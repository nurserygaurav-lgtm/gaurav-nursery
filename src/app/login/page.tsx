'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Sprout, 
  Lock, 
  Mail, 
  AlertCircle, 
  ArrowRight, 
  Eye, 
  EyeOff 
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/'
  const errorParam = searchParams.get('error')
  const requiredRoleParam = searchParams.get('requiredRole')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (errorParam === 'forbidden') {
      setErrorMessage(
        requiredRoleParam
          ? `Access Denied: Your account does not have the required ${requiredRoleParam} role for that portal.`
          : 'Access Denied: You do not have permission to view that resource.'
      )
    }
  }, [errorParam, requiredRoleParam])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Invalid email or password')
      }

      // Notify Navbar and other components of auth state change
      window.dispatchEvent(new Event('auth-change'))

      // Determine redirect path
      if (redirectPath && redirectPath !== '/') {
        router.push(redirectPath)
      } else {
        // Default redirect based on user role
        switch (data.user.role) {
          case 'SUPER_ADMIN':
            router.push('/admin')
            break
          case 'SELLER':
            router.push('/seller/dashboard')
            break
          case 'DELIVERY_PARTNER':
            router.push('/delivery')
            break
          default:
            router.push('/shop')
            break
        }
      }
      router.refresh()
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-700 to-green-500 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-700/20">
          <Sprout className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Sign In to Gaurav Nursery
        </h1>
        <p className="text-xs text-slate-500">
          Enter your credentials to access your marketplace account or portal
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Email Address
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

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Password
            </label>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md shadow-emerald-700/10"
        >
          {loading ? (
            <span>Verifying credentials...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Links */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
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
