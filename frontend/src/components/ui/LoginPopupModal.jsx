import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Eye, EyeOff, Globe, Leaf, Lock, Mail, MessageCircle, ShieldCheck, Sparkles, User, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import env from '../../config/env.js';
import { brandContact } from '../../data/brandContent.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { getRoleHome } from '../../utils/auth.js';
import { validateLoginForm } from '../../utils/formValidation.js';
import {
  safeLocalStorageGet,
  safeLocalStorageSet
} from '../../utils/storage.js';

const DISMISS_KEY = 'gn_login_modal_dismissed_at';
const DISMISS_TTL = 24 * 60 * 60 * 1000;

function getDismissedAt() {
  const value = safeLocalStorageGet(DISMISS_KEY);
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
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const closePopup = useCallback(() => {
    setIsOpen(false);
    setView('login');
    setForm({ name: '', email: '', password: '' });
    setErrors({});
    setShowPassword(false);
    safeLocalStorageSet(DISMISS_KEY, String(Date.now()));
  }, []);

  const continueGuest = useCallback(() => {
    setIsOpen(false);
    safeLocalStorageSet(DISMISS_KEY, String(Date.now()));
    showToast('Continuing as guest', 'success');
  }, [showToast]);

  const handleGoogleResponse = useCallback(
    async (response) => {
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
        navigate(location.state?.from?.pathname || getRoleHome(user?.role), { replace: true });
      } catch (error) {
        showToast(error.message, 'error');
      } finally {
        setIsSubmitting(false);
      }
    },
    [closePopup, location.state?.from?.pathname, loginWithGoogle, navigate, showToast]
  );

  const handleGoogleLogin = useCallback(() => {
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
  }, [googleReady, showToast]);

  const handleOverlayClick = useCallback(
    (event) => {
      if (event.target === event.currentTarget) closePopup();
    },
    [closePopup]
  );

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }, []);

  const handleLoginSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const nextErrors = validateLoginForm(form);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length) return;

      try {
        setIsSubmitting(true);
        const user = await login({ email: form.email, password: form.password }, true);
        showToast('Welcome back');
        closePopup();
        navigate(location.state?.from?.pathname || getRoleHome(user?.role), { replace: true });
      } catch (error) {
        showToast(error.message, 'error');
      } finally {
        setIsSubmitting(false);
      }
    },
    [closePopup, form, login, location.state?.from?.pathname, navigate, showToast]
  );

  const handleSignupSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const nextErrors = validateLoginForm(form);
      if (!form.name.trim()) nextErrors.name = 'Name is required';
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length) return;

      try {
        setIsSubmitting(true);
        const user = await register({ name: form.name.trim(), email: form.email, password: form.password }, true);
        showToast('Account created successfully');
        closePopup();
        navigate(location.state?.from?.pathname || getRoleHome(user?.role), { replace: true });
      } catch (error) {
        showToast(error.message, 'error');
      } finally {
        setIsSubmitting(false);
      }
    },
    [closePopup, form, location.state?.from?.pathname, navigate, register, showToast]
  );

  const switchView = useCallback((nextView) => {
    setView(nextView);
    setErrors({});
    setForm((current) => ({ ...current, password: '' }));
  }, []);

  useEffect(() => {
    if (isAuthenticated || location.pathname.startsWith('/login') || location.pathname.startsWith('/register') || isPopupDismissed()) return undefined;
    const timer = window.setTimeout(() => setIsOpen(true), 1800);
    return () => window.clearTimeout(timer);
  }, [isAuthenticated, location.pathname]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) closePopup();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closePopup]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
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
  }, [googleReady, handleGoogleResponse]);

  const isOpenMemo = useMemo(() => isOpen && !isAuthenticated && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/register'), [isOpen, isAuthenticated, location.pathname]);

  return (
    <AnimatePresence>
      {isOpenMemo ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/55 px-3 py-4 backdrop-blur-[10px] sm:px-5 sm:py-6 lg:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.24, ease: 'easeInOut' } }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className="relative mx-auto flex w-[min(1100px,94vw)] max-h-[92vh] flex-col overflow-hidden rounded-[clamp(1.25rem,2vw,2rem)] border border-white/20 bg-white/95 shadow-[0_30px_80px_rgba(12,36,12,0.28)] backdrop-blur-xl"
            initial={{ scale: 0.96, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0, transition: { duration: 0.24, ease: 'easeInOut' } }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <button
              type="button"
              className="absolute right-3 top-3 z-40 inline-flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/30 bg-white/85 p-2 text-emerald-800 shadow-lg backdrop-blur-md transition hover:scale-110 hover:bg-green-50 hover:text-emerald-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 sm:right-4 sm:top-4 sm:h-11 sm:w-11"
              onClick={closePopup}
              aria-label="Close login popup"
            >
              <X size={18} strokeWidth={3} />
            </button>

            <div className="grid min-h-0 flex-1 overflow-hidden md:grid-cols-[40%_60%] lg:grid-cols-[45%_55%] xl:grid-cols-[48%_52%]">
              <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(79,138,66,0.12),transparent_35%),linear-gradient(180deg,rgba(19,62,25,0.96),rgba(16,49,22,0.92))] px-5 py-6 sm:px-7 sm:py-8 md:px-6 md:py-7 lg:px-8 lg:py-9 xl:px-10 xl:py-10 max-md:border-b max-md:border-white/10">
                <div className="absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.16),transparent_32%)]" />
                <div className="absolute -left-10 top-8 h-20 w-20 rounded-full bg-[#d7f5d1]/24 blur-xl md:h-24 md:w-24 md:-left-12 md:blur-2xl animate-[float_8s_ease-in-out_infinite] max-lg:opacity-70" />
                <div className="absolute right-6 top-20 h-16 w-16 rounded-full bg-[#ffffff]/10 blur-xl md:right-8 md:top-20 md:h-20 md:w-20 md:blur-2xl animate-[float_10s_ease-in-out_infinite] max-lg:opacity-70" />
                <div className="relative z-10 flex h-full min-h-0 flex-col justify-between gap-6 text-white">
                  <div>
                    <p className="text-[clamp(0.72rem,0.9vw,0.92rem)] font-black uppercase tracking-[0.3em] text-[#c7f2bd]">
                      Welcome to {brandContact.name}
                    </p>
                    <h2 className="mt-4 max-w-[12ch] text-[clamp(2rem,4vw,5rem)] font-black leading-[0.96] tracking-tight md:mt-5">
                      Premium plant shopping, simplified.
                    </h2>
                    <p className="mt-4 max-w-[34rem] text-[clamp(0.9rem,1.2vw,1.2rem)] leading-[1.7] text-[#d6f4d2]">
                      Log in with Google or email to track orders, save your cart, and get real plant support from our nursery team.
                    </p>
                  </div>

                  <div className="grid gap-3 rounded-[1.5rem] border border-white/15 bg-white/10 p-4 text-sm text-[#e4f7e1] shadow-[0_18px_50px_rgba(6,23,10,0.16)] backdrop-blur-lg sm:gap-4 sm:p-5 lg:p-6 max-md:hidden">
                    <div className="flex flex-wrap items-center gap-3">
                      <Leaf size={18} className="text-[#c7f2bd]" />
                      Live plant support from the nursery team
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Sparkles size={18} className="text-[#c7f2bd]" />
                      Fast checkout and guest browsing
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <MessageCircle size={18} className="text-[#c7f2bd]" />
                      WhatsApp support ready for quick help
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <CheckCircle2 size={18} className="text-[#c7f2bd]" />
                      Trusted delivery across India
                    </div>
                  </div>

                  <div className="rounded-[1.35rem] border border-white/15 bg-white/10 p-4 text-sm text-[#e4f7e1] shadow-[0_18px_50px_rgba(6,23,10,0.16)] backdrop-blur-lg md:hidden">
                    <div className="flex flex-wrap items-center gap-3">
                      <ShieldCheck size={18} className="text-[#c7f2bd]" />
                      Secure, mobile-friendly login
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7 sm:py-7 md:px-6 md:py-6 lg:px-8 lg:py-8 xl:px-10 xl:py-10">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-[0.7rem] font-black uppercase tracking-[0.24em] text-emerald-900 shadow-soft sm:px-4 sm:text-xs">
                  <Sparkles size={16} />
                  Premium login
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {['login', 'signup'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => switchView(tab)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${view === tab ? 'bg-[#0f5132] text-white shadow-soft' : 'bg-white/90 text-[#223a28] hover:bg-[#f6fff3]'}`}
                    >
                      {tab === 'login' ? 'Login' : 'Signup'}
                    </button>
                  ))}
                </div>

                <div className="mt-6 rounded-[1.5rem] border border-stone-200 bg-[#f7faf5] p-4 shadow-[0_18px_45px_rgba(15,35,16,0.12)] sm:mt-7 sm:rounded-[1.75rem] sm:p-5 lg:mt-8 lg:p-6">
                  {view === 'login' && (
                    <form className="space-y-4 lg:space-y-5" onSubmit={handleLoginSubmit}>
                      <div>
                        <label className="block text-sm font-semibold text-stone-700">Email address</label>
                        <div className="relative mt-3">
                          <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                          <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="form-input input-with-leading-icon h-[50px] rounded-[1.25rem] border-stone-200 bg-white text-sm text-stone-900 sm:h-[54px] sm:rounded-[1.5rem]"
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
                            className="form-input input-with-leading-icon input-with-trailing-action h-[50px] rounded-[1.25rem] border-stone-200 bg-white text-sm text-stone-900 sm:h-[54px] sm:rounded-[1.5rem]"
                            placeholder="Enter your password"
                            type={showPassword ? 'text' : 'password'}
                          />
                          <button type="button" className="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 sm:right-3 sm:h-11 sm:w-11" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                      </div>
                      <button type="submit" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[1.25rem] bg-gradient-to-r from-[#0f5132] to-[#198754] px-5 text-sm font-black text-white shadow-button transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(15,53,25,0.25)] sm:h-14 sm:rounded-[1.5rem] sm:px-6" disabled={isSubmitting}>
                        {isSubmitting ? 'Signing in...' : 'Login securely'}
                        <ArrowRight size={18} />
                      </button>
                    </form>
                  )}

                  {view === 'signup' && (
                    <form className="space-y-4 lg:space-y-5" onSubmit={handleSignupSubmit}>
                      <div>
                        <label className="block text-sm font-semibold text-stone-700">Full name</label>
                        <div className="relative mt-3">
                          <User className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                          <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="form-input input-with-leading-icon h-[50px] rounded-[1.25rem] border-stone-200 bg-white text-sm text-stone-900 sm:h-[54px] sm:rounded-[1.5rem]"
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
                            className="form-input input-with-leading-icon h-[50px] rounded-[1.25rem] border-stone-200 bg-white text-sm text-stone-900 sm:h-[54px] sm:rounded-[1.5rem]"
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
                            className="form-input input-with-leading-icon input-with-trailing-action h-[50px] rounded-[1.25rem] border-stone-200 bg-white text-sm text-stone-900 sm:h-[54px] sm:rounded-[1.5rem]"
                            placeholder="Create a strong password"
                            type={showPassword ? 'text' : 'password'}
                          />
                          <button type="button" className="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 sm:right-3 sm:h-11 sm:w-11" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                      </div>
                      <button type="submit" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[1.25rem] bg-gradient-to-r from-[#0f5132] to-[#198754] px-5 text-sm font-black text-white shadow-button transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(15,53,25,0.25)] sm:h-14 sm:rounded-[1.5rem] sm:px-6" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating account...' : 'Create premium account'}
                      </button>
                    </form>
                  )}
                </div>

                <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={!env.googleClientId || googleLoading}
                    className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-[1.25rem] border border-stone-200 bg-white px-4 text-sm font-black text-stone-800 shadow-soft transition hover:-translate-y-0.5 hover:bg-[#f6fff3] disabled:cursor-not-allowed disabled:opacity-70 sm:h-14 sm:rounded-[1.5rem] sm:px-5"
                  >
                    <Globe className="text-[#4285f4]" size={20} />
                    {googleLoading ? 'Opening Google login...' : 'Continue with Google'}
                  </button>
                </div>

                <div className="mt-5 flex flex-col gap-3 text-sm text-stone-600 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    className="rounded-full bg-[#f1faf4] px-4 py-2.5 font-semibold text-[#17542f] shadow-soft transition hover:bg-[#e8f6ea]"
                    onClick={continueGuest}
                  >
                    Continue as Guest
                  </button>
                  <span className="rounded-full bg-white px-4 py-2.5 font-semibold text-stone-500 shadow-soft">
                    Fast mobile-friendly access
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
