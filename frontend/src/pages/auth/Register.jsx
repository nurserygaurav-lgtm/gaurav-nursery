import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { getRoleHome } from '../../utils/auth.js';
import { validateRegisterForm } from '../../utils/formValidation.js';

const initialValues = {
  name: '',
  email: '',
  password: '',
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

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateRegisterForm(values);
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
    <section className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-black text-leaf-900">Create Account</h1>
      <form className="mt-6 space-y-4 rounded-lg bg-white p-6 shadow-soft" onSubmit={handleSubmit}>
        {authError && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{authError}</p>}
        <Field error={errors.name}>
          <input
            className="w-full rounded-lg border border-leaf-100 px-4 py-3 outline-none focus:border-leaf-600"
            name="name"
            onChange={handleChange}
            placeholder="Full name"
            value={values.name}
          />
        </Field>
        <Field error={errors.email}>
          <input
            className="w-full rounded-lg border border-leaf-100 px-4 py-3 outline-none focus:border-leaf-600"
            name="email"
            onChange={handleChange}
            placeholder="Email"
            type="email"
            value={values.email}
          />
        </Field>
        <Field error={errors.phone}>
          <input
            className="w-full rounded-lg border border-leaf-100 px-4 py-3 outline-none focus:border-leaf-600"
            name="phone"
            onChange={handleChange}
            placeholder="Phone"
            value={values.phone}
          />
        </Field>
        <Field error={errors.password}>
          <input
            className="w-full rounded-lg border border-leaf-100 px-4 py-3 outline-none focus:border-leaf-600"
            name="password"
            onChange={handleChange}
            placeholder="Password"
            type="password"
            value={values.password}
          />
        </Field>
        <Field error={errors.role}>
          <select
            className="w-full rounded-lg border border-leaf-100 px-4 py-3 outline-none focus:border-leaf-600"
            name="role"
            onChange={handleChange}
            value={values.role}
          >
          <option value="customer">Customer</option>
          <option value="seller">Seller</option>
          </select>
        </Field>
        {values.role === 'seller' && (
          <>
            <Field error={errors.shopName}>
              <input
                className="w-full rounded-lg border border-leaf-100 px-4 py-3 outline-none focus:border-leaf-600"
                name="shopName"
                onChange={handleChange}
                placeholder="Shop name"
                value={values.shopName}
              />
            </Field>
            <textarea
              className="min-h-24 w-full rounded-lg border border-leaf-100 px-4 py-3 outline-none focus:border-leaf-600"
              name="businessAddress"
              onChange={handleChange}
              placeholder="Business address"
              value={values.businessAddress}
            />
          </>
        )}
        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? <Spinner label="Creating account" /> : 'Register'}
        </Button>
        <p className="text-center text-sm text-stone-600">
          Already have an account?{' '}
          <Link className="font-bold text-leaf-700" to="/login">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
}

function Field({ children, error }) {
  return (
    <div>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
