'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Sprout, 
  Lock, 
  Mail, 
  User,
  Phone,
  AlertCircle, 
  CheckCircle2,
  ArrowRight, 
  Eye, 
  EyeOff,
  ShoppingBag
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/'
  const errorParam = searchParams.get('error')
  const requiredRoleParam = searchParams.get('requiredRole')
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin'

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.get('mode') === 'signup') {
      setMode('signup')
    }
  }, [searchParams])

  useEffect(() => {
    if (errorParam === 'forbidden') {
      setErrorMessage(
        requiredRoleParam
          ? `Access Denied: Your account does not have the required ${requiredRoleParam} role for that portal.`
          : 'Access Denied: You do not have permission to view that resource.'
      )
    }
  }, [errorParam, requiredRoleParam])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      if (mode === 'signup') {
        // Customer Registration
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim() || undefined,
            password,
            role: 'CUSTOMER',
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Registration failed')
        }

        setSuccessMessage('Account created successfully! Redirecting...')
        window.dispatchEvent(new Event('auth-change'))

        setTimeout(() => {
          if (redirectPath && redirectPath !== '/') {
            router.push(redirectPath)
          } else {
            router.push('/shop')
          }
          router.refresh()
        }, 800)

      } else {
        // Sign In
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), password }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Invalid email or password')
        }

        window.dispatchEvent(new Event('auth-change'))

        const rawRole = (data.user?.role || '').toUpperCase()
        let targetPortal = '/shop'
        if (rawRole === 'SUPER_ADMIN' || rawRole === 'ADMIN') {
          targetPortal = '/admin'
        } else if (rawRole === 'SELLER') {
          targetPortal = '/seller/dashboard'
        } else if (rawRole === 'DELIVERY_PARTNER') {
          targetPortal = '/delivery'
        }

        const destination = (redirectPath && redirectPath !== '/') ? redirectPath : targetPortal
        window.location.href = destination
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please check your details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-700 to-green-500 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-700/20">
          <Sprout className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {mode === 'signup' ? 'Create Customer Account' : 'Sign In to Gaurav Nursery'}
        </h1>
        <p className="text-xs text-slate-500">
          {mode === 'signup' 
            ? 'Sign up to order fresh nursery plants with doorstep delivery' 
            : 'Enter your credentials to access your marketplace account or portal'}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl">
        <button
          type="button"
          onClick={() => { setMode('signin'); setErrorMessage(null); setSuccessMessage(null); }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            mode === 'signin'
              ? 'bg-white text-emerald-950 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => { setMode('signup'); setErrorMessage(null); setSuccessMessage(null); }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            mode === 'signup'
              ? 'bg-white text-emerald-950 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          New Customer? Sign Up
        </button>
      </div>

      {/* Redirect Notice (e.g. checkout prompt) */}
      {redirectPath && redirectPath.includes('checkout') && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span>Sign in or create an account to complete your plant order.</span>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <div className="flex-1 font-semibold">{successMessage}</div>
        </div>
      )}

      {/* Auth Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Name input (only for Sign Up) */}
        {mode === 'signup' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Gaurav Sharma"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Email Address *
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        {/* Phone (only for Sign Up) */}
        {mode === 'signup' && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Mobile Number
              </label>
              <span className="text-[10px] text-slate-400">For transit delivery updates</span>
            </div>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>
        )}

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {mode === 'signup' ? 'Create Password *' : 'Password *'}
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md shadow-emerald-700/10"
        >
          {loading ? (
            <span>{mode === 'signup' ? 'Creating account...' : 'Verifying credentials...'}</span>
          ) : (
            <>
              <span>{mode === 'signup' ? 'Create Customer Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Mode toggle helper text */}
      <div className="text-center text-xs text-slate-500">
        {mode === 'signin' ? (
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMessage(null); setSuccessMessage(null); }}
              className="text-emerald-700 font-bold hover:underline ml-1"
            >
              Sign Up as Customer
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMessage(null); setSuccessMessage(null); }}
              className="text-emerald-700 font-bold hover:underline ml-1"
            >
              Sign In
            </button>
          </p>
        )}
      </div>

      {/* Nursery Owner link */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <span>Are you a nursery owner?</span>
        <Link
          href="/seller/register"
          className="text-emerald-700 font-bold hover:underline"
        >
          Become a Seller
        </Link>
      </div>

    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Suspense fallback={
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-12 text-center">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-400 mt-4">Loading secure portal...</p>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}
