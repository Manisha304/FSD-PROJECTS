"""
app.py
──────
Flask web dashboard for the Fall Detection System.

Routes
──────
  GET  /                      → Dashboard HTML page
  GET  /video_feed            → MJPEG live camera stream
  GET  /api/status            → JSON system status
  GET  /api/history           → JSON alert history
  GET  /api/contacts          → JSON contact list
  POST /api/contacts          → Add a contact   { "number": "+91..." }
  DELETE /api/contacts/<number> → Remove a contact
  POST /api/monitoring        → Toggle monitoring { "enabled": true/false }

Run standalone (for testing):
    python app.py
Run via main.py (preferred) which injects the shared state.
"""

import json
import logging
import os
import time
from threading import Lock
from typing import Generator
from flask import send_from_directory

from flask import Flask, Response, jsonify, render_template_string, request, send_from_directory
logger = logging.getLogger(__name__)

# ── Contacts file path ─────────────────────────────────────────────────────────
CONTACTS_FILE = os.path.join(os.path.dirname(__file__), "contacts.json")

# ── Shared state (injected by main.py) ────────────────────────────────────────
# These are module-level variables that main.py overwrites before calling app.run()
_frame_lock  = Lock()
_latest_frame: bytes | None = None   # JPEG-encoded bytes of the current frame
_system_state: dict = {
    "monitoring": False,
    "status":     "Idle",
    "last_event": None,
    "fall_count": 0,
}
_alert_history: list = []            # list of alert dicts


def set_latest_frame(jpeg_bytes: bytes):
    """Called by the detection thread to push the latest JPEG frame."""
    global _latest_frame
    with _frame_lock:
        _latest_frame = jpeg_bytes


def get_latest_frame() -> bytes | None:
    with _frame_lock:
        return _latest_frame


def push_alert_event(event: dict):
    """Append an event to the alert history (called from main.py)."""
    _alert_history.append(event)
    _system_state["last_event"] = event
    _system_state["status"] = event.get("type", "Event")


# ── Flask app ──────────────────────────────────────────────────────────────────
app = Flask(__name__)
app.config["JSON_SORT_KEYS"] = False


