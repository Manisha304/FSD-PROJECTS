"""
main.py
───────
Master entry point for the Edge AI Fall Detection System.

Starts three concurrent threads:
  1. Camera Thread   – captures frames, runs detection, encodes MJPEG
  2. Flask Thread    – serves the web dashboard on http://localhost:5000
  3. Alert Thread    – spawned on demand when a fall is confirmed

Keyboard controls (OpenCV window):
  Q / Esc → quit

Usage:
    python main.py
"""

import json
import logging
import os
import sys
import threading
import time
import gc
from typing import Optional

import cv2

# ── Local modules ──────────────────────────────────────────────────────────────
import app as flask_app
import alerts
from detection import FallDetector, save_snapshot
from voice import VoiceInterface

# ── Logging ────────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)

# ── Config ─────────────────────────────────────────────────────────────────────
CAMERA_INDEX     = 0
FRAME_W, FRAME_H = 640, 360
FLASK_HOST       = "0.0.0.0"
FLASK_PORT       = 5000
CONTACTS_FILE    = os.path.join(os.path.dirname(__file__), "contacts.json")


# ═══════════════════════════════════════════════════════════════════════════════
# Shared global state
# ═══════════════════════════════════════════════════════════════════════════════

_monitoring         = threading.Event()   # set = monitoring ON
_shutdown           = threading.Event()   # set = quit everything
_alert_in_progress  = threading.Event()   # prevents duplicate alert threads
_voice: Optional[VoiceInterface] = None   # shared voice interface
_detector: Optional[FallDetector] = None  # shared detector


# ═══════════════════════════════════════════════════════════════════════════════
# Contact loader
# ═══════════════════════════════════════════════════════════════════════════════

def load_contacts() -> list:
    try:
        with open(CONTACTS_FILE) as f:
            return json.load(f).get("contacts", [])
    except Exception:
        return []


# ═══════════════════════════════════════════════════════════════════════════════
# Alert pipeline (runs in its own thread)
# ═══════════════════════════════════════════════════════════════════════════════

def alert_pipeline(snapshot_path: str):
    global _voice

    _alert_in_progress.set()

    ts = time.strftime("%Y-%m-%d %H:%M:%S")
    flask_app._system_state["status"] = "Awaiting Response"
    flask_app.push_alert_event({
        "type":   "Fall Detected",
        "time":   ts,
        "detail": f"Snapshot: {snapshot_path}",
    })

    user_ok = False
    if _voice:
        _voice.speak("Fall detected! Are you okay?")
        user_ok = _voice.run_confirmation_loop(
            countdown_seconds=60.0,
            poll_interval=8.0,
            stop_event=_shutdown,
        )

    if user_ok:
        logger.info("User confirmed OK – cancelling alert.")
        flask_app._system_state["status"] = "Monitoring"
        flask_app.push_alert_event({"type": "False Alarm", "time": time.strftime("%Y-%m-%d %H:%M:%S")})
        _alert_in_progress.clear()
        return

    contacts = load_contacts()
    logger.warning("Escalating alert to %d contact(s).", len(contacts))
    flask_app._system_state["status"] = "Alert Sent"

    results = alerts.dispatch_all_alerts(
        contacts,
        snapshot_path=snapshot_path,
    )
    logger.info("Alert results: %s", results)

    flask_app.push_alert_event({
        "type":   "Alert Sent",
        "time":   time.strftime("%Y-%m-%d %H:%M:%S"),
        "detail": f"{len(contacts)} contact(s) notified.",
    })

    if _voice:
        _voice.speak("Emergency alert has been sent to your contacts.")

    flask_app._system_state["status"] = "Monitoring"
    _alert_in_progress.clear()


def on_fall_detected(frame):
    if _alert_in_progress.is_set():
        logger.info("Alert already in progress – skipping duplicate trigger.")
        return

    snapshot_path = save_snapshot(frame)
    logger.warning("Fall detected! Snapshot → %s", snapshot_path)

    t = threading.Thread(
        target=alert_pipeline,
        args=(snapshot_path,),
        daemon=True,
        name="AlertPipeline",
    )
    t.start()


def _open_camera(index: int):
    """Open the video capture with platform-specific flags."""
    if sys.platform.startswith("win"):
        cap = cv2.VideoCapture(index, cv2.CAP_DSHOW)
        if cap.isOpened():
            return cap
    cap = cv2.VideoCapture(index)
    return cap


