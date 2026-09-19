import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import SignOutButton from '@/components/SignOutButton'
import { 
  Store, 
  LayoutDashboard, 
  Sprout, 
  PlusCircle, 
  PackageCheck, 
  DollarSign, 
  ArrowLeft, 
  ShieldCheck,
  UserCheck
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = headers()
  const pathname = headersList.get('x-pathname') || ''

  // Allow public seller registration without requiring pre-existing seller session
  if (pathname === '/seller/register') {
    return <>{children}</>
  }

  const user = await getCurrentUser()

  if (!user || (user.role !== 'SELLER' && user.role !== 'SUPER_ADMIN')) {
    redirect('/login?redirect=/seller/dashboard')
  }

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-800">
      
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-950 text-emerald-100 flex flex-col border-r border-emerald-900 flex-shrink-0">
        
        {/* Brand */}
        <div className="p-5 border-b border-emerald-900 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-800 border border-emerald-700 text-emerald-300 flex items-center justify-center font-bold">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-white text-sm tracking-tight leading-tight">
              SELLER PORTAL
            </h2>
            <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
              Nursery Partner Hub
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 text-xs font-medium">
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-emerald-400/60 tracking-wider">
            Nursery Controls
          </div>

          <Link
            href="/seller/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-900 text-emerald-100 hover:text-white transition"
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/seller/products"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-900 text-emerald-100 hover:text-white transition"
          >
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>My Plant Catalog</span>
          </Link>

          <Link
            href="/seller/products/new"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-white font-semibold transition border border-emerald-800/80"
          >
            <PlusCircle className="w-4 h-4 text-emerald-300" />
            <span>Add New Plant</span>
          </Link>

          <Link
            href="/seller/orders"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-900 text-emerald-100 hover:text-white transition"
          >
            <PackageCheck className="w-4 h-4 text-emerald-400" />
            <span>Nursery Orders</span>
          </Link>

          <div className="pt-4 px-3 py-1.5 text-[10px] uppercase font-bold text-emerald-400/60 tracking-wider">
            Financials
          </div>

          <Link
            href="/seller/earnings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-900 text-emerald-100 hover:text-white transition"
          >
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span>Earnings & 10% Fee</span>
          </Link>

          <Link
            href="/seller/register"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-900 text-emerald-100 hover:text-white transition"
          >
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span>KYC & Bank Settings</span>
          </Link>
        </nav>

        {/* Footer & Switcher */}
        <div className="p-4 border-t border-emerald-900 space-y-2">
          <div className="bg-emerald-900/60 rounded-xl p-2.5 text-[11px] text-emerald-300 space-y-1">
            <span className="text-white font-semibold block truncate">{user.name}</span>
            <span className="block truncate text-emerald-400/80">{user.email}</span>
            <div className="pt-1">
              <SignOutButton />
            </div>
          </div>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 py-2 rounded-xl text-xs font-semibold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Marketplace</span>
          </Link>
        </div>
      </aside>

      {/* Main Seller Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
              VERIFIED NURSERY SELLER
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">Platform Commission: 10% on Gross Sales</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/seller/products/new"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>List New Plant</span>
            </Link>
          </div>
        </header>

        <main className="p-8 flex-1">
          {children}
        </main>
      </div>

    </div>
  )
}
