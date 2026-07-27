'use client';

import { FormEvent, useState } from 'react';

const apiUrl = `${(process.env.NEXT_PUBLIC_LEGACY_API_URL || 'https://gaurav-nursery.onrender.com').replace(/\/$/, '')}/api`;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setMessage('');
    try {
      const response = await fetch(`${apiUrl}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await response.json();
      if (!response.ok || !data?.token) throw new Error(data?.message || 'Unable to log in');
      window.localStorage.setItem('gaurav_nursery_token', data.token);
      window.localStorage.setItem('gaurav_nursery_user', JSON.stringify(data.user));
      const roleHome = data.user?.role === 'admin' ? '/admin' : data.user?.role === 'seller' ? '/seller' : '/';
      window.location.assign(roleHome);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to log in'); }
    finally { setLoading(false); }
  }

  return <main className="auth-page"><a className="logo" href="/"><b>✦</b><span>Gaurav Nursery<small>Trusted Plant Studio</small></span></a><section className="auth-card"><p className="eyebrow">WELCOME BACK</p><h1>Login to your account</h1><p>Manage orders, wishlist, saved addresses, and plant purchases.</p><form onSubmit={submit}><label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Enter your password" /></label>{message && <p className="auth-message">{message}</p>}<button className="button" disabled={loading}>{loading ? 'Logging in…' : 'Login securely'}</button></form><p className="auth-footer">New customer? <a href="/register">Create an account</a></p></section></main>;
}
