'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Sprout, 
  Sun, 
  Droplet, 
  Layers, 
  Ruler, 
  Maximize2, 
  Check, 
  AlertCircle,
  Clock,
  Sparkles,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    price: '',
    mrp: '',
    stock: '15',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80',
    sunlight: 'Low Light (Indoor)',
    waterRequirement: 'Low (Once a week)',
    plantHeight: '12 - 15 inches',
    potSize: '6 inch nursery pot',
    soilType: 'Cocopeat & vermicompost mix',
    difficulty: 'Beginner Friendly',
    plantType: 'Air Purifying',
    careTips: 'Keep in bright indirect light. Water only when top 2 inches feel dry.',
    submitForReview: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const res = await fetch('/api/seller/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: [formData.imageUrl],
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to list plant')
      }

      setSuccessMessage('Plant submitted for Admin review! Status: PENDING_REVIEW')
      setTimeout(() => {
        router.push('/seller/products')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Error creating plant listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="flex items-center gap-3">
        <Link href="/seller/products" className="p-2 rounded-xl bg-white border hover:bg-slate-50 text-slate-600">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Add New Plant to Catalog
          </h1>
          <p className="text-xs text-slate-500">
            List specialized nursery plants with detailed sunlight, water, and pot dimensions.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
          <Check className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span>1. Basic Plant Information</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Plant Title / Variety</label>
              <input
                type="text"
                required
                placeholder="e.g. Zamioculcas ZZ Plant (Black Raven Hybrid)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="">Select Category</option>
                  <option value="indoor-plants">Indoor Plants</option>
                  <option value="flowering-plants">Flowering Plants</option>
                  <option value="bonsai-succulents">Bonsai & Succulents</option>
                  <option value="outdoor-plants">Outdoor Plants</option>
                  <option value="pots-planters">Pots & Planters</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Stock Quantity</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Selling Price (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 450"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  You receive 90% (₹{formData.price ? (parseFloat(formData.price) * 0.9).toFixed(0) : '0'}), platform fee is 10%.
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">MRP / Original Price (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 600"
                  value={formData.mrp}
                  onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Image URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Plant Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe plant health, growth habits, and aesthetic qualities..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Specialized Plant Care Attributes */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>2. Specialized Nursery Attributes & Care Guide</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">☀️ Sunlight Requirement</label>
              <select
                value={formData.sunlight}
                onChange={(e) => setFormData({ ...formData, sunlight: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Low Light (Indoor)">Low Light (Indoor / Office)</option>
                <option value="Moderate">Moderate Indirect (Living Rooms)</option>
                <option value="Full Sun (Outdoor)">Full Sun (Outdoor Balcony / Garden)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">💧 Watering Frequency</label>
              <select
                value={formData.waterRequirement}
                onChange={(e) => setFormData({ ...formData, waterRequirement: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Low (Once a week)">Low (Once a week)</option>
                <option value="Moderate (2-3 days)">Moderate (Every 2-3 days)</option>
                <option value="High (Daily)">High (Daily Watering)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">📏 Plant Height</label>
              <input
                type="text"
                value={formData.plantHeight}
                onChange={(e) => setFormData({ ...formData, plantHeight: e.target.value })}
                placeholder="e.g. 10 - 14 inches"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">🪴 Pot Size / Material</label>
              <input
                type="text"
                value={formData.potSize}
                onChange={(e) => setFormData({ ...formData, potSize: e.target.value })}
                placeholder="e.g. 6 inch nursery pot"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">🌱 Soil Type Recommendation</label>
              <input
                type="text"
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                placeholder="e.g. Well-draining gritty potting mix"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">🧗 Difficulty Level</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Beginner Friendly">Beginner Friendly</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert / Delicate</option>
              </select>
            </div>
          </div>

          <div className="text-xs pt-2">
            <label className="block text-slate-700 font-semibold mb-1">💡 Nursery Care Instructions</label>
            <textarea
              rows={2}
              value={formData.careTips}
              onChange={(e) => setFormData({ ...formData, careTips: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* Approval Workflow Note & Submit */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Admin Moderation Workflow</h4>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Upon clicking "Submit for Admin Review", this listing will be placed in the <strong>PENDING_REVIEW</strong> queue. 
              Once the Super Admin verifies specs, it will automatically go <strong>LIVE</strong> on the customer marketplace.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold py-3.5 px-6 rounded-xl text-sm shadow-md transition"
        >
          {loading ? 'Submitting to Admin Queue...' : 'Submit Plant for Admin Review'}
        </button>

      </form>

    </div>
  )
}
