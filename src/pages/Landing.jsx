import { useState, useEffect, createContext, useContext } from "react";
import { useApp } from "../contexts/AppContext.jsx";

/* ═══════════════════════════════════════════════════════════════════════════
   SVG ICON LIBRARY — replaces all emojis
   ═══════════════════════════════════════════════════════════════════════════ */
const Icons = {
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  zap: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  smartphone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  cpu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  ),
  barChart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  creditCard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  trendingUp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  shieldCheck: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
    </svg>
  ),
  landmark: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="22" x2="21" y2="22" /><line x1="6" y1="18" x2="6" y2="11" /><line x1="10" y1="18" x2="10" y2="11" /><line x1="14" y1="18" x2="14" y2="11" /><line x1="18" y1="18" x2="18" y2="11" /><polygon points="12 2 20 7 4 7" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  fileText: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  clipboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  ),
  checkCircle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  brain: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a5 5 0 0 1 5 5c0 .96-.27 1.85-.74 2.6A5 5 0 0 1 19 14c0 1.52-.68 2.88-1.75 3.8A4 4 0 0 1 14 22h-4a4 4 0 0 1-3.25-4.2A5 5 0 0 1 5 14a5 5 0 0 1 2.74-4.4A4.97 4.97 0 0 1 7 7a5 5 0 0 1 5-5z" /><path d="M12 2v20" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  sun: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><line x1="8" y1="6" x2="10" y2="6" /><line x1="14" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="10" y2="10" /><line x1="14" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="10" y2="14" /><line x1="14" y1="14" x2="16" y2="14" />
    </svg>
  ),
  upload: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  activity: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
};

function Icon({ name, size = 24, className = "" }) {
  return (
    <span className={`ft-icon ${className}`} style={{ width: size, height: size, display: "inline-flex" }}>
      {Icons[name] || null}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   THEME CONTEXT
   ═══════════════════════════════════════════════════════════════════════════ */
const ThemeCtx = createContext();
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("ft-theme") || "dark");
  const toggle = () => setTheme((p) => { const n = p === "dark" ? "light" : "dark"; localStorage.setItem("ft-theme", n); return n; });
  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}
function useTheme() { return useContext(ThemeCtx); }

/* ═══════════════════════════════════════════════════════════════════════════
   CSS — FULL DARK + LIGHT THEME
   ═══════════════════════════════════════════════════════════════════════════ */
