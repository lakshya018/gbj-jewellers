'use client';

import { useState, useRef, useCallback } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { Loader2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function FirebaseAuthUI({ onSuccess }) {
  const [mode, setMode] = useState('buttons');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const confirmationRef = useRef(null);
  const recaptchaWidgetRef = useRef(null);

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      // Try popup first — best UX (no page reload)
      const result = await signInWithPopup(auth, provider);
      if (result?.user) onSuccess?.();
    } catch (err) {
      if (err.code === 'auth/popup-blocked') {
        // Popup blocked → fall back to redirect (handled by AuthContext's onAuthStateChanged)
        try {
          const provider = new GoogleAuthProvider();
          await signInWithRedirect(auth, provider);
          return; // page will redirect
        } catch (redirectErr) {
          setError(redirectErr.message || 'Google sign-in failed');
        }
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google sign-in failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const setupRecaptcha = useCallback(() => {
    if (recaptchaWidgetRef.current) return;
    try {
      recaptchaWidgetRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
      });
    } catch (err) {
      console.error('reCAPTCHA setup error:', err);
    }
  }, []);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    const formatted = phone.startsWith('+') ? phone : `+91${phone}`;
    if (formatted.length < 12) { setError('Please enter a valid 10-digit number'); return; }
    setLoading(true);
    try {
      setupRecaptcha();
      confirmationRef.current = await signInWithPhoneNumber(auth, formatted, recaptchaWidgetRef.current);
      setMode('otp');
    } catch (err) {
      setError(err.code === 'auth/too-many-requests' ? 'Too many attempts. Try later.' : err.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    if (otp.length < 6) { setError('Enter the 6-digit code'); return; }
    setLoading(true);
    try {
      await confirmationRef.current.confirm(otp);
      onSuccess?.();
    } catch (err) {
      setError(err.code === 'auth/invalid-verification-code' ? 'Invalid code. Try again.' : err.message || 'Verification failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-5">
      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-xl text-center font-medium">
          {error}
        </div>
      )}

      {/* ── Main Buttons ── */}
      {mode === 'buttons' && (
        <div className="space-y-4">
          {/* Google Button — Premium style */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center gap-4 bg-white border-2 border-gray-100 py-4 px-5 rounded-2xl hover:border-gray-200 hover:shadow-lg hover:shadow-black/5 transition-all duration-300 disabled:opacity-60 group"
          >
            {loading ? (
              <Loader2 className="animate-spin text-gray-400 mx-auto" size={22} />
            ) : (
              <>
                <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <svg width="22" height="22" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-charcoal">Continue with Google</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Fast & secure sign-in</p>
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-gold-500 group-hover:translate-x-1 transition-all" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 py-1">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-300">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          </div>

          {/* Phone Button */}
          <button
            onClick={() => setMode('phone')}
            className="w-full flex items-center gap-4 py-4 px-5 rounded-2xl border-2 border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-black/5 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}>
              <span className="text-white text-lg">📱</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-charcoal">Continue with Phone</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Receive OTP on your number</p>
            </div>
            <ArrowRight size={16} className="text-gray-300 group-hover:text-gold-500 group-hover:translate-x-1 transition-all" />
          </button>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
              <ShieldCheck size={13} className="text-green-500" />
              <span>256-bit SSL</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-200"></div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
              <Sparkles size={13} className="text-gold-500" />
              <span>Secure & Private</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Phone Input ── */}
      {mode === 'phone' && (
        <form onSubmit={handleSendOTP} className="space-y-5">
          <div className="text-center mb-1">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}>
              <span className="text-2xl">📱</span>
            </div>
            <p className="text-sm text-gray-500">Enter your mobile number to receive a one-time code</p>
          </div>

          <div className="flex gap-2">
            <div className="flex items-center px-4 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm text-charcoal font-semibold tracking-wide">
              🇮🇳 +91
            </div>
            <input
              type="tel" value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="98765 43210" maxLength={10} autoFocus
              className="flex-1 bg-gray-50 border-2 border-gray-100 py-3.5 px-4 rounded-xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-400 outline-none transition-all text-charcoal text-base tracking-wider font-medium"
            />
          </div>

          <button type="submit" disabled={loading || phone.length < 10}
            className="w-full py-4 rounded-xl font-bold tracking-widest uppercase text-xs text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:shadow-xl hover:shadow-gold-500/20"
            style={{ background: 'linear-gradient(135deg, #1a1a2e, #2d2d44)' }}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <>Send Verification Code <ArrowRight size={16} /></>}
          </button>

          <button type="button" onClick={() => { setMode('buttons'); setError(''); }}
            className="w-full text-xs text-gray-400 hover:text-charcoal transition-colors py-2 font-medium">
            ← Back to sign-in options
          </button>
        </form>
      )}

      {/* ── OTP Verify ── */}
      {mode === 'otp' && (
        <form onSubmit={handleVerifyOTP} className="space-y-5">
          <div className="text-center mb-1">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={28} className="text-green-500" />
            </div>
            <p className="text-sm font-medium text-charcoal">Verification code sent!</p>
            <p className="text-xs text-gray-400 mt-1">
              Enter the 6-digit code sent to <span className="font-semibold text-charcoal">+91 {phone}</span>
            </p>
          </div>

          <input
            type="text" inputMode="numeric" value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="• • • • • •" maxLength={6} autoFocus
            className="w-full bg-gray-50 border-2 border-gray-100 py-4 px-4 rounded-xl focus:ring-2 focus:ring-gold-500/20 focus:border-gold-400 outline-none transition-all text-charcoal text-center text-2xl tracking-[0.6em] font-mono font-bold"
          />

          <button type="submit" disabled={loading || otp.length < 6}
            className="w-full py-4 rounded-xl font-bold tracking-widest uppercase text-xs text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:shadow-xl hover:shadow-gold-500/20"
            style={{ background: 'linear-gradient(135deg, #1a1a2e, #2d2d44)' }}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <>Verify & Sign In <ArrowRight size={16} /></>}
          </button>

          <button type="button" onClick={() => { setMode('phone'); setOtp(''); setError(''); }}
            className="w-full text-xs text-gray-400 hover:text-charcoal transition-colors py-2 font-medium">
            ← Change number or resend
          </button>
        </form>
      )}

      <div id="recaptcha-container"></div>
    </div>
  );
}
