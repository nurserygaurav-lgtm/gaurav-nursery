import { ArrowRight, Lock, Mail } from 'lucide-react';
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
    <section className="premium-container py-10">
      <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-card lg:grid-cols-[0.95fr_1.05fr]">
        <div className="p-6 sm:p-10">
          <div className="mb-7 inline-flex rounded-full bg-leaf-50 p-1">
            <Link className="rounded-full bg-leaf-900 px-6 py-2 text-sm font-black text-white shadow-soft" to="/login">Login</Link>
            <Link className="rounded-full px-6 py-2 text-sm font-black text-leaf-900 transition hover:bg-white" to="/register">Register</Link>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-leaf-950">Welcome back</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">Login to continue shopping, manage your cart, and track nursery orders.</p>

          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            {authError && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{authError}</p>}
            <div>
              <label className="relative block">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                  className="form-input h-12 pl-11"
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
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                  className="form-input h-12 pl-11"
                  name="password"
                  onChange={handleChange}
                  placeholder="Password"
                  type="password"
                  value={values.password}
                />
              </label>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
            <div className="flex justify-end">
              <Link className="text-sm font-bold text-leaf-700 hover:text-leaf-900" to="/contact">Forgot Password?</Link>
            </div>
            <Button className="h-12 w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? <Spinner label="Logging in" /> : <>Login <ArrowRight className="ml-2" size={18} /></>}
            </Button>
          </form>
        </div>

        <div className="relative min-h-[360px] bg-gradient-to-br from-leaf-900 via-leaf-700 to-leaf-500 p-8 text-white lg:min-h-full">
          <img
            className="absolute inset-0 h-full w-full object-cover opacity-45"
            src="https://images.unsplash.com/photo-1525498128493-380d1990a112?auto=format&fit=crop&w=1100&q=85"
            alt="Premium indoor plants"
            loading="lazy"
            decoding="async"
          />
          <div className="relative z-10 flex h-full min-h-[300px] flex-col justify-end">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-leaf-100">Gaurav Nursery</p>
            <h2 className="mt-3 max-w-md text-4xl font-black tracking-tight">Grow a greener home with every order.</h2>
          </div>
        </div>
      </div>
    </section>
  );
}
