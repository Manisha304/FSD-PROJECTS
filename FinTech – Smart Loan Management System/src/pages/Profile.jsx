import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useApp } from '../contexts/AppContext.jsx';

export default function Profile() {
  const { currentUser, updateCurrentUser } = useAuth();
  const { switchView, showToast } = useApp();
  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    state: currentUser?.state || '',
    dob: currentUser?.dob || '',
    gender: currentUser?.gender || '',
    aadhar: currentUser?.aadhar || '',
    pan: currentUser?.pan || '',
  });

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSave() {
    if (!form.name.trim()) {
      showToast('Name is required');
      return;
    }
    updateCurrentUser({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      dob: form.dob,
      gender: form.gender,
      aadhar: form.aadhar.trim(),
      pan: form.pan.trim(),
    });
    setShowSuccess(true);
  }

  const isAgent = currentUser?.role === 'agent';
  const isAdmin = currentUser?.role === 'admin';
  const isClient = currentUser?.role === 'client';
  const dashboardView = isAdmin ? 'adminDashboardView' : isAgent ? 'agentDashboardView' : 'clientDashboardView';
  const inputClass = "w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm text-theme-primary focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 outline-none transition-all";
  const labelClass = "block text-xs font-semibold text-theme-secondary mb-1.5";
  const disabledClass = "w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm text-[#94A3B8] bg-[#F8FAFC] outline-none cursor-not-allowed";

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => switchView(dashboardView)} className="p-2 text-[#64748B] hover:text-[#2563EB] rounded-lg hover:bg-[#F0F5FF] transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7 7l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-theme-primary">My Profile</h2>
      </div>

      <div className="card !p-6 md:!p-8 space-y-6">
        <div className="flex items-center gap-4 pb-5 border-b border-[#E2E8F0]">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center text-xl font-bold shadow-md">
            {currentUser?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'}
          </div>
          <div>
            <p className="text-base font-bold text-theme-primary">{currentUser?.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="role-badge-blue">{currentUser?.role}</span>
              <span className="text-xs text-theme-muted">ID: {currentUser?.id}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-theme-primary mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Date of Birth</label>
              <input type="date" name="dob" value={form.dob} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Role</label>
              <input type="text" value={currentUser?.role || ''} disabled className={disabledClass} />
            </div>
          </div>
        </div>

        <div className="border-t border-[#E2E8F0] pt-5">
          <h3 className="text-sm font-bold text-theme-primary mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Address & Identity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>Address</label>
              <textarea name="address" value={form.address} onChange={handleChange} rows="2" className={inputClass + " resize-none"} />
            </div>
            <div>
              <label className={labelClass}>City</label>
              <input type="text" name="city" value={form.city} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>State</label>
              <input type="text" name="state" value={form.state} onChange={handleChange} className={inputClass} />
            </div>
            {isClient && (
              <>
                <div>
                  <label className={labelClass}>Aadhar Number</label>
                  <input type="text" name="aadhar" value={form.aadhar} onChange={handleChange} maxLength="12" className={inputClass} placeholder="12-digit Aadhar" />
                </div>
                <div>
                  <label className={labelClass}>PAN Number</label>
                  <input type="text" name="pan" value={form.pan} onChange={handleChange} className={inputClass} placeholder="e.g. ABCDE1234F" />
                </div>
              </>
            )}
          </div>
        </div>

        {isClient && (
          <div className="border-t border-[#E2E8F0] pt-5">
            <h3 className="text-sm font-bold text-theme-primary mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Account Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>User ID</label>
                <input type="text" value={currentUser?.id || ''} disabled className={disabledClass} />
              </div>
              <div>
                <label className={labelClass}>Member Since</label>
                <input type="text" value={currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'} disabled className={disabledClass} />
              </div>
            </div>
          </div>
        )}

        <button onClick={handleSave} className="btn-primary w-full !py-3 !rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Save Changes
        </button>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => switchView(dashboardView)}>
          <div className="bg-white rounded-2xl p-8 mx-4 max-w-sm w-full shadow-2xl text-center animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-theme-primary mb-2">Saved Successfully!</h3>
            <p className="text-sm text-theme-muted mb-6">Your profile has been updated.</p>
            <button onClick={() => switchView(dashboardView)} className="btn-primary w-full !py-2.5 !rounded-xl">
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
