import { ArrowRight, BadgeCheck, CheckCircle2, Eye, EyeOff, Globe, Headphones, Leaf, Lock, Mail, Phone, ShieldCheck, Sparkles, Sprout, Truck, Undo2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from '../../components/brand/BrandLogo.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import env from '../../config/env.js';
import { useAuth } from '../../hooks/useAuth.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';
import { useToast } from '../../hooks/useToast.js';
import { getRoleHome } from '../../utils/auth.js';
import { validateLoginForm } from '../../utils/formValidation.js';

export default function Login() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');
  const { login, loginWithGoogle, authError } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  usePageMeta({
    title: 'Login',
    description: 'Login to your Gaurav Nursery account to manage cart, wishlist, orders, and checkout.'
  });

  useEffect(() => {
    if (!env.googleClientId) return;
    if (window.google?.accounts?.id) {
      setGoogleReady(true);
      return;
    }

    const scriptId = 'google-identity-script';
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => setGoogleReady(true);
      script.onerror = () => setGoogleError('Unable to load Google authentication.');
      document.body.appendChild(script);
    } else if (window.google?.accounts?.id) {
      setGoogleReady(true);
    }
  }, []);

  const handleGoogleResponse = useCallback(
    async (response) => {
      if (!response?.credential) {
        setGoogleLoading(false);
        showToast('Google login was cancelled or blocked.', 'error');
        return;
      }

      try {
        const user = await loginWithGoogle({ credential: response.credential }, rememberMe);
        showToast('Logged in with Google');
        navigate(location.state?.from?.pathname || getRoleHome(user.role), { replace: true });
      } catch (error) {
        showToast(error.message, 'error');
      } finally {
        setGoogleLoading(false);
      }
    },
    [loginWithGoogle, rememberMe, navigate, location.state, showToast]
  );

  useEffect(() => {
    if (!googleReady || !env.googleClientId || !window.google?.accounts?.id) return;

    window.google.accounts.id.initialize({
      client_id: env.googleClientId,
      callback: handleGoogleResponse,
      cancel_on_tap_outside: true,
      auto_select: false
    });
  }, [googleReady, handleGoogleResponse]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateLoginForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    try {
      setIsSubmitting(true);
      const user = await login(values, rememberMe);
      showToast('Welcome back');
      navigate(location.state?.from?.pathname || getRoleHome(user.role), { replace: true });
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleGoogleLogin() {
    if (!env.googleClientId) {
      showToast('Google Client ID is not configured.', 'error');
      return;
    }

    if (!googleReady) {
      showToast('Google login is still loading. Please try again in a moment.', 'error');
      return;
    }

    setGoogleLoading(true);
    setGoogleError('');

    try {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setGoogleLoading(false);
          setGoogleError('Google sign-in was cancelled or blocked.');
          showToast('Google login was not completed.', 'error');
        }
      });
    } catch (error) {
      setGoogleLoading(false);
      setGoogleError('Unable to start Google login.');
      showToast('Unable to open Google login. Please allow popups.', 'error');
    }
  }

  function handleContinueAsGuest() {
    navigate(location.state?.from?.pathname || '/', { replace: true });
  }

  return (
    <section className="auth-page relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(155,201,145,0.22),transparent_28%),radial-gradient(circle_at_90%_20%,rgba(15,81,50,0.08),transparent_20%),linear-gradient(180deg,#f6fbf3_0%,#eef8e9_100%)]" />
      <div className="premium-container relative py-8 sm:py-12 lg:py-14">
        <div className="mx-auto grid min-h-[760px] overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/90 shadow-[0_30px_90px_rgba(14,42,20,0.16)] lg:grid-cols-[1.05fr_0.95fr]">
          <aside className="relative hidden overflow-hidden bg-[#081a0c] text-white lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(183,242,187,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%),linear-gradient(145deg,#06150b,#0c2a13_55%,#12381d)]" />
            <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-[#b7f2bb]/12 blur-3xl" />
            <div className="absolute right-0 top-24 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute left-10 bottom-16 h-32 w-32 rounded-full bg-[#d7f5d1]/10 blur-3xl" />
            <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-12">
              <div className="max-w-xl">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.3em] text-[#d9ffd8] backdrop-blur">
                  <Sprout size={14} />
                  Premium Nursery
                </p>
                <h1 className="mt-6 max-w-[12ch] text-[clamp(2.8rem,4.8vw,5.8rem)] font-black leading-[0.92] tracking-tight text-white">
                  Welcome back to Gaurav Nursery
                </h1>
                <p className="mt-5 max-w-lg text-[clamp(1rem,1.15vw,1.15rem)] leading-8 text-[#eafeef]">
                  India&apos;s premium plant marketplace for curated indoor gardens, luxury pots, and effortless plant care.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-4 rounded-[2rem] border border-white/12 bg-white/8 p-5 shadow-[0_24px_80px_rgba(5,24,10,0.28)] backdrop-blur-xl sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/12 bg-black/10 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-[#b7f2bb]">Live store</p>
                    <p className="mt-3 text-2xl font-black text-white">Fresh stock daily</p>
                    <p className="mt-2 text-sm leading-6 text-[#d4f5d6]">Plants, seeds, pots, and care essentials from verified nurseries.</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/12 bg-black/10 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-[#b7f2bb]">Support</p>
                    <p className="mt-3 text-2xl font-black text-white">Fast help</p>
                    <p className="mt-2 text-sm leading-6 text-[#d4f5d6]">WhatsApp support, secure checkout, and live order tracking.</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { label: 'Live plants', value: '1K+' },
                    { label: 'Cities served', value: '50+' },
                    { label: 'Seller rating', value: '4.9/5' }
                  ].map((item) => (
                    <div key={item.label} className="rounded-[1.35rem] border border-white/12 bg-white/8 px-4 py-3 backdrop-blur">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b7f2bb]">{item.label}</p>
                      <p className="mt-2 text-2xl font-black text-white">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 rounded-[2rem] border border-white/12 bg-white/8 p-5 backdrop-blur-xl sm:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-[1.5rem] bg-[#f5fff2] p-4 text-[#12381d]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b3d1e] text-white shadow-soft">
                        <BrandLogo compact />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#4caf50]">Trusted checkout</p>
                        <p className="mt-1 text-lg font-black">Secure login journey</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-stone-600">Premium flow for customer, seller, and admin access without the clutter.</p>
                  </div>

                  <div className="grid gap-3">
                    {[
                      { icon: CheckCircle2, text: 'Live plant guarantee' },
                      { icon: ShieldCheck, text: 'Protected checkout' },
                      { icon: Truck, text: 'Pan India delivery' }
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-3 rounded-[1.25rem] border border-white/12 bg-black/10 px-4 py-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/12 text-[#b7f2bb]">
                          <item.icon size={18} />
                        </span>
                        <p className="text-sm font-semibold text-[#e8f8e4]">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <motion.div
            className="relative flex items-center justify-center p-4 sm:p-8 lg:p-10"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
          >
            <button
              type="button"
              onClick={handleContinueAsGuest}
              className="absolute right-4 top-4 z-20 rounded-full border border-white/20 bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#0f5132] shadow-soft backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:bg-[#edf9eb] md:right-5 md:top-5"
            >
              Continue as guest
            </button>

            <div className="glass-panel w-full max-w-xl rounded-[2rem] border border-white/20 p-5 shadow-card login-card-hover login-card-fade-in sm:p-7 lg:p-8">
              <div className="mb-6 rounded-[1.75rem] bg-[#f4fff2]/80 p-5 text-[#14532d] shadow-soft lg:hidden">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#14532d]">Luxury plant welcome</p>
                <h2 className="mt-4 text-2xl font-black tracking-tight">Premium plant shopping, now simpler</h2>
                <p className="mt-3 text-sm leading-6 text-[#2f5132]">Login securely and continue your garden experience with curated indoor plants and fast delivery.</p>
              </div>

              <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex w-fit items-center gap-3 rounded-full bg-[#f4fff2]/80 px-4 py-2 text-sm font-black text-[#0f5132] shadow-soft">
                  <Leaf size={16} />
                  Login
                </div>
                <Link className="font-black text-[#fff] transition hover:text-[#d1ffd4]" to="/register">
                  Create account
                </Link>
              </div>

              <div className="space-y-4">
                <p className="inline-flex items-center gap-2 rounded-full bg-[#e4f7e5]/80 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#14532d]">
                  <Leaf size={14} />
                  Gaurav Nursery
                </p>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                    India&apos;s Premium Plant Marketplace
                  </h1>
                  <p className="mt-4 max-w-lg text-sm leading-7 text-[#d9f5d4]">
                    Secure your plant journey with fast login, premium support, and a luxury shopping experience built for plant lovers.
                  </p>
                </div>
              </div>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                {(authError || googleError) && (
                  <p className="rounded-3xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {authError || googleError}
                  </p>
                )}

                <div>
                  <label className="relative block">
                    <span className="sr-only">Email address</span>
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7eac70]" size={18} />
                    <input
                      className="form-input input-with-leading-icon h-[56px] rounded-[1.5rem] border-[#cde5cf] bg-[#f8fbf8] text-sm text-[#1c3b24] shadow-sm placeholder:text-stone-400"
                      name="email"
                      onChange={handleChange}
                      placeholder="Email address"
                      type="email"
                      value={values.email}
                    />
                  </label>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="relative block">
                    <span className="sr-only">Password</span>
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7eac70]" size={18} />
                    <input
                      className="form-input input-with-leading-icon input-with-trailing-action h-[56px] rounded-[1.5rem] border-[#cde5cf] bg-[#f8fbf8] text-sm text-[#1c3b24] shadow-sm placeholder:text-stone-400"
                      name="password"
                      onChange={handleChange}
                      placeholder="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                    />
                    <button
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-stone-500 transition hover:bg-white hover:text-[#14532d]"
                      onClick={() => setShowPassword((current) => !current)}
                      type="button"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </label>
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <label className="inline-flex w-fit items-center gap-2 font-semibold text-[#d9f5d4]">
                    <input
                      checked={rememberMe}
                      className="h-4 w-4 rounded border-[#b3dbb7] text-leaf-700 focus:ring-leaf-600"
                      onChange={(event) => setRememberMe(event.target.checked)}
                      type="checkbox"
                    />
                    Remember me
                  </label>
                  <Link className="font-black text-white transition hover:text-[#d1ffd4]" to="/contact">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  className="h-[56px] w-full rounded-[1.5rem] bg-gradient-to-r from-[#0f5132] via-[#156c3d] to-[#1f9a57] text-white shadow-button hover:from-[#164a2e] hover:to-[#14804b]"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? <Spinner label="Logging in" /> : <>Login <ArrowRight className="ml-2" size={18} /></>}
                </Button>

                <div className="flex items-center gap-3 py-2">
                  <span className="h-px flex-1 bg-white/15" />
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#d6f8d6]">or continue with</span>
                  <span className="h-px flex-1 bg-white/15" />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white px-4 text-sm font-black text-[#1a3f2b] shadow-soft transition hover:-translate-y-0.5 hover:border-[#e4f9e1] hover:bg-[#f6fff3] disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={!env.googleClientId || !googleReady || googleLoading}
                    onClick={handleGoogleLogin}
                    type="button"
                  >
                    {googleLoading ? (
                      <Spinner label="Signing in" />
                    ) : (
                      <>
                        <Globe className="text-[#4285f4]" size={18} />
                        Continue with Google
                      </>
                    )}
                  </button>
                  <button
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white px-4 text-sm font-black text-[#1a3f2b] shadow-soft transition hover:-translate-y-0.5 hover:border-[#e4f9e1] hover:bg-[#f6fff3]"
                    onClick={() => showToast('Phone OTP login will be available soon')}
                    type="button"
                  >
                    <Phone className="text-[#0f5132]" size={18} />
                    Continue with Phone OTP
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleContinueAsGuest}
                  className="mt-4 w-full rounded-2xl border border-white/20 bg-[#f4fff2] px-4 py-3 text-sm font-black text-[#14532d] shadow-soft transition hover:-translate-y-0.5 hover:border-[#d6f8d6] hover:bg-[#eaf9e4]"
                >
                  Continue as guest
                </button>

                <div className="rounded-[1.75rem] border border-white/15 bg-[#f4fff2]/80 p-4 text-sm text-[#244023] shadow-soft">
                  <div className="flex flex-wrap items-center gap-2">
                    <ShieldCheck size={16} className="text-[#0f5132]" />
                    <p className="font-semibold">Secure login powered by Google OAuth</p>
                  </div>
                  <p className="mt-1 text-sm text-[#3d7d4e]">Popup friendly, device-safe, and built for fast checkout across mobile and desktop.</p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>

        <div className="mx-auto mt-8 grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {trustBadges.map((badge) => (
            <div key={badge.title} className="flex min-h-24 items-center gap-3 rounded-2xl border border-white/80 bg-white px-4 py-4 shadow-soft">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-800">
                <badge.icon size={21} />
              </span>
              <span>
                <span className="block text-sm font-black text-leaf-950">{badge.title}</span>
                <span className="mt-0.5 block text-xs font-semibold text-stone-500">{badge.text}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const trustBadges = [
  { title: 'Free Delivery', text: 'On orders above Rs. 499', icon: Truck },
  { title: 'Secure Payment', text: 'Protected checkout', icon: ShieldCheck },
  { title: 'Easy Returns', text: 'Simple support', icon: Undo2 },
  { title: 'Best Quality', text: 'Nursery fresh plants', icon: BadgeCheck },
  { title: '24/7 Support', text: 'Always here to help', icon: Headphones }
];
