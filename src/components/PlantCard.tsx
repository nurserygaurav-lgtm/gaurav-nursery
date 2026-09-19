'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Heart, 
  ShoppingBag, 
  Sun, 
  Droplet, 
  Store, 
  Check, 
  Sparkles,
  ShieldCheck
} from 'lucide-react'

interface PlantProps {
  id: string
  title: string
  slug: string
  price: number
  mrp: number
  images: string | string[]
  sunlight?: string
  waterRequirement?: string
  difficulty?: string
  category?: { name: string; slug: string }
  seller?: { id: string; businessName: string; city: string; slug?: string }
}

export default function PlantCard({ plant }: { plant: PlantProps }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addedToast, setAddedToast] = useState(false)

  let parsedImages: string[] = []
  if (Array.isArray(plant.images)) {
    parsedImages = plant.images
  } else {
    try {
      parsedImages = JSON.parse(plant.images || '[]')
    } catch {
      parsedImages = [plant.images]
    }
  }

  const primaryImage = parsedImages[0] || 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80'

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gn_wishlist')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.some((id: string) => id === plant.id)) {
          setIsWishlisted(true)
        }
      }
    } catch {}
  }, [plant.id])

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const saved = localStorage.getItem('gn_wishlist')
      let list: string[] = saved ? JSON.parse(saved) : []
      if (isWishlisted) {
        list = list.filter((id) => id !== plant.id)
        setIsWishlisted(false)
      } else {
        list.push(plant.id)
        setIsWishlisted(true)
      }
      localStorage.setItem('gn_wishlist', JSON.stringify(list))
      window.dispatchEvent(new Event('storage'))
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const existingCart = JSON.parse(localStorage.getItem('gn_cart') || '[]')
      const existingIdx = existingCart.findIndex((i: any) => i.productId === plant.id)

      if (existingIdx > -1) {
        existingCart[existingIdx].quantity += 1
      } else {
        existingCart.push({
          productId: plant.id,
          title: plant.title,
          price: plant.price,
          quantity: 1,
          image: primaryImage,
          sellerId: plant.seller?.id || '',
          sellerBusinessName: plant.seller?.businessName || 'Verified Nursery',
        })
      }

      localStorage.setItem('gn_cart', JSON.stringify(existingCart))
      window.dispatchEvent(new Event('storage'))
      setAddedToast(true)
      setTimeout(() => setAddedToast(false), 2000)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all duration-300 group flex flex-col relative">
      
      {/* Top Image & Wishlist Button */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <Link href={`/product/${plant.slug}`}>
          <img
            src={primaryImage}
            alt={plant.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        </Link>

        {plant.category?.name && (
          <span className="absolute top-2.5 left-2.5 bg-emerald-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {plant.category.name}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition shadow ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-white/80 text-slate-600 hover:text-rose-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
        </button>
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Nursery Origin Link */}
          {plant.seller && (
            <Link
              href={`/nursery/${plant.seller.slug || 'gaurav-greenery-hub'}`}
              className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-emerald-700 transition mb-1 group/seller"
            >
              <Store className="w-3 h-3 text-emerald-600 flex-shrink-0" />
              <span className="truncate group-hover/seller:underline">
                {plant.seller.businessName} ({plant.seller.city})
              </span>
            </Link>
          )}

          <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition line-clamp-2">
            <Link href={`/product/${plant.slug}`}>{plant.title}</Link>
          </h3>

          {/* Plant Care Attribute Badges */}
          <div className="flex flex-wrap gap-1.5 mt-2.5 text-[10px]">
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
            {plant.difficulty && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded font-medium">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span className="truncate max-w-[90px]">{plant.difficulty}</span>
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-base font-black text-slate-900">₹{plant.price}</span>
            {plant.mrp > plant.price && (
              <span className="text-xs text-slate-400 line-through ml-1.5">₹{plant.mrp}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition ${
              addedToast
                ? 'bg-emerald-800 text-white'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
            }`}
          >
            {addedToast ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  )
}
