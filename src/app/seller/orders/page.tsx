'use client'

import { useState, useEffect } from 'react'
import { 
  PackageCheck, 
  Truck, 
  Check, 
  Clock, 
  MapPin, 
  AlertCircle,
  ExternalLink 
} from 'lucide-react'

export default function SellerOrdersPage() {
  const [subOrders, setSubOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/seller/orders')
      const data = await res.json()
      if (data.subOrders) {
        setSubOrders(data.subOrders)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (subOrderId: string, fulfillmentStatus: string) => {
    try {
      setUpdatingId(subOrderId)
      setMessage(null)
      const res = await fetch('/api/seller/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subOrderId, fulfillmentStatus }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update')

      setMessage(`Order status updated to ${fulfillmentStatus}`)
      fetchOrders()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Nursery Fulfillment Orders
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Pack and dispatch live plant orders assigned specifically to your nursery.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 mt-3">Loading orders...</p>
        </div>
      ) : subOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          No sub-orders received yet.
        </div>
      ) : (
        <div className="space-y-4">
          {subOrders.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Header */}
              <div className="bg-slate-50 px-6 py-3.5 border-b border-slate-200/80 flex flex-wrap justify-between items-center gap-3 text-xs">
                <div>
                  <span className="font-mono font-bold text-slate-900">Sub-Order #{sub.subOrderNumber}</span>
                  {sub.order && (
                    <span className="text-slate-400 ml-2">
                      (Master #{sub.order.orderNumber} • Placed {new Date(sub.order.createdAt).toLocaleDateString()})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                    {sub.fulfillmentStatus}
                  </span>

                  {/* Dispatch Controls */}
                  <div className="flex gap-1.5">
                    {sub.fulfillmentStatus === 'PLACED' && (
                      <button
                        onClick={() => handleUpdateStatus(sub.id, 'PACKED')}
                        disabled={updatingId === sub.id}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1 rounded-lg text-xs"
                      >
                        Mark Packed
                      </button>
                    )}
                    {sub.fulfillmentStatus === 'PACKED' && (
                      <button
                        onClick={() => handleUpdateStatus(sub.id, 'SHIPPED')}
                        disabled={updatingId === sub.id}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded-lg text-xs"
                      >
                        Mark Shipped
                      </button>
                    )}
                    {sub.fulfillmentStatus === 'SHIPPED' && (
                      <button
                        onClick={() => handleUpdateStatus(sub.id, 'DELIVERED')}
                        disabled={updatingId === sub.id}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-lg text-xs"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Items */}
                <div className="md:col-span-6 space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Plants to Pack</h4>
                  {sub.items.map((it: any) => (
                    <div key={it.id} className="flex items-center gap-3 text-xs">
                      <img
                        src={it.productImage || 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80'}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate">{it.productTitle}</p>
                        <p className="text-slate-400">Quantity: {it.quantity} × ₹{it.unitPrice}</p>
                      </div>
                      <span className="font-bold text-slate-800">₹{it.lineTotal}</span>
                    </div>
                  ))}
                </div>

                {/* Shipping destination */}
                <div className="md:col-span-3 text-xs text-slate-600 space-y-1 border-l md:pl-6 border-slate-100">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Customer Destination
                  </h4>
                  <p className="font-bold text-slate-900">{sub.order.customerName}</p>
                  <p>{sub.order.shippingAddress}</p>
                  <p>{sub.order.shippingCity}, {sub.order.shippingPincode}</p>
                  <p className="text-slate-400">{sub.order.customerPhone}</p>
                </div>

                {/* 10% Commission Financial Split */}
                <div className="md:col-span-3 bg-slate-50 p-4 rounded-xl text-xs space-y-1.5 border border-slate-200/80">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Financial Split</h4>
                  <div className="flex justify-between text-slate-600">
                    <span>Order Subtotal:</span>
                    <strong>₹{sub.grossAmount}</strong>
                  </div>
                  <div className="flex justify-between text-amber-700">
                    <span>10% Platform Fee:</span>
                    <strong>-₹{sub.platformFee}</strong>
                  </div>
                  <div className="pt-1 border-t border-slate-200 flex justify-between text-emerald-900 font-black text-sm">
                    <span>Your Net Earning:</span>
                    <span>₹{sub.sellerNet}</span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