# ══════════════════════════════════════════════════════════════════════════════
# Dashboard HTML (single-file, no templates directory needed)
# ══════════════════════════════════════════════════════════════════════════════
DASHBOARD_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Fall Detection System</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;600&display=swap" rel="stylesheet">
<style>
  :root {
    --bg:       #0d0f14;
    --surface:  #161920;
    --border:   #252830;
    --accent:   #e8ff47;
    --red:      #ff3c3c;
    --green:    #3cffa0;
    --dim:      #5a5f70;
    --text:     #dde1ec;
    --mono:     'Space Mono', monospace;
    --sans:     'DM Sans', sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    min-height: 100vh;
    padding: 0;
  }

  /* ── Header ── */
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 32px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .logo {
    font-family: var(--mono);
    font-size: 1rem;
    letter-spacing: 0.08em;
    color: var(--accent);
    text-transform: uppercase;
  }
  .logo span { color: var(--dim); }

  /* ── Status pill ── */
  .status-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--mono);
    font-size: 0.75rem;
    padding: 6px 14px;
    border-radius: 40px;
    border: 1px solid var(--border);
    background: var(--bg);
    letter-spacing: 0.06em;
    transition: all 0.3s;
  }
  .status-pill.active  { border-color: var(--green); color: var(--green); }
  .status-pill.fall    { border-color: var(--red);   color: var(--red); animation: pulse-border 0.8s infinite; }
  .status-pill.idle    { border-color: var(--dim);   color: var(--dim); }
  .dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: currentColor;
  }
  .status-pill.active .dot { animation: blink 1.2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
  @keyframes pulse-border { 0%,100%{box-shadow:0 0 0 0 rgba(255,60,60,0.4)} 50%{box-shadow:0 0 0 6px rgba(255,60,60,0)} }

  /* ── Layout ── */
  .grid {
    display: grid;
    grid-template-columns: 1fr 340px;
    grid-template-rows: auto 1fr;
    gap: 1px;
    height: calc(100vh - 61px);
    background: var(--border);
  }

  /* ── Panel base ── */
  .panel {
    background: var(--bg);
    padding: 24px;
    overflow-y: auto;
  }
  .panel-title {
    font-family: var(--mono);
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--dim);
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .panel-title::after { content:''; flex:1; height:1px; background:var(--border); }

  /* ── Camera panel ── */
  .camera-panel {
    grid-row: 1 / 3;
    display: flex;
    flex-direction: column;
    background: var(--surface);
    padding: 0;
    position: relative;
  }
  .cam-header {
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    font-family: var(--mono);
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--dim);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .fps-badge {
    font-size: 0.65rem;
    color: var(--accent);
    font-family: var(--mono);
  }
  .cam-body {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #080a0d;
    position: relative;
  }
  #video-feed {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
  }
  .cam-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .fall-banner {
    background: rgba(255,60,60,0.88);
    color: #fff;
    font-family: var(--mono);
    font-size: 1.4rem;
    letter-spacing: 0.12em;
    padding: 14px 36px;
    border-radius: 4px;
    display: none;
    animation: pulse-banner 0.6s infinite;
  }
  @keyframes pulse-banner { 0%,100%{opacity:1} 50%{opacity:0.7} }

  /* ── Controls panel ── */
  .ctrl-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    border-bottom: 1px solid var(--border);
  }
  .ctrl-label { font-size: 0.85rem; color: var(--text); font-weight: 600; }
  .ctrl-sub   { font-size: 0.72rem; color: var(--dim); margin-top: 2px; }

  /* Toggle switch */
  .toggle-wrap { position: relative; width: 48px; height: 26px; }
  .toggle-wrap input { opacity: 0; width: 0; height: 0; }
  .toggle-track {
    position: absolute; inset: 0;
    background: var(--border);
    border-radius: 26px;
    cursor: pointer;
    transition: background 0.25s;
  }
  .toggle-track::after {
    content: '';
    position: absolute;
    left: 3px; top: 3px;
    width: 20px; height: 20px;
    background: var(--dim);
    border-radius: 50%;
    transition: transform 0.25s, background 0.25s;
  }
  input:checked + .toggle-track { background: rgba(60,255,160,0.2); }
  input:checked + .toggle-track::after { transform: translateX(22px); background: var(--green); }

  /* Stat cards */
  .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 18px; }
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 14px;
  }
  .stat-val { font-family: var(--mono); font-size: 1.6rem; color: var(--accent); line-height: 1; }
  .stat-lbl { font-size: 0.65rem; color: var(--dim); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.08em; }

  /* Contact list */
  .contact-list { list-style: none; }
  .contact-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
    font-family: var(--mono);
    font-size: 0.78rem;
  }
  .contact-item:last-child { border-bottom: none; }
  .del-btn {
    background: none;
    border: 1px solid var(--border);
    color: var(--dim);
    font-size: 0.65rem;
    padding: 3px 8px;
    border-radius: 3px;
    cursor: pointer;
    font-family: var(--mono);
    transition: all 0.2s;
  }
  .del-btn:hover { border-color: var(--red); color: var(--red); }

  /* Add contact form */
  .add-form { display: flex; gap: 8px; margin-top: 12px; }
  .add-form input {
    flex: 1;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
    font-family: var(--mono);
    font-size: 0.78rem;
    padding: 8px 12px;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.2s;
  }
  .add-form input:focus { border-color: var(--accent); }
  .add-form input::placeholder { color: var(--dim); }
  .btn-add {
    background: var(--accent);
    color: #0d0f14;
    border: none;
    font-family: var(--mono);
    font-size: 0.72rem;
    font-weight: 700;
    padding: 8px 14px;
    border-radius: 4px;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .btn-add:hover { opacity: 0.85; }

  /* History */
  .history-list { list-style: none; }
  .history-item {
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
    font-size: 0.8rem;
  }
  .history-item:last-child { border-bottom: none; }
  .h-time { font-family: var(--mono); font-size: 0.65rem; color: var(--dim); margin-bottom: 4px; }
  .h-type { font-weight: 600; }
  .h-type.fall { color: var(--red); }
  .h-type.ok   { color: var(--green); }
  .h-type.sent { color: var(--accent); }

  /* Empty state */
  .empty { color: var(--dim); font-size: 0.78rem; padding: 16px 0; font-family: var(--mono); }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  /* Tab nav */
  .tab-nav { display: flex; gap: 0; border-bottom: 1px solid var(--border); margin-bottom: 18px; }
  .tab-btn {
    background: none; border: none; border-bottom: 2px solid transparent;
    color: var(--dim); font-family: var(--mono); font-size: 0.65rem;
    letter-spacing: 0.12em; text-transform: uppercase; padding: 8px 16px 10px;
    cursor: pointer; transition: all 0.2s;
  }
  .tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }
  .tab-content { display: none; }
  .tab-content.active { display: block; }
