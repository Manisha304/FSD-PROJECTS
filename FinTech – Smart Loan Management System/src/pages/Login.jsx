import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useApp } from '../contexts/AppContext.jsx';
import OtpVerification from '../components/OtpVerification.jsx';

export default function Login() {
  const { loginByPhone, sendOtp, verifyOtp, findUserByEmailOrPhone } = useAuth();
  const { switchView, showToast } = useApp();
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [sendError, setSendError] = useState('');

  function handleSendOtp() {
    setSendError('');
    if (!/^\d{10}$/.test(phone)) {
      setSendError('Enter a valid 10-digit mobile number');
      return;
    }
    const existing = findUserByEmailOrPhone(null, phone);
    if (!existing) {
      setSendError('No account found with this number. Please register first.');
      return;
    }
    const result = sendOtp(phone);
    if (result.success) {
      setStep('otp');
      setOtpError('');
    } else {
      setSendError(result.error);
    }
  }

  async function handleVerify(otp) {
    setLoading(true);
    setOtpError('');
    await new Promise(r => setTimeout(r, 400));
    const result = verifyOtp(phone, otp);
    if (result.success) {
      loginByPhone(phone);
      const role = findUserByEmailOrPhone(null, phone)?.role;
      if (role === 'admin') switchView('adminDashboardView');
      else if (role === 'agent') switchView('agentDashboardView');
      else switchView('clientDashboardView');
    } else {
      setOtpError(result.error);
      setLoading(false);
    }
  }

  function handleResend() {
    sendOtp(phone);
  }

  return (
    <div className="w-full max-w-sm my-auto">
      <div className="text-center mb-8 flex flex-col items-center">
        <button onClick={() => switchView('landingView')} className="self-start mb-4 text-sm text-theme-muted hover:text-theme-brand flex items-center gap-1 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back Home
        </button>
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1E3A8A] shadow-lg flex items-center justify-center ring-4 ring-theme-light">
          <img src="/logo.png" alt="NexaFin" className="w-11 h-11 rounded-full" />
        </div>
      </div>

      <div className="card">
        {step === 'phone' ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-theme-primary">Welcome Back</h2>
              <p className="text-theme-muted text-sm mt-2">Sign in with your mobile number</p>
            </div>
            <div className="space-y-5">
              <div>
                <label className="label">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted text-sm font-medium">+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    required
                    className="input-field !pl-12"
                    placeholder="9876543210"
                    maxLength={10}
                    value={phone}
                    onChange={e => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setSendError(''); }}
                    onKeyDown={e => { if (e.key === 'Enter') handleSendOtp(); }}
                  />
                </div>
                {sendError && <p className="text-xs text-theme-error mt-1.5 flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{sendError}</p>}
              </div>
              <button type="button" onClick={handleSendOtp} className="btn-primary flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send OTP
              </button>
            </div>
            <div className="mt-6 pt-6 border-t border-theme-light text-center">
              <p className="text-theme-muted text-sm">
                New user?{' '}
                <button onClick={() => switchView('registerView')} className="text-theme-brand font-semibold hover:underline">
                  Register
                </button>
              </p>
            </div>
          </>
        ) : (
          <OtpVerification
            phone={phone}
            onVerify={handleVerify}
            onResend={handleResend}
            onBack={() => { setStep('phone'); setOtpError(''); setSendError(''); }}
            loading={loading}
            error={otpError}
          />
        )}
      </div>
    </div>
  );
}
