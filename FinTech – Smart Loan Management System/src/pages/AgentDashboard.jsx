import { useEffect } from 'react';
import { useApp } from '../contexts/AppContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

const STATUS_COLORS = {
  SUBMITTED: { bg: '#DBEAFE', text: '#1D4ED8' },
  AGENT_REVIEW: { bg: '#F3E8FF', text: '#7C3AED' },
  DOCUMENTS_PENDING: { bg: '#FEF3C7', text: '#B45309' },
  DOCUMENTS_VERIFIED: { bg: '#D1FAE5', text: '#047857' },
  ADMIN_REVIEW: { bg: '#E0E7FF', text: '#4338CA' },
  SENT_TO_BANK: { bg: '#E0F2FE', text: '#0369A1' },
  UNDER_BANK_REVIEW: { bg: '#FED7AA', text: '#C2410C' },
  APPROVED: { bg: '#D1FAE5', text: '#059669' },
  REJECTED: { bg: '#FEE2E2', text: '#DC2626' },
  COMPLETED: { bg: '#F3F4F6', text: '#6B7280' },
};

export default function AgentDashboard() {
  const { applications, switchView, getApplicationsByAgent, assignAgent, verifyDocuments, sendToAdminReview, requestDocument, getUnassignedApplications, getUnreadNotifications, markNotificationsRead, showToast } = useApp();
  const { currentUser } = useAuth();

  const myApps = getApplicationsByAgent(currentUser?.id);
  const unassigned = getUnassignedApplications();
  const pendingVerification = myApps.filter(a => a.status === 'AGENT_REVIEW');
  const docsPending = myApps.filter(a => a.status === 'DOCUMENTS_PENDING');
  const docsVerified = myApps.filter(a => a.status === 'DOCUMENTS_VERIFIED');
  const approved = myApps.filter(a => a.status === 'APPROVED');
  const rejected = myApps.filter(a => a.status === 'REJECTED');
  const unreadNotifs = getUnreadNotifications('agent');

  function handleMarkRead() {
    if (unreadNotifs.length > 0) markNotificationsRead('agent');
  }

  const stats = [
    { label: 'Assigned Clients', value: myApps.length, color: '#3B82F6', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { label: 'Pending Verification', value: pendingVerification.length, color: '#3B82F6', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'New Applications', value: unassigned.length, color: '#3B82F6', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
    { label: 'Approved', value: approved.length, color: '#3B82F6', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Rejected', value: rejected.length, color: '#3B82F6', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

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

  return (
    <div className="w-full">
      <div className="flex items-center justify-end mb-4">
        <div id="google_translate_element" />
      </div>
      <div className="hero-welcome animate-fade-in">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="hero-badge">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Agent Portal
            </span>
            <div className="flex items-center gap-2 text-blue-200/80 text-xs">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure Portal
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Welcome, {currentUser?.name}</h1>
          <p className="text-blue-100/80 text-sm md:text-base max-w-xl mb-3">
            Manage client applications and verifications.
          </p>
          <div className="flex items-center gap-3 text-blue-200/60 text-xs">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="card !p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15` }}>
                <svg className="w-5 h-5" fill="none" stroke={s.color} viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-theme-primary">{s.value}</p>
                <p className="text-xs text-theme-muted">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {unreadNotifs.length > 0 && (
        <div className="card !border-l-4 !border-l-[#3B82F6] mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p className="text-sm font-semibold text-theme-primary">{unreadNotifs.length} unread notification{unreadNotifs.length > 1 ? 's' : ''}</p>
            </div>
            <button onClick={handleMarkRead} className="text-xs text-theme-brand font-semibold hover:underline">Mark all read</button>
          </div>
          <div className="mt-3 space-y-2">
            {unreadNotifs.slice(0, 5).map((n, i) => (
              <p key={i} className="text-xs text-theme-secondary bg-blue-50 p-2 rounded">{n.message}</p>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-8 flex-wrap">
        <button onClick={() => switchView('submissionsView')} className="btn-primary !w-auto !px-6">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            All Applications
          </span>
        </button>
        <button onClick={() => switchView('schemesView')} className="btn-secondary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
          </svg>
          Browse Services
        </button>
      </div>

      {unassigned.length > 0 && (
        <div className="mb-8">
          <h3 className="section-title">New Unassigned Applications ({unassigned.length})</h3>
          <div className="space-y-3">
            {unassigned.slice(0, 5).map((app) => (
              <div key={app.id} className="card !p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#DBEAFE', color: '#1D4ED8' }}>New</span>
                    <span className="text-xs text-theme-muted">{app.category}</span>
                  </div>
                  <p className="font-semibold text-theme-primary">{app.scheme} - {app.data?.customerName}</p>
                  <p className="text-xs text-theme-muted">{new Date(app.date).toLocaleDateString()}</p>
                </div>
                <button onClick={() => assignAgent(app.id, currentUser?.id)} className="btn-primary !py-1.5 !px-4 !w-auto text-xs">Assign to Me</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingVerification.length > 0 && (
        <div className="mb-8">
          <h3 className="section-title">Pending Verification ({pendingVerification.length})</h3>
          <div className="space-y-3">
            {pendingVerification.slice(0, 5).map((app) => (
              <div key={app.id} className="card !p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-theme-primary">{app.scheme} - {app.data?.customerName}</p>
                    <p className="text-xs text-theme-muted">{app.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { const doc = prompt('Document name to request:'); if (doc) requestDocument(app.id, doc); }} className="btn-secondary !py-1 !px-3 text-xs">Request Doc</button>
                    <button onClick={() => verifyDocuments(app.id)} className="btn-primary !py-1 !px-3 !w-auto text-xs">Verify</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {docsPending.length > 0 && (
        <div className="mb-8">
          <h3 className="section-title">Documents Pending ({docsPending.length})</h3>
          <div className="space-y-3">
            {docsPending.slice(0, 5).map((app) => {
              const uploaded = (app.documents || []).filter(d => d.status === 'uploaded');
              const requested = (app.documents || []).filter(d => d.status === 'requested');
              return (
                <div key={app.id} className="card !p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-theme-primary">{app.scheme} - {app.data?.customerName}</p>
                      <p className="text-xs text-theme-muted">{app.category}</p>
                    </div>
                    <button onClick={() => verifyDocuments(app.id)} className="btn-primary !py-1.5 !px-4 !w-auto text-xs">Verify All</button>
                  </div>
                  <div className="space-y-1">
                    {requested.map((d, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#F59E0B] bg-amber-50 p-2 rounded">
                        <span>○</span>
                        <span>{d.name}</span>
                        <span className="ml-auto text-theme-muted">Awaiting upload</span>
                      </div>
                    ))}
                    {uploaded.map((d, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#10B981] bg-green-50 p-2 rounded">
                        <span>✓</span>
                        <span>{d.name}</span>
                        <span className="ml-auto text-[10px] text-theme-muted truncate max-w-[140px]">{d.fileUrl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {docsVerified.length > 0 && (
        <div className="mb-8">
          <h3 className="section-title">Ready for Admin Review ({docsVerified.length})</h3>
          <div className="space-y-3">
            {docsVerified.slice(0, 5).map((app) => (
              <div key={app.id} className="card !p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-theme-primary">{app.scheme} - {app.data?.customerName}</p>
                  <p className="text-xs text-theme-muted">Documents verified</p>
                </div>
                <button onClick={() => sendToAdminReview(app.id)} className="btn-primary !py-1.5 !px-4 !w-auto text-xs">Send to Admin</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {myApps.length > 0 && (
        <div>
          <h3 className="section-title">Application Tracking</h3>
          <div className="space-y-3">
            {myApps.slice(0, 10).map((app) => {
              const sc = STATUS_COLORS[app.status] || STATUS_COLORS.SUBMITTED;
              return (
                <div key={app.id} className="card !p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>{app.status.replace(/_/g, ' ')}</span>
                      <span className="text-xs text-theme-muted">{app.category}</span>
                    </div>
                    <p className="font-semibold text-theme-primary">{app.scheme} - {app.data?.customerName}</p>
                    <p className="text-xs text-theme-muted">{new Date(app.date).toLocaleDateString()}{app.bankPartner ? ` | Bank: ${app.bankPartner}` : ''}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