const buildCSS = (theme) => `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');

/* ─── THEME TOKENS ─── */
:root {
  ${theme === "dark" ? `
  --bg-primary: #06080f;
  --bg-secondary: #0b1022;
  --bg-tertiary: #101730;
  --bg-card: rgba(14, 20, 40, 0.70);
  --bg-card-hover: rgba(22, 32, 60, 0.85);
  --nav-bg: rgba(6, 8, 15, 0.78);
  --nav-bg-scroll: rgba(6, 8, 15, 0.94);
  --accent-1: #7c3aed;
  --accent-2: #3b82f6;
  --accent-3: #06d6a0;
  --gradient-main: linear-gradient(135deg, #7c3aed 0%, #3b82f6 50%, #06b6d4 100%);
  --gradient-subtle: linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(59,130,246,0.08) 50%, rgba(6,182,212,0.06) 100%);
  --glow-1: rgba(124, 58, 237, 0.30);
  --glow-2: rgba(59, 130, 246, 0.25);
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --border: rgba(124, 58, 237, 0.10);
  --border-hover: rgba(124, 58, 237, 0.28);
  --glass: rgba(14, 20, 40, 0.50);
  ` : `
  --bg-primary: #f8fafc;
  --bg-secondary: #f1f5f9;
  --bg-tertiary: #e2e8f0;
  --bg-card: rgba(255, 255, 255, 0.85);
  --bg-card-hover: rgba(255, 255, 255, 1);
  --nav-bg: rgba(248, 250, 252, 0.82);
  --nav-bg-scroll: rgba(248, 250, 252, 0.96);
  --accent-1: #7c3aed;
  --accent-2: #3b82f6;
  --accent-3: #06d6a0;
  --gradient-main: linear-gradient(135deg, #7c3aed 0%, #3b82f6 50%, #06b6d4 100%);
  --gradient-subtle: linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(59,130,246,0.04) 50%, rgba(6,182,212,0.03) 100%);
  --glow-1: rgba(124, 58, 237, 0.12);
  --glow-2: rgba(59, 130, 246, 0.10);
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --border: rgba(124, 58, 237, 0.10);
  --border-hover: rgba(124, 58, 237, 0.22);
  --glass: rgba(255, 255, 255, 0.45);
  `}
  --radius: 16px;
  --radius-sm: 10px;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
}

html { scroll-behavior: smooth; }
body {
  margin:0; padding:0; width:100%;
  font-family: 'Inter', sans-serif;
  background: var(--bg-primary); color: var(--text-primary);
  -webkit-font-smoothing: antialiased; overflow-x: hidden;
  transition: background .5s var(--ease), color .5s var(--ease);
}

/* ─── ICON ─── */
.ft-icon svg { width: 100%; height: 100%; }

/* ══════════════ NAVBAR ══════════════ */
.ft-nav {
  position: fixed; top:0; left:0; right:0; z-index:100;
  background: var(--nav-bg); backdrop-filter: blur(24px) saturate(1.5);
  border-bottom: 1px solid var(--border);
  padding: 0 5%; height: 72px;
  display: flex; align-items: center; justify-content: space-between;
  transition: all .45s var(--ease);
}
.ft-nav.scrolled { background: var(--nav-bg-scroll); box-shadow: 0 4px 40px rgba(0,0,0,${theme === "dark" ? ".45" : ".08"}); }
.ft-nav-logo { display:flex; align-items:center; gap:10px; text-decoration:none; }
.ft-nav-logo-text { font-family:'Space Grotesk',sans-serif; font-size:1.4rem; font-weight:700; color:var(--text-primary); letter-spacing:-.02em; }
.ft-nav-logo-accent { background: var(--gradient-main); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.ft-nav-links { display:flex; align-items:center; gap:32px; list-style:none; padding:0; margin:0; }
.ft-nav-links a { text-decoration:none; color:var(--text-secondary); font-size:.85rem; font-weight:500; transition:all .3s; position:relative; }
.ft-nav-links a::after { content:''; position:absolute; bottom:-4px; left:0; width:0; height:2px; background:var(--gradient-main); transition:width .3s; border-radius:1px; }
.ft-nav-links a:hover, .ft-nav-links a.active { color:var(--text-primary); }
.ft-nav-links a:hover::after, .ft-nav-links a.active::after { width:100%; }
.ft-nav-right { display:flex; gap:12px; align-items:center; }
.ft-nav-login { text-decoration:none; color:var(--text-secondary); font-size:.85rem; font-weight:500; transition:color .3s; cursor:pointer; background:none; border:none; font-family:inherit; }
.ft-nav-login:hover { color:var(--text-primary); }
.ft-theme-toggle {
  width:40px; height:40px; border-radius:50%; cursor:pointer;
  background: var(--glass); border:1px solid var(--border);
  display:flex; align-items:center; justify-content:center;
  color: var(--text-secondary); transition: all .3s;
  backdrop-filter: blur(8px);
}
.ft-theme-toggle:hover { border-color:var(--border-hover); color:var(--text-primary); background: var(--bg-card-hover); }
.ft-theme-toggle svg { width:18px; height:18px; }

/* ══════════════ BUTTONS ══════════════ */
.btn {
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  padding:12px 26px; border-radius:var(--radius-sm); font-size:.875rem; font-weight:600;
  text-decoration:none; cursor:pointer; border:none;
  transition: all .4s var(--ease); letter-spacing:.01em; position:relative; overflow:hidden; font-family:inherit;
}
.btn-primary {
  background: var(--gradient-main); color:#fff;
  box-shadow: 0 4px 20px var(--glow-1);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 40px var(--glow-1), 0 0 60px var(--glow-2);
}
.btn-ghost {
  background:transparent; color:var(--text-secondary);
  border:1px solid var(--border); backdrop-filter:blur(8px);
}
.btn-ghost:hover {
  color:var(--text-primary); border-color:var(--border-hover);
  background: var(--gradient-subtle); transform:translateY(-1px);
}
.btn-large { padding:16px 34px; font-size:.95rem; border-radius:12px; }
.btn-white { background:#fff; color:var(--accent-1); font-weight:700; box-shadow:0 4px 24px rgba(0,0,0,.15); }
.btn-white:hover { background:#f5f3ff; transform:translateY(-2px); box-shadow:0 8px 36px rgba(0,0,0,.2); }
.btn-outline-white { background:transparent; color:#fff; border:1.5px solid rgba(255,255,255,.3); }
.btn-outline-white:hover { border-color:#fff; background:rgba(255,255,255,.08); }

/* ══════════════ HERO ══════════════ */
.ft-hero {
  width:100vw; min-height:100vh; display:flex; align-items:center;
  padding:140px 5% 100px; position:relative; overflow:hidden;
}
.ft-hero-mesh {
  position:absolute; inset:0; z-index:0;
  background:
    radial-gradient(ellipse 70% 55% at 15% 45%, rgba(124,58,237,.${theme === "dark" ? "14" : "06"}) 0%, transparent 60%),
    radial-gradient(ellipse 55% 45% at 85% 25%, rgba(59,130,246,.${theme === "dark" ? "10" : "04"}) 0%, transparent 60%),
    radial-gradient(ellipse 45% 35% at 55% 85%, rgba(6,182,212,.${theme === "dark" ? "07" : "03"}) 0%, transparent 60%);
  animation: meshFloat 14s ease-in-out infinite;
}
@keyframes meshFloat { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.75;transform:scale(1.06)} }
.ft-hero-grid {
  position:absolute; inset:0; z-index:0; opacity:${theme === "dark" ? ".12" : ".06"};
  background-image: linear-gradient(rgba(124,58,237,.2) 1px,transparent 1px), linear-gradient(90deg,rgba(124,58,237,.2) 1px,transparent 1px);
  background-size:64px 64px;
  mask-image: radial-gradient(ellipse 65% 55% at 50% 30%,black 0%,transparent 100%);
}
.ft-particles { position:absolute; inset:0; z-index:0; pointer-events:none; }
.ft-particle {
  position:absolute; width:3px; height:3px; border-radius:50%;
  background:var(--accent-2); opacity:0;
  animation: particleUp 10s ease-in-out infinite;
}
@keyframes particleUp {
  0%{opacity:0;transform:translateY(100vh) scale(0)} 15%{opacity:.5} 85%{opacity:.2} 100%{opacity:0;transform:translateY(-80px) scale(1)}
}
.ft-hero-container {
  position:relative; z-index:1; display:flex; align-items:center;
  justify-content:space-between; gap:64px; width:100%; max-width:1300px; margin:0 auto;
}
.ft-hero-content { flex:1.2; max-width:700px; }

/* eyebrow */
.ft-hero-eyebrow {
  display:inline-flex; align-items:center; gap:10px;
  background: var(--glass); border:1px solid var(--border);
  border-radius:100px; padding:8px 20px 8px 14px;
  font-size:.76rem; font-weight:600; color:var(--accent-2);
  letter-spacing:.1em; text-transform:uppercase; margin-bottom:32px;
  backdrop-filter:blur(12px);
  opacity:0; animation: fadeUp .8s .2s forwards;
}
.ft-eyebrow-dot {
  width:8px; height:8px; border-radius:50%; background:#22c55e;
  box-shadow:0 0 14px rgba(34,197,94,.55); animation:pulse 2s infinite;
}
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }

.ft-hero-headline {
  font-family:'Space Grotesk',sans-serif;
  font-size:clamp(2.8rem,5.5vw,4.8rem); line-height:1.06;
  letter-spacing:-.045em; margin-bottom:28px; font-weight:700;
  color:var(--text-primary);
  opacity:0; animation: fadeUp .8s .4s forwards;
}
.ft-hero-headline em {
  font-style:normal; font-weight:800;
  background: var(--gradient-main);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
}
.ft-hero-sub {
  font-size:1.1rem; color:var(--text-secondary); line-height:1.8;
  max-width:540px; margin-bottom:44px;
  opacity:0; animation: fadeUp .8s .6s forwards;
}
.ft-hero-actions {
  display:flex; gap:16px; flex-wrap:wrap; margin-bottom:64px;
  opacity:0; animation: fadeUp .8s .8s forwards;
}
.ft-hero-stats {
  display:flex; gap:52px; flex-wrap:wrap;
  opacity:0; animation: fadeUp .8s 1s forwards;
}
.ft-stat { display:flex; flex-direction:column; gap:4px; }
.ft-stat-num {
  font-family:'Space Grotesk',sans-serif;
  font-size:2.1rem; font-weight:700; color:var(--text-primary); letter-spacing:-.02em;
}
.ft-stat-num span {
  background: var(--gradient-main);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
}
.ft-stat-label { font-size:.72rem; color:var(--text-muted); font-weight:500; text-transform:uppercase; letter-spacing:.1em; }

/* hero visual */
.ft-hero-visual {
  flex:1; display:flex; justify-content:center; align-items:center;
  max-width:520px; position:relative;
  opacity:0; animation: fadeUpScale 1s .5s forwards;
}
.ft-hero-orb {
  width:380px; height:380px; position:relative; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
}
.ft-hero-orb::before {
  content:''; position:absolute; inset:-3px; border-radius:50%;
  background: conic-gradient(from 0deg, var(--accent-1), var(--accent-2), var(--accent-3), var(--accent-1));
  opacity:.2; animation: orbSpin 12s linear infinite;
}
@keyframes orbSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
.ft-hero-orb-inner {
  width:280px; height:280px; border-radius:50%;
  background: radial-gradient(circle at 30% 30%, rgba(124,58,237,.15) 0%, var(--bg-primary) 70%);
  border:1px solid var(--border); display:flex; align-items:center; justify-content:center;
  position:relative; z-index:1; backdrop-filter:blur(20px);
}
.ft-hero-orb-icon {
  color: var(--accent-2);
  filter: drop-shadow(0 0 30px var(--glow-2));
  animation: float 6s ease-in-out infinite;
}
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
.ft-orb-ring {
  position:absolute; border-radius:50%; border:1px solid var(--border);
}
.ft-orb-ring-1 { width:340px; height:340px; animation: orbSpin 28s linear infinite; }
.ft-orb-ring-2 { width:430px; height:430px; animation: orbSpin 38s linear infinite reverse; opacity:.4; }
.ft-orb-dot {
  position:absolute; width:9px; height:9px; border-radius:50%;
  background: var(--accent-1); box-shadow:0 0 18px var(--glow-1);
}

@keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeUpScale { from{opacity:0;transform:translateY(40px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }

/* ══════════════ SCROLL REVEAL ══════════════ */
.ft-reveal { opacity:0; transform:translateY(50px); transition:all .8s var(--ease); }
.ft-reveal.visible { opacity:1; transform:translateY(0); }
.ft-reveal-d1 { transition-delay:.1s } .ft-reveal-d2 { transition-delay:.2s }
.ft-reveal-d3 { transition-delay:.3s } .ft-reveal-d4 { transition-delay:.4s }

/* ══════════════ SECTION SHARED ══════════════ */
.ft-section { padding:120px 5%; position:relative; }
.ft-section-label {
  font-size:.72rem; font-weight:700; text-transform:uppercase;
  letter-spacing:.14em; margin-bottom:18px;
  display:flex; align-items:center; gap:12px;
  background: var(--gradient-main);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
}
.ft-section-label::before {
  content:''; width:28px; height:2px;
  background: var(--gradient-main); border-radius:1px;
}
.ft-section-title {
  font-family:'Space Grotesk',sans-serif;
  font-size:clamp(2rem,3.5vw,3.2rem); line-height:1.1;
  letter-spacing:-.035em; color:var(--text-primary);
  max-width:660px; margin-bottom:18px; font-weight:700;
}
.ft-section-sub {
  color:var(--text-secondary); font-size:1.05rem;
  line-height:1.75; max-width:580px; margin-bottom:64px;
}

/* ══════════════ HORIZONTAL CARDS — SERVICES ══════════════ */
.ft-services { background: var(--bg-primary); }
.ft-services-grid { display:flex; flex-direction:column; gap:20px; }
.ft-service-card {
  display:flex; align-items:center; gap:28px;
  background: var(--bg-card); border:1px solid var(--border);
  border-radius:var(--radius); padding:28px 32px;
  transition: all .45s var(--ease); cursor:pointer;
  position:relative; overflow:hidden;
}
.ft-service-card::before {
  content:''; position:absolute; left:0; top:0; bottom:0; width:3px;
  background: var(--gradient-main);
  transform:scaleY(0); transform-origin:top; transition:transform .4s var(--ease);
}
.ft-service-card:hover::before { transform:scaleY(1); }
.ft-service-card:hover {
  border-color:var(--border-hover); background:var(--bg-card-hover);
  transform:translateX(6px);
  box-shadow: 0 12px 48px rgba(0,0,0,${theme === "dark" ? ".35" : ".08"}), 0 0 30px var(--glow-1);
}
.ft-service-card-icon-wrap {
  flex-shrink:0; width:56px; height:56px; border-radius:14px;
  background: var(--gradient-subtle);
  border:1px solid var(--border);
  display:flex; align-items:center; justify-content:center;
  color: var(--accent-1); transition: all .4s var(--ease);
}
.ft-service-card:hover .ft-service-card-icon-wrap {
  background: var(--gradient-main); color:#fff;
  box-shadow:0 4px 20px var(--glow-1);
}
.ft-service-card-body { flex:1; min-width:0; }
.ft-service-name {
  font-family:'Space Grotesk',sans-serif;
  font-weight:700; font-size:1.05rem; color:var(--text-primary); margin-bottom:6px;
}
.ft-service-desc { font-size:.84rem; color:var(--text-secondary); line-height:1.65; margin-bottom:10px; }
.ft-service-tag {
  display:inline-block;
  background: var(--gradient-subtle); border:1px solid var(--border);
  color:var(--accent-1); font-size:.68rem; font-weight:700;
  padding:3px 12px; border-radius:100px; letter-spacing:.06em; text-transform:uppercase;
}

/* ══════════════ MOVING CARDS CAROUSEL ══════════════ */
.ft-carousel-section { padding:120px 0; position:relative; overflow:hidden; background:var(--bg-secondary); }
.ft-carousel-section::before, .ft-carousel-section::after {
  content:''; position:absolute; left:0; right:0; height:1px;
  background: var(--gradient-main); opacity:.3;
}
.ft-carousel-section::before { top:0; }
.ft-carousel-section::after { bottom:0; }
.ft-carousel-header { padding:0 5%; margin-bottom:64px; max-width:1300px; margin-left:auto; margin-right:auto; }
.ft-carousel-track-wrapper {
  position:relative; width:100%; overflow:hidden;
  mask-image: linear-gradient(90deg,transparent,black 6%,black 94%,transparent);
  -webkit-mask-image: linear-gradient(90deg,transparent,black 6%,black 94%,transparent);
}
.ft-carousel-track {
  display:flex; gap:28px; padding:16px 0;
  animation: scrollLeft 50s linear infinite; width:max-content;
}
.ft-carousel-track:hover { animation-play-state:paused; }
@keyframes scrollLeft { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
.ft-carousel-track-rev { animation: scrollRight 55s linear infinite; }
.ft-carousel-track-rev:hover { animation-play-state:paused; }
@keyframes scrollRight { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }

/* HORIZONTAL carousel card */
.ft-carousel-card {
  flex-shrink:0; width:420px;
  display:flex; align-items:stretch;
  background: var(--bg-card); border:1px solid var(--border);
  border-radius:18px; overflow:hidden;
  transition: all .5s var(--ease); cursor:pointer;
}
.ft-carousel-card:hover {
  transform:translateY(-6px) scale(1.015);
  border-color:var(--border-hover);
  box-shadow: 0 20px 60px rgba(0,0,0,${theme === "dark" ? ".45" : ".10"}), 0 0 40px var(--glow-1);
}
.ft-carousel-card-visual {
  flex-shrink:0; width:120px; display:flex; align-items:center; justify-content:center;
  background: var(--gradient-subtle); position:relative; overflow:hidden;
}
.ft-carousel-card-visual::after {
  content:''; position:absolute; inset:0;
  background: var(--gradient-main); opacity:.06;
}
.ft-carousel-card-icon {
  position:relative; z-index:1; color:var(--accent-2);
  transition: transform .5s var(--ease);
}
.ft-carousel-card:hover .ft-carousel-card-icon { transform:scale(1.2); }
.ft-carousel-card-content { padding:24px; flex:1; display:flex; flex-direction:column; justify-content:center; }
.ft-carousel-card-tag {
  display:inline-block; width:fit-content; padding:3px 10px; border-radius:100px;
  background: var(--gradient-subtle); border:1px solid var(--border);
  color:var(--accent-1); font-size:.66rem; font-weight:700; letter-spacing:.1em;
  text-transform:uppercase; margin-bottom:10px;
}
.ft-carousel-card h4 {
  font-family:'Space Grotesk',sans-serif;
  font-size:1.05rem; font-weight:700; color:var(--text-primary);
  margin:0 0 6px; letter-spacing:-.01em;
}
.ft-carousel-card p { font-size:.82rem; color:var(--text-secondary); line-height:1.6; margin:0; }

/* ══════════════ PROCESS ══════════════ */
.ft-process { background: var(--bg-secondary); }
.ft-process-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:24px; }
.ft-process-card {
  display:flex; align-items:flex-start; gap:20px;
  background: var(--bg-card); border:1px solid var(--border);
  border-radius:var(--radius); padding:30px 28px;
  transition: all .45s var(--ease); cursor:pointer; position:relative; overflow:hidden;
}
.ft-process-card:hover {
  border-color:var(--border-hover); background:var(--bg-card-hover);
  transform:translateY(-4px);
  box-shadow:0 12px 44px rgba(0,0,0,${theme === "dark" ? ".3" : ".06"});
}
.ft-process-step-num {
  flex-shrink:0; width:42px; height:42px; border-radius:50%;
  background: var(--gradient-main); color:#fff;
  font-family:'Space Grotesk',sans-serif; font-size:.85rem; font-weight:800;
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 4px 16px var(--glow-1);
}
.ft-process-card-body { flex:1; }
.ft-process-card h4 {
  font-family:'Space Grotesk',sans-serif;
  font-weight:700; font-size:1rem; color:var(--text-primary); margin:0 0 8px;
}
.ft-process-card p { font-size:.84rem; color:var(--text-secondary); line-height:1.65; margin:0; }

/* ══════════════ AGENTS ══════════════ */
.ft-agents { background:var(--bg-primary); }
.ft-agent-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:24px; }
.ft-agent-card {
  display:flex; align-items:flex-start; gap:22px;
  background: var(--bg-card); border:1px solid var(--border);
  border-radius:var(--radius); padding:30px 28px;
  transition: all .45s var(--ease); cursor:pointer; position:relative; overflow:hidden;
}
.ft-agent-card::after {
  content:''; position:absolute; bottom:0; left:0; right:0; height:2px;
  background: var(--gradient-main); transform:scaleX(0); transform-origin:right;
  transition:transform .4s var(--ease);
}
.ft-agent-card:hover::after { transform:scaleX(1); transform-origin:left; }
.ft-agent-card:hover {
  border-color:var(--border-hover); background:var(--bg-card-hover);
  transform:translateY(-4px);
  box-shadow:0 12px 44px rgba(0,0,0,${theme === "dark" ? ".3" : ".06"}), 0 0 24px var(--glow-2);
}
.ft-agent-icon-wrap {
  flex-shrink:0; width:50px; height:50px; border-radius:12px;
  background: var(--gradient-subtle); border:1px solid var(--border);
  display:flex; align-items:center; justify-content:center;
  color:var(--accent-2); transition:all .4s var(--ease);
}
.ft-agent-card:hover .ft-agent-icon-wrap {
  background:var(--gradient-main); color:#fff; box-shadow:0 4px 16px var(--glow-2);
}
.ft-agent-card-body { flex:1; }
.ft-agent-card h4 {
  font-family:'Space Grotesk',sans-serif;
  font-weight:700; font-size:1rem; color:var(--text-primary); margin:0 0 8px;
}
.ft-agent-card p { font-size:.84rem; color:var(--text-secondary); line-height:1.65; margin:0; }

/* ══════════════ CTA ══════════════ */
.ft-cta {
  width:100vw; min-height:45vh; display:flex; align-items:center;
  padding:120px 5%; position:relative; overflow:hidden;
  background: ${theme === "dark"
    ? "linear-gradient(135deg, #0b0e1a 0%, #1a103a 40%, #0e1638 100%)"
    : "linear-gradient(135deg, #ede9fe 0%, #dbeafe 40%, #e0f2fe 100%)"};
  box-sizing:border-box;
}
.ft-cta::before {
  content:''; position:absolute; inset:0;
  background: radial-gradient(ellipse 55% 50% at 50% 50%, var(--glow-1) 0%, transparent 60%);
}
.ft-cta::after {
  content:''; position:absolute; inset:0;
  background-image: radial-gradient(rgba(124,58,237,.12) 1px,transparent 1px);
  background-size:36px 36px; opacity:.35;
}
.ft-cta-inner {
  position:relative; z-index:1; display:flex; align-items:center;
  justify-content:space-between; gap:48px; width:100%; max-width:1300px; margin:0 auto;
}
.ft-cta-text { flex:1.2; max-width:700px; }
.ft-cta-title {
  font-family:'Space Grotesk',sans-serif;
  font-size:clamp(2rem,4vw,3.3rem);
  color:${theme === "dark" ? "#fff" : "var(--text-primary)"};
  line-height:1.1; letter-spacing:-.025em; margin-bottom:18px; font-weight:700;
}
.ft-cta-sub { color:${theme === "dark" ? "rgba(255,255,255,.6)" : "var(--text-secondary)"}; font-size:1.05rem; line-height:1.7; }
.ft-cta-actions { flex:1; display:flex; justify-content:center; align-items:center; gap:16px; flex-wrap:wrap; max-width:520px; }

/* ══════════════ FOOTER ══════════════ */
.ft-footer {
  width:100vw; background:${theme === "dark" ? "#040610" : "#f1f5f9"};
  border-top:1px solid var(--border);
  color:var(--text-muted); padding:80px 5% 40px; box-sizing:border-box;
}
.ft-footer-inner {
  display:flex; align-items:flex-start; justify-content:space-between;
  gap:48px; width:100%; max-width:1300px; margin:0 auto;
}
.ft-footer-inner > div:first-child { flex:1.4; max-width:420px; }
.ft-footer-inner > div:not(:first-child) { flex:1; max-width:200px; }
.ft-footer-logo { display:flex; align-items:center; gap:10px; margin-bottom:16px; }
.ft-footer-logo-text {
  font-family:'Space Grotesk',sans-serif; font-size:1.4rem;
  color:var(--text-primary); font-weight:700;
}
.ft-footer-logo-accent {
  background: var(--gradient-main);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
}
.ft-footer-desc { font-size:.84rem; line-height:1.7; max-width:320px; margin-bottom:24px; }
.ft-footer-col-title {
  color:var(--text-primary); font-weight:700; font-size:.78rem;
  text-transform:uppercase; letter-spacing:.1em; margin-bottom:18px;
}
.ft-footer-links { list-style:none; display:flex; flex-direction:column; gap:12px; padding:0; margin:0; }
.ft-footer-links a { text-decoration:none; color:var(--text-muted); font-size:.84rem; transition:all .3s; }
.ft-footer-links a:hover { color:var(--accent-1); }
.ft-footer-bottom {
  border-top:1px solid var(--border); margin-top:48px;
  padding-top:28px; display:flex; justify-content:space-between;
  align-items:center; flex-wrap:wrap; gap:12px; font-size:.78rem;
  max-width:1300px; margin-left:auto; margin-right:auto;
}

/* ══════════════ RESPONSIVE ══════════════ */
@media(max-width:1024px) {
  .ft-hero-visual { display:none; }
  .ft-hero-container { justify-content:center; }
  .ft-hero-content { text-align:center; max-width:100%; }
  .ft-hero-sub { margin-left:auto; margin-right:auto; }
  .ft-hero-actions { justify-content:center; }
  .ft-hero-stats { justify-content:center; }
}
@media(max-width:900px) {
  .ft-footer-inner { flex-direction:column; }
  .ft-nav-links { display:none; }
  .ft-cta-inner { flex-direction:column; text-align:center; }
  .ft-cta-actions { justify-content:center; }
}
@media(max-width:640px) {
  .ft-hero-stats { gap:24px; }
  .ft-footer-bottom { flex-direction:column; align-items:flex-start; }
  .ft-carousel-card { width:320px; }
  .ft-carousel-card-visual { width:90px; }
  .ft-service-card { flex-direction:column; gap:16px; }
}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}}
`;

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLL REVEAL HOOK
   ═══════════════════════════════════════════════════════════════════════════ */
