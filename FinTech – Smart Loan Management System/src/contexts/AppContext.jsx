import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CATEGORIES } from '../data/categories.js';

const AppContext = createContext(null);

export const STATUS_FLOW_MAP = {
  SUBMITTED: { label: 'Submitted', color: '#3B82F6', next: ['AGENT_REVIEW'] },
  AGENT_REVIEW: { label: 'Agent Review', color: '#8B5CF6', next: ['DOCUMENTS_PENDING', 'DOCUMENTS_VERIFIED'] },
  DOCUMENTS_PENDING: { label: 'Documents Pending', color: '#F59E0B', next: ['DOCUMENTS_VERIFIED'] },
  DOCUMENTS_VERIFIED: { label: 'Documents Verified', color: '#10B981', next: ['ADMIN_REVIEW'] },
  ADMIN_REVIEW: { label: 'Admin Review', color: '#6366F1', next: ['BANK_SELECTION', 'REJECTED'] },
  BANK_SELECTION: { label: 'Bank Selection', color: '#06B6D4', next: ['SENT_TO_BANK'] },
  SENT_TO_BANK: { label: 'Sent to Bank', color: '#0EA5E9', next: ['UNDER_BANK_REVIEW'] },
  UNDER_BANK_REVIEW: { label: 'Under Bank Review', color: '#F97316', next: ['APPROVED', 'REJECTED'] },
  APPROVED: { label: 'Approved', color: '#10B981', next: ['COMPLETED'] },
  REJECTED: { label: 'Rejected', color: '#EF4444', next: ['COMPLETED'] },
  COMPLETED: { label: 'Completed', color: '#6B7280', next: [] },
};

function loadApps() {
  try { return JSON.parse(localStorage.getItem('nexafin_subs') || '[]'); }
  catch { return []; }
}

function saveApps(apps) {
  localStorage.setItem('nexafin_subs', JSON.stringify(apps));
}

function addNotification(app, message, role) {
  return [...(app.notifications || []), { id: 'n' + Date.now() + Math.random(), message, role, date: new Date().toISOString(), read: false }];
}