def camera_thread():
    global _detector

    cap = _open_camera(CAMERA_INDEX)
    if not cap.isOpened():
        logger.error("Cannot open camera %d. Check webcam connection.", CAMERA_INDEX)
        _shutdown.set()
        return

    cap.set(cv2.CAP_PROP_FRAME_WIDTH,  FRAME_W)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, FRAME_H)
    aw = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    ah = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    logger.info("Camera opened at %d×%d", aw, ah)

    _detector = FallDetector(on_fall_detected=on_fall_detected)

    fps_t = time.monotonic()
    fps_c = 0
    failure_count = 0

    while not _shutdown.is_set():
        ret, frame = cap.read()
        if not ret:
            failure_count += 1
            if failure_count % 10 == 0:
                logger.warning("Failed to grab frame %d times – retrying…", failure_count)
            time.sleep(0.1)
            if failure_count >= 30:
                logger.warning("Reopening camera after repeated frame failures.")
                cap.release()
                time.sleep(1.0)
                cap = _open_camera(CAMERA_INDEX)
                if not cap.isOpened():
                    logger.error("Cannot reopen camera %d. Stopping.", CAMERA_INDEX)
                    _shutdown.set()
                    break
                cap.set(cv2.CAP_PROP_FRAME_WIDTH,  FRAME_W)
                cap.set(cv2.CAP_PROP_FRAME_HEIGHT, FRAME_H)
                aw = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
                ah = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
                logger.info("Camera reopened at %d×%d", aw, ah)
                failure_count = 0
            continue

        failure_count = 0

        if frame.shape[1] != FRAME_W or frame.shape[0] != FRAME_H:
            frame = cv2.resize(frame, (FRAME_W, FRAME_H), interpolation=cv2.INTER_LINEAR)

        if _monitoring.is_set():
            annotated = _detector.process_frame(frame)
            flask_app._system_state["fall_count"] = _detector.fall_count
        else:
            annotated = cv2.flip(frame, 1)
            cv2.putText(annotated, "Monitoring OFF — press toggle on dashboard",
                        (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (100, 100, 100), 2)

        _, jpeg = cv2.imencode(".jpg", annotated, [cv2.IMWRITE_JPEG_QUALITY, 50])
        flask_app.set_latest_frame(jpeg.tobytes())
        del jpeg  # Explicit cleanup of JPEG

        cv2.imshow("Fall Detection System  |  Q = Quit", annotated)

        fps_c += 1
        if time.monotonic() - fps_t >= 1.0:
            logger.debug("FPS: %.1f", fps_c / (time.monotonic() - fps_t))
            fps_c = 0
            fps_t = time.monotonic()
        
        # Aggressive garbage collection every 15 frames
        if fps_c % 15 == 0:
            gc.collect()

        key = cv2.waitKey(1) & 0xFF
        if key in (ord("q"), ord("Q"), 27):
            logger.info("Quit key pressed.")
            _shutdown.set()

    cap.release()
    cv2.destroyAllWindows()
    if _detector:
        _detector.close()
    logger.info("Camera thread exited.")


def flask_thread():
    logger.info("Web dashboard → http://localhost:%d", FLASK_PORT)
    flask_app.app.run(
        host=FLASK_HOST,
        port=FLASK_PORT,
        debug=False,
        use_reloader=False,
        threaded=True,
    )


def main():
    global _voice

    _monitoring.set()   # ← ONLY ADDED LINE

    print("=" * 60)
    print("  Edge AI Fall Detection System")
    print("  Dashboard → http://localhost:5000")
    print("  Press Q in the camera window to quit.")
    print("=" * 60)

    try:
        _voice = VoiceInterface()
        if not _voice.tts_available:
            logger.warning("TTS unavailable – voice output disabled.")
        if not _voice.mic_available:
            logger.warning("Microphone unavailable – voice confirmation disabled.")
    except Exception as exc:
        logger.error("Voice interface init error: %s", exc)
        _voice = None

    ft = threading.Thread(target=flask_thread, daemon=True, name="Flask")
    ft.start()
    time.sleep(0.5)

    camera_thread()

    logger.info("Shutdown complete.")


if __name__ == "__main__":
    main()