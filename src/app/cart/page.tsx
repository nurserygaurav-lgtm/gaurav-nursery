'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Store, 
  ShieldCheck, 
  Truck, 
  Sprout,
  Info
} from 'lucide-react'

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gn_cart')
      if (saved) {
        setCartItems(JSON.parse(saved))
      } else {
        // Pre-load demo multi-vendor cart items if empty so user immediately sees the multi-vendor split magic!
        const demoCart = [
          {
            productId: 'demo-p1',
            title: 'Adenium Desert Rose (Grafted Thai Hybrid)',
            price: 499,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&q=80',
            sellerId: 'demo-seller-1',
            sellerBusinessName: 'Gaurav Greenery Hub',
          },
          {
            productId: 'demo-p3',
            title: 'Ginseng Ficus Microcarpa Bonsai (S-Curve)',
            price: 899,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&q=80',
            sellerId: 'demo-seller-2',
            sellerBusinessName: 'Shree Ram Plant Nursery (Ahmedabad)',
          },
        ]
        setCartItems(demoCart)
        localStorage.setItem('gn_cart', JSON.stringify(demoCart))
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateQuantity = (idx: number, delta: number) => {
    const updated = [...cartItems]
    updated[idx].quantity = Math.max(1, updated[idx].quantity + delta)
    setCartItems(updated)
    localStorage.setItem('gn_cart', JSON.stringify(updated))
  }

  const removeItem = (idx: number) => {
    const updated = cartItems.filter((_, i) => i !== idx)
    setCartItems(updated)
    localStorage.setItem('gn_cart', JSON.stringify(updated))
  }

  // Group items by nursery/seller for transparent multi-vendor presentation
  const groupedBySeller = cartItems.reduce((acc: any, item: any) => {
    const seller = item.sellerBusinessName || 'Verified Nursery'
    if (!acc[seller]) acc[seller] = []
    acc[seller].push(item)
    return acc
  }, {})

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Your Plant Basket</h1>
            <p className="text-xs text-slate-500">Secure online plant checkout with live transit guarantee</p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <Sprout className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">Your cart is empty</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Browse healthy live plants from verified nurseries across India.
            </p>
            <Link
              href="/shop"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Cart Items Grouped by Nursery */}
            <div className="lg:col-span-8 space-y-6">
              {Object.keys(groupedBySeller).map((sellerName) => {
                const items = groupedBySeller[sellerName]
                const sellerSubtotal = items.reduce((sum: number, it: any) => sum + it.price * it.quantity, 0)

                return (
                  <div
                    key={sellerName}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
                  >
                    {/* Nursery Header */}
                    <div className="bg-slate-50 border-b border-slate-200/80 px-5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <Store className="w-4 h-4 text-emerald-700" />
                        <span className="text-slate-500">Dispatched by:</span>
                        <strong className="text-slate-900 font-bold">{sellerName}</strong>
                      </div>
                      <span className="text-xs font-semibold text-slate-600">
                        Nursery Subtotal: <strong className="text-emerald-900">₹{sellerSubtotal}</strong>
                      </span>
                    </div>

                    {/* Items for this nursery */}
                    <div className="divide-y divide-slate-100 p-5 space-y-4">
                      {items.map((item: any) => {
                        const originalIdx = cartItems.findIndex((ci) => ci.title === item.title)
                        return (
                          <div key={item.title} className="flex gap-4 pt-3 first:pt-0 items-center">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                            />
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm text-slate-900 truncate">{item.title}</h4>
                              <p className="text-xs text-emerald-900 font-bold mt-0.5">₹{item.price}</p>
                            </div>

                            {/* Quantity controls */}
                            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 text-xs">
                              <button
                                onClick={() => updateQuantity(originalIdx, -1)}
                                className="px-2.5 py-1 hover:bg-slate-200 text-slate-700 font-bold"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 font-bold text-slate-800">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(originalIdx, 1)}
                                className="px-2.5 py-1 hover:bg-slate-200 text-slate-700 font-bold"
                              >
                                +
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="font-bold text-sm text-slate-900">
                                ₹{item.price * item.quantity}
                              </p>
                              <button
                                onClick={() => removeItem(originalIdx)}
                                className="text-[11px] text-red-500 hover:underline flex items-center gap-1 mt-1 ml-auto"
                              >
                                <Trash2 className="w-3 h-3" /> Remove
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-100">
                  Order Summary
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Total ({cartItems.length} plants)</span>
                    <span className="font-semibold text-slate-900">₹{totalAmount}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Live Plant Safe Packaging</span>
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Estimated Transit Shipping</span>
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between text-base font-black text-slate-900">
                    <span>Total Payable</span>
                    <span className="text-emerald-900">₹{totalAmount}</span>
                  </div>
                </div>

                {/* Live Plant Transit Guarantee */}
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>100% Live Plant Transit Guarantee</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Freshly dispatched from verified greenhouses, packed in specialized protective cartons, and delivered directly to your doorstep across India.
                  </p>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-xl text-center text-sm shadow-md flex items-center justify-center gap-2 transition"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Safety Badges */}
              <div className="bg-slate-100 rounded-xl p-4 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  <span>Transit damage replacement guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Direct nursery dispatched live root health</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
