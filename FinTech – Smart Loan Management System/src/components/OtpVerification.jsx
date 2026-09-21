import { useState, useRef, useEffect } from 'react';

const EXPIRY_S = 300;

export default function OtpVerification({ phone, onVerify, onResend, onBack, loading, error: externalError }) {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [timer, setTimer] = useState(EXPIRY_S);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [internalError, setInternalError] = useState('');
  const inputRefs = useRef([]);

  const error = externalError || internalError;

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  function handleChange(index, value) {
    if (!/^\d*$/.test(value)) return;
    setInternalError('');
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (value && index === 5 && next.every(d => d)) {
      onVerify(next.join(''));
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter' && otp.every(d => d)) {
      onVerify(otp.join(''));
    }
  }

  function handlePaste(e) {
    const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  }

  function handleResend() {
    if (resendCooldown > 0 || loading) return;
    setResendCooldown(30);
    setTimer(EXPIRY_S);
    setOtp(Array(6).fill(''));
    setInternalError('');
    inputRefs.current[0]?.focus();
    onResend();
  }

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  function handleManualVerify() {
    if (otp.some(d => !d)) {
      setInternalError('Enter all 6 digits');
      return;
    }
    onVerify(otp.join(''));
  }

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1E3A8A] shadow-lg flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-theme-primary">Verify Mobile Number</h3>
        <p className="text-sm text-theme-muted mt-2">
          Enter the 6-digit code sent to <span className="font-semibold text-theme-secondary">{phone}</span>
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 md:gap-3 mb-2">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => inputRefs.current[i] = el}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            className="otp-digit"
            disabled={loading}
          />
        ))}
      </div>

      {error && (
        <p className="text-center text-sm text-theme-error mt-3 flex items-center justify-center gap-1">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}

      <div className="flex items-center justify-between mt-5">
        <span className={`text-xs font-medium ${timer <= 30 ? 'text-theme-error' : 'text-theme-muted'}`}>
          {timer > 0 ? `Expires in ${formatTime(timer)}` : 'Code expired'}
        </span>
        <button
          type="button"
          onClick={handleResend}
          disabled={resendCooldown > 0 || loading}
          className="text-xs font-semibold text-theme-brand hover:underline disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:no-underline transition-opacity"
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
        </button>
      </div>

      <button
        type="button"
        onClick={handleManualVerify}
        disabled={otp.some(d => !d) || loading}
        className="btn-primary mt-6 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Verifying...
          </>
        ) : 'Verify OTP'}
      </button>

      <button type="button" onClick={onBack} className="btn-secondary mt-3 w-full justify-center">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>
    </div>
  );
}
