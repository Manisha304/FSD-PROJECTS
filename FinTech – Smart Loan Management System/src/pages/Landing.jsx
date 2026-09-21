import { useState, useEffect } from "react";
import { useApp } from '../contexts/AppContext.jsx';

// ─── CSS-in-JS via a style tag injected once ───────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');


  :root {
    --ink: #0B1120;
    --ink-60: rgba(11,17,32,0.6);
    --surface: #F4F7FC;
    --paper: #FFFFFF;
    --accent: #1A56DB;
    --accent-light: #EEF3FF;
    --gold: #E8A020;
    --gold-light: #FFF8EC;
    --green: #0E9F6E;
    --muted: #64748B;
    --border: #E2E8F0;
    --radius: 14px;
  }

  html { scroll-behavior: smooth; }
  body { margin: 0; padding: 0; width: 100%; font-family: 'Inter', sans-serif; background: var(--surface); color: var(--ink); -webkit-font-smoothing: antialiased; overflow-x: hidden; }

  /* NAV */
  .ft-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(255,255,255,0.92); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0 5%; height: 68px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .ft-nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .ft-nav-logo-text { font-family: 'DM Serif Display', serif; font-size: 1.35rem; color: var(--ink); letter-spacing: -0.02em; }
  .ft-nav-links { display: flex; align-items: center; gap: 32px; list-style: none; }
  .ft-nav-links a { text-decoration: none; color: var(--muted); font-size: .875rem; font-weight: 500; transition: color .2s; }
  .ft-nav-links a:hover, .ft-nav-links a.active { color: var(--ink); }
  .ft-nav-cta { display: flex; gap: 10px; align-items: center; }
  .ft-nav-login { text-decoration: none; color: var(--muted); font-size: .875rem; font-weight: 500; transition: color .2s; }
  .ft-nav-login:hover { color: var(--ink); }

  /* BUTTONS */
  .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 22px; border-radius: 8px; font-size: .875rem; font-weight: 600; text-decoration: none; cursor: pointer; border: none; transition: all .2s; }
  .btn-ghost { background: transparent; color: var(--ink); border: 1px solid var(--border); }
  .btn-ghost:hover { background: var(--surface); }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { background: #1547c0; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(26,86,219,.3); }
  .btn-large { padding: 14px 28px; font-size: .95rem; border-radius: 10px; }
  .btn-white { background: #fff; color: var(--accent); font-weight: 700; }
  .btn-white:hover { background: #f0f4ff; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0,0,0,.2); }
  .btn-outline-white { background: transparent; color: #fff; border: 2px solid rgba(255,255,255,.5); }
  .btn-outline-white:hover { border-color: #fff; background: rgba(255,255,255,.1); }

  /* HERO */
  .ft-hero { width: 100vw; min-height: 100vh; display: flex; align-items: center; padding: 120px 5% 80px; position: relative; overflow: hidden; }
  .ft-hero-bg { position: absolute; inset: 0; z-index: 0; background: linear-gradient(135deg,#EEF3FF 0%,#F4F7FC 50%,#FFF8EC 100%); }
  .ft-hero-grid { position: absolute; inset: 0; z-index: 0; opacity: .4; background-image: linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px); background-size: 48px 48px; mask-image: radial-gradient(ellipse 70% 70% at 50% 40%,black 0%,transparent 100%); }
  .ft-hero-container { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; gap: 48px; width: 100%; max-width: 1200px; margin: 0 auto; }
  .ft-hero-content { flex: 1.2; max-width: 680px; position: relative; }
  .ft-hero-image-container { flex: 1; display: flex; justify-content: center; align-items: center; max-width: 520px; position: relative; z-index: 1; }
  .ft-hero-image { width: 100%; height: auto; max-height: 480px; object-fit: contain; filter: drop-shadow(0 12px 30px rgba(0,0,0,0.06)); animation: float 6s ease-in-out infinite; }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
  .ft-hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; background: var(--paper); border: 1px solid var(--border); border-radius: 100px; padding: 6px 16px; font-size: .78rem; font-weight: 600; color: var(--accent); letter-spacing: .06em; text-transform: uppercase; margin-bottom: 28px; box-shadow: 0 2px 8px rgba(0,0,0,.06); position: relative; overflow: hidden; }
  .ft-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; position: relative; z-index: 1; }
  .ft-hero-eyebrow-shimmer { position: absolute; inset: 0; background: linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.6) 50%,transparent 100%); animation: shimmer 3s ease-in-out infinite; pointer-events: none; }
  @keyframes shimmer { 0%{transform:translateX(-100%)} 50%{transform:translateX(100%)} 100%{transform:translateX(100%)} }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)} }
  .ft-sparkle { position: absolute; width: 6px; height: 6px; border-radius: 50%; pointer-events: none; animation: sparkle 2s ease-in-out infinite; }
  .ft-sparkle:nth-child(1) { top: -8px; right: 20%; background: #60A5FA; animation-delay: 0s; }
  .ft-sparkle:nth-child(2) { top: 50%; right: -10px; background: #F59E0B; width: 4px; height: 4px; animation-delay: 0.6s; }
  .ft-sparkle:nth-child(3) { bottom: -6px; right: 35%; background: #10B981; width: 5px; height: 5px; animation-delay: 1.2s; }
  .ft-sparkle:nth-child(4) { top: -4px; left: 10%; background: #A78BFA; width: 4px; height: 4px; animation-delay: 0.3s; }
  @keyframes sparkle { 0%,100%{opacity:0;transform:scale(0)} 50%{opacity:1;transform:scale(1.2)} }
  .ft-hero-headline { font-family: 'DM Serif Display', serif; font-size: clamp(2.6rem,5vw,4rem); line-height: 1.1; letter-spacing: -.03em; color: var(--ink); margin-bottom: 24px; }
  .ft-hero-headline em { font-style: italic; color: var(--accent); }
  .ft-hero-sub { font-size: 1.05rem; color: var(--muted); line-height: 1.7; max-width: 520px; margin-bottom: 40px; }
  .ft-hero-actions { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 56px; }
  .ft-hero-stats { display: flex; gap: 40px; flex-wrap: wrap; }
  .ft-stat { display: flex; flex-direction: column; gap: 2px; }
  .ft-stat-num { font-family: 'JetBrains Mono', monospace; font-size: 1.6rem; font-weight: 500; color: var(--ink); letter-spacing: -.02em; }
  .ft-stat-num span { color: var(--accent); }
  .ft-stat-label { font-size: .78rem; color: var(--muted); font-weight: 500; text-transform: uppercase; letter-spacing: .05em; }

  /* SECTION SHARED */
  .ft-section { padding: 96px 5%; }
  .ft-section-label { font-size: .75rem; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: var(--accent); margin-bottom: 16px; }
  .ft-section-title { font-family: 'DM Serif Display', serif; font-size: clamp(1.8rem,3.5vw,2.6rem); line-height: 1.15; letter-spacing: -.02em; color: var(--ink); max-width: 600px; margin-bottom: 16px; }
  .ft-section-sub { color: var(--muted); font-size: 1rem; line-height: 1.7; max-width: 540px; margin-bottom: 56px; }

  /* SERVICES */
  .ft-services { background: var(--paper); }
  .ft-services-grid { display: flex; gap: 24px; overflow-x: auto; padding-bottom: 8px; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
  .ft-services-grid::-webkit-scrollbar { height: 4px; }
  .ft-services-grid::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
  .ft-service-card { min-width: 260px; flex: 1; scroll-snap-align: start; }
  .ft-service-card { background: var(--paper); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px 24px; transition: all .25s; cursor: pointer; position: relative; overflow: hidden; }
  .ft-service-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:var(--accent); transform:scaleX(0); transform-origin:left; transition:transform .25s; }
  .ft-service-card:hover::before { transform:scaleX(1); }
  .ft-service-card:hover { border-color:#c7d7f8; background:var(--paper); transform:translateY(-3px); box-shadow:0 8px 28px rgba(26,86,219,.1); }
  .ft-service-name { font-weight: 600; font-size: .95rem; color: var(--ink); margin-bottom: 8px; }
  .ft-service-desc { font-size: .82rem; color: var(--muted); line-height: 1.6; }
  .ft-service-tag { display: inline-block; margin-top: 14px; background: var(--accent-light); color: var(--accent); font-size: .72rem; font-weight: 600; padding: 3px 10px; border-radius: 100px; letter-spacing: .04em; }

  /* AGENTS */
  .ft-agents { background: var(--paper); }
  .ft-agent-grid { display: flex; gap: 24px; overflow-x: auto; padding-bottom: 8px; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
  .ft-agent-grid::-webkit-scrollbar { height: 4px; }
  .ft-agent-grid::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
  .ft-agent-card { min-width: 260px; flex: 1; scroll-snap-align: start; background: var(--paper); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px 24px; transition: all .25s; cursor: pointer; position: relative; overflow: hidden; }
  .ft-agent-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:var(--accent); transform:scaleX(0); transform-origin:left; transition:transform .25s; }
  .ft-agent-card:hover::before { transform:scaleX(1); }
  .ft-agent-card:hover { border-color:#c7d7f8; background:var(--paper); transform:translateY(-3px); box-shadow:0 8px 28px rgba(26,86,219,.1); }
  .ft-agent-card h4 { font-weight: 600; font-size: .95rem; color: var(--ink); margin-bottom: 8px; }
  .ft-agent-card p { font-size: .82rem; color: var(--muted); line-height: 1.6; }

  /* PROCESS */
  .ft-process { background: var(--surface); }
  .ft-process-grid { display: flex; gap: 24px; overflow-x: auto; padding-bottom: 8px; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
  .ft-process-grid::-webkit-scrollbar { height: 4px; }
  .ft-process-grid::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
  .ft-process-card { min-width: 260px; flex: 1; scroll-snap-align: start; background: var(--paper); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px 24px; transition: all .25s; cursor: pointer; position: relative; overflow: hidden; }
  .ft-process-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:var(--accent); transform:scaleX(0); transform-origin:left; transition:transform .25s; }
  .ft-process-card:hover::before { transform:scaleX(1); }
  .ft-process-card:hover { border-color:#c7d7f8; background:var(--paper); transform:translateY(-3px); box-shadow:0 8px 28px rgba(26,86,219,.1); }
  .ft-process-card-step { display: inline-block; margin-bottom: 14px; background: var(--accent-light); color: var(--accent); font-size: .72rem; font-weight: 600; padding: 3px 10px; border-radius: 100px; letter-spacing: .04em; }
  .ft-process-card h4 { font-weight: 600; font-size: .95rem; color: var(--ink); margin-bottom: 8px; }
  .ft-process-card p { font-size: .82rem; color: var(--muted); line-height: 1.6; }

  /* CTA */
  .ft-cta { width: 100vw; min-height: 60vh; display: flex; align-items: center; padding: 120px 5% 80px; position: relative; overflow: hidden; background: linear-gradient(135deg,var(--accent) 0%,#1547c0 50%,#0f3a99 100%); box-sizing: border-box; }
  .ft-cta::before { content:''; position:absolute; inset:0; background-image:radial-gradient(rgba(255,255,255,.1) 1px,transparent 1px); background-size:32px 32px; }
  .ft-cta-inner { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; gap: 48px; width: 100%; max-width: 1200px; margin: 0 auto; }
  .ft-cta-text { flex: 1.2; max-width: 680px; }
  .ft-cta-title { font-family: 'DM Serif Display', serif; font-size: clamp(2rem,4vw,3rem); color: #fff; line-height: 1.1; letter-spacing: -.02em; margin-bottom: 16px; }
  .ft-cta-sub { color: rgba(255,255,255,.75); font-size: 1rem; line-height: 1.7; }
  .ft-cta-actions { flex: 1; display: flex; justify-content: center; align-items: center; gap: 14px; flex-wrap: wrap; max-width: 520px; }

  /* FOOTER */
  .ft-footer { width: 100vw; background: var(--ink); color: rgba(255,255,255,.5); padding: 80px 5% 36px; box-sizing: border-box; }
  .ft-footer-inner { display: flex; align-items: flex-start; justify-content: space-between; gap: 48px; width: 100%; max-width: 1200px; margin: 0 auto; }
  .ft-footer-inner > div:first-child { flex: 1.2; max-width: 400px; }
  .ft-footer-inner > div:not(:first-child) { flex: 1; max-width: 200px; }
  .ft-footer-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .ft-footer-logo-text { font-family: 'DM Serif Display', serif; font-size: 1.4rem; color: #fff; }
  .ft-footer-desc { font-size: .82rem; line-height: 1.7; max-width: 280px; margin-bottom: 20px; }
  .ft-footer-col-title { color: #fff; font-weight: 600; font-size: .82rem; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 16px; }
  .ft-footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .ft-footer-links a { text-decoration: none; color: rgba(255,255,255,.5); font-size: .82rem; transition: color .2s; }
  .ft-footer-links a:hover { color: #fff; }
  .ft-footer-bottom { border-top: 1px solid rgba(255,255,255,.1); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; font-size: .78rem; }

  /* RESPONSIVE */
  @media(max-width:900px) {
    .ft-hero-container { flex-direction: column; align-items: stretch; gap: 32px; }
    .ft-hero-image-container { max-width: 100%; order: -1; margin-bottom: 16px; }
    .ft-hero-image { max-height: 320px; }
    .ft-footer-inner{flex-direction:column}
    .ft-nav-links{display:none}
    .ft-services-grid,.ft-process-grid,.ft-agent-grid{flex-wrap:wrap;overflow-x:visible}
    .ft-service-card,.ft-process-card,.ft-agent-card{min-width:auto;flex:1 1 280px}
  }
  @media(max-width:600px) {
    .ft-hero-stats{gap:24px}

    .ft-footer-bottom{flex-direction:column;align-items:flex-start;}
  }
  @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}}
`;

// ─── Sub-components ────────────────────────────────────────────────────────

function Nav({ activeSection }) {
  const { switchView } = useApp();
  return (
    <nav className="ft-nav">
      <a className="ft-nav-logo" href="#">
        <img src="/logo.png" alt="FinTech" style={{ height: "28px", width: "auto" }} />
        <span className="ft-nav-logo-text">FinTech</span>
      </a>
      <ul className="ft-nav-links">
        {[["#services", "Services"], ["#agents", "For Agents"]].map(([href, label]) => (
          <li key={href}><a href={href} className={activeSection === href.slice(1) ? "active" : ""}>{label}</a></li>
        ))}
      </ul>
      <div className="ft-nav-cta">
        <a href="#" onClick={(e) => { e.preventDefault(); switchView('loginView'); }} className="ft-nav-login">Login</a>
        <a href="#" className="btn btn-primary" onClick={(e) => { e.preventDefault(); switchView('registerView'); }}>
          Get started
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="ft-hero">
      <div className="ft-hero-bg" />
      <div className="ft-hero-grid" />
      <div className="ft-hero-container">
        <div className="ft-hero-content">
          <div className="ft-hero-eyebrow">
            <div className="ft-hero-eyebrow-shimmer" />
            <span className="ft-sparkle" />
            <span className="ft-sparkle" />
            <span className="ft-sparkle" />
            <span className="ft-sparkle" />
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
            <a href="#" className="btn btn-primary" style={{ padding: "6px 16px", width: "fit-content" }}>Start your application</a>
            <a href="#process" className="btn btn-ghost" style={{ padding: "6px 12px" }}>How it works</a>
          </div>
          <div className="ft-hero-stats">
            {[
              ["5", "", "Service Categories"],
            ].map(([num, sup, label]) => (
              <div className="ft-stat" key={label}>
                <span className="ft-stat-num">{num}{sup && <span>{sup}</span>}</span>
                <span className="ft-stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="ft-hero-image-container">
          <img
            src="/hero-loan.png"
            alt="Loan application illustration"
            className="ft-hero-image"
          />
        </div>
      </div>
    </section>
  );
}

const SERVICES = [
  { name: "Credit Services", desc: "Personal, home, vehicle, education, gold, agricultural & business loans. MSME and working capital covered.", tag: "4 loan types" },
  { name: "Savings & Investments", desc: "FD, RD, SIP, mutual funds, ELSS, sovereign gold bonds, and goal-based investment planning.", tag: "4 products" },
  { name: "Insurance", desc: "Life, health, family, vehicle, term, travel, accident, property, and crop insurance under one roof.", tag: "4 categories" },
  { name: "Pension Services", desc: "NPS, Atal Pension Yojana, PM-SYM, senior citizen, widow, and disability pension schemes.", tag: "4 schemes" },
  { name: "Social Security", desc: "E-Shram, PM Kisan, labour welfare, scholarships, disability benefits, and government subsidy programs.", tag: "4 benefits" },
];

function Services() {
  return (
    <section className="ft-section ft-services" id="services">
      <div className="ft-section-label">What we offer</div>
      <h2 className="ft-section-title">Every service, one application</h2>
      <p className="ft-section-sub">From your first home loan to retirement planning — stop repeating yourself across a dozen different portals.</p>
      <div className="ft-services-grid">
        {SERVICES.map(s => (
          <div className="ft-service-card" key={s.name}>
            <div className="ft-service-name">{s.name}</div>
            <div className="ft-service-desc">{s.desc}</div>
            <span className="ft-service-tag">{s.tag}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

const AGENT_FEATURES = [
  { title: "Unified application dashboard", desc: "View all client applications across every service category in one place. Sort by status, type, or amount." },
  { title: "Document verification tools", desc: "Review uploaded documents, request missing files, and approve submissions — without leaving the portal." },
  { title: "AI eligibility on behalf of clients", desc: "Run eligibility checks and present bank recommendations directly to clients during field visits." },
  { title: "Real-time status notifications", desc: "Get alerted the moment a client's application moves, a document is requested, or approval is granted." },
];

function AgentPortal() {
  return (
    <section className="ft-section ft-agents" id="agents">
      <div className="ft-section-label">Agent Portal</div>
      <h2 className="ft-section-title">Built for the people who make it happen</h2>
      <p className="ft-section-sub">Field agents and financial advisors get a dedicated portal to manage client applications, verify documents, and track outcomes — all without manual paperwork.</p>
      <div className="ft-agent-grid">
        {AGENT_FEATURES.map(f => (
          <div className="ft-agent-card" key={f.title}>
            <h4>{f.title}</h4>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const PROCESS_STEPS = [
  { step: "Step 01", title: "Submit your application", desc: "Fill out a single application for any financial service — loans, insurance, investments, or pensions. No repeated paperwork." },
  { step: "Step 02", title: "Upload documents once", desc: "Attach your Aadhaar, PAN, bank statements, and salary slips to the secure Document Vault. Use them for every application." },
  { step: "Step 03", title: "AI eligibility check", desc: "Our engine analyses your profile against lender criteria and delivers approval probability, recommendations, and risk insights." },
  { step: "Step 04", title: "Track & get approved", desc: "Monitor application status in real time. Receive instant notifications when documents are reviewed or approval is granted." },
];

function Process() {
  return (
    <section className="ft-section ft-process" id="process">
      <div className="ft-section-label">How it works</div>
      <h2 className="ft-section-title">From application to approval in four steps</h2>
      <p className="ft-section-sub">No branches, no paperwork piles, no status calls. A streamlined process designed for speed and transparency.</p>
      <div className="ft-process-grid">
        {PROCESS_STEPS.map(s => (
          <div className="ft-process-card" key={s.title}>
            <span className="ft-process-card-step">{s.step}</span>
            <h4>{s.title}</h4>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="ft-cta">
      <div className="ft-cta-inner">
        <div className="ft-cta-text">
          <h2 className="ft-cta-title">Your financial life, finally in one place</h2>
          <p className="ft-cta-sub">Whether you need a loan, an insurance policy, or your first investment — FinTech connects you to every service without the paperwork maze.</p>
        </div>
        <div className="ft-cta-actions">
          <a href="#" className="btn btn-white btn-large">Create a free account</a>
          <a href="#" className="btn btn-outline-white btn-large">Agent sign-up →</a>
        </div>
      </div>
    </section>
  );
}

const FOOTER_LINKS = {
  Services: ["Credit Services", "Savings & Investments", "Insurance", "Pension", "Social Security"],
  Platform: ["Document Vault", "Agent Portal"],
  Company: ["About us", "Careers", "Privacy Policy", "Terms of Service", "Contact"],
};

function Footer() {
  return (
    <footer className="ft-footer">
      <div className="ft-footer-inner">
        <div>
          <div className="ft-footer-logo">
            <span className="ft-footer-logo-text">FinTech</span>
          </div>
          <p className="ft-footer-desc">A unified digital platform connecting customers and agents to loans, investments, insurance, pensions, and government benefits across India.</p>
        </div>
        {Object.entries(FOOTER_LINKS).map(([col, links]) => (
          <div key={col}>
            <div className="ft-footer-col-title">{col}</div>
            <ul className="ft-footer-links">
              {links.map(l => <li key={l}><a href="#">{l}</a></li>)}
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

// ─── Root App ──────────────────────────────────────────────────────────────
export default function App() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    // Inject global styles once
    const id = "ft-global-styles";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = GLOBAL_CSS;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const onScroll = () => {
      let current = "";
      sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Nav activeSection={activeSection} />
      <Hero />
      <Services />
      <Process />
      <AgentPortal />
      <CTA />
      <Footer />
    </>
  );
}