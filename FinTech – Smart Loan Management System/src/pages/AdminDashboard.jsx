import { useState, useEffect } from 'react';
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

const BANKS = [
  { id: 'sbi', name: 'State Bank of India' },
  { id: 'hdfc', name: 'HDFC Bank' },
  { id: 'icici', name: 'ICICI Bank' },
  { id: 'axis', name: 'Axis Bank' },
  { id: 'kotak', name: 'Kotak Mahindra Bank' },
];

export default function AdminDashboard() {
  const {
    applications, switchView, getUnreadNotifications, markNotificationsRead, showToast,
    assignAgent, updateStatus, selectBank, sendToBank, updateBankDecision,
    requestDocument, verifyDocuments, addRemark
  } = useApp();
  const { users, addAgent, toggleUserStatus, removeUser, getUsersByRole, currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [newAgent, setNewAgent] = useState({ name: '', email: '', phone: '' });
  const [showAddAgent, setShowAddAgent] = useState(false);

  const clients = getUsersByRole('client');
  const agents = getUsersByRole('agent');
  const allAgents = users.filter(u => u.role === 'agent');
  const performanceAgents = allAgents.filter(a => a.name !== 'Agent Kumar' && a.name !== 'Priya Sharma');
  const pendingReview = applications.filter(a => a.status === 'ADMIN_REVIEW');
  const docsVerified = applications.filter(a => a.status === 'DOCUMENTS_VERIFIED');
  const sentToBank = applications.filter(a => a.status === 'SENT_TO_BANK');
  const bankReview = applications.filter(a => a.status === 'UNDER_BANK_REVIEW');
  const approved = applications.filter(a => a.status === 'APPROVED');
  const rejected = applications.filter(a => a.status === 'REJECTED');
  const unreadNotifs = getUnreadNotifications('admin');

  function handleCreateAgent(e) {
    e.preventDefault();
    if (!newAgent.name || !newAgent.email) return;
    addAgent(newAgent);
    setNewAgent({ name: '', email: '', phone: '' });
    setShowAddAgent(false);
    showToast('Agent created successfully');
  }

  function handleMarkRead() {
    if (unreadNotifs.length > 0) markNotificationsRead('admin');
  }

  const stats = [
    { label: 'Total Clients', value: clients.filter(c => applications.some(a => a.clientId === c.id)).length, color: '#3B82F6', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { label: 'Total Agents', value: agents.length, color: '#8B5CF6', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { label: 'Total Applications', value: applications.length, color: '#F59E0B', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { label: 'Pending Reviews', value: pendingReview.length, color: '#EF4444', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  function renderOverview() {
    return (
      <>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="card !p-4 md:!p-5">
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
          <div className="card !border-l-4 !border-l-[#F59E0B] mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
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
          <button onClick={() => setActiveTab('approvals')} className="btn-primary !w-auto !px-6">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Approval Center ({pendingReview.length})
            </span>
          </button>
          <button onClick={() => setActiveTab('agents')} className="btn-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Agent Management
          </button>
          <button onClick={() => switchView('submissionsView')} className="btn-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            All Applications
          </button>
        </div>

        {pendingReview.length > 0 && (
          <div className="mb-8">
            <h3 className="section-title">Pending Admin Reviews ({pendingReview.length})</h3>
            <div className="space-y-3">
              {pendingReview.slice(0, 5).map((app) => (
                <div key={app.id} className="card !p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-theme-primary">{app.scheme} - {app.data?.customerName}</p>
                      <p className="text-xs text-theme-muted">{app.category} | Agent: {app.agentId}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { const b = prompt('Bank name:'); if (b) selectBank(app.id, b); }} className="btn-primary !py-1 !px-3 !w-auto text-xs">Review & Select Bank</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {docsVerified.length > 0 && (
          <div className="mb-8">
            <h3 className="section-title">Verified by Agents ({docsVerified.length})</h3>
            <div className="space-y-3">
              {docsVerified.slice(0, 5).map((app) => (
                <div key={app.id} className="card !p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-theme-primary">{app.scheme} - {app.data?.customerName}</p>
                    <p className="text-xs text-theme-muted">Agent: {app.agentId} | Docs verified</p>
                  </div>
                  <button onClick={() => updateStatus(app.id, 'ADMIN_REVIEW')} className="btn-primary !py-1.5 !px-4 !w-auto text-xs">Review</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {sentToBank.length > 0 && (
          <div className="mb-8">
            <h3 className="section-title">Sent to Bank - Awaiting Response ({sentToBank.length})</h3>
            <div className="space-y-3">
              {sentToBank.slice(0, 5).map((app) => (
                <div key={app.id} className="card !p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-theme-primary">{app.scheme} - {app.data?.customerName}</p>
                    <p className="text-xs text-theme-muted">Bank: {app.bankPartner || 'N/A'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateBankDecision(app.id, 'approved')} className="btn-primary !py-1 !px-3 !w-auto text-xs !bg-[#10B981]">Approve</button>
                    <button onClick={() => updateBankDecision(app.id, 'rejected')} className="btn-primary !py-1 !px-3 !w-auto text-xs !bg-[#EF4444]">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="font-bold text-theme-primary mb-4">Recent Approvals</h3>
            {approved.length === 0 ? <p className="text-sm text-theme-muted">No recent approvals</p> : (
              <div className="space-y-2">
                {approved.slice(0, 5).map(app => (
                  <div key={app.id} className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                    <span className="text-theme-secondary">{app.data?.customerName} - {app.scheme}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="card">
            <h3 className="font-bold text-theme-primary mb-4">Recent Rejections</h3>
            {rejected.length === 0 ? <p className="text-sm text-theme-muted">No recent rejections</p> : (
              <div className="space-y-2">
                {rejected.slice(0, 5).map(app => (
                  <div key={app.id} className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                    <span className="text-theme-secondary">{app.data?.customerName} - {app.scheme}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card mb-8">
          <h3 className="font-bold text-theme-primary mb-4">Agent Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-theme-light">
                  <th className="text-left py-2 px-3 text-theme-muted font-semibold">Agent</th>
                  <th className="text-center py-2 px-3 text-theme-muted font-semibold">Applications</th>
                  <th className="text-center py-2 px-3 text-theme-muted font-semibold">Pending</th>
                  <th className="text-center py-2 px-3 text-theme-muted font-semibold">Verified</th>
                  <th className="text-center py-2 px-3 text-theme-muted font-semibold">Approved</th>
                  <th className="text-center py-2 px-3 text-theme-muted font-semibold">Rejected</th>
                </tr>
              </thead>
              <tbody>
                {performanceAgents.map(agent => {
                  const agentApps = applications.filter(a => a.agentId === agent.id);
                  return (
                    <tr key={agent.id} className="border-b border-theme-light hover:bg-theme-bg">
                      <td className="py-2 px-3 font-medium text-theme-primary">{agent.name}</td>
                      <td className="text-center py-2 px-3 text-theme-secondary">{agentApps.length}</td>
                      <td className="text-center py-2 px-3 text-[#F59E0B]">{agentApps.filter(a => a.status === 'AGENT_REVIEW').length}</td>
                      <td className="text-center py-2 px-3 text-[#10B981]">{agentApps.filter(a => a.status === 'DOCUMENTS_VERIFIED').length}</td>
                      <td className="text-center py-2 px-3 text-[#059669]">{agentApps.filter(a => a.status === 'APPROVED').length}</td>
                      <td className="text-center py-2 px-3 text-[#DC2626]">{agentApps.filter(a => a.status === 'REJECTED').length}</td>
                    </tr>
                  );
                })}
                {performanceAgents.length === 0 && (
                  <tr><td colSpan="6" className="text-center py-4 text-theme-muted">No agents found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }

  function renderApprovals() {
    const reviewApps = applications.filter(a => ['ADMIN_REVIEW', 'BANK_SELECTION', 'SENT_TO_BANK', 'UNDER_BANK_REVIEW'].includes(a.status));
    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <h3 className="section-title !mb-0">Approval Center</h3>
          <button onClick={() => setActiveTab('overview')} className="btn-secondary !py-1.5 !px-3 text-xs">Back</button>
        </div>
        {reviewApps.length === 0 ? (
          <div className="text-center py-12 card">
            <p className="text-theme-muted">No applications pending review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviewApps.map(app => {
              const sc = STATUS_COLORS[app.status] || STATUS_COLORS.SUBMITTED;
              return (
                <div key={app.id} className="card !p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>{app.status.replace(/_/g, ' ')}</span>
                        <span className="text-xs text-theme-muted">{app.category}</span>
                      </div>
                      <p className="font-bold text-theme-primary">{app.scheme}</p>
                      <p className="text-sm text-theme-secondary">{app.data?.customerName} | {app.data?.customerPhone}</p>
                      <p className="text-xs text-theme-muted">Agent ID: {app.agentId || 'Unassigned'} | Submitted: {new Date(app.date).toLocaleDateString()}</p>
                      {app.bankPartner && <p className="text-xs text-theme-muted">Bank: {app.bankPartner}</p>}
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      {app.status === 'ADMIN_REVIEW' && (
                        <>
                          <select className="input-field !py-1.5 text-xs" onChange={(e) => { if (e.target.value) selectBank(app.id, e.target.value); }}>
                            <option value="">Select Bank</option>
                            {BANKS.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                          </select>
                        </>
                      )}
                      {app.status === 'BANK_SELECTION' && (
                        <button onClick={() => sendToBank(app.id)} className="btn-primary !py-1.5 !px-3 !w-auto text-xs">Send to Bank</button>
                      )}
                      {(app.status === 'SENT_TO_BANK' || app.status === 'UNDER_BANK_REVIEW') && (
                        <>
                          <button onClick={() => updateBankDecision(app.id, 'approved')} className="btn-primary !py-1.5 !px-3 !w-auto text-xs !bg-[#10B981]">Approve</button>
                          <button onClick={() => updateBankDecision(app.id, 'rejected')} className="btn-primary !py-1.5 !px-3 !w-auto text-xs !bg-[#EF4444]">Reject</button>
                        </>
                      )}
                    </div>
                  </div>
                  {app.remarks?.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-theme-light">
                      <p className="text-xs font-semibold text-theme-muted mb-1">Remarks:</p>
                      {app.remarks.map((r, i) => (
                        <p key={i} className="text-xs text-theme-secondary">{r.text}</p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  }

  function renderAgentManagement() {
    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <h3 className="section-title !mb-0">Agent Management</h3>
          <button onClick={() => setShowAddAgent(true)} className="btn-primary !w-auto !px-4 !py-2 text-sm">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Add Agent
            </span>
          </button>
          <button onClick={() => setActiveTab('overview')} className="btn-secondary !py-1.5 !px-3 text-xs">Back</button>
        </div>

        {showAddAgent && (
          <div className="card mb-6 !border-t-2 !border-t-[#8B5CF6]">
            <h4 className="font-bold text-theme-primary mb-4">Create New Agent</h4>
            <form onSubmit={handleCreateAgent} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input type="text" required value={newAgent.name} onChange={(e) => setNewAgent(prev => ({ ...prev, name: e.target.value }))} className="input-field" placeholder="Agent name" />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" required value={newAgent.email} onChange={(e) => setNewAgent(prev => ({ ...prev, email: e.target.value }))} className="input-field" placeholder="agent@nexafin.com" />
              </div>
              <div>
                <label className="label">Phone</label>
                <input type="tel" value={newAgent.phone} onChange={(e) => setNewAgent(prev => ({ ...prev, phone: e.target.value }))} className="input-field" placeholder="Phone number" />
              </div>
              <div className="md:col-span-3 flex gap-3">
                <button type="submit" className="btn-primary !w-auto !px-6">Create Agent</button>
                <button type="button" onClick={() => setShowAddAgent(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-theme-light">
                  <th className="text-left py-3 px-3 text-theme-muted font-semibold">Name</th>
                  <th className="text-left py-3 px-3 text-theme-muted font-semibold">Email</th>
                  <th className="text-left py-3 px-3 text-theme-muted font-semibold">Phone</th>
                  <th className="text-center py-3 px-3 text-theme-muted font-semibold">Status</th>
                  <th className="text-center py-3 px-3 text-theme-muted font-semibold">Applications</th>
                  <th className="text-center py-3 px-3 text-theme-muted font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allAgents.filter(a => a.name !== 'Agent Kumar' && a.name !== 'Priya Sharma').map(agent => {
                  const agentApps = applications.filter(a => a.agentId === agent.id);
                  return (
                    <tr key={agent.id} className="border-b border-theme-light hover:bg-theme-bg">
                      <td className="py-3 px-3 font-medium text-theme-primary">{agent.name}</td>
                      <td className="py-3 px-3 text-theme-secondary">{agent.email}</td>
                      <td className="py-3 px-3 text-theme-secondary">{agent.phone || '-'}</td>
                      <td className="text-center py-3 px-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${agent.isActive ? 'bg-[#D1FAE5] text-[#059669]' : 'bg-[#FEE2E2] text-[#DC2626]'}`}>
                          {agent.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="text-center py-3 px-3 text-theme-secondary">{agentApps.length}</td>
                      <td className="text-center py-3 px-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => toggleUserStatus(agent.id)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded border transition-colors ${agent.isActive ? 'border-[#FCA5A5] text-[#EF4444] hover:bg-[#FEF2F2]' : 'border-[#6EE7B7] text-[#059669] hover:bg-[#ECFDF5]'}`}
                          >
                            {agent.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => { if (window.confirm(`Remove agent "${agent.name}"? This cannot be undone.`)) { removeUser(agent.id); showToast(`Agent "${agent.name}" removed`); } }}
                            className="text-xs font-semibold px-3 py-1.5 rounded border border-[#FCA5A5] text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {allAgents.filter(a => a.name !== 'Agent Kumar' && a.name !== 'Priya Sharma').length === 0 && (
                  <tr><td colSpan="6" className="text-center py-8 text-theme-muted">No agents found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }

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
      <div className="hero-welcome animate-fade-in mb-8">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="hero-badge">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Admin Dashboard
            </span>
            <div className="flex items-center gap-2 text-blue-200/80 text-xs">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Admin Portal
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Admin Panel</h1>
          <p className="text-blue-100/80 text-sm md:text-base max-w-xl mb-3">
            Manage agents, review applications, and monitor performance.
          </p>
        </div>
      </div>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'approvals' && renderApprovals()}
      {activeTab === 'agents' && renderAgentManagement()}
    </div>
  );
}
