import { useState } from 'react';
import { useApp } from '../contexts/AppContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { CATEGORIES } from '../data/categories.js';
import Modal from '../components/Modal.jsx';

const STATUS_LABELS = {
  SUBMITTED: { label: 'Submitted', color: '#3B82F6', bg: '#DBEAFE' },
  AGENT_REVIEW: { label: 'Agent Review', color: '#8B5CF6', bg: '#F3E8FF' },
  DOCUMENTS_PENDING: { label: 'Docs Pending', color: '#F59E0B', bg: '#FEF3C7' },
  DOCUMENTS_VERIFIED: { label: 'Docs Verified', color: '#10B981', bg: '#D1FAE5' },
  ADMIN_REVIEW: { label: 'Admin Review', color: '#6366F1', bg: '#E0E7FF' },
  BANK_SELECTION: { label: 'Bank Selection', color: '#06B6D4', bg: '#CFFAFE' },
  SENT_TO_BANK: { label: 'Sent to Bank', color: '#0EA5E9', bg: '#E0F2FE' },
  UNDER_BANK_REVIEW: { label: 'Bank Review', color: '#F97316', bg: '#FED7AA' },
  APPROVED: { label: 'Approved', color: '#059669', bg: '#D1FAE5' },
  REJECTED: { label: 'Rejected', color: '#DC2626', bg: '#FEE2E2' },
  COMPLETED: { label: 'Completed', color: '#6B7280', bg: '#F3F4F6' },
};

