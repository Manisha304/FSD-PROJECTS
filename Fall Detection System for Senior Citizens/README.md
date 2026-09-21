# 🛡️ Edge AI Fall Detection System

A complete, real-time fall detection prototype combining computer vision,
voice interaction, SMS/call alerts, and a live web dashboard — all running
locally on a standard laptop with no GPU required.

---

## 📁 Folder Structure

```
fall_detection_system/
│
├── main.py           # Master entry point (camera + threading orchestration)
├── detection.py      # MediaPipe Pose fall detection engine
├── voice.py          # pyttsx3 TTS + SpeechRecognition voice interface
├── alerts.py         # Twilio SMS + phone call dispatch
├── app.py            # Flask web dashboard (MJPEG stream + REST API)
├── contacts.json     # Emergency contact store
├── requirements.txt  # Python dependencies
├── README.md         # This file
└── snapshots/        # Auto-created; fall snapshot images saved here
```

---

## ⚙️ Setup Instructions

### 1 — Prerequisites

| Requirement | Version |
|---|---|
| Python | **3.10 or 3.11** |
| OS     | Windows 10/11 (tested), macOS, Linux |
| Webcam | Built-in or USB (index 0) |

> ⚠️ MediaPipe **does not support Python 3.12+** on Windows as of 2024.
> Use `py -3.11 -m venv venv` to create a 3.11 virtual environment.

### 2 — Create a virtual environment

```bash
# Windows
py -3.11 -m venv venv
venv\Scripts\activate

# macOS / Linux
python3.11 -m venv venv
source venv/bin/activate
```

### 3 — Install dependencies

```bash
pip install -r requirements.txt
```

**PyAudio note (Windows):** If `pip install pyaudio` fails, install the
pre-built wheel:
```bash
pip install pipwin
pipwin install pyaudio
```

---

## 📱 Twilio Setup

> Skip this section if you only want local fall detection without SMS/calls.
> The system runs in "dry-run" mode and prints alerts to the console instead.

### Step 1 — Create a Twilio account
1. Go to [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Sign up for a free trial account.

### Step 2 — Get your credentials
1. From the Twilio Console dashboard, copy:
   - **Account SID** (starts with `AC…`)
   - **Auth Token**
2. Purchase (or use the free trial number) a Twilio phone number.

### Step 3 — Create a TwiML Bin for calls
1. In the Twilio Console go to **Explore Products → TwiML Bins**.
2. Create a new Bin with this content:
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <Response>
     <Say voice="alice">
       Emergency Fall Alert. A fall has been detected. Please check on the person immediately.
     </Say>
     <Pause length="1"/>
     <Say voice="alice">This message will repeat.</Say>
     <Redirect/>
   </Response>
   ```
3. Copy the TwiML Bin URL.

### Step 4 — Configure credentials

**Option A — Environment variables (recommended):**
```bash
# Windows
set TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
set TWILIO_AUTH_TOKEN=your_auth_token
set TWILIO_FROM_NUMBER=+15551234567
set TWILIO_TWIML_URL=https://handler.twilio.com/twiml/EHxxxxx

# macOS / Linux
export TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
export TWILIO_AUTH_TOKEN=your_auth_token
export TWILIO_FROM_NUMBER=+15551234567
export TWILIO_TWIML_URL=https://handler.twilio.com/twiml/EHxxxxx
```

**Option B — Edit `alerts.py` directly:**
```python
TWILIO_ACCOUNT_SID = "ACxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN  = "your_auth_token"
TWILIO_FROM_NUMBER = "+15551234567"
TWILIO_TWIML_URL   = "https://handler.twilio.com/twiml/EHxxxxx"
```

---

## ▶️ Running the System

```bash
python main.py
```

The system will:
1. Open the webcam window with a live skeleton overlay.
2. Start the Flask dashboard at **http://localhost:5000**
3. Begin voice-interface initialisation.

**Workflow:**
1. Open **http://localhost:5000** in your browser.
2. Toggle **Monitoring ON** from the dashboard.
3. Add emergency contacts (E.164 format, e.g. `+919876543210`).
4. Stand ~1.5–2.5 m from the camera so your full body is visible.
5. Simulate a fall (drop quickly, lie down fast).

---

## ⌨️ Controls

| Control | Action |
|---|---|
| **Q** (camera window) or Esc | Quit the program |
| Dashboard toggle | Enable / disable fall detection |
| Add contact form | Register emergency phone numbers |

---

## 🧠 Detection Logic

Two conditions must both be true within the same frame:

| Condition | Threshold | Purpose |
|---|---|---|
| Body-tilt angle | ≥ 55° from vertical | Torso is horizontal |
| Downward velocity | ≥ 0.25 norm-height/s | Sudden drop (not slow sit) |

A 4-second cooldown prevents duplicate triggers for the same event.
Frames where any key landmark (shoulder/hip/knee) is below 50% confidence
are skipped to avoid partial-body false positives.

---

## 📣 Alert Lifecycle

```
Fall detected
    │
    ├─ Snapshot saved to snapshots/
    ├─ Dashboard → "Awaiting Response"
    ├─ Voice asks "Are you okay?" every 8 seconds
    │
    ├─ User says "I'm fine" / "I'm okay"
    │     └─ "False Alarm" logged → back to Monitoring
    │
    └─ 60 seconds elapse with no OK response
          ├─ SMS sent to all contacts
          ├─ Phone call made to all contacts
          └─ Dashboard → "Alert Sent"
```

---

## 🌐 Dashboard Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Dashboard HTML |
| GET | `/video_feed` | MJPEG live stream |
| GET | `/api/status` | System status JSON |
| GET | `/api/history` | Alert history JSON |
| GET | `/api/contacts` | Contact list JSON |
| POST | `/api/contacts` | Add contact `{"number": "+91..."}` |
| DELETE | `/api/contacts/<num>` | Remove a contact |
| POST | `/api/monitoring` | Toggle `{"enabled": true}` |

---

## 🐛 Troubleshooting

| Problem | Fix |
|---|---|
| `mediapipe` install fails | Use Python 3.10 or 3.11 exactly |
| Camera not opening | Try `CAMERA_INDEX = 1` in `main.py` |
| `pyaudio` install fails | Use `pipwin install pyaudio` on Windows |
| No voice output | Check speakers; pyttsx3 requires a Windows voice engine |
| No microphone input | Check mic permissions in Windows Privacy settings |
| Twilio SMS not sending | Verify SID, token, and that the "To" number is verified (trial) |
| Too many false positives | Increase `ANGLE_THRESHOLD` or `VELOCITY_THRESHOLD` in `detection.py` |
| Falls not detected | Ensure full body is visible; reduce thresholds |
| Low FPS | Set `model_complexity=0` in `detection.py` `_mp_pose.Pose(...)` |

---

## 📦 Libraries Used

| Library | Purpose |
|---|---|
| `opencv-python` | Webcam capture, frame rendering, JPEG encoding |
| `mediapipe` | Real-time human pose landmark estimation |
| `numpy` | Angle and velocity calculations |
| `flask` | Web dashboard and REST API |
| `twilio` | SMS and automated phone calls |
| `SpeechRecognition` | Microphone voice input |
| `pyttsx3` | Offline text-to-speech output |

---

*Built as a college Edge AI demonstration project.*
