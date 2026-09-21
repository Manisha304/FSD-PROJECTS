"""
detection.py
────────────
Real-time fall detection using MediaPipe Pose.

Detection logic uses two complementary conditions (both must be true):
  1. Body-angle condition  – torso tilt from vertical exceeds ANGLE_THRESHOLD
  2. Velocity condition    – hip midpoint moves downward faster than VELOCITY_THRESHOLD
     within a rolling time window.

A 4-second cooldown prevents the same event from re-triggering continuously.
"""

import logging
import time
import threading
from collections import deque
from typing import Callable, Optional, Tuple

import cv2
import mediapipe as mp
import numpy as np

logger = logging.getLogger(__name__)

# ── MediaPipe setup ────────────────────────────────────────────────────────────
_mp_pose    = mp.solutions.pose
_mp_drawing = mp.solutions.drawing_utils
_mp_styles  = mp.solutions.drawing_styles

# Landmark index aliases
_L = _mp_pose.PoseLandmark
IDX_L_SHOULDER = _L.LEFT_SHOULDER.value
IDX_R_SHOULDER = _L.RIGHT_SHOULDER.value
IDX_L_HIP      = _L.LEFT_HIP.value
IDX_R_HIP      = _L.RIGHT_HIP.value
IDX_L_KNEE     = _L.LEFT_KNEE.value
IDX_R_KNEE     = _L.RIGHT_KNEE.value

# Landmarks that must all be visible for a valid reading
REQUIRED = [IDX_L_SHOULDER, IDX_R_SHOULDER, IDX_L_HIP, IDX_R_HIP]

# ── Tunable thresholds ────────────────────────────────────────────────────────
ANGLE_THRESHOLD:    float = 55.0   # degrees from vertical → body is "horizontal"
VELOCITY_THRESHOLD: float = 0.25   # normalised height/s downward spike
MIN_VISIBILITY:     float = 0.50   # MediaPipe landmark confidence floor
HISTORY_WINDOW_SEC: float = 0.70   # seconds of motion history used for velocity
COOLDOWN_SEC:       float = 4.0    # seconds to ignore re-triggers after a fall
HISTORY_MAXLEN:     int   = 40     # ring-buffer size


def _midpoint(p1: Tuple, p2: Tuple) -> Tuple:
    return ((p1[0] + p2[0]) / 2.0, (p1[1] + p2[1]) / 2.0)


def _body_angle(shoulder_mid: Tuple, hip_mid: Tuple) -> float:
    """Angle (degrees) between the torso vector and the vertical axis."""
    dx = shoulder_mid[0] - hip_mid[0]
    dy = shoulder_mid[1] - hip_mid[1]
    return float(np.degrees(np.arctan2(abs(dx), abs(dy) + 1e-6)))


