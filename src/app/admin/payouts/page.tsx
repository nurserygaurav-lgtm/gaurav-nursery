import { prisma } from '@/lib/prisma'
import { Wallet, Check, Clock, ExternalLink } from 'lucide-react'

export default async function AdminPayoutsPage() {
  const payouts = await prisma.sellerPayout.findMany({
    include: {
      seller: true,
    },
    orderBy: { requestedAt: 'desc' },
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Seller Payout Settlements
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Process approved earnings transfers to partner nursery bank accounts after 10% commission deductions.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Bank Transfer Queue</h3>
          <span className="text-xs text-slate-400 font-mono">{payouts.length} Requests</span>
        </div>

        {payouts.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No active payout requests in the queue.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/80">
                <tr>
                  <th className="py-3 px-6">Payout #</th>
                  <th className="py-3 px-6">Nursery</th>
                  <th className="py-3 px-6">Requested Amount</th>
                  <th className="py-3 px-6">Bank Account</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">{p.payoutNumber}</td>
                    <td className="py-4 px-6 font-bold text-slate-800">{p.seller.businessName}</td>
                    <td className="py-4 px-6 font-black text-emerald-800 text-sm">₹{p.amount}</td>
                    <td className="py-4 px-6 font-mono text-[11px]">
                      {p.bankName} • {p.accountNumber} ({p.ifscCode})
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {new Date(p.requestedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
