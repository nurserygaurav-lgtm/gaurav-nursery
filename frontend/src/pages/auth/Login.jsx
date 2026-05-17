import { ArrowRight, Eye, EyeOff, Facebook, Leaf, Lock, Mail, ShieldCheck, Sparkles, Truck, Undo2, BadgeCheck, Headphones } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
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
  const { login, authError } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  usePageMeta({
    title: 'Login',
    description: 'Login to your Gaurav Nursery account to manage cart, wishlist, orders, and checkout.'
  });

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
      const user = await login(values);
      showToast('Welcome back');
      navigate(location.state?.from?.pathname || getRoleHome(user.role), { replace: true });
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="premium-container py-10 sm:py-14">
        <div className="mx-auto grid max-w-6xl items-stretch overflow-hidden rounded-[1.75rem] border border-white/80 bg-white shadow-[0_28px_80px_rgba(24,51,23,0.16)] lg:min-h-[680px] lg:grid-cols-2">
          <div className="flex min-w-0 flex-col justify-center p-6 sm:p-10 lg:p-12">
            <div className="mb-8 inline-flex w-fit max-w-full rounded-full bg-leaf-50 p-1 shadow-inner">
              <Link className="rounded-full bg-leaf-900 px-6 py-2.5 text-sm font-black text-white shadow-soft" to="/login">Login</Link>
              <Link className="rounded-full px-6 py-2.5 text-sm font-black text-leaf-900 transition hover:bg-white" to="/register">Register</Link>
            </div>

            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-leaf-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-leaf-700">
                <Leaf size={14} />
                Gaurav Nursery
              </p>
              <h1 className="mt-5 text-3xl font-black tracking-tight text-leaf-950 sm:text-4xl">Welcome back</h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-stone-600">
                Login to continue shopping, manage your cart, and track your nursery orders.
              </p>
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              {authError && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{authError}</p>}
              <div>
                <label className="relative block">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-leaf-500" size={18} />
                  <input
                    className="form-input input-with-leading-icon h-[52px] rounded-2xl border-leaf-100 bg-leaf-50/50 text-sm"
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
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-leaf-500" size={18} />
                  <input
                    className="form-input input-with-leading-icon input-with-trailing-action h-[52px] rounded-2xl border-leaf-100 bg-leaf-50/50 text-sm"
                    name="password"
                    onChange={handleChange}
                    placeholder="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                  />
                  <button
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-stone-500 transition hover:bg-white hover:text-leaf-800"
                    onClick={() => setShowPassword((current) => !current)}
                    type="button"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </label>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex w-fit items-center gap-2 font-semibold text-stone-600">
                  <input
                    checked={rememberMe}
                    className="h-4 w-4 rounded border-leaf-200 text-leaf-700 focus:ring-leaf-600"
                    onChange={(event) => setRememberMe(event.target.checked)}
                    type="checkbox"
                  />
                  Remember me
                </label>
                <Link className="font-black text-leaf-700 transition hover:text-leaf-950" to="/contact">Forgot Password?</Link>
              </div>

              <Button className="h-[52px] w-full bg-gradient-to-r from-leaf-700 to-leaf-500 shadow-[0_18px_36px_rgba(61,125,54,0.28)] hover:from-leaf-800 hover:to-leaf-600" disabled={isSubmitting} type="submit">
                {isSubmitting ? <Spinner label="Logging in" /> : <>Login <ArrowRight className="ml-2" size={18} /></>}
              </Button>

              <div className="flex items-center gap-3 py-1">
                <span className="h-px flex-1 bg-leaf-100" />
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">or continue with</span>
                <span className="h-px flex-1 bg-leaf-100" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-leaf-100 bg-white px-4 text-sm font-black text-stone-700 shadow-soft transition hover:-translate-y-0.5 hover:border-leaf-200 hover:bg-leaf-50" onClick={() => showToast('Google login is coming soon')} type="button">
                  <span className="text-lg font-black text-[#4285f4]">G</span>
                  Google
                </button>
                <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-leaf-100 bg-white px-4 text-sm font-black text-stone-700 shadow-soft transition hover:-translate-y-0.5 hover:border-leaf-200 hover:bg-leaf-50" onClick={() => showToast('Facebook login is coming soon')} type="button">
                  <Facebook className="text-[#1877f2]" size={18} />
                  Facebook
                </button>
              </div>

              <p className="pt-2 text-center text-sm font-semibold text-stone-600">
                New to Gaurav Nursery? <Link className="font-black text-leaf-700 hover:text-leaf-950" to="/register">Register now</Link>
              </p>
            </form>
          </div>

          <div className="relative min-h-[420px] overflow-hidden bg-leaf-950 text-white lg:min-h-full">
            <img
              className="absolute inset-0 h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80"
              alt="Large monstera and premium indoor plants in elegant pots"
              loading="eager"
              decoding="async"
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.15))'
              }}
            />
            <div className="absolute inset-x-0 bottom-0 z-10 p-7 sm:p-10 lg:p-12">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/16 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-leaf-50 backdrop-blur">
                <Sparkles size={14} />
                Premium indoor plants
              </p>
              <h2 className="mt-5 max-w-lg text-3xl font-black tracking-tight sm:text-5xl">Bring nature home and let it thrive</h2>
              <p className="mt-4 max-w-md text-base font-semibold leading-7 text-leaf-50">
                Premium quality plants delivered to your doorstep
              </p>
            </div>
          </div>
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
  { title: 'Free Delivery', text: 'On orders above ₹499', icon: Truck },
  { title: 'Secure Payment', text: 'Protected checkout', icon: ShieldCheck },
  { title: 'Easy Returns', text: 'Simple support', icon: Undo2 },
  { title: 'Best Quality', text: 'Nursery fresh plants', icon: BadgeCheck },
  { title: '24/7 Support', text: 'Always here to help', icon: Headphones }
];
