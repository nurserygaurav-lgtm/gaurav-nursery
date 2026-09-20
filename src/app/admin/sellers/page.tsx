'use client'

import { useState, useEffect } from 'react'
import { 
  Store, 
  ShieldCheck, 
  Check, 
  X, 
  AlertCircle, 
  Building2, 
  FileText, 
  CreditCard,
  MapPin,
  Clock,
  ExternalLink,
  Eye,
  EyeOff,
  Ban,
  RotateCcw
} from 'lucide-react'
import { maskAccountNumber, maskPanNumber, maskGstNumber } from '@/lib/masking'

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchSellers()
  }, [])

  const fetchSellers = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/sellers')
      const data = await res.json()
      if (data.sellers) {
        setSellers(data.sellers)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (sellerId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      setActionLoading(sellerId)
      setMessage(null)
      const res = await fetch('/api/admin/sellers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId, action }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update seller')
      }

      setMessage({ type: 'success', text: data.message })
      fetchSellers() // Refresh list
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Seller KYC Approval Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit partner nursery applications, verify PAN/GST and bank details before enabling marketplace access.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 mt-3">Loading nursery applications...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sellers.map((seller) => {
            const isPending = seller.status === 'KYC_PENDING'
            let photos: string[] = []
            if (Array.isArray(seller.nurseryPhotos)) {
              photos = seller.nurseryPhotos
            } else if (typeof seller.nurseryPhotos === 'string') {
              try {
                photos = JSON.parse(seller.nurseryPhotos)
              } catch {
                photos = [seller.nurseryPhotos].filter(Boolean)
              }
            }

            const sellerName = seller.user?.name || seller.name || seller.businessName || 'Verified Partner'
            const sellerEmail = seller.user?.email || seller.email || 'Verified Seller'
            const sellerPhone = seller.user?.phone || seller.phone || 'Contact on file'

            return (
              <div
                key={seller.id}
                className={`bg-white rounded-2xl border transition shadow-sm overflow-hidden ${
                  isPending ? 'border-amber-300 ring-2 ring-amber-400/20' : 'border-slate-200'
                }`}
              >
                {/* Header Strip */}
                <div className="bg-slate-50 px-6 py-3.5 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{seller.businessName}</h3>
                      <span className="text-[11px] text-slate-400">
                        Proprietor: {sellerName} ({sellerEmail} • {sellerPhone})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 ${
                        seller.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          : seller.status === 'KYC_PENDING'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                          : seller.status === 'SUSPENDED'
                          ? 'bg-slate-200 text-slate-800 border border-slate-300'
                          : 'bg-red-100 text-red-900 border border-red-200'
                      }`}
                    >
                      {seller.status === 'KYC_PENDING' ? (
                        <>
                          <Clock className="w-3 h-3 text-amber-700" />
                          <span>Awaiting Admin Audit</span>
                        </>
                      ) : seller.status === 'SUSPENDED' ? (
                        <>
                          <Ban className="w-3 h-3 text-red-600" />
                          <span>Status: SUSPENDED</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3 h-3 text-emerald-700" />
                          <span>Status: {seller.status}</span>
                        </>
                      )}
                    </span>

                    {/* Admin Action Buttons */}
                    {isPending && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStatusUpdate(seller.id, 'APPROVE')}
                          disabled={actionLoading === seller.id}
                          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1 transition shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve Nursery</span>
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(seller.id, 'REJECT')}
                          disabled={actionLoading === seller.id}
                          className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}

                    {seller.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleStatusUpdate(seller.id, 'SUSPEND')}
                        disabled={actionLoading === seller.id}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                      >
                        <Ban className="w-3.5 h-3.5 text-amber-700" />
                        <span>Suspend</span>
                      </button>
                    )}

                    {seller.status === 'SUSPENDED' && (
                      <button
                        onClick={() => handleStatusUpdate(seller.id, 'REACTIVATE')}
                        disabled={actionLoading === seller.id}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition shadow-sm"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reactivate Nursery</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
                  
                  {/* Nursery Address */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1 font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> Nursery Location
                    </div>
                    <p className="font-semibold text-slate-900">{seller.nurseryAddress}</p>
                    <p>{seller.city}, {seller.state} — {seller.pincode}</p>
                  </div>

                  {/* Tax & Legal Documents */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1 font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                      <FileText className="w-3.5 h-3.5 text-slate-400" /> KYC & Legal Credentials
                    </div>
                    <p>PAN Card: <strong className="font-mono text-slate-900">{maskPanNumber(seller.panNumber)}</strong></p>
                    <p>GSTIN: <strong className="font-mono text-slate-900">{seller.gstNumber ? maskGstNumber(seller.gstNumber) : 'Exempt / None'}</strong></p>
                    <p>Commission Contract: <strong className="text-emerald-700 font-bold">10% Platform Fee</strong></p>
                  </div>

                  {/* Bank Account for Payouts */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1 font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Bank Payout Account
                    </div>
                    <p>Bank: <strong className="text-slate-900">{seller.bankName || 'Pending'}</strong></p>
                    <p>A/C: <strong className="font-mono text-slate-900">{maskAccountNumber(seller.accountNumber)}</strong></p>
                    <p>IFSC: <strong className="font-mono text-slate-900">{seller.ifscCode || 'Pending'}</strong></p>
                    {seller.upiId && <p>UPI: <span className="font-mono text-slate-700">{seller.upiId}</span></p>}
                  </div>

                </div>

                {/* Photos Preview */}
                {photos.length > 0 && (
                  <div className="px-6 pb-5 pt-1 border-t border-slate-100 flex items-center gap-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Nursery Photos:</span>
                    <div className="flex gap-2">
                      {photos.map((url: string, i: number) => (
                        <a key={i} href={url} target="_blank" rel="noreferrer" className="relative group">
                          <img src={url} alt="" className="w-14 h-14 rounded-lg object-cover border group-hover:opacity-80" />
                          <ExternalLink className="w-3 h-3 text-white absolute bottom-1 right-1 opacity-0 group-hover:opacity-100" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
