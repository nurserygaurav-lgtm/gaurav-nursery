import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  TrendingUp, 
  DollarSign, 
  Store, 
  Sprout, 
  Package, 
  Clock, 
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Download
} from 'lucide-react'

export default async function AdminDashboardPage() {
  const [
    ordersCount,
    activeSellersCount,
    pendingSellersCount,
    totalProductsCount,
    pendingProductsCount,
    allOrders,
    commissionLedgers,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.sellerProfile.count({ where: { status: 'ACTIVE' } }),
    prisma.sellerProfile.count({ where: { status: 'KYC_PENDING' } }),
    prisma.product.count(),
    prisma.product.count({ where: { status: 'PENDING_REVIEW' } }),
    prisma.order.findMany({ select: { totalGrossAmount: true, totalPlatformFee: true, totalSellerNet: true } }),
    prisma.commissionLedger.findMany(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        subOrders: {
          include: {
            seller: true,
            items: true,
          },
        },
      },
    }),
  ])

  const totalGrossSales = allOrders.reduce((sum, o) => sum + o.totalGrossAmount, 0)
  const totalPlatformCommission = allOrders.reduce((sum, o) => sum + o.totalPlatformFee, 0)
  const totalSellerNet = allOrders.reduce((sum, o) => sum + o.totalSellerNet, 0)

  const pendingPayoutsAmount = commissionLedgers
    .filter((l) => l.settlementStatus === 'ELIGIBLE_FOR_PAYOUT')
    .reduce((sum, l) => sum + l.sellerPayable, 0)

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Title & Action Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Marketplace Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time financial telemetry, seller onboarding pipeline, and 10% commission vault.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/admin/reports/export?type=orders"
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-sm transition"
            download
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export Orders CSV</span>
          </a>

          {pendingSellersCount > 0 && (
            <Link
              href="/admin/sellers"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-sm transition"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{pendingSellersCount} Seller KYC Pending</span>
            </Link>
          )}

          {pendingProductsCount > 0 && (
            <Link
              href="/admin/products"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-sm transition"
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>{pendingProductsCount} Product Review Pending</span>
            </Link>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Gross Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Platform Sales</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">₹{totalGrossSales.toLocaleString('en-IN')}</div>
            <span className="text-[11px] text-slate-400">Total customer orders gross value</span>
          </div>
        </div>

        {/* 10% Platform Commission Vault */}
        <div className="bg-emerald-950 text-white p-5 rounded-2xl border border-emerald-900 shadow-md space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">10% Platform Commission</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-emerald-300 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-400">₹{totalPlatformCommission.toLocaleString('en-IN')}</div>
            <span className="text-[11px] text-emerald-200/80">Net platform revenue generated</span>
          </div>
        </div>

        {/* Active Nurseries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Nurseries</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{activeSellersCount} Active</div>
            <span className="text-[11px] text-amber-600 font-semibold">{pendingSellersCount} waiting for KYC review</span>
          </div>
        </div>

        {/* Pending Seller Payouts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Eligible Payouts</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">₹{pendingPayoutsAmount.toLocaleString('en-IN')}</div>
            <span className="text-[11px] text-slate-400">Available for seller bank transfers</span>
          </div>
        </div>

      </div>

      {/* Action Shortcut Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1 max-w-sm">
            <h3 className="font-bold text-base text-white">Seller KYC Approval Pipeline</h3>
            <p className="text-xs text-slate-400">
              Audit nursery photo proofs, PAN/GST documents, and bank details before authorizing listings.
            </p>
          </div>
          <Link
            href="/admin/sellers"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 transition flex-shrink-0"
          >
            <span>Review Sellers</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1 max-w-sm">
            <h3 className="font-bold text-base text-white">10% Immutable Commission Ledger</h3>
            <p className="text-xs text-emerald-200/80">
              Inspect order-by-order sub-order splits, platform fee deductions, and seller payable calculations.
            </p>
          </div>
          <Link
            href="/admin/commission"
            className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 transition flex-shrink-0"
          >
            <span>Inspect Ledger</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Recent Marketplace Orders</h3>
            <p className="text-xs text-slate-500">Live multi-vendor transactions and status</p>
          </div>
          <Link href="/admin/commission" className="text-xs font-semibold text-emerald-700 hover:underline">
            View All in Ledger →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-6">Order Number</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Nurseries Involved</th>
                <th className="py-3 px-6">Gross Amount</th>
                <th className="py-3 px-6">10% Platform Fee</th>
                <th className="py-3 px-6">Seller Net (90%)</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80">
                  <td className="py-4 px-6 font-mono font-bold text-slate-900">
                    {order.orderNumber}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-800 block">{order.customerName}</span>
                    <span className="text-[11px] text-slate-400">{order.shippingCity}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {order.subOrders.map((sub) => (
                        <span key={sub.id} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200">
                          {sub.seller.businessName}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    ₹{order.totalGrossAmount}
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-emerald-700 bg-emerald-50/50">
                    ₹{order.totalPlatformFee}
                  </td>
                  <td className="py-4 px-6 font-bold text-blue-900">
                    ₹{order.totalSellerNet}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      {order.masterStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
