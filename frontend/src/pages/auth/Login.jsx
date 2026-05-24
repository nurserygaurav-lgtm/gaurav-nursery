import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Facebook, Leaf, Lock, Mail, ShieldCheck, Sparkles, Truck, Undo2, BadgeCheck, Headphones, Phone } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';
import { useToast } from '../../hooks/useToast.js';
import { getRoleHome } from '../../utils/auth.js';
import { validateLoginForm } from '../../utils/formValidation.js';
import env from '../../config/env.js';

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

  return (
    <section className="auth-page">
      <div className="premium-container py-8 sm:py-12 lg:py-14">
        <div className="mx-auto grid min-h-[720px] overflow-hidden rounded-[2rem] bg-white/95 shadow-card lg:grid-cols-[1.1fr_0.95fr]">
          <div className="relative hidden overflow-hidden rounded-l-[2rem] bg-[#0d2f17] text-white lg:block">
            <img
              className="absolute inset-0 h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80"
              alt="Luxury indoor plant and garden design with sculptural pots"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(22,73,35,0.75),transparent_45%)]" />
            <div className="absolute -left-12 top-12 h-40 w-40 rounded-full bg-[#d7f5d1]/30 blur-3xl login-hero-glow" />
            <div className="absolute right-12 top-28 h-28 w-28 rounded-full bg-[#ffffff]/10 blur-2xl login-leaf-float" />
            <div className="absolute left-16 bottom-24 h-24 w-24 rounded-full bg-[#def2d0]/20 blur-3xl login-leaf-float" />
            <div className="relative z-10 flex h-full flex-col justify-between p-10">
              <div className="max-w-xl">
                <p className="text-sm font-black uppercase tracking-[0.32em] text-[#d9ffd8]">Premium Nursery</p>
                <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
                  Welcome Back to Gaurav Nursery
                </h1>
                <p className="mt-5 max-w-lg text-base leading-8 text-[#eafeef]">
                  India’s premium plant marketplace for curated indoor gardens, luxury pots, and effortless plant care.
                </p>
              </div>
              <div className="grid gap-3 rounded-[1.75rem] border border-white/15 bg-white/10 p-6 shadow-[0_24px_80px_rgba(5,24,10,0.28)] backdrop-blur-xl">
                <div className="inline-flex items-center gap-3 rounded-full bg-[#ffffff]/10 px-4 py-3 text-sm font-semibold text-white">
                  <ShieldCheck size={18} />
                  Trusted by plant lovers across India
                </div>
                <div className="grid gap-2 text-sm text-[#d4f5d6]">
                  <span>• 100% live plant guarantee</span>
                  <span>• Fast eco packaging & delivery</span>
                  <span>• Luxury indoor styling advice</span>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            className="relative flex items-center justify-center p-6 sm:p-10"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
          >
            <div className="glass-panel w-full max-w-xl rounded-[2rem] border border-white/20 p-8 shadow-card login-card-hover login-card-fade-in">
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
                <Link className="font-black text-white transition hover:text-[#d1ffd4]" to="/register">
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
                    India’s Premium Plant Marketplace
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
                      className="form-input input-with-leading-icon h-[54px] rounded-[1.5rem] border-[#cde5cf] bg-white text-sm text-[#1c3b24] shadow-sm"
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
                      className="form-input input-with-leading-icon input-with-trailing-action h-[54px] rounded-[1.5rem] border-[#cde5cf] bg-white text-sm text-[#1c3b24] shadow-sm"
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
                  className="h-[54px] w-full rounded-[1.5rem] bg-gradient-to-r from-[#0f5132] to-[#198754] text-white shadow-button hover:from-[#164a2e] hover:to-[#1f6b43]"
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
                        <span className="text-lg font-black text-[#4285f4]">G</span>
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

                <div className="rounded-[1.75rem] border border-white/15 bg-[#f4fff2]/80 p-4 text-sm text-[#244023] shadow-soft">
                  <p className="font-semibold">Secure login powered by Google OAuth</p>
                  <p className="mt-1 text-sm text-[#3d7d4e]">Popup friendly, device-safe, and built for fast checkout across mobile and desktop.</p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const trustBadges = [
  { title: 'Free Delivery', text: 'On orders above ₹499', icon: Truck },
  { title: 'Secure Payment', text: 'Protected checkout', icon: ShieldCheck },
  { title: 'Easy Returns', text: 'Simple support', icon: Undo2 },
  { title: 'Best Quality', text: 'Nursery fresh plants', icon: BadgeCheck },
  { title: '24/7 Support', text: 'Always here to help', icon: Headphones }
];
