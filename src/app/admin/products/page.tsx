'use client'

import { useState, useEffect } from 'react'
import { 
  Sprout, 
  Check, 
  X, 
  Sun, 
  Droplet, 
  Layers, 
  Store, 
  AlertCircle,
  Clock,
  ExternalLink,
  CheckSquare,
  Square
} from 'lucide-react'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [bulkLoading, setBulkLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/products')
      const data = await res.json()
      if (data.products) {
        setProducts(data.products)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (productId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      setActionLoading(productId)
      setMessage(null)
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, action }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update product')
      }

      setMessage({ type: 'success', text: data.message })
      fetchProducts()
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setActionLoading(null)
    }
  }

  const handleBulkAction = async (action: 'APPROVE_ALL' | 'REJECT_ALL') => {
    if (selectedIds.length === 0) return
    try {
      setBulkLoading(true)
      setMessage(null)
      const res = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: selectedIds, action }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Bulk action failed')

      setMessage({ type: 'success', text: data.message })
      setSelectedIds([])
      fetchProducts()
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setBulkLoading(false)
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(products.map((p) => p.id))
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Plant Listing Moderation & Bulk Actions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verify specialized plant care attributes (Sunlight, Water, Pot specs) individually or via bulk moderation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSelectAll}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition"
          >
            {selectedIds.length === products.length ? (
              <>
                <CheckSquare className="w-4 h-4 text-emerald-700" />
                <span>Deselect All</span>
              </>
            ) : (
              <>
                <Square className="w-4 h-4 text-slate-400" />
                <span>Select All ({products.length})</span>
              </>
            )}
          </button>
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
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 mt-3">Loading catalog...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => {
            const isPending = product.status === 'PENDING_REVIEW'
            const isSelected = selectedIds.includes(product.id)
            const images = product.images || []

            return (
              <div
                key={product.id}
                className={`bg-white rounded-2xl border transition shadow-sm p-5 ${
                  isSelected ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20' : isPending ? 'border-amber-300' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  
                  {/* Selection Checkbox */}
                  <div className="pt-2 flex-shrink-0">
                    <button
                      onClick={() => toggleSelect(product.id)}
                      className="text-slate-400 hover:text-emerald-700 p-1"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-emerald-700" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Thumbnail */}
                  <img
                    src={images[0] || 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80'}
                    alt=""
                    className="w-24 h-24 rounded-xl object-cover border flex-shrink-0"
                  />

                  {/* Main details */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Store className="w-3 h-3 text-emerald-700" />
                          <span>{product.seller?.businessName} ({product.seller?.city})</span>
                          <span>• Category: {product.category?.name}</span>
                        </div>
                        <h3 className="font-bold text-base text-slate-900 mt-0.5">{product.title}</h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            product.status === 'LIVE'
                              ? 'bg-emerald-100 text-emerald-900'
                              : product.status === 'PENDING_REVIEW'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {product.status}
                        </span>

                        {isPending && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleAction(product.id, 'APPROVE')}
                              disabled={actionLoading === product.id}
                              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleAction(product.id, 'REJECT')}
                              disabled={actionLoading === product.id}
                              className="bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-red-200"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{product.description}</p>

                    {/* Specialized Plant Specs */}
                    <div className="flex flex-wrap gap-2 pt-2 text-[11px]">
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-100">
                        <Sun className="w-3 h-3 text-amber-600" /> {product.sunlight}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-100">
                        <Droplet className="w-3 h-3 text-blue-600" /> {product.waterRequirement}
                      </span>
                      {product.plantHeight && (
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          Height: {product.plantHeight}
                        </span>
                      )}
                      {product.potSize && (
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          Pot: {product.potSize}
                        </span>
                      )}
                      <span className="ml-auto font-black text-sm text-emerald-900">
                        ₹{product.price} <span className="text-xs text-slate-400 font-normal line-through">₹{product.mrp}</span>
                      </span>
                    </div>

                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Floating Sticky Bulk Moderation Toolbar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex flex-wrap items-center gap-4 border border-slate-700 z-50 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span className="text-xs font-bold">Plants Selected</span>
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction('APPROVE_ALL')}
              disabled={bulkLoading}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Bulk Approve ({selectedIds.length})</span>
            </button>

            <button
              onClick={() => handleBulkAction('REJECT_ALL')}
              disabled={bulkLoading}
              className="bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700 font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>Bulk Reject</span>
            </button>

            <button
              onClick={() => setSelectedIds([])}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 underline"
            >
              Clear
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
