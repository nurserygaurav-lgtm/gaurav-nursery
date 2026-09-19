import { prisma } from '@/lib/prisma'
import { DollarSign, ShieldCheck, ArrowDownRight, CheckCircle2, Clock, Download } from 'lucide-react'

export default async function AdminCommissionLedgerPage() {
  const ledgers = await prisma.commissionLedger.findMany({
    include: {
      seller: true,
      subOrder: {
        include: {
          order: true,
          items: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const totalOrderAmount = ledgers.reduce((sum, l) => sum + l.orderAmount, 0)
  const totalCommission = ledgers.reduce((sum, l) => sum + l.platformFee, 0)
  const totalSellerGross = ledgers.reduce((sum, l) => sum + l.sellerGross, 0)
  const totalSellerPayable = ledgers.reduce((sum, l) => sum + l.sellerPayable, 0)

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Title & Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Immutable Financial Audit Trail</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            10% Platform Commission Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Order-by-order breakdown of gross amount, platform commission (10%), seller gross, refunds, and net payable.
          </p>
        </div>

        <a
          href="/api/admin/reports/export?type=commission"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-sm shadow-emerald-700/20 transition"
          download
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Ledger CSV</span>
        </a>
      </div>

      {/* Ledger Totals Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Orders Volume</span>
          <div className="text-2xl font-black text-slate-900">₹{totalOrderAmount.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-400">Total gross value transacted</span>
        </div>

        <div className="bg-emerald-950 text-white p-5 rounded-2xl border border-emerald-900 shadow-md space-y-1">
          <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">10% Platform Revenue</span>
          <div className="text-2xl font-black text-emerald-400">₹{totalCommission.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-emerald-200/80">Retained platform commission</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Seller Gross (90%)</span>
          <div className="text-2xl font-black text-blue-900">₹{totalSellerGross.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-400">Gross credited to seller profiles</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Net Seller Payable</span>
          <div className="text-2xl font-black text-emerald-700">₹{totalSellerPayable.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-400">Payable after refunds/settlements</span>
        </div>
      </div>

      {/* Immutable Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Financial Audit Records</h3>
          <span className="text-xs text-slate-400 font-mono">{ledgers.length} Sub-Order Ledgers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-5">Sub-Order #</th>
                <th className="py-3 px-5">Nursery Partner</th>
                <th className="py-3 px-5 text-right">Order Amount</th>
                <th className="py-3 px-5 text-right bg-emerald-50 text-emerald-900">Platform Fee (10%)</th>
                <th className="py-3 px-5 text-right">Seller Gross</th>
                <th className="py-3 px-5 text-right">Refund</th>
                <th className="py-3 px-5 text-right font-black">Seller Payable</th>
                <th className="py-3 px-5">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {ledgers.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/80">
                  <td className="py-4 px-5 font-mono font-bold text-slate-900">
                    {l.subOrder.subOrderNumber}
                  </td>
                  <td className="py-4 px-5">
                    <span className="font-bold text-slate-800 block">{l.seller.businessName}</span>
                    <span className="text-[10px] text-slate-400">{l.seller.city}, {l.seller.bankName}</span>
                  </td>
                  <td className="py-4 px-5 text-right font-bold text-slate-900">
                    ₹{l.orderAmount.toFixed(2)}
                  </td>
                  <td className="py-4 px-5 text-right font-mono font-black text-emerald-700 bg-emerald-50/50">
                    ₹{l.platformFee.toFixed(2)}
                  </td>
                  <td className="py-4 px-5 text-right font-bold text-blue-900">
                    ₹{l.sellerGross.toFixed(2)}
                  </td>
                  <td className="py-4 px-5 text-right text-slate-400">
                    ₹{l.refundAmount.toFixed(2)}
                  </td>
                  <td className="py-4 px-5 text-right font-black text-slate-950">
                    ₹{l.sellerPayable.toFixed(2)}
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        l.settlementStatus === 'SETTLED'
                          ? 'bg-emerald-100 text-emerald-900'
                          : l.settlementStatus === 'ELIGIBLE_FOR_PAYOUT'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {l.settlementStatus === 'SETTLED' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      ) : (
                        <Clock className="w-3 h-3 text-slate-500" />
                      )}
                      <span>{l.settlementStatus}</span>
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