export function AppProvider({ children }) {
  const [currentView, setCurrentView] = useState('landingView');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentScheme, setCurrentScheme] = useState(null);
  const [applications, setApplications] = useState(loadApps);
  const [toast, setToast] = useState({ message: '', visible: false });
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showPredefinedBtns, setShowPredefinedBtns] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => { saveApps(applications); }, [applications]);

  const showToast = useCallback((message) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 2500);
  }, []);

  const switchView = useCallback((viewId) => {
    setCurrentView(viewId);
    window.scrollTo(0, 0);
  }, []);

  const openCategory = useCallback((catId) => {
    const cat = CATEGORIES.find(c => c.id === catId);
    if (cat) { setCurrentCategory(cat); switchView('categoryListView'); }
  }, [switchView]);

  const openSchemeForm = useCallback((schemeId) => {
    if (!currentCategory) return;
    const scheme = currentCategory.schemes.find(s => s.id === schemeId);
    if (scheme) { setCurrentScheme(scheme); switchView('formView'); }
  }, [currentCategory, switchView]);

  const addSubmission = useCallback((data, userId) => {
    if (!currentCategory || !currentScheme) return;
    const app = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      category: currentCategory.name,
      categoryId: currentCategory.id,
      scheme: currentScheme.name,
      data,
      status: 'SUBMITTED',
      clientId: userId || null,
      agentId: null,
      documents: [],
      remarks: [],
      notifications: [
        { id: 'n' + Date.now(), message: 'Application submitted successfully', role: 'client', date: new Date().toISOString(), read: false },
        { id: 'n' + (Date.now() + 1), message: 'New client application received', role: 'agent', date: new Date().toISOString(), read: false },
        { id: 'n' + (Date.now() + 2), message: 'New application awaiting processing', role: 'admin', date: new Date().toISOString(), read: false },
      ],
      eligibilityResult: null,
      bankPartner: null,
    };
    setApplications(prev => [app, ...prev]);
    switchView('successView');
  }, [currentCategory, currentScheme, switchView]);

  const deleteSubmission = useCallback((id) => {
    setApplications(prev => prev.filter(x => x.id !== id));
    showToast('Record deleted');
  }, [showToast]);

  const updateStatus = useCallback((appId, newStatus) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      let notifs = [...(app.notifications || [])];
      const meta = STATUS_FLOW_MAP[newStatus];
      if (newStatus === 'DOCUMENTS_PENDING') {
        notifs = addNotification({ notifications: notifs }, 'Additional documents required', 'client');
        notifs = addNotification({ notifications: notifs }, 'Documents requested from client', 'agent');
      }
      if (newStatus === 'DOCUMENTS_VERIFIED') {
        notifs = addNotification({ notifications: notifs }, 'Documents verified, forwarded to admin', 'agent');
        notifs = addNotification({ notifications: notifs }, 'New verified application for review', 'admin');
      }
      if (newStatus === 'ADMIN_REVIEW') {
        notifs = addNotification({ notifications: notifs }, 'Your application is under admin review', 'client');
      }
      if (newStatus === 'BANK_SELECTION') {
        notifs = addNotification({ notifications: notifs }, 'Bank selected for your application', 'client');
      }
      if (newStatus === 'SENT_TO_BANK') {
        notifs = addNotification({ notifications: notifs }, 'Application sent to bank partner', 'client');
        notifs = addNotification({ notifications: notifs }, 'Application forwarded to bank', 'agent');
        notifs = addNotification({ notifications: notifs }, 'Bank response pending', 'admin');
      }
      if (newStatus === 'APPROVED') {
        notifs = addNotification({ notifications: notifs }, 'Your application has been approved!', 'client');
        notifs = addNotification({ notifications: notifs }, 'Application approved', 'agent');
        notifs = addNotification({ notifications: notifs }, 'Application approved', 'admin');
      }
      if (newStatus === 'REJECTED') {
        notifs = addNotification({ notifications: notifs }, 'Your application has been rejected', 'client');
        notifs = addNotification({ notifications: notifs }, 'Application rejected', 'agent');
        notifs = addNotification({ notifications: notifs }, 'Application rejected', 'admin');
      }
      if (newStatus === 'COMPLETED') {
        notifs = addNotification({ notifications: notifs }, 'Application process completed', 'client');
      }
      return { ...app, status: newStatus, notifications: notifs };
    }));
    showToast(`Status updated to ${STATUS_FLOW_MAP[newStatus]?.label || newStatus}`);
  }, [showToast]);

  const assignAgent = useCallback((appId, agentId) => {
    setApplications(prev => prev.map(app =>
      app.id === appId
        ? { ...app, agentId, status: 'AGENT_REVIEW', notifications: addNotification(app, 'Agent assigned to your application', 'client') }
        : app
    ));
    showToast('Agent assigned');
  }, [showToast]);

  const addRemark = useCallback((appId, text) => {
    setApplications(prev => prev.map(app =>
      app.id === appId
        ? { ...app, remarks: [...(app.remarks || []), { text, date: new Date().toISOString(), by: '' }] }
        : app
    ));
    showToast('Remark added');
  }, [showToast]);

  const requestDocument = useCallback((appId, docName) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      const docs = [...(app.documents || []), { name: docName, status: 'requested', date: new Date().toISOString() }];
      let notifs = addNotification(app, `Document requested: ${docName}`, 'client');
      notifs = addNotification({ notifications: notifs }, `Requested ${docName} from client`, 'agent');
      return { ...app, status: 'DOCUMENTS_PENDING', documents: docs, notifications: notifs };
    }));
    showToast('Document requested');
  }, [showToast]);

  const uploadDocument = useCallback((appId, docName, fileUrl) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      const docs = (app.documents || []).map(d =>
        d.name === docName ? { ...d, status: 'uploaded', fileUrl, uploadedAt: new Date().toISOString() } : d
      );
      const notifs = addNotification(app, `Document uploaded: ${docName}`, 'agent');
      const allUploaded = docs.every(d => d.status === 'uploaded');
      return { ...app, documents: docs, notifications: notifs, ...(allUploaded && docs.length > 0 ? { status: 'DOCUMENTS_VERIFIED' } : {}) };
    }));
    showToast('Document uploaded');
  }, [showToast]);

  const verifyDocuments = useCallback((appId) => {
    updateStatus(appId, 'DOCUMENTS_VERIFIED');
  }, [updateStatus]);

  const sendToAdminReview = useCallback((appId) => {
    updateStatus(appId, 'ADMIN_REVIEW');
  }, [updateStatus]);

  const selectBank = useCallback((appId, bankName) => {
    setApplications(prev => prev.map(app =>
      app.id === appId ? { ...app, bankPartner: bankName, status: 'BANK_SELECTION' } : app
    ));
    showToast(`Bank selected: ${bankName}`);
  }, [showToast]);

  const sendToBank = useCallback((appId) => {
    updateStatus(appId, 'SENT_TO_BANK');
  }, [updateStatus]);

  const updateBankDecision = useCallback((appId, decision) => {
    updateStatus(appId, decision === 'approved' ? 'APPROVED' : 'REJECTED');
  }, [updateStatus]);

  const completeApplication = useCallback((appId) => {
    updateStatus(appId, 'COMPLETED');
  }, [updateStatus]);

  const getApplicationsByClient = useCallback((clientId) => {
    return applications.filter(a => a.clientId === clientId);
  }, [applications]);

  const getApplicationsByAgent = useCallback((agentId) => {
    return applications.filter(a => a.agentId === agentId);
  }, [applications]);

  const getApplicationsByStatus = useCallback((status) => {
    return applications.filter(a => a.status === status);
  }, [applications]);

  const getUnassignedApplications = useCallback(() => {
    return applications.filter(a => !a.agentId && a.status === 'SUBMITTED');
  }, [applications]);

  const getUnreadNotifications = useCallback((role) => {
    return applications.flatMap(a => (a.notifications || []).filter(n => n.role === role && !n.read));
  }, [applications]);

  const markNotificationsRead = useCallback((role) => {
    setApplications(prev => prev.map(app => ({
      ...app,
      notifications: (app.notifications || []).map(n => n.role === role ? { ...n, read: true } : n)
    })));
  }, []);

  const getAppNotifications = useCallback((appId, role) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return [];
    return (app.notifications || []).filter(n => n.role === role);
  }, [applications]);

  const viewApplicationDetail = useCallback((appId) => {
    const app = applications.find(a => a.id === appId);
    if (app) setSelectedApplication(app);
    switchView('submissionsView');
  }, [applications, switchView]);

  const toggleChat = useCallback(() => setIsChatOpen(prev => !prev), []);

  const addChatMessage = useCallback((msg, sender) => {
    setChatMessages(prev => [...prev, { text: msg, sender }]);
  }, []);

  const sendChatMessage = useCallback((text) => {
    if (!text.trim()) return;
    addChatMessage(text, 'user');
    setShowPredefinedBtns(false);
    setTimeout(() => {
      let reply = "I'm sorry, I don't understand that. You can ask about Savings, Credit, Insurance, Pension, Social Security, or type 'contact admin'.";
      const lmsg = text.toLowerCase();
      if (lmsg.includes('saving')) reply = 'We offer High Return FDs, RDs, SGB, ELSS, and SIPs. Navigate to Services -> Savings to apply.';
      else if (lmsg.includes('credit') || lmsg.includes('loan')) reply = 'We offer Micro Credit, Livelihood Support, MSME, and Home/Vehicle Loans. Navigate to Services -> Credit.';
      else if (lmsg.includes('insurance')) reply = 'We offer Life, Medical, Vehicle, and Agri Insurance. Navigate to Services -> Insurance.';
      else if (lmsg.includes('pension')) reply = 'We offer APY, PM-SYM / PM-KMY, and NPS-Lite. Navigate to Services -> Pension.';
      else if (lmsg.includes('social') || lmsg.includes('welfare')) reply = 'We currently implement TNUWWB, TNCWWB, and E-SHRAM schemes. Navigate to Services -> Social Security.';
      else if (lmsg.includes('admin') || lmsg.includes('contact')) reply = "You can contact the admin team by clicking 'Contact Admin' in the top menu or the bottom bar.";
      else if (lmsg.includes('hello') || lmsg.includes('hi')) reply = 'Hello! How can I assist you with NexaFin services today?';
      addChatMessage(reply, 'bot');
    }, 600);
  }, [addChatMessage]);

  const contactAdmin = useCallback(() => {
    showToast('Connecting to admin support team...');
  }, [showToast]);

  const value = {
    currentView, switchView, currentCategory, setCurrentCategory,
    currentScheme, setCurrentScheme, openCategory, openSchemeForm,
    get submissions() { return applications; },
    applications, addSubmission, deleteSubmission,
    toast, showToast,
    chatMessages, addChatMessage, sendChatMessage,
    isChatOpen, toggleChat, showPredefinedBtns, contactAdmin,
    STATUS_FLOW_MAP, updateStatus, assignAgent, addRemark,
    requestDocument, uploadDocument, verifyDocuments,
    sendToAdminReview, selectBank, sendToBank, updateBankDecision, completeApplication,
    getApplicationsByClient, getApplicationsByAgent, getApplicationsByStatus,
    getUnassignedApplications,
    getUnreadNotifications, markNotificationsRead, getAppNotifications,
    selectedApplication, setSelectedApplication, viewApplicationDetail,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