</style>
</head>
<body>

<header>
  <div class="logo">FALL<span>_</span>DETECT <span>// Edge AI</span></div>
  <div class="status-pill idle" id="header-pill">
    <div class="dot"></div>
    <span id="header-status">IDLE</span>
  </div>
</header>

<div class="grid">

  <!-- ── Left: Live Feed ── -->
  <div class="camera-panel">
    <div class="cam-header">
      <span>Live Feed</span>
      <span class="fps-badge" id="fps-badge">● STREAM</span>
    </div>
    <div class="cam-body">
      <img id="video-feed" src="/video_feed" alt="Live feed"
           onerror="this.style.display='none'; document.getElementById('no-feed').style.display='flex'"/>
      <div class="cam-overlay">
        <div class="fall-banner" id="fall-banner">!! FALL DETECTED !!</div>
      </div>
      <div id="no-feed" style="display:none;position:absolute;inset:0;align-items:center;justify-content:center;flex-direction:column;gap:12px;color:var(--dim);font-family:var(--mono);font-size:0.75rem;">
        <div style="font-size:2rem;">📷</div>
        <div>Camera stream unavailable</div>
        <div style="font-size:0.65rem;">Run main.py to start the camera</div>
      </div>
    </div>
  </div>

  <!-- ── Top-right: Controls + Stats ── -->
  <div class="panel">
    <div class="panel-title">System Control</div>

    <div class="ctrl-row">
      <div>
        <div class="ctrl-label">Monitoring</div>
        <div class="ctrl-sub">Toggle fall detection</div>
      </div>
      <label class="toggle-wrap">
        <input type="checkbox" id="mon-toggle" onchange="toggleMonitoring(this.checked)"/>
        <div class="toggle-track"></div>
      </label>
    </div>

    <div style="height:18px"></div>

    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-val" id="stat-falls">0</div>
        <div class="stat-lbl">Falls detected</div>
      </div>
      <div class="stat-card">
        <div class="stat-val" id="stat-alerts">0</div>
        <div class="stat-lbl">Alerts sent</div>
      </div>
      <div class="stat-card" style="grid-column:1/-1;">
        <div class="stat-val" style="font-size:0.85rem;color:var(--text)" id="stat-last">—</div>
        <div class="stat-lbl">Last event</div>
      </div>
    </div>
  </div>

  <!-- ── Bottom-right: Contacts + History ── -->
  <div class="panel">
    <div class="tab-nav">
      <button class="tab-btn active" onclick="showTab('contacts',this)">Contacts</button>
      <button class="tab-btn" onclick="showTab('history',this)">History</button>
    </div>

    <!-- Contacts tab -->
    <div class="tab-content active" id="tab-contacts">
      <ul class="contact-list" id="contact-list">
        <li class="empty">No contacts added yet.</li>
      </ul>
      <div class="add-form">
        <input type="text" id="new-number" placeholder="+91 9876543210"
               onkeydown="if(event.key==='Enter') addContact()"/>
        <button class="btn-add" onclick="addContact()">ADD</button>
      </div>
    </div>

    <!-- History tab -->
    <div class="tab-content" id="tab-history">
      <ul class="history-list" id="history-list">
        <li class="empty">No events recorded yet.</li>
      </ul>
    </div>

  </div>