function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    document.querySelectorAll(".ft-reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

function Nav({ activeSection }) {
  const { switchView } = useApp();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`ft-nav ${scrolled ? "scrolled" : ""}`}>
      <a className="ft-nav-logo" href="#">
        <img src="/logo.png" alt="FinTech" style={{ height: 28, width: "auto", filter: theme === "dark" ? "brightness(1.3)" : "none" }} />
        <span className="ft-nav-logo-text">Fin<span className="ft-nav-logo-accent">Tech</span></span>
      </a>
      <ul className="ft-nav-links">
        {[["#services","Services"],["#features","Features"],["#agents","For Agents"],["#process","How it Works"]].map(([h, l]) => (
          <li key={h}><a href={h} className={activeSection === h.slice(1) ? "active" : ""}>{l}</a></li>
        ))}
      </ul>
      <div className="ft-nav-right">
        <button className="ft-theme-toggle" onClick={toggle} aria-label="Toggle theme" title={theme === "dark" ? "Switch to light" : "Switch to dark"}>
          {theme === "dark" ? Icons.sun : Icons.moon}
        </button>
        <button onClick={() => switchView("loginView")} className="ft-nav-login">Login</button>
        <a href="#" className="btn btn-primary" onClick={(e) => { e.preventDefault(); switchView("registerView"); }}>Get Started</a>
      </div>
    </nav>
  );
}

