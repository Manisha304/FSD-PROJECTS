import { useState, useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

const STATUS_COLORS = {
  SUBMITTED: { bg: '#DBEAFE', text: '#1D4ED8' },
  AGENT_REVIEW: { bg: '#F3E8FF', text: '#7C3AED' },
  DOCUMENTS_PENDING: { bg: '#FEF3C7', text: '#B45309' },
  DOCUMENTS_VERIFIED: { bg: '#D1FAE5', text: '#047857' },
  ADMIN_REVIEW: { bg: '#E0E7FF', text: '#4338CA' },
  BANK_SELECTION: { bg: '#CFFAFE', text: '#0E7490' },
  SENT_TO_BANK: { bg: '#E0F2FE', text: '#0369A1' },
  UNDER_BANK_REVIEW: { bg: '#FED7AA', text: '#C2410C' },
  APPROVED: { bg: '#D1FAE5', text: '#059669' },
  REJECTED: { bg: '#FEE2E2', text: '#DC2626' },
  COMPLETED: { bg: '#F3F4F6', text: '#6B7280' },
};

const STAT_ICONS = [
  'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
];

function CountUp({ value, duration = 600 }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const start = prev.current;
    const diff = value - start;
    if (diff === 0) return;
    const startTime = performance.now();
    let frame;
    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else prev.current = value;
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <span className="stat-value">{display}</span>;
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export default function ClientDashboard() {
  const { applications, switchView, getApplicationsByClient, getUnreadNotifications, markNotificationsRead, uploadDocument } = useApp();
  const { currentUser } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [uploadTarget, setUploadTarget] = useState(null);

  const myApps = getApplicationsByClient(currentUser?.id);
  const activeApps = myApps.filter(a => !['COMPLETED', 'REJECTED', 'APPROVED'].includes(a.status));
  const unreadNotifs = getUnreadNotifications('client');
  const completedApps = myApps.filter(a => ['COMPLETED', 'APPROVED', 'REJECTED'].includes(a.status));

  function handleMarkRead() {
    if (unreadNotifs.length > 0) markNotificationsRead('client');
  }

  function getInitials(name) {
    return name
      ?.split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  }

  const BLUE = '#3B82F6';
  const today = new Date();

  useEffect(() => {
    if (window._gtInit) return;
    window._gtInit = true;

    window.googleTranslateElementInit = () => {
      try {
        if (window.google && google.translate && google.translate.TranslateElement) {
          const el = document.getElementById('google_translate_element');
          if (!el || el.querySelector('.goog-te-combo')) return;
          new google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,ta,te,ml,hi',
            autoDisplay: false,
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
          }, 'google_translate_element');
        }
      } catch (e) {}
    };

    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.onerror = () => {};
    document.body.appendChild(script);
  }, []);

  const stats = [
    { label: 'Active Applications', value: activeApps.length },
    { label: 'Completed', value: completedApps.length },
    { label: 'Total Submitted', value: myApps.length },
    { label: 'Notifications', value: unreadNotifs.length },
  ];

  return (
    <div className="w-full space-y-6">

      <div className="hero-welcome animate-fade-in">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="hero-badge">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Client Portal
            </span>
            <div className="flex items-center gap-2 text-blue-200/80 text-xs">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure Portal
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-blue-100/80 text-sm md:text-base max-w-xl mb-3">
            Manage your financial services and applications securely from one place.
          </p>
          <div className="flex items-center gap-3 text-blue-200/60 text-xs">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(today)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <div id="google_translate_element" />
      </div>

      <div className="client-info-card animate-fade-in animate-fade-in-d1">
        <div className="flex items-center gap-4">
          <div className="client-avatar">{getInitials(currentUser?.name)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-0.5">
              <h3 className="text-lg font-bold text-theme-primary">{currentUser?.name}</h3>
              <span className="role-badge-blue">{currentUser?.role}</span>
            </div>
            <div className="flex flex-col gap-1 text-xs text-theme-muted">
              <span className="flex items-center gap-1.5 truncate">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="truncate">{currentUser?.email || 'No email'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {currentUser?.phone || 'No contact'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowProfile(true)}
            className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] bg-[#EEF3FF] hover:bg-[#DBEAFE] px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Details
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className={`card !p-4 md:!p-5 animate-fade-in animate-fade-in-d${i + 1}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ background: `${BLUE}12` }}>
                <svg className="w-5 h-5" fill="none" stroke={BLUE} viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d={STAT_ICONS[i]} />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-theme-primary leading-none mb-1">
                  <CountUp value={s.value} />
                </p>
                <p className="text-xs text-theme-muted font-medium">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {unreadNotifs.length > 0 && (
        <div className="notif-center p-4 md:p-5 animate-fade-in animate-fade-in-d3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#EEF3FF] flex items-center justify-center">
                <svg className="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-theme-primary">Notifications</p>
                <p className="text-xs text-theme-muted">{unreadNotifs.length} unread</p>
              </div>
            </div>
            <button onClick={handleMarkRead} className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] bg-[#EEF3FF] hover:bg-[#DBEAFE] px-3 py-1.5 rounded-lg transition-all duration-200">
              Mark all read
            </button>
          </div>
          <div className="space-y-1">
            {unreadNotifs.slice(0, 5).map((n, i) => (
              <div key={i} className={`notif-item flex items-start gap-3 rounded-lg p-3 ${i === 0 ? 'notif-item-unread' : ''}`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${i === 0 ? 'bg-[#2563EB]' : 'bg-[#CBD5E1]'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs ${i === 0 ? 'font-semibold text-theme-primary' : 'text-theme-secondary'}`}>{n.message}</p>
                  <p className="text-[11px] text-theme-muted mt-0.5">
                    {new Date(n.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 flex-wrap animate-fade-in animate-fade-in-d4">
        <button onClick={() => switchView('schemesView')} className="btn-primary !w-auto !px-6 !py-3 !rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Apply for Service
          </span>
        </button>
        <button onClick={() => switchView('submissionsView')} className="btn-secondary !rounded-xl !py-3 hover:shadow-md active:scale-[0.98] transition-all duration-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          View Applications
        </button>
      </div>

      {activeApps.length > 0 && (
        <div className="animate-fade-in animate-fade-in-d5">
          <div className="flex items-center gap-3 mb-4">
            <div className="section-header-bar" />
            <h3 className="text-base font-semibold text-theme-primary">Active Applications</h3>
          </div>
          <div className="space-y-3">
            {activeApps.slice(0, 5).map((app) => {
              const sc = STATUS_COLORS[app.status] || STATUS_COLORS.SUBMITTED;
              const pendingDocs = (app.documents || []).filter(d => d.status === 'requested');
              return (
                <div key={app.id} className="card !p-4">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className="status-badge" style={{ background: sc.bg, color: sc.text }}>{app.status.replace(/_/g, ' ')}</span>
                        <span className="text-[11px] font-medium text-theme-muted bg-theme-bg px-2 py-0.5 rounded-md">{app.category}</span>
                      </div>
                      <p className="font-semibold text-[15px] text-theme-primary mb-0.5">{app.scheme}</p>
                      <p className="text-xs text-theme-muted flex items-center gap-1.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {app.data?.customerName}
                        <span className="text-theme-border">|</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(app.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-theme-bg flex items-center justify-center flex-shrink-0 ml-3">
                      <svg className="w-4 h-4 text-theme-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  {pendingDocs.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#E2E8F0] space-y-1.5">
                      <p className="text-[11px] font-semibold text-theme-muted uppercase tracking-wide">Pending Documents</p>
                      {pendingDocs.map((d, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <span className="text-[#F59E0B]">○</span>
                          <span className="text-theme-secondary">{d.name}</span>
                          {uploadTarget?.appId === app.id && uploadTarget?.docName === d.name ? (
                            <input type="file" onChange={(e) => { if (e.target.files?.[0]) { uploadDocument(app.id, d.name, e.target.files[0].name); setUploadTarget(null); } }} className="ml-auto text-xs max-w-[110px]" />
                          ) : (
                            <button onClick={() => setUploadTarget({ appId: app.id, docName: d.name })} className="ml-auto text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] bg-[#EEF3FF] hover:bg-[#DBEAFE] px-2 py-0.5 rounded transition-all">
                              Upload
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showProfile && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowProfile(false)}>
          <div className="bg-white rounded-2xl p-6 md:p-8 mx-4 max-w-lg w-full shadow-2xl animate-scale-in max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-theme-primary flex items-center gap-2">
                <svg className="w-5 h-5 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile Details
              </h3>
              <button onClick={() => setShowProfile(false)} className="p-1.5 text-[#94A3B8] hover:text-theme-primary rounded-lg hover:bg-[#F1F5F9] transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-4 pb-5 border-b border-[#E2E8F0] mb-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center text-lg font-bold shadow-sm">
                {getInitials(currentUser?.name)}
              </div>
              <div>
                <p className="text-base font-bold text-theme-primary">{currentUser?.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="role-badge-blue">{currentUser?.role}</span>
                  <span className="text-xs text-theme-muted">ID: {currentUser?.id}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Email', value: currentUser?.email },
                { label: 'Phone', value: currentUser?.phone },
                { label: 'Gender', value: currentUser?.gender },
                { label: 'Date of Birth', value: currentUser?.dob ? new Date(currentUser.dob + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null },
                { label: 'Address', value: currentUser?.address, span: true },
                { label: 'City', value: currentUser?.city },
                { label: 'State', value: currentUser?.state },
                { label: 'Aadhar', value: currentUser?.aadhar },
                { label: 'PAN', value: currentUser?.pan },
              ].map((f, i) =>
                f.value ? (
                  <div key={i} className={f.span ? 'col-span-2' : 'min-w-0'}>
                    <p className="text-[11px] font-semibold text-theme-muted uppercase tracking-wide mb-0.5">{f.label}</p>
                    <p className="text-sm font-medium text-theme-primary truncate">{f.value}</p>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}