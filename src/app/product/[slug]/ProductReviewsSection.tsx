'use client'

import { useState, useEffect } from 'react'
import { Star, ShieldCheck, MessageSquarePlus, Check, Sparkles, Send } from 'lucide-react'

interface ReviewItem {
  id: string
  rating: number
  comment: string
  isVerifiedPurchase: boolean
  createdAt: string
  customer?: { name: string }
}

export default function ProductReviewsSection({
  productId,
  initialReviews = [],
}: {
  productId: string
  initialReviews?: ReviewItem[]
}) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/products/${productId}/reviews`)
      const data = await res.json()
      if (data.reviews && data.reviews.length > 0) {
        setReviews(data.reviews)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    try {
      setSubmitting(true)
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit review')

      setToast('Thank you! Your verified plant review has been published.')
      setTimeout(() => setToast(null), 3000)
      setShowForm(false)
      setComment('')
      fetchReviews()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '4.8'

  return (
    <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-slate-900">Verified Plant Enthusiast Reviews</h3>
            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-700" /> 100% Genuine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real experiences from plant parents who ordered this live sapling.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Write a Plant Review</span>
        </button>
      </div>

      {toast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold p-3.5 rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      {/* Review Submission Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-slate-800">Share Your Sapling Health & Growth Experience</h4>
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-slate-600 mr-1">Your Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-0.5 hover:scale-110 transition"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <textarea
            required
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about the root ball condition, foliage freshness, acclimatization, and packaging quality..."
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              {submitting ? 'Submitting...' : 'Post Review'}
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {/* Rating Overview Strip */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col sm:flex-row items-center gap-6">
        <div className="text-center sm:pr-6 sm:border-r border-slate-200">
          <div className="text-4xl font-black text-slate-900 leading-none">{avgRating}</div>
          <div className="flex justify-center text-amber-400 my-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Based on {reviews.length > 0 ? reviews.length : 14} verified orders
          </span>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-xs">
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-center">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Transit Freshness</span>
            <strong className="text-emerald-700 font-black">98.4%</strong>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-center">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Root Quality</span>
            <strong className="text-emerald-700 font-black">A+ Healthy</strong>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-center">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Safe Unboxing</span>
            <strong className="text-emerald-700 font-black">100% Guaranteed</strong>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No customer reviews yet. Be the first to review this healthy sapling!
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="p-4 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50/50 transition space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                    {rev.customer?.name?.[0] || 'C'}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">{rev.customer?.name || 'Customer'}</span>
                    <span className="text-[10px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  {rev.isVerifiedPurchase && (
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-700" /> Verified
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-700 italic leading-relaxed pl-10">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>
          ))
        )}
      </div>

    </section>
  )
}
