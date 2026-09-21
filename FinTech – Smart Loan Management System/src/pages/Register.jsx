import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useApp } from '../contexts/AppContext.jsx';
import OtpVerification from '../components/OtpVerification.jsx';

export default function Register() {
  const { register, sendOtp, verifyOtp, findUserByEmailOrPhone } = useAuth();
  const { switchView, showToast } = useApp();
  const [step, setStep] = useState('form');
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', role: 'client' });
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [formError, setFormError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value }));
    setFormError('');
  }

  function handleSendOtp() {
    setFormError('');
    if (!form.name.trim()) { setFormError('Full name is required'); return; }
    if (!/^\d{10}$/.test(form.phone)) { setFormError('Enter a valid 10-digit mobile number'); return; }
    if (!form.email.includes('@')) { setFormError('Enter a valid email address'); return; }
    if (form.password.length < 4) { setFormError('Password must be at least 4 characters'); return; }
    const duplicate = findUserByEmailOrPhone(form.email, form.phone);
    if (duplicate) {
      setFormError('Email or phone number already registered');
      return;
    }
    const result = sendOtp(form.phone);
    if (result.success) {
      setStep('otp');
      setOtpError('');
    } else {
      setFormError(result.error);
    }
  }

  async function handleVerify(otp) {
    setLoading(true);
    setOtpError('');
    await new Promise(r => setTimeout(r, 400));
    const result = verifyOtp(form.phone, otp);
    if (result.success) {
      register({ ...form, phone: form.phone });
      showToast('Account created successfully! Please login.');
      setStep('form');
      setForm({ name: '', phone: '', email: '', password: '', role: 'client' });
      switchView('loginView');
    } else {
      setOtpError(result.error);
    }
    setLoading(false);
  }

  function handleResend() {
    sendOtp(form.phone);
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <button onClick={() => switchView('landingView')} className="self-start mb-4 text-sm text-theme-muted hover:text-theme-brand flex items-center gap-1 transition-colors max-w-max">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back Home
        </button>
      </div>

      <div className="card">
        {step === 'form' ? (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-theme-gradient shadow-lg mb-4">
                <svg className="text-white w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-theme-primary">Create Account</h2>
              <p className="text-theme-muted text-sm mt-2">Register as a client, agent, or admin</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input type="text" name="name" required className="input-field" placeholder="Your full name" value={form.name} onChange={handleChange} />
              </div>
              <div>
                <label className="label">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted text-sm font-medium pointer-events-none">+91</span>
                  <input type="tel" name="phone" inputMode="numeric" required className="input-field !pl-12" placeholder="9876543210" value={form.phone} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" name="email" required className="input-field" placeholder="you@example.com" value={form.email} onChange={handleChange} />
              </div>
              <div>
                <label className="label">Password</label>
                <input type="password" name="password" required className="input-field" placeholder="Min 4 characters" value={form.password} onChange={handleChange} />
              </div>
              <div>
                <label className="label">Register as</label>
                <select name="role" value={form.role} onChange={handleChange} className="input-field">
                  <option value="client">Client</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {formError && (
                <p className="text-xs text-theme-error flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formError}
                </p>
              )}

              <button type="button" onClick={handleSendOtp} className="btn-primary mt-2 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send OTP
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-theme-light text-center">
              <button onClick={() => switchView('loginView')} className="text-theme-brand font-semibold text-sm hover:underline">
                Already have an account? Login
              </button>
            </div>
          </>
        ) : (
          <OtpVerification
            phone={form.phone}
            onVerify={handleVerify}
            onResend={handleResend}
            onBack={() => { setStep('form'); setOtpError(''); }}
            loading={loading}
            error={otpError}
          />
        )}
      </div>
    </div>
  );
}
