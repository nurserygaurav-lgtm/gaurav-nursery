'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Truck, 
  MapPin, 
  Store, 
  Package, 
  CheckCircle2, 
  ArrowLeft, 
  Phone, 
  Clock,
  ShieldCheck
} from 'lucide-react'

export default function DeliveryPortalPage() {
  const [deliveries, setDeliveries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchDeliveries()
  }, [])

  const fetchDeliveries = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/delivery')
      const data = await res.json()
      if (data.deliveries) {
        setDeliveries(data.deliveries)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (subOrderId: string, status: string) => {
    try {
      setUpdatingId(subOrderId)
      setMessage(null)
      const res = await fetch('/api/delivery', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subOrderId, status }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update delivery')

      setMessage(`Order status updated to: ${status}`)
      fetchDeliveries()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      
      {/* Top Header */}
      <header className="bg-slate-950 border-b border-slate-800 py-4 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-black text-lg text-white">GAURAV EXPRESS DELIVERY</h1>
              <span className="text-xs text-purple-400 font-semibold tracking-wider uppercase">
                Portal 4 — Plant Transit Partner Dispatch
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Store</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 sm:p-8 flex-1 w-full space-y-6">
        
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Assigned Live Plant Shipments</h2>
            <p className="text-xs text-slate-400">Keep parcels upright; live botanical transit protocol active.</p>
          </div>
          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
            {deliveries.length} Active Parcels
          </span>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{message}</span>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-400 mt-3">Loading deliveries...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deliveries.map((d) => {
              const isDelivered = d.fulfillmentStatus === 'DELIVERED'

              return (
                <div
                  key={d.id}
                  className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-sm space-y-5"
                >
                  <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-slate-700/60">
                    <div>
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="text-purple-400 font-bold">Sub-Order #{d.subOrderNumber}</span>
                        <span className="text-slate-500">• Tracking: {d.trackingNumber || 'GN-EXP-90812'}</span>
                      </div>
                      <span className="text-xs text-slate-400 mt-1 block">
                        Master Order: {d.order?.orderNumber} ({d.order?.paymentMethod} • {d.order?.paymentStatus})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${
                          isDelivered
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : 'bg-purple-950 text-purple-300 border-purple-800'
                        }`}
                      >
                        {d.fulfillmentStatus}
                      </span>

                      {!isDelivered && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(d.id, 'OUT_FOR_DELIVERY')}
                            disabled={updatingId === d.id}
                            className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition"
                          >
                            Out for Delivery
                          </button>
                          <button
                            onClick={() => handleUpdate(d.id, 'DELIVERED')}
                            disabled={updatingId === d.id}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Delivered</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Route details: Pickup -> Drop */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    
                    {/* Pickup Nursery */}
                    <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/50 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <Store className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Pickup: Nursery Location</span>
                      </div>
                      <p className="font-bold text-white text-sm">{d.seller?.businessName}</p>
                      <p className="text-slate-300">{d.seller?.nurseryAddress}</p>
                      <p className="text-slate-400">{d.seller?.city} — {d.seller?.pincode}</p>
                    </div>

                    {/* Customer Drop */}
                    <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/50 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>Destination: Customer Address</span>
                      </div>
                      <p className="font-bold text-white text-sm">{d.order?.customerName}</p>
                      <p className="text-slate-300">{d.order?.shippingAddress}</p>
                      <p className="text-slate-400">{d.order?.shippingCity} — {d.order?.shippingPincode}</p>
                      <div className="flex items-center gap-1 text-emerald-400 pt-1">
                        <Phone className="w-3 h-3" />
                        <span>{d.order?.customerPhone}</span>
                      </div>
                    </div>

                  </div>

                  {/* Items list */}
                  <div className="pt-2 text-xs">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-2">
                      Live Plant Items inside package:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {d.items?.map((it: any) => (
                        <div key={it.id} className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-purple-400" />
                          <span>{it.quantity}x {it.productTitle}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        )}

      </main>
    </div>
  )
}