class FallDetector:
    """
    Stateful fall detector.  Operates frame-by-frame; thread-safe.

    Args:
        on_fall_detected: Callback(frame: np.ndarray) fired when a new fall
                          event is confirmed.  Runs on the detection thread.
    """

    def __init__(self, on_fall_detected: Optional[Callable] = None):
        self._on_fall = on_fall_detected
        self._lock    = threading.Lock()

        # Ring-buffer of (monotonic_time, normalised_hip_y)
        self._history: deque = deque(maxlen=HISTORY_MAXLEN)
        self._last_fall_time: float = -999.0
        self._fall_count: int = 0

        # Exposed state (read by Flask / main thread)
        self.status:     str   = "Normal"
        self.body_angle: float = 0.0
        self.hip_y:      float = 0.0
        self.velocity:   float = 0.0

        # MediaPipe Pose (one instance, kept alive for the session)
        self._pose = _mp_pose.Pose(
            min_detection_confidence=0.6,
            min_tracking_confidence=0.55,
            model_complexity=1,
            smooth_landmarks=True,
        )

    # ── Public API ─────────────────────────────────────────────────────────────

    @property
    def fall_count(self) -> int:
        return self._fall_count

    def close(self):
        """Release MediaPipe resources."""
        self._pose.close()

    def process_frame(self, frame: np.ndarray) -> np.ndarray:
        """
        Run pose detection on *frame*, overlay the skeleton, and check for falls.

        Args:
            frame: BGR numpy array from OpenCV.

        Returns:
            Annotated BGR frame with skeleton and status overlay drawn.
        """
        frame = cv2.flip(frame, 1)          # mirror so it feels natural
        h, w  = frame.shape[:2]

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        rgb.flags.writeable = False
        try:
            results = self._pose.process(rgb)
        except Exception as exc:
            logger.warning("MediaPipe process failed: %s", exc)
            self.status = "Model Error"
            self._pose.close()
            self._pose = _mp_pose.Pose(
                min_detection_confidence=0.6,
                min_tracking_confidence=0.55,
                model_complexity=1,
                smooth_landmarks=True,
            )
            rgb.flags.writeable = True
            return frame
        rgb.flags.writeable = True

        # ── Draw skeleton ──────────────────────────────────────────────────────
        if results.pose_landmarks:
            _mp_drawing.draw_landmarks(
                frame,
                results.pose_landmarks,
                _mp_pose.POSE_CONNECTIONS,
                landmark_drawing_spec=_mp_styles.get_default_pose_landmarks_style(),
            )

        # ── Fall logic ─────────────────────────────────────────────────────────
        new_fall = self._evaluate(results.pose_landmarks, h, w)
        if new_fall and self._on_fall:
            self._on_fall(frame.copy())

        # ── Status overlay ─────────────────────────────────────────────────────
        self._draw_overlay(frame)
        return frame

    # ── Private helpers ────────────────────────────────────────────────────────

    def _evaluate(self, landmarks, h: int, w: int) -> bool:
        """Return True if a *new* fall event fires this frame."""
        if landmarks is None:
            self.status = "No Pose"
            return False

        lm = landmarks.landmark

        # Require all key landmarks to be visible
        if any(lm[i].visibility < MIN_VISIBILITY for i in REQUIRED):
            self.status = "Partial Body"
            return False

        def px(i):
            return (lm[i].x * w, lm[i].y * h)

        shoulder_mid = _midpoint(px(IDX_L_SHOULDER), px(IDX_R_SHOULDER))
        hip_mid      = _midpoint(px(IDX_L_HIP),      px(IDX_R_HIP))

        # Normalised hip-y (0 = top, 1 = bottom)
        hip_y_norm = (lm[IDX_L_HIP].y + lm[IDX_R_HIP].y) / 2.0

        angle = _body_angle(shoulder_mid, hip_mid)

        now = time.monotonic()
        self._history.append((now, hip_y_norm))
        velocity = self._peak_velocity(now)

        # Expose metrics
        self.body_angle = angle
        self.hip_y      = hip_y_norm
        self.velocity   = velocity

        angle_trigger    = angle    >= ANGLE_THRESHOLD
        velocity_trigger = velocity >= VELOCITY_THRESHOLD

        if angle_trigger and velocity_trigger:
            if now - self._last_fall_time >= COOLDOWN_SEC:
                with self._lock:
                    self._last_fall_time = now
                    self._fall_count    += 1
                self.status = "FALL DETECTED"
                return True
            self.status = "FALL DETECTED"
        else:
            self.status = "Normal"
        return False

    def _peak_velocity(self, now: float) -> float:
        """Largest downward frame-to-frame velocity in the history window."""
        window = [(t, y) for t, y in self._history
                  if now - t <= HISTORY_WINDOW_SEC]
        if len(window) < 2:
            return 0.0
        vels = []
        for i in range(1, len(window)):
            dt = window[i][0] - window[i - 1][0]
            if dt < 1e-4:
                continue
            vels.append((window[i][1] - window[i - 1][1]) / dt)
        return float(max(vels)) if vels else 0.0

    def _draw_overlay(self, frame: np.ndarray):
        """Render the HUD status bar on *frame* in-place."""
        h, w = frame.shape[:2]

        is_fall = self.status == "FALL DETECTED"
        bar_col = (20, 20, 200) if is_fall else (20, 20, 20)

        # Top bar - draw directly without copy to reduce memory pressure
        cv2.rectangle(frame, (0, 0), (w, 72), bar_col, -1)

        txt_col = (255, 255, 255)
        cv2.putText(frame, f"Status: {self.status}",
                    (10, 30), cv2.FONT_HERSHEY_DUPLEX, 0.80, txt_col, 2)
        cv2.putText(frame,
                    f"Angle: {self.body_angle:.1f}  Vel: {self.velocity:.2f}  Falls: {self._fall_count}",
                    (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.50, txt_col, 1)

        if is_fall:
            bh = 58
            by = h // 2 - bh // 2
            cv2.rectangle(frame, (0, by), (w, by + bh), (0, 0, 180), -1)
            cv2.putText(frame, "!! FALL DETECTED !!",
                        (w // 2 - 185, by + 40),
                        cv2.FONT_HERSHEY_DUPLEX, 1.1, (255, 255, 255), 3)


# ── Snapshot helper ────────────────────────────────────────────────────────────

def save_snapshot(frame: np.ndarray, directory: str = "snapshots") -> str:
    """Save a JPEG snapshot; return the file path."""
    import os
    os.makedirs(directory, exist_ok=True)
    ts   = time.strftime("%Y%m%d_%H%M%S")
    path = os.path.join(directory, f"fall_{ts}.jpg")
    cv2.imwrite(path, frame)
    return path
