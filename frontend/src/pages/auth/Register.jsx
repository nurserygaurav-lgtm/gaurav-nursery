import { ArrowRight, Lock, Mail, Phone, Store, UserRound } from 'lucide-react';
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
    <section className="premium-container py-10">
      <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-card lg:grid-cols-[0.95fr_1.05fr]">
        <div className="p-6 sm:p-10">
          <div className="mb-7 inline-flex rounded-full bg-leaf-50 p-1">
            <Link className="rounded-full px-6 py-2 text-sm font-black text-leaf-900 transition hover:bg-white" to="/login">Login</Link>
            <Link className="rounded-full bg-leaf-900 px-6 py-2 text-sm font-black text-white shadow-soft" to="/register">Register</Link>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-leaf-950">Create account</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">Register to save wishlist items, checkout faster, and manage your nursery orders.</p>

          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            {authError && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{authError}</p>}
            <Field error={errors.name} icon={UserRound}>
              <input className="form-input h-12 pl-11" name="name" onChange={handleChange} placeholder="Full name" value={values.name} />
            </Field>
            <Field error={errors.email} icon={Mail}>
              <input className="form-input h-12 pl-11" name="email" onChange={handleChange} placeholder="Email address" type="email" value={values.email} />
            </Field>
            <Field error={errors.phone} icon={Phone}>
              <input className="form-input h-12 pl-11" name="phone" onChange={handleChange} placeholder="Phone" value={values.phone} />
            </Field>
            <Field error={errors.password} icon={Lock}>
              <input className="form-input h-12 pl-11" name="password" onChange={handleChange} placeholder="Password" type="password" value={values.password} />
            </Field>
            <Field error={errors.confirmPassword} icon={Lock}>
              <input className="form-input h-12 pl-11" name="confirmPassword" onChange={handleChange} placeholder="Confirm Password" type="password" value={values.confirmPassword} />
            </Field>
            <Field error={errors.role}>
              <select className="form-input h-12" name="role" onChange={handleChange} value={values.role}>
                <option value="customer">Customer</option>
                <option value="seller">Seller</option>
              </select>
            </Field>
            {values.role === 'seller' && (
              <>
                <Field error={errors.shopName} icon={Store}>
                  <input className="form-input h-12 pl-11" name="shopName" onChange={handleChange} placeholder="Shop name" value={values.shopName} />
                </Field>
                <textarea className="form-input min-h-24 rounded-2xl" name="businessAddress" onChange={handleChange} placeholder="Business address" value={values.businessAddress} />
              </>
            )}
            <div className="flex justify-end">
              <Link className="text-sm font-bold text-leaf-700 hover:text-leaf-900" to="/contact">Forgot Password?</Link>
            </div>
            <Button className="h-12 w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? <Spinner label="Creating account" /> : <>Register <ArrowRight className="ml-2" size={18} /></>}
            </Button>
          </form>
        </div>

        <div className="relative min-h-[360px] bg-gradient-to-br from-leaf-900 via-leaf-700 to-leaf-500 p-8 text-white lg:min-h-full">
          <img
            className="absolute inset-0 h-full w-full object-cover opacity-45"
            src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1100&q=85"
            alt="Green nursery plants"
            loading="lazy"
            decoding="async"
          />
          <div className="relative z-10 flex h-full min-h-[300px] flex-col justify-end">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-leaf-100">Gaurav Nursery</p>
            <h2 className="mt-3 max-w-md text-4xl font-black tracking-tight">Start your plant journey with a fresh account.</h2>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ children, error, icon: Icon }) {
  return (
    <div>
      <label className="relative block">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />}
        {children}
      </label>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
