import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useAuth } from '../../hooks/useAuth.js';
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
    <section className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-black text-leaf-900">Login</h1>
      <form className="mt-6 space-y-4 rounded-lg bg-white p-6 shadow-soft" onSubmit={handleSubmit}>
        {authError && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{authError}</p>}
        <div>
          <input
            className="w-full rounded-lg border border-leaf-100 px-4 py-3 outline-none focus:border-leaf-600"
            name="email"
            onChange={handleChange}
            placeholder="Email"
            type="email"
            value={values.email}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
        <div>
          <input
            className="w-full rounded-lg border border-leaf-100 px-4 py-3 outline-none focus:border-leaf-600"
            name="password"
            onChange={handleChange}
            placeholder="Password"
            type="password"
            value={values.password}
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>
        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? <Spinner label="Logging in" /> : 'Login'}
        </Button>
        <p className="text-center text-sm text-stone-600">
          New to Gaurav Nursery?{' '}
          <Link className="font-bold text-leaf-700" to="/register">
            Create account
          </Link>
        </p>
      </form>
    </section>
  );
}