</div>

<script>
// ── Tab switching ──────────────────────────────────────────────────────────────
function showTab(name, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  btn.classList.add('active');
}

// ── Polling ───────────────────────────────────────────────────────────────────
async function fetchStatus() {
  try {
    const r = await fetch('/api/status');
    const d = await r.json();

    const pill = document.getElementById('header-pill');
    const hs   = document.getElementById('header-status');
    const fb   = document.getElementById('fall-banner');

    pill.className = 'status-pill';
    if (d.status === 'Fall Detected' || d.status === 'FALL DETECTED') {
      pill.classList.add('fall');
      hs.textContent = 'FALL';
      fb.style.display = 'flex';
    } else if (d.monitoring) {
      pill.classList.add('active');
      hs.textContent = 'MONITORING';
      fb.style.display = 'none';
    } else {
      pill.classList.add('idle');
      hs.textContent = 'IDLE';
      fb.style.display = 'none';
    }

    document.getElementById('mon-toggle').checked = d.monitoring;
    document.getElementById('stat-falls').textContent  = d.fall_count  || 0;
    document.getElementById('stat-alerts').textContent = d.alert_count || 0;
    document.getElementById('stat-last').textContent   = d.last_event
      ? (d.last_event.type + ' — ' + d.last_event.time)
      : '—';
  } catch(e) { /* server may be starting */ }
}

async function fetchContacts() {
  try {
    const r  = await fetch('/api/contacts');
    const d  = await r.json();
    const ul = document.getElementById('contact-list');
    if (!d.contacts || d.contacts.length === 0) {
      ul.innerHTML = '<li class="empty">No contacts added yet.</li>';
      return;
    }
    ul.innerHTML = d.contacts.map(n =>
      `<li class="contact-item">
        <span>${n}</span>
        <button class="del-btn" onclick="deleteContact('${n}')">REMOVE</button>
      </li>`
    ).join('');
  } catch(e) {}
}

async function fetchHistory() {
  try {
    const r  = await fetch('/api/history');
    const d  = await r.json();
    const ul = document.getElementById('history-list');

    if (!d.history || d.history.length === 0) {
      ul.innerHTML = '<li class="empty">No events recorded yet.</li>';
      return;
    }

    ul.innerHTML = [...d.history].reverse().map(ev => {
      const cls = ev.type.toLowerCase().includes('fall') ? 'fall'
                : ev.type.toLowerCase().includes('alert') ? 'sent' : 'ok';

      let detailHTML = '';

      if (ev.detail) {
        const match = ev.detail.match(/Snapshot:\s*(.*)/);

        if (match) {
          const file = match[1].split(/[\\/]/).pop();  // 🔥 FIXED HERE

          detailHTML = `
            <div style="font-size:0.72rem;color:var(--dim);margin-top:3px">
              Snapshot:<br/>
              <img src="/snapshot/${file}"
                   style="width:100%;margin-top:6px;border:1px solid #252830;border-radius:4px"/>
            </div>
          `;
        } else {
          detailHTML = `<div style="font-size:0.72rem;color:var(--dim);margin-top:3px">${ev.detail}</div>`;
        }
      }

      return `<li class="history-item">
        <div class="h-time">${ev.time}</div>
        <div class="h-type ${cls}">${ev.type}</div>
        ${detailHTML}
      </li>`;
    }).join('');

  } catch(e) {}
}
// ── Actions ───────────────────────────────────────────────────────────────────
async function toggleMonitoring(enabled) {
  try {
    await fetch('/api/monitoring', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({enabled})
    });
  } catch(e) {}
}

async function addContact() {
  const inp = document.getElementById('new-number');
  const num = inp.value.trim();
  if (!num) return;
  try {
    const r = await fetch('/api/contacts', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({number: num})
    });
    if (r.ok) { inp.value = ''; fetchContacts(); }
    else {
      const d = await r.json();
      alert(d.error || 'Failed to add contact');
    }
  } catch(e) { alert('Request failed'); }
}

