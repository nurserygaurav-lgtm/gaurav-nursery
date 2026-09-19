'use client'

import { useState, useEffect } from 'react'
import { 
  Image as ImageIcon, 
  Plus, 
  Check, 
  X, 
  Trash2, 
  ExternalLink, 
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Eye,
  Sparkles
} from 'lucide-react'

interface Banner {
  id: string
  title: string
  subtitle?: string
  imageUrl: string
  linkUrl: string
  badgeText?: string
  displayOrder: number
  isActive: boolean
  createdAt: string
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    imageUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1400&q=80',
    linkUrl: '/shop',
    badgeText: 'SEASONAL SALE',
    displayOrder: 0,
    isActive: true,
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/banners')
      const data = await res.json()
      if (data.banners) setBanners(data.banners)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create banner')

      setMessage({ type: 'success', text: data.message })
      setShowModal(false)
      setForm({
        title: '',
        subtitle: '',
        imageUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1400&q=80',
        linkUrl: '/shop',
        badgeText: 'SEASONAL SALE',
        displayOrder: 0,
        isActive: true,
      })
      fetchBanners()
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    }
  }

  const toggleActive = async (id: string, current: boolean) => {
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !current }),
      })
      if (res.ok) fetchBanners()
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promotional banner?')) return
    try {
      const res = await fetch(`/api/admin/banners?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setMessage({ type: 'success', text: 'Banner deleted successfully' })
        fetchBanners()
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message })
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Homepage Banner CMS
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure promotional hero banners, festival highlights, and seasonal marketing slides.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm shadow-emerald-700/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Banner</span>
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid of Active Banners */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 font-medium">
          Loading promotional banners...
        </div>
      ) : banners.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <ImageIcon className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-700">No Homepage Banners Active</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add seasonal promotions, festive offers, or special curated collections to display directly on the customer homepage.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Banner</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((b) => (
            <div
              key={b.id}
              className={`bg-white rounded-2xl border transition overflow-hidden shadow-sm flex flex-col ${
                b.isActive ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50/50'
              }`}
            >
              {/* Image Preview */}
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                <img
                  src={b.imageUrl}
                  alt={b.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                  {b.badgeText && (
                    <span className="inline-block bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded w-fit mb-1">
                      {b.badgeText}
                    </span>
                  )}
                  <h3 className="font-black text-lg leading-tight drop-shadow-sm">{b.title}</h3>
                  {b.subtitle && (
                    <p className="text-xs text-slate-200 line-clamp-1 drop-shadow-sm">{b.subtitle}</p>
                  )}
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md shadow ${
                    b.isActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {b.isActive ? 'LIVE' : 'DISABLED'}
                  </span>
                  <span className="bg-slate-900/80 text-white font-mono text-[10px] px-2 py-1 rounded-md backdrop-blur-sm">
                    Order: {b.displayOrder}
                  </span>
                </div>
              </div>

              {/* Card Footer / Controls */}
              <div className="p-4 flex items-center justify-between border-t border-slate-100 bg-white mt-auto">
                <div className="text-xs text-slate-500 flex items-center gap-2 truncate pr-2">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="font-mono text-[11px] truncate">{b.linkUrl}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleActive(b.id, b.isActive)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
                    title={b.isActive ? 'Deactivate Banner' : 'Activate Banner'}
                  >
                    {b.isActive ? (
                      <ToggleRight className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-slate-400" />
                    )}
                    <span className="text-[11px]">{b.isActive ? 'Active' : 'Paused'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">New Homepage Banner</h3>
                  <p className="text-[11px] text-slate-500">Live promotion on customer storefront</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Banner Headline</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Monsoon Plant Carnival — Up to 35% Off"
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle / Subtext</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="e.g. Verified healthy saplings directly delivered from top nurseries"
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={form.badgeText}
                    onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
                    placeholder="e.g. LIMITED OFFER"
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Display Priority</label>
                  <input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value, 10) || 0 })}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL (High-Res Unsplash/CDN)</label>
                <input
                  type="url"
                  required
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Click URL</label>
                <input
                  type="text"
                  required
                  value={form.linkUrl}
                  onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                  placeholder="/shop or /category/indoor-plants"
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Live Preview Box */}
              {form.imageUrl && form.title && (
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 relative h-28">
                  <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover opacity-70" />
                  <div className="absolute inset-0 p-3 flex flex-col justify-end text-white">
                    {form.badgeText && (
                      <span className="bg-amber-500 text-slate-950 text-[9px] font-black uppercase px-1.5 py-0.5 rounded w-fit mb-0.5">
                        {form.badgeText}
                      </span>
                    )}
                    <p className="font-bold text-xs truncate">{form.title}</p>
                    <p className="text-[10px] text-slate-300 truncate">{form.subtitle}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm shadow-emerald-700/20"
                >
                  Publish Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
