'use client'

import { useState } from 'react'
import { ShoppingBag, Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function AddToCartButton({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    try {
      const existingCart = JSON.parse(localStorage.getItem('gn_cart') || '[]')
      const existingIdx = existingCart.findIndex((i: any) => i.productId === product.productId)

      if (existingIdx > -1) {
        existingCart[existingIdx].quantity += quantity
      } else {
        existingCart.push({
          ...product,
          quantity,
        })
      }

      localStorage.setItem('gn_cart', JSON.stringify(existingCart))
      setAdded(true)
      setTimeout(() => setAdded(false), 3000)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center gap-3">
        {/* Quantity control */}
        <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3.5 py-2.5 hover:bg-slate-100 text-slate-700 font-bold transition"
          >
            -
          </button>
          <span className="px-4 py-2.5 font-bold text-sm text-slate-800">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3.5 py-2.5 hover:bg-slate-100 text-slate-700 font-bold transition"
          >
            +
          </button>
        </div>

        {/* Add to Cart button */}
        <button
          onClick={handleAdd}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition ${
            added
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-700 hover:bg-emerald-800 text-white'
          }`}
        >
          {added ? (
            <>
              <Check className="w-5 h-5" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              <span>Add to Nursery Cart</span>
            </>
          )}
        </button>
      </div>

      {added && (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2.5 rounded-xl text-xs">
          <span>Item added to your multi-vendor basket.</span>
          <Link href="/cart" className="font-bold underline flex items-center gap-1">
            Go to Cart <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  )
}
