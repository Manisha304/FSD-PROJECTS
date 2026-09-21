import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

const DEFAULT_USERS = [
  { id: 'u1', name: 'Admin User', email: 'admin@nexafin.com', password: 'admin123', role: 'admin', phone: '9999999999', isActive: true, phoneVerified: true, createdAt: '2024-01-01' },
  { id: 'u2', name: 'Agent Kumar', email: 'agent@nexafin.com', password: 'agent123', role: 'agent', phone: '8888888888', isActive: true, phoneVerified: true, createdAt: '2024-01-01' },
  { id: 'u3', name: 'Ravi Client', email: 'client@nexafin.com', password: 'client123', role: 'client', phone: '7777777777', isActive: true, phoneVerified: true, createdAt: '2024-01-01' },
  { id: 'u4', name: 'Priya Sharma', email: 'priya@nexafin.com', password: 'agent123', role: 'agent', phone: '8877665544', isActive: true, phoneVerified: true, createdAt: '2024-01-15' },
  { id: 'u5', name: 'Amit Client', email: 'amit@test.com', password: 'client123', role: 'client', phone: '7766554433', isActive: true, phoneVerified: true, createdAt: '2024-02-01' },
];

const OTP_EXPIRY_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const OTP_COOLDOWN_S = 30;
const DEMO_OTP = '123456';
const DEMO_PHONES = ['9999999999', '8888888888', '7777777777', '8877665544', '7766554433'];

function loadUsers() {
  try {
    const stored = JSON.parse(localStorage.getItem('nexafin_users') || 'null');
    if (stored && stored.length > 0) return stored;
  } catch {}
  localStorage.setItem('nexafin_users', JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
}

function saveUsers(users) {
  localStorage.setItem('nexafin_users', JSON.stringify(users));
}

function loadOtp() {
  try { return JSON.parse(localStorage.getItem('nexafin_otp') || 'null'); }
  catch { return null; }
}

function saveOtp(data) {
  localStorage.setItem('nexafin_otp', JSON.stringify(data));
}

function clearOtp() {
  localStorage.removeItem('nexafin_otp');
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('nexafin_session'));
  const [currentUser, setCurrentUser] = useState(() => {
    const sid = localStorage.getItem('nexafin_session');
    if (!sid) return null;
    const users = loadUsers();
    return users.find(u => u.id === sid) || null;
  });
  const [users, setUsers] = useState(loadUsers);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nexafin_session', currentUser.id);
    }
  }, [currentUser]);

  useEffect(() => { saveUsers(users); }, [users]);

  const login = useCallback((email, password) => {
    const user = users.find(u => u.email === email && u.password === password && u.isActive);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      return user;
    }
    return null;
  }, [users]);

  const loginByPhone = useCallback((phone) => {
    const user = users.find(u => u.phone === phone && u.isActive);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      return user;
    }
    return null;
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('nexafin_session');
  }, []);

  const register = useCallback((data) => {
    const existing = users.find(u => u.email === data.email || u.phone === data.phone);
    if (existing) return null;
    const newUser = {
      id: 'u' + Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone || '',
      role: data.role || 'client',
      isActive: true,
      phoneVerified: true,
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  }, [users]);

  const addAgent = useCallback((data) => {
    const newAgent = {
      id: 'u' + Date.now(),
      name: data.name,
      email: data.email,
      password: data.password || 'agent123',
      phone: data.phone || '',
      role: 'agent',
      isActive: true,
      phoneVerified: true,
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newAgent]);
    return newAgent;
  }, []);

  const toggleUserStatus = useCallback((userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
  }, []);

  const getUsersByRole = useCallback((role) => {
    return users.filter(u => u.role === role && u.isActive);
  }, [users]);

  const getAllUsers = useCallback(() => users, [users]);

  const updateUser = useCallback((userId, updates) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
  }, []);

  const removeUser = useCallback((userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  }, []);

  const updateCurrentUser = useCallback((updates) => {
    setCurrentUser(prev => prev ? { ...prev, ...updates } : prev);
    setUsers(prev => prev.map(u => u.id === currentUser?.id ? { ...u, ...updates } : u));
  }, [currentUser]);

  const findUserByEmailOrPhone = useCallback((email, phone) => {
    return users.find(u => (email && u.email === email) || (phone && u.phone === phone));
  }, [users]);

  const sendOtp = useCallback((phone) => {
    if (!/^\d{10}$/.test(phone)) {
      return { success: false, error: 'Enter a valid 10-digit mobile number' };
    }
    const existing = loadOtp();
    if (existing && existing.phone === phone) {
      const elapsed = (Date.now() - existing.lastResendAt) / 1000;
      if (elapsed < OTP_COOLDOWN_S) {
        const remaining = Math.ceil(OTP_COOLDOWN_S - elapsed);
        return { success: false, error: `Wait ${remaining}s before requesting again` };
      }
    }
    const otp = DEMO_PHONES.includes(phone) ? DEMO_OTP : generateOtp();
    saveOtp({
      phone,
      otp,
      expiresAt: Date.now() + OTP_EXPIRY_MS,
      attempts: 0,
      lastResendAt: Date.now(),
    });
    console.log(`%c[OTP for ${phone}] ${otp}`, 'background:#1E3A8A;color:white;font-size:14px;padding:4px 10px;border-radius:4px;font-weight:bold;');
    return { success: true };
  }, []);

  const verifyOtp = useCallback((phone, otp) => {
    const data = loadOtp();
    if (!data || data.phone !== phone) {
      return { success: false, error: 'No OTP found. Request a new one.' };
    }
    if (Date.now() > data.expiresAt) {
      clearOtp();
      return { success: false, error: 'OTP expired. Request a new one.' };
    }
    data.attempts += 1;
    saveOtp(data);
    if (data.otp !== otp) {
      const remaining = MAX_ATTEMPTS - data.attempts;
      if (remaining <= 0) { clearOtp(); return { success: false, error: 'Too many attempts. Request a new OTP.' }; }
      return { success: false, error: `Invalid OTP. ${remaining} attempt${remaining !== 1 ? 's' : ''} left.` };
    }
    clearOtp();
    return { success: true };
  }, []);

  const value = {
    isLoggedIn, login, loginByPhone, logout, currentUser, users,
    register, addAgent, toggleUserStatus, removeUser, getUsersByRole, getAllUsers, updateUser, updateCurrentUser,
    findUserByEmailOrPhone, sendOtp, verifyOtp,
    isAdmin: currentUser?.role === 'admin',
    isAgent: currentUser?.role === 'agent',
    isClient: currentUser?.role === 'client',
    hasAgentAccess: currentUser?.role === 'agent' || currentUser?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
