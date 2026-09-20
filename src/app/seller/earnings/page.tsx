'use client'

import { useState, useEffect } from 'react'
import { 
  DollarSign, 
  Wallet, 
  CreditCard, 
  ArrowDownRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ShieldCheck 
} from 'lucide-react'

export default function SellerEarningsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [payoutLoading, setPayoutLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchEarnings()
  }, [])

  const fetchEarnings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/seller/payouts')
      const json = await res.json()
      setData(json)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestPayout = async () => {
    try {
      setPayoutLoading(true)
      setMessage(null)
      const res = await fetch('/api/seller/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: data?.stats?.availableForPayout || 500,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to request payout')

      setMessage('Payout request of ₹' + (data?.stats?.availableForPayout || 500) + ' submitted to Admin!')
      fetchEarnings()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setPayoutLoading(false)
    }
  }

  if (loading || !data) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 mt-3">Loading financial ledger...</p>
      </div>
    )
  }

  const stats = data?.stats || {
    totalGross: 0,
    totalCommission: 0,
    totalNetPayable: 0,
    availableForPayout: 0,
    alreadySettled: 0,
  }
  const seller = data?.seller || {}
  const ledgers = data?.ledgers || []
  const payouts = data?.payouts || []

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Earnings & 10% Commission Ledger
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Transparent accounting statement with automatic 10% platform fee deduction and bank settlement history.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{message}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Nursery Sales</span>
          <div className="text-2xl font-black text-slate-900">₹{stats.totalGross}</div>
          <span className="text-[10px] text-slate-400">Total customer orders gross value</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">10% Platform Fee</span>
          <div className="text-2xl font-black text-amber-800">-₹{stats.totalCommission}</div>
          <span className="text-[10px] text-slate-400">Platform operational & transit fee</span>
        </div>

        <div className="bg-emerald-950 text-white p-5 rounded-2xl border border-emerald-900 shadow-md space-y-1">
          <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">Total Net Earnings (90%)</span>
          <div className="text-2xl font-black text-emerald-400">₹{stats.totalNetPayable}</div>
          <span className="text-[10px] text-emerald-200/80">Total credited to your nursery</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Available for Payout</span>
            <div className="text-2xl font-black text-emerald-900">₹{stats.availableForPayout}</div>
          </div>

          <button
            onClick={handleRequestPayout}
            disabled={payoutLoading || stats.availableForPayout <= 0}
            className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-2 rounded-xl text-xs transition"
          >
            {payoutLoading ? 'Submitting...' : 'Request Payout'}
          </button>
        </div>
      </div>

      {/* Bank Account on File */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Registered Payout Bank Account</h4>
            <p className="text-slate-500 font-mono mt-0.5">
              {seller.bankName} • A/C: {seller.accountNumber} • IFSC: {seller.ifscCode}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-lg border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified for Direct Bank Transfers</span>
        </span>
      </div>

      {/* Sub-Orders Financial Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Ledger Statement per Order</h3>
          <span className="text-xs text-slate-400 font-mono">{ledgers.length} Transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-6">Order Sub-Total</th>
                <th className="py-3 px-6 text-right">Gross Amount</th>
                <th className="py-3 px-6 text-right text-amber-800">10% Platform Commission</th>
                <th className="py-3 px-6 text-right font-black text-emerald-900">Your Net Payable</th>
                <th className="py-3 px-6">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {ledgers.map((l: any) => (
                <tr key={l.id} className="hover:bg-slate-50">
                  <td className="py-4 px-6 font-mono text-slate-900">
                    Order Ledger #{l.id.slice(-8)}
                  </td>
                  <td className="py-4 px-6 text-right font-bold">
                    ₹{l.orderAmount.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-amber-800">
                    -₹{l.platformFee.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-right font-black text-emerald-900">
                    ₹{l.sellerPayable.toFixed(2)}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        l.settlementStatus === 'SETTLED'
                          ? 'bg-emerald-100 text-emerald-900'
                          : l.settlementStatus === 'ELIGIBLE_FOR_PAYOUT'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {l.settlementStatus}
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
