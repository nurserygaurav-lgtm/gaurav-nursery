'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PlantCard from '@/components/PlantCard'
import Link from 'next/link'
import { Heart, Sprout, ArrowLeft, ShoppingBag } from 'lucide-react'

export default function WishlistPage() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gn_wishlist')
      if (saved) {
        setWishlistIds(JSON.parse(saved))
      }
    } catch {}
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/products')
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

  const wishlistedPlants = products.filter((p) => wishlistIds.includes(p.id))

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Saved Plants Wishlist</h1>
              <p className="text-xs text-slate-500">
                {wishlistedPlants.length} plant {wishlistedPlants.length === 1 ? 'variety' : 'varieties'} saved for your garden
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs text-slate-400">Loading saved plants...</div>
        ) : wishlistedPlants.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-4 max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-black text-slate-800 text-lg">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-500">
              Browse through our local nursery catalog and click the heart icon on plants you want to grow!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-sm transition"
            >
              <Sprout className="w-4 h-4" />
              <span>Explore Marketplace Catalog</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistedPlants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
