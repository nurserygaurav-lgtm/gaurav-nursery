'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { 
  Sun, 
  Droplet, 
  Store, 
  Filter, 
  Search, 
  Sparkles, 
  SlidersHorizontal,
  ArrowUpDown,
  Check,
  ShoppingBag
} from 'lucide-react'

interface ShopClientProps {
  initialProducts: any[]
  initialParams?: {
    q?: string
    category?: string
    sunlight?: string
    water?: string
    difficulty?: string
  }
}

export default function ShopClient({ initialProducts, initialParams }: ShopClientProps) {
  const [products, setProducts] = useState<any[]>(initialProducts || [])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(initialParams?.q || '')
  const [selectedCategory, setSelectedCategory] = useState(initialParams?.category || '')
  const [selectedSunlight, setSelectedSunlight] = useState(initialParams?.sunlight || '')
  const [selectedWater, setSelectedWater] = useState(initialParams?.water || '')
  const [selectedDifficulty, setSelectedDifficulty] = useState(initialParams?.difficulty || '')
  const [addedToast, setAddedToast] = useState<string | null>(null)

  useEffect(() => {
    // Read initial search params from URL on mount if present
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('q')) setSearchQuery(params.get('q') || '')
      if (params.get('category')) setSelectedCategory(params.get('category') || '')
      if (params.get('sunlight')) setSelectedSunlight(params.get('sunlight') || '')
      if (params.get('water')) setSelectedWater(params.get('water') || '')
      if (params.get('difficulty')) setSelectedDifficulty(params.get('difficulty') || '')
    }
  }, [])

  // Filter products client-side for ultra-fast instant UI responsiveness
  const filteredProducts = products.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const matchTitle = p.title?.toLowerCase().includes(q)
      const matchDesc = p.description?.toLowerCase().includes(q)
      const matchSeller = p.seller?.businessName?.toLowerCase().includes(q)
      if (!matchTitle && !matchDesc && !matchSeller) return false
    }
    if (selectedCategory && p.category?.slug !== selectedCategory) return false
    if (selectedSunlight && !p.sunlight?.toLowerCase().includes(selectedSunlight.toLowerCase())) return false
    if (selectedWater && !p.waterRequirement?.toLowerCase().includes(selectedWater.toLowerCase())) return false
    if (selectedDifficulty && p.difficulty !== selectedDifficulty) return false
    return true
  })

  const handleAddToCart = (product: any) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem('gn_cart') || '[]')
      const existingIdx = existingCart.findIndex((i: any) => i.productId === product.id)
      
      if (existingIdx > -1) {
        existingCart[existingIdx].quantity += 1
      } else {
        existingCart.push({
          productId: product.id,
          title: product.title,
          price: product.price,
          quantity: 1,
          image: product.images?.[0] || 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80',
          sellerId: product.sellerId,
          sellerBusinessName: product.seller?.businessName || 'Verified Nursery',
        })
      }

      localStorage.setItem('gn_cart', JSON.stringify(existingCart))
      window.dispatchEvent(new Event('storage'))
      setAddedToast(product.title)
      setTimeout(() => setAddedToast(null), 2500)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-700 animate-fade-in">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-emerald-950 font-bold text-xs">
            ✓
          </div>
          <div>
            <p className="text-xs font-bold">Added to Cart!</p>
            <p className="text-[11px] text-emerald-200">{addedToast}</p>
          </div>
          <Link href="/cart" className="ml-2 bg-emerald-700 hover:bg-emerald-600 text-xs px-2.5 py-1 rounded font-semibold text-white">
            View Cart
          </Link>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-emerald-950 text-white py-8 px-4 border-b border-emerald-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Vendor Nursery Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">All Plants & Gardening Supplies</h1>
            <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
              Filter by sunlight, watering needs, and plant care difficulty.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-900 border border-emerald-800 text-emerald-300 px-3 py-1 rounded-full font-medium">
              {filteredProducts.length} Items Available
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid with Sidebar Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <Filter className="w-4 h-4 text-emerald-700" />
                  <span>Filters</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory('')
                    setSelectedSunlight('')
                    setSelectedWater('')
                    setSelectedDifficulty('')
                    setSearchQuery('')
                  }}
                  className="text-[11px] text-emerald-700 hover:underline font-semibold"
                >
                  Reset All
                </button>
              </div>

              {/* Search */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search plant or nursery..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-8 pr-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Category</label>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {[
                    { label: 'All Categories', value: '' },
                    { label: 'Indoor Plants', value: 'indoor-plants' },
                    { label: 'Outdoor Plants', value: 'outdoor-plants' },
                    { label: 'Flowering Plants', value: 'flowering-plants' },
                    { label: 'Bonsai & Succulents', value: 'bonsai-succulents' },
                    { label: 'Pots & Planters', value: 'pots-planters' },
                    { label: 'Soil & Fertilizers', value: 'soil-fertilizers' },
                  ].map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition ${
                        selectedCategory === cat.value
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <span>{cat.label}</span>
                      {selectedCategory === cat.value && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialized Sunlight Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  ☀️ Sunlight Needs
                </label>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {[
                    { label: 'Any Sunlight', value: '' },
                    { label: 'Low Light (Indoor)', value: 'Low Light' },
                    { label: 'Moderate Indirect', value: 'Moderate' },
                    { label: 'Full Sun (Outdoor)', value: 'Full Sun' },
                  ].map((sun) => (
                    <button
                      key={sun.value}
                      onClick={() => setSelectedSunlight(sun.value)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition ${
                        selectedSunlight === sun.value
                          ? 'bg-amber-50 text-amber-900 font-bold'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <span>{sun.label}</span>
                      {selectedSunlight === sun.value && <Check className="w-3.5 h-3.5 text-amber-700" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialized Water Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  💧 Watering Schedule
                </label>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {[
                    { label: 'Any Schedule', value: '' },
                    { label: 'Low (Once a week)', value: 'Low' },
                    { label: 'Moderate (2-3 days)', value: 'Moderate' },
                  ].map((w) => (
                    <button
                      key={w.value}
                      onClick={() => setSelectedWater(w.value)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition ${
                        selectedWater === w.value
                          ? 'bg-blue-50 text-blue-900 font-bold'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <span>{w.label}</span>
                      {selectedWater === w.value && <Check className="w-3.5 h-3.5 text-blue-700" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Care Difficulty */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Care Difficulty
                </label>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {[
                    { label: 'All Levels', value: '' },
                    { label: 'Beginner Friendly', value: 'Beginner Friendly' },
                    { label: 'Intermediate', value: 'Intermediate' },
                  ].map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setSelectedDifficulty(d.value)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition ${
                        selectedDifficulty === d.value
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <span>{d.label}</span>
                      {selectedDifficulty === d.value && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-500 mt-4">Loading fresh nursery plants...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">No matching plants found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try clearing your sunlight or water filters to see more plants from our nursery network.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('')
                    setSelectedSunlight('')
                    setSelectedWater('')
                    setSelectedDifficulty('')
                    setSearchQuery('')
                  }}
                  className="mt-4 bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((plant) => (
                  <div
                    key={plant.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-300 transition flex flex-col group"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                      <img
                        src={plant.images?.[0] || 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80'}
                        alt={plant.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-emerald-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {plant.category?.name || 'Plant'}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Seller origin */}
                        <Link
                          href={`/nursery/${plant.seller?.slug || 'gaurav-greenery-hub'}`}
                          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-emerald-700 mb-1 transition group/seller"
                        >
                          <Store className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                          <span className="truncate group-hover/seller:underline">{plant.seller?.businessName} ({plant.seller?.city})</span>
                        </Link>

                        <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition line-clamp-2">
                          <Link href={`/product/${plant.slug}`}>{plant.title}</Link>
                        </h3>

                        {/* Plant Care Attribute Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-slate-100 text-[10px]">
                          {plant.sunlight && (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded font-medium">
                              <Sun className="w-2.5 h-2.5 text-amber-600" /> {plant.sunlight}
                            </span>
                          )}
                          {plant.waterRequirement && (
                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-900 px-2 py-0.5 rounded font-medium">
                              <Droplet className="w-2.5 h-2.5 text-blue-600" /> {plant.waterRequirement}
                            </span>
                          )}
                          {plant.difficulty && (
                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                              {plant.difficulty}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Pricing & Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-lg font-black text-emerald-900">₹{plant.price}</span>
                          {plant.mrp > plant.price && (
                            <span className="text-xs text-slate-400 line-through ml-1.5">₹{plant.mrp}</span>
                          )}
                        </div>

                        <div className="flex gap-1.5">
                          <Link
                            href={`/product/${plant.slug}`}
                            className="text-xs border border-slate-200 hover:border-slate-300 text-slate-700 px-2.5 py-1.5 rounded-lg font-semibold transition"
                          >
                            Details
                          </Link>
                          <button
                            onClick={() => handleAddToCart(plant)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

        </div>
      </div>

      <Footer />
    </div>
  )
}