export default function Submissions() {
  const { applications, deleteSubmission, updateStatus, assignAgent, addRemark, requestDocument, uploadDocument, verifyDocuments, sendToAdminReview, selectBank, sendToBank, updateBankDecision, showToast } = useApp();
  const { currentUser, isAdmin, isAgent, isClient, getUsersByRole } = useAuth();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [remarkText, setRemarkText] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [uploadTarget, setUploadTarget] = useState(null);

  let filtered = applications;
  if (isClient) {
    filtered = applications.filter(a => a.clientId === currentUser?.id);
  } else if (isAgent) {
    filtered = applications.filter(a => a.agentId === currentUser?.id || !a.agentId);
  }

  filtered = filtered.filter((s) => {
    if (filterCat && s.categoryId !== filterCat) return false;
    if (search) {
      const q = search.toLowerCase();
      const name = s.data?.customerName || '';
      const phone = s.data?.customerPhone || '';
      const id = s.id || '';
      return name.toLowerCase().includes(q) || phone.includes(q) || id.includes(q);
    }
    return true;
  });

  function handleDelete() {
    if (deleteId) { deleteSubmission(deleteId); setDeleteId(null); }
  }

  function handleAssignAgent(appId) {
    if (selectedAgent) { assignAgent(appId, selectedAgent); setExpandedId(null); }
  }

  function handleAddRemark(appId) {
    if (remarkText.trim()) { addRemark(appId, remarkText); setRemarkText(''); }
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  const agents = getUsersByRole('agent');

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-1 bg-theme-brand rounded-full" />
        <span className="text-xs font-semibold text-theme-brand uppercase tracking-widest">Records</span>
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-bold text-theme-primary">
          {isClient ? 'My Applications' : isAgent ? 'All Applications' : 'All Applications'}
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or ID..." className="input-field !py-2 !pl-10 !w-full sm:!w-64" />
          </div>
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="input-field !py-2 !w-full sm:!w-auto">
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 card">
          <div className="w-16 h-16 rounded-full bg-theme-gradient-light flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-theme-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-theme-muted font-medium">No applications found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((s) => {
            const st = STATUS_LABELS[s.status] || STATUS_LABELS.SUBMITTED;
            return (
              <div key={s.id} className="card hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="badge bg-theme-gradient-light text-theme-brand text-xs">{s.category}</span>
                      <span className="badge" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                      {s.bankPartner && <span className="badge bg-blue-50 text-blue-600 text-xs">Bank: {s.bankPartner}</span>}
                    </div>
                    <h4 className="font-bold text-theme-primary">{s.data?.customerName || 'N/A'}</h4>
                    <p className="text-sm text-theme-secondary">{s.scheme} | {formatDate(s.date)}</p>
                    {s.agentId && <p className="text-xs text-theme-muted mt-1">Agent ID: {s.agentId}</p>}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setExpandedId(expandedId === s.id ? null : s.id)} className="btn-secondary !py-1.5 !px-3 text-xs">
                      {expandedId === s.id ? 'Collapse' : 'Details'}
                    </button>
                    {isClient && (s.status === 'SUBMITTED' || s.status === 'DOCUMENTS_PENDING') && (
                      <button onClick={() => setDeleteId(s.id)} className="text-xs font-semibold px-3 py-1.5 rounded border border-[#FCA5A5] text-[#EF4444] hover:bg-[#FEF2F2] transition-colors">Delete</button>
                    )}
                  </div>
                </div>

                {expandedId === s.id && (
                  <div className="mt-4 pt-4 border-t border-theme-light space-y-4">
                    {isAdmin && s.status === 'SUBMITTED' && !s.agentId && (
                      <div className="flex gap-2 items-end flex-wrap">
                        <div>
                          <label className="label text-xs">Assign Agent</label>
                          <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)} className="input-field !py-1.5 text-sm">
                            <option value="">Select agent...</option>
                            {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                          </select>
                        </div>
                        <button onClick={() => handleAssignAgent(s.id)} className="btn-primary !py-1.5 !px-4 !w-auto text-xs">Assign</button>
                      </div>
                    )}

                    {isAgent && s.status === 'SUBMITTED' && !s.agentId && (
                      <div className="flex gap-2">
                        <button onClick={() => assignAgent(s.id, currentUser?.id)} className="btn-primary !py-1.5 !px-4 !w-auto text-xs">Assign to Me</button>
                      </div>
                    )}

                    {isAgent && s.status === 'AGENT_REVIEW' && (
                      <div className="flex gap-2 flex-wrap">
                        <input type="text" placeholder="Document name to request..." className="input-field !py-1.5 text-sm flex-1 min-w-[200px]" onKeyDown={(e) => { if (e.key === 'Enter') requestDocument(s.id, e.target.value); }} />
                        <button onClick={() => { const input = document.activeElement; if (input?.value) requestDocument(s.id, input.value); }} className="btn-secondary !py-1.5 !px-3 text-xs">Request Doc</button>
                        <button onClick={() => verifyDocuments(s.id)} className="btn-primary !py-1.5 !px-4 !w-auto text-xs">Verify All Docs</button>
                      </div>
                    )}

                    {isAgent && s.status === 'DOCUMENTS_VERIFIED' && (
                      <div className="flex gap-2">
                        <button onClick={() => sendToAdminReview(s.id)} className="btn-primary !py-1.5 !px-4 !w-auto text-xs">Send to Admin Review</button>
                      </div>
                    )}

                    {isAdmin && s.status === 'ADMIN_REVIEW' && (
                      <div className="flex gap-2 items-end flex-wrap">
                        <div>
                          <label className="label text-xs">Select Bank Partner</label>
                          <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} className="input-field !py-1.5 text-sm">
                            <option value="">Choose bank...</option>
                            <option value="SBI">State Bank of India</option>
                            <option value="HDFC">HDFC Bank</option>
                            <option value="ICICI">ICICI Bank</option>
                            <option value="AXIS">Axis Bank</option>
                            <option value="KOTAK">Kotak Mahindra</option>
                          </select>
                        </div>
                        <button onClick={() => { if (selectedBank) { selectBank(s.id, selectedBank); } }} className="btn-primary !py-1.5 !px-4 !w-auto text-xs">Select Bank</button>
                      </div>
                    )}

                    {isAdmin && s.status === 'BANK_SELECTION' && (
                      <div className="flex gap-2">
                        <button onClick={() => sendToBank(s.id)} className="btn-primary !py-1.5 !px-4 !w-auto text-xs">Send to Bank</button>
                      </div>
                    )}

                    {isAdmin && s.status === 'SENT_TO_BANK' && (
                      <div className="flex gap-2 flex-wrap">
                        <button onClick={() => updateBankDecision(s.id, 'approved')} className="btn-primary !py-1.5 !px-4 !w-auto text-xs !bg-[#10B981]">Approve</button>
                        <button onClick={() => updateBankDecision(s.id, 'rejected')} className="btn-primary !py-1.5 !px-4 !w-auto text-xs !bg-[#EF4444]">Reject</button>
                      </div>
                    )}

                    {(s.status === 'APPROVED' || s.status === 'REJECTED') && (
                      <div className="flex gap-2">
                        <button onClick={() => { if (window.confirm('Mark as completed?')) updateStatus(s.id, 'COMPLETED'); }} className="btn-secondary !py-1.5 !px-3 text-xs">Mark Completed</button>
                      </div>
                    )}

                    <div>
                      <label className="label text-xs">Remarks</label>
                      <div className="flex gap-2">
                        <input type="text" value={remarkText} onChange={(e) => setRemarkText(e.target.value)} placeholder="Add a remark..." className="input-field !py-1.5 text-sm flex-1" onKeyDown={(e) => { if (e.key === 'Enter') handleAddRemark(s.id); }} />
                        <button onClick={() => handleAddRemark(s.id)} className="btn-secondary !py-1.5 !px-3 text-xs">Add</button>
                      </div>
                      {s.remarks?.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {s.remarks.map((r, i) => (
                            <p key={i} className="text-xs text-theme-muted bg-theme-bg p-2 rounded">{r.text} <span className="text-theme-muted/60">- {new Date(r.date).toLocaleString()}</span></p>
                          ))}
                        </div>
                      )}
                    </div>

                    {s.documents?.length > 0 && (
                      <div>
                        <label className="label text-xs">Documents</label>
                        <div className="space-y-1">
                          {s.documents.map((d, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-theme-secondary bg-theme-bg p-2 rounded">
                              <span className={d.status === 'uploaded' ? 'text-theme-success' : 'text-theme-warning'}>
                                {d.status === 'uploaded' ? '✓' : '○'}
                              </span>
                              <span>{d.name}</span>
                              <span className="text-theme-muted">({d.status})</span>
                              {isClient && d.status === 'requested' && uploadTarget?.docName !== d.name && (
                                <button onClick={() => setUploadTarget({ appId: s.id, docName: d.name })} className="ml-auto text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] bg-[#EEF3FF] hover:bg-[#DBEAFE] px-2.5 py-1 rounded-md transition-all">
                                  Upload
                                </button>
                              )}
                              {isClient && d.status === 'requested' && uploadTarget?.docName === d.name && (
                                <span className="ml-auto flex items-center gap-1.5">
                                  <input type="file" onChange={(e) => { if (e.target.files?.[0]) { uploadDocument(s.id, d.name, e.target.files[0].name); setUploadTarget(null); } }} className="text-xs max-w-[120px]" />
                                </span>
                              )}
                              {d.status === 'uploaded' && d.fileUrl && (
                                <span className="ml-auto text-[10px] text-theme-muted truncate max-w-[120px]">{d.fileUrl}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {s.notifications?.length > 0 && (
                      <div>
                        <label className="label text-xs">Notifications</label>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {s.notifications.filter(n => n.role === currentUser?.role).map((n, i) => (
                            <p key={i} className={`text-xs p-2 rounded ${n.read ? 'text-theme-muted bg-theme-bg' : 'text-theme-primary bg-blue-50 font-medium'}`}>
                              {n.message}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={!!deleteId} title="Delete Record" message="Are you sure you want to delete this record?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
