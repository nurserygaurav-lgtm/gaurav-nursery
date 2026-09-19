'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

interface SignOutButtonProps {
  className?: string
  text?: string
}

export default function SignOutButton({ className, text = 'Sign Out' }: SignOutButtonProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.dispatchEvent(new Event('auth-change'))
      router.push('/login')
      router.refresh()
    } catch (e) {
      console.error('Logout error:', e)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className={className || 'flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-medium transition'}
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>{text}</span>
    </button>
  )
}
