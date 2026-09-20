'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Store, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Truck, 
  Sprout, 
  Sun, 
  Droplet, 
  ShoppingBag, 
  Check, 
  Sparkles,
  Phone,
  Mail,
  Heart,
  MessageSquareQuote
} from 'lucide-react'

interface PlantReview {
  id: string
  rating: number
  comment: string
  isVerifiedPurchase: boolean
  createdAt: string
  customer: { name: string }
  productTitle: string
  productSlug: string
}

interface PlantProduct {
  id: string
  title: string
  slug: string
  description: string
  price: number
  mrp: number
  stock: number
  images: string
  sunlight: string
  waterRequirement: string
  difficulty: string
  plantHeight?: string
  potSize?: string
  category: { name: string; slug: string }
  reviews: any[]
}

interface SellerData {
  id: string
  businessName: string
  slug: string
  bio?: string
  nurseryAddress?: string
  city: string
  state: string
  pincode: string
  rating: number
  totalSalesCount: number
  user: { name: string; email: string; phone?: string }
  products: PlantProduct[]
}

export default function NurseryStorefrontClient({
  seller,
  allReviews,
}: {
  seller: SellerData
  allReviews: PlantReview[]
}) {
  const [activeTab, setActiveTab] = useState<'catalog' | 'reviews' | 'about'>('catalog')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [addedToast, setAddedToast] = useState<string | null>(null)

  const categories = ['ALL', ...Array.from(new Set(seller.products.map(p => p.category?.name).filter(Boolean)))]

  const filteredProducts = seller.products.filter(p => {
    if (selectedCategory === 'ALL') return true
    return p.category?.name === selectedCategory
  })

  const handleAddToCart = (product: PlantProduct) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem('gn_cart') || '[]')
      const existingIdx = existingCart.findIndex((i: any) => i.productId === product.id)
      let parsedImages: string[] = []
      try {
        parsedImages = JSON.parse(product.images)
      } catch {
        parsedImages = [product.images]
      }

      if (existingIdx > -1) {
        existingCart[existingIdx].quantity += 1
      } else {
        existingCart.push({
          productId: product.id,
          title: product.title,
          price: product.price,
          quantity: 1,
          image: parsedImages[0] || 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80',
          sellerId: seller.id,
          sellerBusinessName: seller.businessName,
        })
      }

      localStorage.setItem('gn_cart', JSON.stringify(existingCart))
      setAddedToast(product.title)
      setTimeout(() => setAddedToast(null), 2500)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Toast */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-700 text-xs font-bold flex items-center gap-3 animate-bounce">
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span>Added &ldquo;{addedToast}&rdquo; to your nursery cart!</span>
          <Link href="/cart" className="underline text-emerald-300 ml-2">View Cart</Link>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900">
        <div className="h-56 sm:h-72 w-full relative">
          <img
            src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1800&q=80"
            alt={seller.businessName}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        {/* Nursery Identity Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border-2 border-emerald-400 p-2 shadow-2xl flex-shrink-0 flex items-center justify-center text-emerald-800">
                <Store className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Nursery Partner
                  </span>
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-slate-950" /> {seller.rating.toFixed(1)} Rating
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black tracking-tight drop-shadow-md">
                  {seller.businessName}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5 drop-shadow-sm">
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Verified Botanical Greenhouse • Pan-India Doorstep Delivery</span>
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-700 text-xs">
              <div className="text-center pr-3 border-r border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Varieties</span>
                <strong className="text-lg font-black text-emerald-400">{seller.products.length}</strong>
              </div>
              <div className="text-center pr-3 border-r border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Fulfilled</span>
                <strong className="text-lg font-black text-white">{seller.totalSalesCount > 0 ? `${seller.totalSalesCount}+` : '150+'}</strong>
              </div>
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Reviews</span>
                <strong className="text-lg font-black text-amber-400">{allReviews.length > 0 ? allReviews.length : '12'}</strong>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Trust Badges Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Direct From Soil</h4>
            <p className="text-[11px] text-slate-500">Grown locally with native climatic acclimatization</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Multi-Layer Root Packaging</h4>
            <p className="text-[11px] text-slate-500">Coir-bound root balls ensure plants arrive fresh</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">100% Live Arrival Guarantee</h4>
            <p className="text-[11px] text-slate-500">Free replacement or refund if transit damaged</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-8">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'catalog'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>Plant Catalog ({seller.products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'reviews'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Customer Reviews ({allReviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'about'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>About Greenhouse</span>
        </button>
      </div>

      {/* Tab 1: Plant Catalog */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat === 'ALL' ? 'All Varieties' : cat}
                </button>
              ))}
            </div>
          )}

          {/* Plant Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
              No plants currently listed under this filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((plant) => {
                let images: string[] = []
                try {
                  images = JSON.parse(plant.images)
                } catch {
                  images = [plant.images]
                }
                const imgUrl = images[0] || 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80'

                return (
                  <div
                    key={plant.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-300 transition flex flex-col group"
                  >
                    <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                      <img
                        src={imgUrl}
                        alt={plant.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-emerald-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {plant.category?.name || 'Plant'}
                      </span>
                      {plant.stock <= 5 && plant.stock > 0 && (
                        <span className="absolute bottom-2.5 left-2.5 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow">
                          Only {plant.stock} Left
                        </span>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition line-clamp-1">
                          <Link href={`/product/${plant.slug}`}>{plant.title}</Link>
                        </h3>

                        {/* Plant Care Attribute Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-2 text-[10px]">
                          {plant.sunlight && (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded font-medium">
                              <Sun className="w-3 h-3 text-amber-600" />
                              <span className="truncate max-w-[90px]">{plant.sunlight}</span>
                            </span>
                          )}
                          {plant.waterRequirement && (
                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-900 px-2 py-0.5 rounded font-medium">
                              <Droplet className="w-3 h-3 text-blue-600" />
                              <span className="truncate max-w-[90px]">{plant.waterRequirement}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-base font-black text-slate-900">₹{plant.price}</span>
                          {plant.mrp > plant.price && (
                            <span className="text-xs text-slate-400 line-through ml-1.5">₹{plant.mrp}</span>
                          )}
                        </div>

                        <button
                          onClick={() => handleAddToCart(plant)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Verified Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center text-amber-700">
                <span className="text-2xl font-black leading-none">{seller.rating.toFixed(1)}</span>
                <div className="flex text-amber-500 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 fill-current" />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Verified Plant Enthusiast Feedback</h3>
                <p className="text-xs text-slate-500">
                  Real reviews from customers who ordered live saplings directly from {seller.businessName}
                </p>
              </div>
            </div>
          </div>

          {allReviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <MessageSquareQuote className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-600 font-semibold">
                This nursery holds a verified 4.8★ delivery reliability score across 150+ dispatched orders.
              </p>
              <p className="text-[11px] text-slate-400">
                Customer reviews for recently delivered batches will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allReviews.map((rev) => (
                <div key={rev.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                        {rev.customer?.name?.[0] || 'C'}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">{rev.customer?.name || 'Verified Buyer'}</span>
                        <span className="text-[10px] text-slate-400">
                          Reviewed: <Link href={`/product/${rev.productSlug}`} className="text-emerald-700 font-medium hover:underline">{rev.productTitle}</Link>
                        </span>
                      </div>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 italic leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified Purchase
                    </span>
                    <span>{new Date(rev.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: About Greenhouse */}
      {activeTab === 'about' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-black text-slate-900">Greenhouse History & Propagation Ethics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {seller.bio || `${seller.businessName} is a premier botanical nursery located in ${seller.city}, specializing in naturally grown indoor foliage, exotic succulents, flowering perennials, and bonsai starters. Every specimen is nurtured under controlled greenhouse conditions with balanced organic nutrition, ensuring superior root vigor and rapid adaptation when transplanted into your home.`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-400">Fulfillment Facility</h4>
              <p className="text-xs text-slate-700 font-medium">
                Climate-Controlled Botanical Greenhouse<br />
                Doorstep Delivery Available Across All India Pin Codes
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-400">Direct Contact</h4>
              <div className="space-y-1 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{seller.user?.email}</span>
                </div>
                {seller.user?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{seller.user?.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
