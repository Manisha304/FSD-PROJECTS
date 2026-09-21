"""
voice.py
────────
Voice interface module.

• Text-to-Speech via pyttsx3   (offline, no API key needed)
• Speech recognition via SpeechRecognition + Google Web Speech API
  (requires an internet connection for recognition; falls back gracefully)

Thread safety: speak() and listen() can be called from any thread.
pyttsx3 is NOT thread-safe, so all TTS calls are serialised via a lock.
"""

import logging
import threading
import time
from typing import Optional

logger = logging.getLogger(__name__)

# ── Try importing optional audio libraries ─────────────────────────────────────
try:
    import pyttsx3
    _TTS_AVAILABLE = True
except ImportError:
    _TTS_AVAILABLE = False
    logger.warning("pyttsx3 not installed – TTS disabled.")

try:
    import speech_recognition as sr
    _SR_AVAILABLE = True
except ImportError:
    _SR_AVAILABLE = False
    logger.warning("SpeechRecognition not installed – voice input disabled.")


# ── Phrases that mean "I'm fine" ───────────────────────────────────────────────
OK_PHRASES = {
    "i am fine", "i'm fine", "i am okay", "i'm okay",
    "i am ok", "i'm ok", "fine", "okay", "ok",
    "no need", "cancel", "false alarm", "all good",
}


class VoiceInterface:
    """
    Manages TTS output and mic input.  Designed to be used by one thread at
    a time for the listen loop; speak() is safe from any thread.

    Usage
    ─────
    voice = VoiceInterface()
    voice.speak("Are you okay?")
    response = voice.listen(timeout=10)
    if voice.is_ok_response(response):
        ...
    """

    def __init__(self):
        self._tts_lock = threading.Lock()
        self._tts_engine = None
        self._recognizer  = None
        self._microphone  = None
        self._mic_available = False

        self._init_tts()
        self._init_microphone()

    # ── Initialisation ─────────────────────────────────────────────────────────

    def _init_tts(self):
        """Initialise pyttsx3 engine (silent on failure)."""
        if not _TTS_AVAILABLE:
            return
        try:
            engine = pyttsx3.init()
            engine.setProperty("rate", 160)   # slightly faster than default
            engine.setProperty("volume", 1.0)
            # Prefer a female voice if available (index 1 on most Windows setups)
            voices = engine.getProperty("voices")
            if len(voices) > 1:
                engine.setProperty("voice", voices[1].id)
            self._tts_engine = engine
            logger.info("TTS engine ready.")
        except Exception as exc:
            logger.error("TTS init failed: %s", exc)

    def _init_microphone(self):
        """Test-open the default microphone (silent on failure)."""
        if not _SR_AVAILABLE:
            return
        try:
            self._recognizer = sr.Recognizer()
            self._recognizer.energy_threshold = 300
            self._recognizer.dynamic_energy_threshold = True
            with sr.Microphone() as mic:
                self._recognizer.adjust_for_ambient_noise(mic, duration=0.5)
            self._microphone = sr.Microphone()
            self._mic_available = True
            logger.info("Microphone ready.")
        except OSError as exc:
            logger.warning("Microphone unavailable: %s", exc)
        except Exception as exc:
            logger.error("Microphone init error: %s", exc)

    # ── Public API ─────────────────────────────────────────────────────────────

    @property
    def tts_available(self) -> bool:
        return self._tts_engine is not None

    @property
    def mic_available(self) -> bool:
        return self._mic_available

    def speak(self, text: str) -> None:
        """
        Speak *text* aloud.  Blocks until speech is complete.
        Safe to call from any thread.

        Args:
            text: String to synthesise.
        """
        logger.info("[TTS] %s", text)
        print(f"[VOICE OUT] {text}")

        if not self.tts_available:
            return

        with self._tts_lock:
            try:
                self._tts_engine.say(text)
                self._tts_engine.runAndWait()
            except Exception as exc:
                logger.error("TTS speak error: %s", exc)

    def listen(self, timeout: float = 8.0, phrase_limit: float = 5.0) -> Optional[str]:
        """
        Listen for a single spoken utterance and return the transcription.

        Args:
            timeout:      Seconds to wait for speech to start.
            phrase_limit: Maximum seconds of speech to capture.

        Returns:
            Lowercase transcribed string, or None on failure / silence.
        """
        if not self.mic_available:
            logger.warning("listen() called but microphone is unavailable.")
            return None

        try:
            with self._microphone as source:
                logger.info("Listening… (timeout=%.1fs)", timeout)
                audio = self._recognizer.listen(
                    source,
                    timeout=timeout,
                    phrase_time_limit=phrase_limit,
                )

            text = self._recognizer.recognize_google(audio).lower().strip()
            logger.info("[STT] Heard: %r", text)
            print(f"[VOICE IN ] {text}")
            return text

        except sr.WaitTimeoutError:
            logger.info("Listen timeout – no speech detected.")
            return None
        except sr.UnknownValueError:
            logger.info("Speech not understood.")
            return None
        except sr.RequestError as exc:
            logger.error("Google STT API error: %s", exc)
            return None
        except Exception as exc:
            logger.error("listen() unexpected error: %s", exc)
            return None

    @staticmethod
    def is_ok_response(text: Optional[str]) -> bool:
        """
        Return True if *text* contains an "I'm okay" acknowledgement.

        Args:
            text: Transcribed string or None.

        Returns:
            bool
        """
        if not text:
            return False
        text = text.lower()
        return any(phrase in text for phrase in OK_PHRASES)

    def run_confirmation_loop(
        self,
        countdown_seconds: float = 60.0,
        poll_interval:      float =  8.0,
        stop_event: Optional[threading.Event] = None,
    ) -> bool:
        """
        Ask "Are you okay?" repeatedly until:
          • The user gives an OK response  → returns True  (cancel alert)
          • countdown_seconds elapses      → returns False (escalate alert)
          • stop_event is set              → returns False

        Args:
            countdown_seconds: Total time before escalation.
            poll_interval:     Seconds between each speak+listen cycle.
            stop_event:        External cancellation signal.

        Returns:
            True  if user confirmed they are okay.
            False if timer expired or cancelled externally.
        """
        deadline = time.monotonic() + countdown_seconds
        attempt  = 0

        while time.monotonic() < deadline:
            if stop_event and stop_event.is_set():
                return False

            remaining = deadline - time.monotonic()
            if remaining <= 0:
                break

            attempt += 1
            self.speak(
                f"Are you okay? Please say I am fine or I'm okay to cancel the alert. "
                f"You have {int(remaining)} seconds."
            )

            response = self.listen(timeout=min(poll_interval, remaining))

            if self.is_ok_response(response):
                self.speak("Okay, cancelling the alert. Stay safe!")
                return True

            # Wait a moment before the next cycle
            pause = min(2.0, deadline - time.monotonic())
            if pause > 0:
                time.sleep(pause)

        self.speak(
            "No response received. Sending emergency alert now. Help is on the way."
        )
        return False
