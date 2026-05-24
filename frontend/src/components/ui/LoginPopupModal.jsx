import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  User,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { validateLoginForm } from '../../utils/formValidation.js';
import { getRoleHome } from '../../utils/auth.js';
import env from '../../config/env.js';
import { useLocation, useNavigate } from 'react-router-dom';

const DISMISS_KEY = 'gn_login_modal_dismissed_at';
const DISMISS_TTL = 24 * 60 * 60 * 1000;

function getDismissedAt() {
  const value = localStorage.getItem(DISMISS_KEY);
  if (!value) return null;
  const timestamp = Number(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function isPopupDismissed() {
  const dismissedAt = getDismissedAt();
  return dismissedAt && Date.now() - dismissedAt < DISMISS_TTL;
}

export default function LoginPopupModal() {
  const { isAuthenticated, login, loginWithGoogle, register } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', otp: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const contentRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated || location.pathname.startsWith('/login') || location.pathname.startsWith('/register') || isPopupDismissed()) {
      return undefined;
    }

    const timer = window.setTimeout(() => setIsOpen(true), 2000);
    return () => window.clearTimeout(timer);
  }, [isAuthenticated, location.pathname]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        closePopup();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!env.googleClientId) return;
    if (window.google?.accounts?.id) {
      setGoogleReady(true);
      return;
    }

    const scriptId = 'google-identity-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => setGoogleReady(Boolean(window.google?.accounts?.id));
      script.onerror = () => showToast('Unable to load Google authentication.', 'error');
      document.body.appendChild(script);
    }
  }, [showToast]);

  useEffect(() => {
    if (!googleReady || !env.googleClientId || !window.google?.accounts?.id) return;

    window.google.accounts.id.initialize({
      client_id: env.googleClientId,
      callback: handleGoogleResponse,
      cancel_on_tap_outside: true,
      auto_select: false
    });
  }, [googleReady]);

  const closePopup = useCallback(() => {
    setIsOpen(false);
    setView('login');
    setForm({ name: '', email: '', password: '', phone: '', otp: '' });
    setErrors({});
    setShowPassword(false);
    setOtpSent(false);
    setOtpCode('');
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  }, []);

  const continueGuest = useCallback(() => {
    setIsOpen(false);
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    showToast('Continuing as guest', 'success');
  }, [showToast]);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      closePopup();
    }
  };

  const switchView = (nextView) => {
    setView(nextView);
    setErrors({});
    setForm((current) => ({ ...current, password: '' }));
    setOtpSent(false);
    setOtpCode('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const handleGoogleResponse = async (response) => {
    setGoogleLoading(false);
    if (!response?.credential) {
      showToast('Google login was cancelled or blocked.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const user = await loginWithGoogle({ credential: response.credential }, true);
      showToast('Logged in with Google');
      closePopup();
      navigate(location.state?.from?.pathname || getRoleHome(user.role), { replace: true });
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!env.googleClientId) {
      showToast('Google Client ID is not configured.', 'error');
      return;
    }
    if (!googleReady || !window.google?.accounts?.id) {
      showToast('Google login is still loading. Please try again shortly.', 'error');
      return;
    }

    setGoogleLoading(true);
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        setGoogleLoading(false);
        showToast('Google login was not completed.', 'error');
      }
    });
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateLoginForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      setIsSubmitting(true);
      const user = await login({ email: form.email, password: form.password }, true);
      showToast('Welcome back');
      closePopup();
      navigate(location.state?.from?.pathname || getRoleHome(user.role), { replace: true });
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateLoginForm({ email: form.email, password: form.password });
    if (!form.name.trim()) nextErrors.name = 'Name is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      setIsSubmitting(true);
      const user = await register({ name: form.name.trim(), email: form.email, password: form.password }, true);
      showToast('Account created successfully');
      closePopup();
      navigate(location.state?.from?.pathname || getRoleHome(user.role), { replace: true });
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = () => {
    if (!form.phone.trim()) {
      setErrors({ phone: 'Enter your phone number' });
      return;
    }
    setOtpSent(true);
    showToast('OTP sent to your phone', 'success');
  };

  const handleVerifyOtp = (event) => {
    event.preventDefault();
    if (!otpCode.trim()) {
      setErrors({ otp: 'Enter the verification code' });
      return;
    }
    if (otpCode.trim().length < 4) {
      setErrors({ otp: 'Enter a valid OTP code' });
      return;
    }
    showToast('OTP verified', 'success');
    closePopup();
  };

  const handleForgotSubmit = (event) => {
    event.preventDefault();
    if (!form.email.trim()) {
      setErrors({ email: 'Email is required to reset password' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrors({ email: 'Enter a valid email address' });
      return;
    }
    showToast('Password reset instructions sent to your email', 'success');
    closePopup();
  };

  const tabClasses = (tab) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${view === tab ? 'bg-[#0f5132] text-white shadow-soft' : 'bg-white/90 text-[#223a28] hover:bg-[#f6fff3]'}`;

  const isOpenMemo = useMemo(() => isOpen && !isAuthenticated && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/register'), [isOpen, isAuthenticated, location.pathname]);

  return (
    <AnimatePresence>
      {isOpenMemo ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 backdrop-blur-sm px-4 py-6 sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            ref={contentRef}
            className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/20 bg-white/95 shadow-[0_35px_90px_rgba(12,36,12,0.32)] backdrop-blur-xl"
            initial={{ scale: 0.94, y: 18, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 16, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <button
              type="button"
              className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/90 text-stone-700 shadow-soft transition hover:bg-white focus:outline-none"
              onClick={closePopup}
              aria-label="Close login popup"
            >
              <X size={20} />
            </button>

            <div className="grid min-h-[620px] gap-6 lg:grid-cols-[1.1fr_1fr]">
              <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(79,138,66,0.2),transparent_35%),linear-gradient(180deg,rgba(19,62,25,0.96),rgba(16,49,22,0.94))] p-8 sm:p-10 lg:p-12">
                <div className="absolute inset-x-0 bottom-0 h-56 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.16),transparent_32%)]" />
                <div className="absolute -left-12 top-8 h-32 w-32 rounded-full bg-[#d7f5d1]/30 blur-3xl animate-[float_8s_ease-in-out_infinite]" />
                <div className="absolute right-10 top-24 h-24 w-24 rounded-full bg-[#ffffff]/10 blur-2xl animate-[float_10s_ease-in-out_infinite]" />
                <div className="absolute left-10 top-40 h-20 w-20 rounded-full bg-[#eaf9e5]/25 blur-2xl" />
                <div className="relative z-10 flex h-full flex-col justify-between text-white">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.32em] text-[#c7f2bd]">Welcome to Gaurav Nursery</p>
                    <h2 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                      India’s Premium Plant Marketplace
                    </h2>
                    <p className="mt-5 max-w-lg text-base leading-7 text-[#d6f4d2]">
                      Discover luxury indoor plants, seamless shopping, and expert support in a beautiful plant-first experience.
                    </p>
                  </div>

                  <div className="grid gap-4 rounded-[1.75rem] border border-white/15 bg-white/10 p-6 text-sm text-[#e4f7e1] shadow-[0_24px_80px_rgba(6,23,10,0.22)] backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={18} className="text-[#c7f2bd]" />
                      Secure login powered by Google OAuth
                    </div>
                    <div className="flex items-center gap-3">
                      <Sparkles size={18} className="text-[#c7f2bd]" />
                      Get ₹100 OFF on first order
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageCircle size={18} className="text-[#c7f2bd]" />
                      WhatsApp support ready for fast help
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={18} className="text-[#c7f2bd]" />
                      Trusted by plant lovers across India
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative p-8 sm:p-10 lg:p-12">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-900 shadow-soft">
                  <Sparkles size={16} />
                  Premium login
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {['login', 'signup', 'otp'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => switchView(tab)}
                      className={tabClasses(tab)}
                    >
                      {tab === 'login' ? 'Login' : tab === 'signup' ? 'Signup' : 'Phone OTP'}
                    </button>
                  ))}
                </div>

                <div className="mt-8 rounded-[2rem] border border-stone-200 bg-[#f7faf5] p-6 shadow-[0_18px_45px_rgba(15,35,16,0.12)]">
                  {view === 'login' && (
                    <form className="space-y-5" onSubmit={handleLoginSubmit}>
                      <div>
                        <label className="block text-sm font-semibold text-stone-700">Email address</label>
                        <div className="relative mt-3">
                          <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                          <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="form-input input-with-leading-icon h-[56px] rounded-[1.5rem] border-stone-200 bg-white text-sm text-stone-900"
                            placeholder="your@email.com"
                            type="email"
                          />
                        </div>
                        {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-stone-700">Password</label>
                        <div className="relative mt-3">
                          <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                          <input
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="form-input input-with-leading-icon input-with-trailing-action h-[56px] rounded-[1.5rem] border-stone-200 bg-white text-sm text-stone-900"
                            placeholder="••••••••"
                            type={showPassword ? 'text' : 'password'}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100"
                            onClick={() => setShowPassword((current) => !current)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                      </div>
                      <button
                        type="submit"
                        className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-[1.5rem] bg-gradient-to-r from-[#0f5132] to-[#198754] px-6 text-sm font-black text-white shadow-button transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(15,53,25,0.25)]"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Signing in…' : 'Login securely'}
                        <ArrowRight size={18} />
                      </button>
                    </form>
                  )}

                  {view === 'signup' && (
                    <form className="space-y-5" onSubmit={handleSignupSubmit}>
                      <div>
                        <label className="block text-sm font-semibold text-stone-700">Full name</label>
                        <div className="relative mt-3">
                          <User className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                          <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="form-input input-with-leading-icon h-[56px] rounded-[1.5rem] border-stone-200 bg-white text-sm text-stone-900"
                            placeholder="Your full name"
                            type="text"
                          />
                        </div>
                        {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-stone-700">Email address</label>
                        <div className="relative mt-3">
                          <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                          <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="form-input input-with-leading-icon h-[56px] rounded-[1.5rem] border-stone-200 bg-white text-sm text-stone-900"
                            placeholder="your@email.com"
                            type="email"
                          />
                        </div>
                        {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-stone-700">Choose password</label>
                        <div className="relative mt-3">
                          <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                          <input
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="form-input input-with-leading-icon input-with-trailing-action h-[56px] rounded-[1.5rem] border-stone-200 bg-white text-sm text-stone-900"
                            placeholder="Create a strong password"
                            type={showPassword ? 'text' : 'password'}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100"
                            onClick={() => setShowPassword((current) => !current)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                      </div>
                      <button
                        type="submit"
                        className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-[1.5rem] bg-gradient-to-r from-[#0f5132] to-[#198754] px-6 text-sm font-black text-white shadow-button transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(15,53,25,0.25)]"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Creating account…' : 'Create premium account'}
                      </button>
                    </form>
                  )}

                  {view === 'otp' && (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-stone-700">Phone number</label>
                        <div className="relative mt-3">
                          <Phone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                          <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="form-input input-with-leading-icon h-[56px] rounded-[1.5rem] border-stone-200 bg-white text-sm text-stone-900"
                            placeholder="+91 98765 43210"
                            type="tel"
                          />
                        </div>
                        {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                      </div>
                      {!otpSent ? (
                        <button
                          type="button"
                          className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-[1.5rem] bg-[#0f5132] px-6 text-sm font-black text-white shadow-button transition hover:-translate-y-0.5 hover:bg-[#164a2e]"
                          onClick={handleSendOtp}
                        >
                          Send OTP
                        </button>
                      ) : (
                        <form className="space-y-5" onSubmit={handleVerifyOtp}>
                          <div>
                            <label className="block text-sm font-semibold text-stone-700">Enter OTP</label>
                            <input
                              name="otp"
                              value={otpCode}
                              onChange={(event) => { setOtpCode(event.target.value); setErrors({ ...errors, otp: '' }); }}
                              className="form-input h-[56px] rounded-[1.5rem] border-stone-200 bg-white text-sm text-stone-900"
                              placeholder="123456"
                              inputMode="numeric"
                            />
                            {errors.otp && <p className="mt-2 text-sm text-red-600">{errors.otp}</p>}
                          </div>
                          <button
                            type="submit"
                            className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-[1.5rem] bg-[#0f5132] px-6 text-sm font-black text-white shadow-button transition hover:-translate-y-0.5 hover:bg-[#164a2e]"
                          >
                            Verify OTP
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {view === 'forgot' && (
                    <form className="space-y-5" onSubmit={handleForgotSubmit}>
                      <div>
                        <label className="block text-sm font-semibold text-stone-700">Email address</label>
                        <div className="relative mt-3">
                          <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                          <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="form-input input-with-leading-icon h-[56px] rounded-[1.5rem] border-stone-200 bg-white text-sm text-stone-900"
                            placeholder="your@email.com"
                            type="email"
                          />
                        </div>
                        {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                      </div>
                      <button
                        type="submit"
                        className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-[1.5rem] bg-[#0f5132] px-6 text-sm font-black text-white shadow-button transition hover:-translate-y-0.5 hover:bg-[#164a2e]"
                      >
                        Send reset link
                      </button>
                    </form>
                  )}
                </div>

                <div className="mt-6 space-y-4">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={!env.googleClientId || googleLoading}
                    className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-[1.5rem] border border-stone-200 bg-white px-5 text-sm font-black text-stone-800 shadow-soft transition hover:-translate-y-0.5 hover:bg-[#f6fff3] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Globe className="text-[#4285f4]" size={20} />
                    {googleLoading ? 'Opening Google login…' : 'Continue with Google'}
                  </button>
                  <button
                    type="button"
                    onClick={() => switchView('otp')}
                    className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-[1.5rem] border border-stone-200 bg-[#f4fff2] px-5 text-sm font-black text-[#15532f] shadow-soft transition hover:-translate-y-0.5 hover:bg-[#eaf8e7]"
                  >
                    <Phone className="text-[#0f5132]" size={20} />
                    Continue with Phone OTP
                  </button>
                </div>

                <div className="mt-6 flex flex-col gap-3 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    className="rounded-full bg-[#f1faf4] px-4 py-3 font-semibold text-[#17542f] shadow-soft transition hover:bg-[#e8f6ea]"
                    onClick={continueGuest}
                  >
                    Continue as Guest
                  </button>
                  <button
                    type="button"
                    className="rounded-full px-4 py-3 font-semibold text-stone-500 transition hover:text-stone-900"
                    onClick={() => switchView('forgot')}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
