import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import SignOutButton from '@/components/SignOutButton'
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Store, 
  Sprout, 
  DollarSign, 
  Wallet, 
  ArrowLeft,
  Bell,
  Sliders,
  CheckSquare,
  Ticket,
  Image as ImageIcon
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'SUPER_ADMIN') {
    redirect('/login?redirect=/admin')
  }

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-800">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 flex-shrink-0">
        {/* Brand */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-white text-sm tracking-tight leading-tight">
              SUPER ADMIN
            </h2>
            <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">
              Control Center
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 text-xs font-medium">
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Overview & Core
          </div>

          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white transition"
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/sellers"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white transition justify-between"
          >
            <div className="flex items-center gap-3">
              <Store className="w-4 h-4 text-blue-400" />
              <span>Seller KYC Approvals</span>
            </div>
            <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
              1
            </span>
          </Link>

          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white transition justify-between"
          >
            <div className="flex items-center gap-3">
              <Sprout className="w-4 h-4 text-green-400" />
              <span>Product Moderation</span>
            </div>
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
              1
            </span>
          </Link>

          <div className="pt-4 px-3 py-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Finance & Ledger
          </div>

          <Link
            href="/admin/commission"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white transition"
          >
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span>10% Commission Ledger</span>
          </Link>

          <Link
            href="/admin/payouts"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white transition"
          >
            <Wallet className="w-4 h-4 text-purple-400" />
            <span>Seller Payouts</span>
          </Link>

          <div className="pt-4 px-3 py-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Marketing & Growth
          </div>

          <Link
            href="/admin/coupons"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white transition"
          >
            <Ticket className="w-4 h-4 text-pink-400" />
            <span>Coupons & Promos</span>
          </Link>

          <Link
            href="/admin/banners"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white transition"
          >
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            <span>Homepage Banners</span>
          </Link>
        </nav>

        {/* Footer info & Exit to Storefront */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="bg-slate-800/60 rounded-xl p-2.5 text-[11px] text-slate-400 space-y-1">
            <span className="text-slate-200 font-semibold block">{user.name || 'Admin User'}</span>
            <span className="block truncate">{user.email}</span>
            <div className="pt-1">
              <SignOutButton />
            </div>
          </div>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-xl text-xs font-semibold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Marketplace</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
              SUPER_ADMIN ROLE ACTIVE
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">Gaurav Nursery Central Control Hub</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
              <span className="font-bold text-slate-800">10% Platform Fee Engine: ONLINE</span>
            </div>
          </div>
        </header>

        <main className="p-8 flex-1">
          {children}
        </main>
      </div>

    </div>
  )
}