/* ─── particles ─── */
function Particles() {
  const pts = Array.from({ length: 18 }, (_, i) => ({
    id: i, left: `${Math.random() * 100}%`, s: 2 + Math.random() * 3,
    del: Math.random() * 10, dur: 7 + Math.random() * 9,
  }));
  return (
    <div className="ft-particles">
      {pts.map((p) => (
        <div key={p.id} className="ft-particle" style={{ left: p.left, width: p.s, height: p.s, animationDelay: `${p.del}s`, animationDuration: `${p.dur}s` }} />
      ))}
    </div>
  );
}

/* ─── hero ─── */
function Hero() {
  return (
    <section className="ft-hero">
      <div className="ft-hero-mesh" />
      <div className="ft-hero-grid" />
      <Particles />
      <div className="ft-hero-container">
        <div className="ft-hero-content">
          <div className="ft-hero-eyebrow">
            <span className="ft-eyebrow-dot" />
            Unified Financial Platform
          </div>
          <h1 className="ft-hero-headline">
            Every financial service,<br /><em>one bridge.</em>
          </h1>
          <p className="ft-hero-sub">
            Loans, investments, insurance, pensions, and government benefits — accessed through a single platform. Stop chasing documents. Start achieving goals.
          </p>
          <div className="ft-hero-actions">
            <a href="#" className="btn btn-primary btn-large">Start your application</a>
            <a href="#process" className="btn btn-ghost btn-large">How it works</a>
          </div>
          <div className="ft-hero-stats">
            {[["5","+","Service Categories"],["100","%","Digital Process"],["24/7","","AI Support"]].map(([n, s, l]) => (
              <div className="ft-stat" key={l}>
                <span className="ft-stat-num">{n}{s && <span>{s}</span>}</span>
                <span className="ft-stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="ft-hero-visual">
          <div className="ft-orb-ring ft-orb-ring-2"><div className="ft-orb-dot" style={{ top: "8%", right: "0" }} /></div>
          <div className="ft-orb-ring ft-orb-ring-1"><div className="ft-orb-dot" style={{ bottom: "4%", left: "8%" }} /></div>
          <div className="ft-hero-orb">
            <div className="ft-hero-orb-inner">
              <div className="ft-hero-orb-icon"><Icon name="building" size={72} /></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOVING CARD CAROUSEL — horizontal cards, 2 rows, auto-scroll
   ═══════════════════════════════════════════════════════════════════════════ */

const ROW1 = [
  { icon: "shield",     tag: "Security",  title: "Bank-Grade Encryption",   desc: "AES-256 encryption and multi-factor authentication protect your data at every step." },
  { icon: "zap",        tag: "Speed",     title: "Instant Processing",      desc: "AI-powered eligibility checks deliver results in seconds. Real-time status updates included." },
  { icon: "smartphone", tag: "Mobile",    title: "Apply Anywhere",          desc: "Complete your entire application from any device. Upload documents with your phone camera." },
  { icon: "cpu",        tag: "AI Engine", title: "Smart Recommendations",   desc: "Our AI analyses your profile against thousands of schemes to find the best fit." },
  { icon: "barChart",   tag: "Analytics", title: "Track Everything",        desc: "Real-time dashboards show application status, document verification, and approval timelines." },
  { icon: "globe",      tag: "Platform",  title: "Unified Access",          desc: "One application for loans, insurance, investments, and pensions — no more portal-hopping." },
];

const ROW2 = [
  { icon: "creditCard",  tag: "Loans",       title: "Credit Services",  desc: "Personal, home, vehicle, education, gold, agricultural & business loans. MSME included." },
  { icon: "trendingUp",  tag: "Growth",      title: "Investments",      desc: "FD, RD, SIP, mutual funds, ELSS, sovereign gold bonds, and goal-based planning." },
  { icon: "shieldCheck", tag: "Protection",  title: "Insurance",        desc: "Life, health, vehicle, term, travel, accident, property, and crop insurance in one place." },
  { icon: "landmark",    tag: "Retirement",  title: "Pension",          desc: "NPS, Atal Pension Yojana, PM-SYM, senior citizen, widow, and disability pension schemes." },
  { icon: "users",       tag: "Welfare",     title: "Social Security",  desc: "E-Shram, PM Kisan, labour welfare, scholarships, disability benefits & government subsidies." },
  { icon: "fileText",    tag: "Documents",   title: "Digital Vault",    desc: "Upload once, reuse everywhere. Your docs are securely stored and auto-attached to applications." },
];

function MovingCards() {
  const renderRow = (cards) => (
    <>
      {[...cards, ...cards].map((c, i) => (
        <div className="ft-carousel-card" key={i}>
          <div className="ft-carousel-card-visual">
            <div className="ft-carousel-card-icon"><Icon name={c.icon} size={36} /></div>
          </div>
          <div className="ft-carousel-card-content">
            <span className="ft-carousel-card-tag">{c.tag}</span>
            <h4>{c.title}</h4>
            <p>{c.desc}</p>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <section className="ft-carousel-section" id="features">
      <div className="ft-carousel-header">
        <div className="ft-section-label ft-reveal">Platform Features</div>
        <h2 className="ft-section-title ft-reveal ft-reveal-d1">Transform Your Financial Journey</h2>
        <p className="ft-section-sub ft-reveal ft-reveal-d2">
          Experience enhanced security, speed, and convenience with our cutting-edge financial platform. Everything you need, unified.
        </p>
      </div>
      <div className="ft-carousel-track-wrapper">
        <div className="ft-carousel-track">{renderRow(ROW1)}</div>
      </div>
      <div style={{ height: 20 }} />
      <div className="ft-carousel-track-wrapper">
        <div className="ft-carousel-track ft-carousel-track-rev">{renderRow(ROW2)}</div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SERVICES — horizontal cards
   ═══════════════════════════════════════════════════════════════════════════ */
const SERVICES = [
  { icon: "creditCard",  name: "Credit Services",       desc: "Personal, home, vehicle, education, gold, agricultural & business loans. MSME and working capital covered.",             tag: "4 loan types" },
  { icon: "trendingUp",  name: "Savings & Investments",  desc: "FD, RD, SIP, mutual funds, ELSS, sovereign gold bonds, and goal-based investment planning.",                           tag: "4 products" },
  { icon: "shieldCheck", name: "Insurance",              desc: "Life, health, family, vehicle, term, travel, accident, property, and crop insurance under one roof.",                   tag: "4 categories" },
  { icon: "landmark",    name: "Pension Services",       desc: "NPS, Atal Pension Yojana, PM-SYM, senior citizen, widow, and disability pension schemes.",                              tag: "4 schemes" },
  { icon: "users",       name: "Social Security",        desc: "E-Shram, PM Kisan, labour welfare, scholarships, disability benefits, and government subsidy programs.",                tag: "4 benefits" },
];

function Services() {
  return (
    <section className="ft-section ft-services" id="services">
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <div className="ft-section-label ft-reveal">What we offer</div>
        <h2 className="ft-section-title ft-reveal ft-reveal-d1">Every service, one application</h2>
        <p className="ft-section-sub ft-reveal ft-reveal-d2">From your first home loan to retirement planning — stop repeating yourself across a dozen different portals.</p>
        <div className="ft-services-grid">
          {SERVICES.map((s, i) => (
            <div className={`ft-service-card ft-reveal ft-reveal-d${(i % 4) + 1}`} key={s.name}>
              <div className="ft-service-card-icon-wrap"><Icon name={s.icon} size={26} /></div>
              <div className="ft-service-card-body">
                <div className="ft-service-name">{s.name}</div>
                <div className="ft-service-desc">{s.desc}</div>
                <span className="ft-service-tag">{s.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROCESS — horizontal card layout
   ═══════════════════════════════════════════════════════════════════════════ */
const STEPS = [
  { step: "01", icon: "upload",      title: "Submit your application",  desc: "Fill out a single application for any financial service — loans, insurance, investments, or pensions." },
  { step: "02", icon: "fileText",    title: "Upload documents once",    desc: "Attach your Aadhaar, PAN, bank statements, and salary slips to the secure Document Vault." },
  { step: "03", icon: "search",      title: "AI eligibility check",    desc: "Our engine analyses your profile against lender criteria and delivers approval probability & insights." },
  { step: "04", icon: "activity",    title: "Track & get approved",     desc: "Monitor application status in real time. Receive instant notifications on documents & approvals." },
];

function Process() {
  return (
    <section className="ft-section ft-process" id="process">
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <div className="ft-section-label ft-reveal">How it works</div>
        <h2 className="ft-section-title ft-reveal ft-reveal-d1">From application to approval in four steps</h2>
        <p className="ft-section-sub ft-reveal ft-reveal-d2">No branches, no paperwork piles, no status calls. A streamlined process for speed and transparency.</p>
        <div className="ft-process-grid">
          {STEPS.map((s, i) => (
            <div className={`ft-process-card ft-reveal ft-reveal-d${i + 1}`} key={s.step}>
              <span className="ft-process-step-num">{s.step}</span>
              <div className="ft-process-card-body">
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   AGENT PORTAL — horizontal cards
   ═══════════════════════════════════════════════════════════════════════════ */
const AGENT_FEATURES = [
  { icon: "clipboard",   title: "Unified application dashboard",       desc: "View all client applications across every service category in one place. Sort by status, type, or amount." },
  { icon: "checkCircle", title: "Document verification tools",         desc: "Review uploaded documents, request missing files, and approve submissions — without leaving the portal." },
  { icon: "brain",       title: "AI eligibility on behalf of clients", desc: "Run eligibility checks and present bank recommendations directly to clients during field visits." },
  { icon: "bell",        title: "Real-time status notifications",      desc: "Get alerted the moment a client's application moves, a document is requested, or approval is granted." },
];

function AgentPortal() {
  return (
    <section className="ft-section ft-agents" id="agents">
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <div className="ft-section-label ft-reveal">Agent Portal</div>
        <h2 className="ft-section-title ft-reveal ft-reveal-d1">Built for the people who make it happen</h2>
        <p className="ft-section-sub ft-reveal ft-reveal-d2">Field agents get a dedicated portal to manage client applications, verify documents, and track outcomes — no manual paperwork.</p>
        <div className="ft-agent-grid">
          {AGENT_FEATURES.map((f, i) => (
            <div className={`ft-agent-card ft-reveal ft-reveal-d${i + 1}`} key={f.title}>
              <div className="ft-agent-icon-wrap"><Icon name={f.icon} size={24} /></div>
              <div className="ft-agent-card-body">
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTA() {
  const { switchView } = useApp();
  const { theme } = useTheme();
  return (
    <section className="ft-cta">
      <div className="ft-cta-inner">
        <div className="ft-cta-text ft-reveal">
          <h2 className="ft-cta-title">Your financial life, finally in one place</h2>
          <p className="ft-cta-sub">Whether you need a loan, an insurance policy, or your first investment — FinTech connects you to every service without the paperwork maze.</p>
        </div>
        <div className="ft-cta-actions ft-reveal ft-reveal-d2">
          <a href="#" className={`btn ${theme === "dark" ? "btn-white" : "btn-primary"} btn-large`} onClick={(e) => { e.preventDefault(); switchView("registerView"); }}>Create a free account</a>
          <a href="#" className={`btn ${theme === "dark" ? "btn-outline-white" : "btn-ghost"} btn-large`} onClick={(e) => { e.preventDefault(); switchView("registerView"); }}>Agent sign-up →</a>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
const FOOTER_LINKS = {
  Services: ["Credit Services", "Savings & Investments", "Insurance", "Pension", "Social Security"],
  Platform: ["Document Vault", "Agent Portal", "AI Engine"],
  Company: ["About us", "Careers", "Privacy Policy", "Terms of Service", "Contact"],
};

function Footer() {
  return (
    <footer className="ft-footer">
      <div className="ft-footer-inner">
        <div>
          <div className="ft-footer-logo">
            <span className="ft-footer-logo-text">Fin<span className="ft-footer-logo-accent">Tech</span></span>
          </div>
          <p className="ft-footer-desc">A unified digital platform connecting customers and agents to loans, investments, insurance, pensions, and government benefits across India.</p>
        </div>
        {Object.entries(FOOTER_LINKS).map(([col, links]) => (
          <div key={col}>
            <div className="ft-footer-col-title">{col}</div>
            <ul className="ft-footer-links">
              {links.map((l) => <li key={l}><a href="#">{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="ft-footer-bottom">
        <span>© 2026 FinTech Technologies Pvt. Ltd. All rights reserved.</span>
        <span>CIN: U72900MH2024PTC000000 · SEBI Registered</span>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT EXPORT
   ═══════════════════════════════════════════════════════════════════════════ */
function LandingInner() {
  const [activeSection, setActiveSection] = useState("");
  const { theme } = useTheme();

  /* inject / update CSS whenever theme changes */
  useEffect(() => {
    const id = "ft-global-styles";
    let el = document.getElementById(id);
    if (!el) { el = document.createElement("style"); el.id = id; document.head.appendChild(el); }
    el.textContent = buildCSS(theme);
  }, [theme]);

  /* scroll spy */
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const fn = () => {
      let cur = "";
      sections.forEach((s) => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
      setActiveSection(cur);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useScrollReveal();

  return (
    <>
      <Nav activeSection={activeSection} />
      <Hero />
      <MovingCards />
      <Services />
      <Process />
      <AgentPortal />
      <CTA />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LandingInner />
    </ThemeProvider>
  );
}