async function deleteContact(number) {
  try {
    await fetch('/api/contacts/' + encodeURIComponent(number), {method: 'DELETE'});
    fetchContacts();
  } catch(e) {}
}

// ── Init polling ──────────────────────────────────────────────────────────────
fetchStatus(); fetchContacts(); fetchHistory();
setInterval(fetchStatus,  2000);
setInterval(fetchContacts, 5000);
setInterval(fetchHistory,  4000);
</script>
</body>
</html>
"""


# ══════════════════════════════════════════════════════════════════════════════
# Routes
# ══════════════════════════════════════════════════════════════════════════════

@app.route("/")
def index():
    return render_template_string(DASHBOARD_HTML)


@app.route("/video_feed")
def video_feed():
    """MJPEG stream endpoint consumed by the <img> tag on the dashboard."""
    return Response(
        _frame_generator(),
        mimetype="multipart/x-mixed-replace; boundary=frame",
    )


def _frame_generator() -> Generator[bytes, None, None]:
    """Yield JPEG frames wrapped in MJPEG boundary headers."""
    import gc
    last_frame = None
    frame_skip = 0
    while True:
        frame = get_latest_frame()
        if frame is not None and frame != last_frame:
            last_frame = frame
            frame_skip += 1
            # Skip every 2nd frame to reduce memory pressure
            if frame_skip % 2 == 0:
                yield (
                    b"--frame\r\n"
                    b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n"
                )
                if frame_skip % 10 == 0:
                    gc.collect()
        # Small sleep to avoid pegging the CPU when there's no new frame
        import time as _t; _t.sleep(0.05)


@app.route("/api/status")
def api_status():
    return jsonify({**_system_state, "alert_count": len(_alert_history)})


@app.route("/api/history")
def api_history():
    return jsonify({"history": _alert_history})


@app.route("/api/contacts", methods=["GET"])
def api_get_contacts():
    contacts = _load_contacts()
    return jsonify({"contacts": contacts})


@app.route("/api/contacts", methods=["POST"])
def api_add_contact():
    data   = request.get_json(silent=True) or {}
    number = (data.get("number") or "").strip()
    if not number:
        return jsonify({"error": "Phone number is required."}), 400
    if not number.startswith("+"):
        return jsonify({"error": "Number must be in E.164 format, e.g. +919876543210"}), 400

    contacts = _load_contacts()
    if number in contacts:
        return jsonify({"error": "Contact already exists."}), 409
    contacts.append(number)
    _save_contacts(contacts)
    return jsonify({"success": True, "contacts": contacts}), 201


@app.route("/api/contacts/<path:number>", methods=["DELETE"])
def api_delete_contact(number: str):
    contacts = _load_contacts()
    if number not in contacts:
        return jsonify({"error": "Contact not found."}), 404
    contacts.remove(number)
    _save_contacts(contacts)
    return jsonify({"success": True, "contacts": contacts})


@app.route("/api/monitoring", methods=["POST"])
def api_monitoring():
    data    = request.get_json(silent=True) or {}
    enabled = bool(data.get("enabled", False))
    _system_state["monitoring"] = enabled
    _system_state["status"]     = "Monitoring" if enabled else "Idle"
    logger.info("Monitoring set to: %s", enabled)
    return jsonify({"monitoring": enabled})

@app.route("/snapshot/<path:filename>")
def serve_snapshot(filename):
    snapshot_dir = os.path.join(os.path.dirname(__file__), "snapshots")
    filename = filename.replace("snapshots/", "").replace("snapshots\\", "")
    return send_from_directory(snapshot_dir, filename)

# ── Contact helpers ────────────────────────────────────────────────────────────

def _load_contacts() -> list:
    try:
        with open(CONTACTS_FILE, "r") as f:
            return json.load(f).get("contacts", [])
    except (FileNotFoundError, json.JSONDecodeError):
        return []


def _save_contacts(contacts: list):
    with open(CONTACTS_FILE, "w") as f:
        json.dump({"contacts": contacts}, f, indent=2)


# ── Standalone run ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False, use_reloader=False)
