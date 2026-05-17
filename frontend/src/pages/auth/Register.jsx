import { ArrowRight, BadgeCheck, Eye, EyeOff, Facebook, Headphones, Leaf, Lock, Mail, Phone, ShieldCheck, Sparkles, Store, Truck, Undo2, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';
import { useToast } from '../../hooks/useToast.js';
import { getRoleHome } from '../../utils/auth.js';
import { validateRegisterForm } from '../../utils/formValidation.js';

const initialValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  role: 'customer',
  shopName: '',
  businessAddress: ''
};

export default function Register() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, authError } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  usePageMeta({
    title: 'Register',
    description: 'Create a Gaurav Nursery account for shopping plants, managing wishlist, orders, and seller access.'
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateRegisterForm(values);
    if (values.password !== values.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    try {
      setIsSubmitting(true);
      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        role: values.role,
        shopName: values.role === 'seller' ? values.shopName : undefined,
        businessAddress: values.role === 'seller' ? values.businessAddress : undefined
      };
      const user = await register(payload);
      showToast('Account created successfully');
      navigate(getRoleHome(user.role), { replace: true });
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="premium-container py-10 sm:py-14">
        <div className="mx-auto grid max-w-6xl items-stretch overflow-hidden rounded-[1.75rem] border border-white/80 bg-white shadow-[0_28px_80px_rgba(24,51,23,0.16)] lg:min-h-[760px] lg:grid-cols-2">
          <div className="flex min-w-0 flex-col justify-center p-6 sm:p-10 lg:p-12">
            <div className="mb-8 inline-flex w-fit max-w-full rounded-full bg-leaf-50 p-1 shadow-inner">
              <Link className="rounded-full px-6 py-2.5 text-sm font-black text-leaf-900 transition hover:bg-white" to="/login">Login</Link>
              <Link className="rounded-full bg-leaf-900 px-6 py-2.5 text-sm font-black text-white shadow-soft" to="/register">Register</Link>
            </div>

            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-leaf-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-leaf-700">
                <Leaf size={14} />
                Gaurav Nursery
              </p>
              <h1 className="mt-5 text-3xl font-black tracking-tight text-leaf-950 sm:text-4xl">Create account</h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-stone-600">
                Register to continue shopping, manage your cart, and track your nursery orders.
              </p>
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              {authError && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{authError}</p>}
              <Field error={errors.name} icon={UserRound}>
                <input className="form-input input-with-leading-icon h-[52px] rounded-2xl border-leaf-100 bg-leaf-50/50 text-sm" name="name" onChange={handleChange} placeholder="Full name" value={values.name} />
              </Field>
              <Field error={errors.email} icon={Mail}>
                <input className="form-input input-with-leading-icon h-[52px] rounded-2xl border-leaf-100 bg-leaf-50/50 text-sm" name="email" onChange={handleChange} placeholder="Email address" type="email" value={values.email} />
              </Field>
              <Field error={errors.phone} icon={Phone}>
                <input className="form-input input-with-leading-icon h-[52px] rounded-2xl border-leaf-100 bg-leaf-50/50 text-sm" name="phone" onChange={handleChange} placeholder="Phone" value={values.phone} />
              </Field>
              <PasswordField
                error={errors.password}
                name="password"
                onChange={handleChange}
                placeholder="Password"
                showPassword={showPassword}
                toggle={() => setShowPassword((current) => !current)}
                value={values.password}
              />
              <PasswordField
                error={errors.confirmPassword}
                name="confirmPassword"
                onChange={handleChange}
                placeholder="Confirm Password"
                showPassword={showConfirmPassword}
                toggle={() => setShowConfirmPassword((current) => !current)}
                value={values.confirmPassword}
              />
              <Field error={errors.role}>
                <select className="form-input h-[52px] rounded-2xl border-leaf-100 bg-leaf-50/50 text-sm font-semibold text-stone-700" name="role" onChange={handleChange} value={values.role}>
                  <option value="customer">Customer</option>
                  <option value="seller">Seller</option>
                </select>
              </Field>
              {values.role === 'seller' && (
                <>
                  <Field error={errors.shopName} icon={Store}>
                    <input className="form-input input-with-leading-icon h-[52px] rounded-2xl border-leaf-100 bg-leaf-50/50 text-sm" name="shopName" onChange={handleChange} placeholder="Shop name" value={values.shopName} />
                  </Field>
                  <textarea className="form-input min-h-24 rounded-2xl border-leaf-100 bg-leaf-50/50 text-sm" name="businessAddress" onChange={handleChange} placeholder="Business address" value={values.businessAddress} />
                </>
              )}

              <Button className="h-[52px] w-full bg-gradient-to-r from-leaf-700 to-leaf-500 shadow-[0_18px_36px_rgba(61,125,54,0.28)] hover:from-leaf-800 hover:to-leaf-600" disabled={isSubmitting} type="submit">
                {isSubmitting ? <Spinner label="Creating account" /> : <>Register <ArrowRight className="ml-2" size={18} /></>}
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
                Already shopping with us? <Link className="font-black text-leaf-700 hover:text-leaf-950" to="/login">Login now</Link>
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

function Field({ children, error, icon: Icon }) {
  return (
    <div>
      <label className="relative block">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-leaf-500" size={18} />}
        {children}
      </label>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function PasswordField({ error, name, onChange, placeholder, showPassword, toggle, value }) {
  return (
    <Field error={error} icon={Lock}>
      <input
        className="form-input input-with-leading-icon input-with-trailing-action h-[52px] rounded-2xl border-leaf-100 bg-leaf-50/50 text-sm"
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        type={showPassword ? 'text' : 'password'}
        value={value}
      />
      <button
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-stone-500 transition hover:bg-white hover:text-leaf-800"
        onClick={toggle}
        type="button"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </Field>
  );
}

const trustBadges = [
  { title: 'Free Delivery', text: 'On orders above ₹499', icon: Truck },
  { title: 'Secure Payment', text: 'Protected checkout', icon: ShieldCheck },
  { title: 'Easy Returns', text: 'Simple support', icon: Undo2 },
  { title: 'Best Quality', text: 'Nursery fresh plants', icon: BadgeCheck },
  { title: '24/7 Support', text: 'Always here to help', icon: Headphones }
];
