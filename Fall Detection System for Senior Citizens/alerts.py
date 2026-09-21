"""
alerts.py
─────────
Emergency alert module using the Twilio REST API.

Sends:
  • SMS message with timestamp and optional location
  • Automated phone call with a voice message
  • (Optional) MMS with snapshot image – requires a publicly reachable URL;
    this prototype falls back to a plain SMS with a note about the image path.

Setup
─────
1. Create a free Twilio account at https://www.twilio.com/try-twilio
2. Get your Account SID and Auth Token from the Twilio Console.
3. Purchase or use a trial Twilio phone number (must be SMS + call capable).
4. Set the four constants below (or use environment variables).

Leave TWILIO_ACCOUNT_SID empty to run in "dry-run" mode (alerts are printed
to the console but not actually sent).
"""

import logging
import os
import time
from typing import List, Optional

logger = logging.getLogger(__name__)

# ── Twilio credentials ─────────────────────────────────────────────────────────
# Prefer environment variables instead of hard-coding secrets in the repository.
TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN", "")
TWILIO_FROM_NUMBER = os.environ.get("TWILIO_FROM_NUMBER", "+15551234567")
PUBLIC_BASE_URL = os.environ.get("PUBLIC_BASE_URL", "http://localhost")

# TwiML Bin URL for outbound calls (see README for how to create one).
# It should return XML like:
#   <Response><Say>Fall alert! Please check on the person immediately.</Say></Response>
TWILIO_TWIML_URL: str = os.environ.get(
    "TWILIO_TWIML_URL",
    "http://twimlets.com/message?Message=Fall+Alert+Please+check+immediately",
)

# ── Try importing Twilio ───────────────────────────────────────────────────────
try:
    from twilio.rest import Client as TwilioClient
    _TWILIO_AVAILABLE = True
except ImportError:
    _TWILIO_AVAILABLE = False
    logger.warning("twilio package not installed – SMS/call alerts will be dry-run only.")

def _build_public_image_url(snapshot_path: str) -> Optional[str]:
    if not snapshot_path:
        return None

    filename = os.path.basename(snapshot_path)

    # 🔥 ADD THIS LINE (this is your PUBLIC URL)
    return f"{PUBLIC_BASE_URL}/snapshot/{filename}"

def _dry_run_enabled() -> bool:
    return not (_TWILIO_AVAILABLE and TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN)


def _get_client() -> Optional["TwilioClient"]:
    if _dry_run_enabled():
        return None
    try:
        return TwilioClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    except Exception as exc:
        logger.error("Twilio client init failed: %s", exc)
        return None


# ── Public API ─────────────────────────────────────────────────────────────────

def send_sms(
    to_numbers: List[str],
    snapshot_path: Optional[str] = None,
    location: Optional[str] = None,
) -> List[dict]:

    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    loc_text  = f"\nLocation: {location}" if location else ""

    body = (
        f"🚨 FALL ALERT\n"
        f"Time: {timestamp}"
        f"{loc_text}\n"
        f"Please check on the person immediately."
    )

    results = []

    media_url = _build_public_image_url(snapshot_path)

    if _dry_run_enabled():
        print(f"\n[DRY-RUN] MMS → {to_numbers}")
        print("Image URL:", media_url)
        return [{"number": n, "success": True, "sid": "DRY-RUN"} for n in to_numbers]

    client = _get_client()
    if not client:
        return [{"number": n, "success": False, "error": "Client init failed"} for n in to_numbers]

    for number in to_numbers:
        try:
            msg = client.messages.create(
                body=body,
                from_=TWILIO_FROM_NUMBER,
                to=number,
                media_url=[media_url] if media_url else None   # 🔥 MMS happens HERE
            )
            results.append({"number": number, "success": True, "sid": msg.sid})

        except Exception as exc:
            results.append({"number": number, "success": False, "error": str(exc)})

    return results

def make_call(to_numbers: List[str]) -> List[dict]:
    """
    Initiate an automated phone call to each number in *to_numbers*.

    The call plays the TwiML at TWILIO_TWIML_URL.

    Args:
        to_numbers: List of E.164 phone numbers.

    Returns:
        List of result dicts.
    """
    results = []

    if _dry_run_enabled():
        logger.info("[DRY-RUN] Call would be made to %s via %s", to_numbers, TWILIO_TWIML_URL)
        print(f"\n[ALERT DRY-RUN] CALL → Recipients: {to_numbers}\n")
        return [{"number": n, "success": True, "sid": "DRY-RUN"} for n in to_numbers]

    client = _get_client()
    if not client:
        return [{"number": n, "success": False, "error": "Client init failed"} for n in to_numbers]

    for number in to_numbers:
        try:
            call = client.calls.create(
                url=TWILIO_TWIML_URL,
                from_=TWILIO_FROM_NUMBER,
                to=number,
            )
            logger.info("Call to %s – SID %s", number, call.sid)
            results.append({"number": number, "success": True, "sid": call.sid})
        except Exception as exc:
            logger.error("Call to %s failed: %s", number, exc)
            results.append({"number": number, "success": False, "error": str(exc)})

    return results


def dispatch_all_alerts(
    contacts: List[str],
    snapshot_path: Optional[str] = None,
    location: Optional[str] = None,
) -> dict:
    """
    Convenience wrapper: send SMS + calls to all contacts simultaneously.

    Args:
        contacts:      List of E.164 phone numbers.
        snapshot_path: Path to local fall snapshot image.
        location:      Optional location string.

    Returns:
        Dict with keys "sms" and "calls", each a list of result dicts.
    """
    if not contacts:
        logger.warning("dispatch_all_alerts: no contacts configured.")
        return {"sms": [], "calls": []}

    sms_results  = send_sms(contacts, snapshot_path=snapshot_path, location=location)
    call_results = make_call(contacts)

    return {"sms": sms_results, "calls": call_results}
