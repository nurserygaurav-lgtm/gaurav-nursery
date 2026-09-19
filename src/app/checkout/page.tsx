'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ShieldCheck, 
  CreditCard, 
  Banknote, 
  Lock, 
  Store, 
  CheckCircle2, 
  AlertCircle,
  UserCheck
} from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    customerName: 'Anjali Mehta',
    customerEmail: 'customer@gmail.com',
    customerPhone: '+91 99887 66554',
    shippingAddress: 'Flat 402, Sunshine Heights, Althan Canal Road',
    shippingCity: 'Surat',
    shippingState: 'Gujarat',
    shippingPincode: '395017',
    paymentMethod: 'TEST_PAYMENT',
  })

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gn_cart')
      if (saved) {
        setCartItems(JSON.parse(saved))
      }
    } catch (e) {
      console.error(e)
    }

    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user)
          setFormData((prev) => ({
            ...prev,
            customerName: data.user.name || prev.customerName,
            customerEmail: data.user.email || prev.customerEmail,
            customerPhone: data.user.phone || prev.customerPhone,
          }))
        }
      })
      .catch(() => {})
  }, [])

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const platformFee = Math.round(totalAmount * 0.10)
  const sellerNet = totalAmount - platformFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // First ensure sellerIds exist; if demo seller ids are present, map them to real seeded seller IDs
      const mappedItems = cartItems.map((it) => ({
        ...it,
        sellerId: it.sellerId.includes('demo') ? undefined : it.sellerId,
      }))

      // If needed, fetch valid products/sellers from backend
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: cartItems.map((it) => ({
            productId: it.productId.startsWith('demo') ? 'demo' : it.productId,
            title: it.title,
            price: it.price,
            quantity: it.quantity,
            image: it.image,
            sellerId: it.sellerId,
          })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Checkout failed')
      }

      // Clear cart
      localStorage.removeItem('gn_cart')

      // Redirect to orders page with success
      router.push(`/orders?placed=${data.order?.orderNumber}`)
    } catch (err: any) {
      setError(err.message || 'An error occurred during checkout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Secure Marketplace Checkout</h1>
              <p className="text-xs text-slate-500">Order from verified nurseries with live plant transit guarantee</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left: Shipping & Payment Form */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Account State / Login Prompt for New Users */}
              {!currentUser ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-emerald-950 text-sm">New to Gaurav Nursery?</p>
                    <p className="text-emerald-700 text-xs mt-0.5">
                      Create an account or sign in for real-time delivery tracking & saved nursery orders.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href="/login?redirect=/checkout"
                      className="bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-bold px-3 py-1.5 rounded-xl transition text-xs"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/login?mode=signup&redirect=/checkout"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl transition text-xs shadow-sm"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between text-xs text-slate-700 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Signed in as <strong className="text-slate-900">{currentUser.name}</strong> ({currentUser.email})</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Verified Customer
                  </span>
                </div>
              )}

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <span>1. Delivery Details</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.customerEmail}
                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        value={formData.customerPhone}
                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Street Address / House No.</label>
                    <input
                      type="text"
                      required
                      value={formData.shippingAddress}
                      onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={formData.shippingCity}
                        onChange={(e) => setFormData({ ...formData, shippingCity: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">State</label>
                      <input
                        type="text"
                        required
                        value={formData.shippingState}
                        onChange={(e) => setFormData({ ...formData, shippingState: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Pincode</label>
                      <input
                        type="text"
                        required
                        value={formData.shippingPincode}
                        onChange={(e) => setFormData({ ...formData, shippingPincode: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods (Mandatory Requirement 6: Test Payment / COD mode) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <span>2. Payment Option</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <label
                    onClick={() => setFormData({ ...formData, paymentMethod: 'TEST_PAYMENT' })}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                      formData.paymentMethod === 'TEST_PAYMENT'
                        ? 'border-emerald-600 bg-emerald-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'TEST_PAYMENT'}
                      onChange={() => {}}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <CreditCard className="w-4 h-4 text-emerald-700" />
                        <span>Instant Test Payment (UPI / Card / NetBanking Mock)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Instant simulated success for testing Phase 1 MVP order lifecycle and 10% commission calculations.
                      </p>
                    </div>
                  </label>

                  <label
                    onClick={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                      formData.paymentMethod === 'COD'
                        ? 'border-emerald-600 bg-emerald-50/50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={() => {}}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Banknote className="w-4 h-4 text-amber-700" />
                        <span>Cash on Delivery (COD)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Pay upon receiving healthy live plant parcel at your doorstep.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* Right: Order Split & Place Order CTA */}
            <div className="md:col-span-5 space-y-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-100">
                  Review & Confirm
                </h3>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {cartItems.map((item: any, i: number) => (
                    <div key={i} className="flex gap-3 text-xs">
                      <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover border" />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-slate-800 truncate">{item.title}</h5>
                        <p className="text-[11px] text-slate-400">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Order Subtotal</span>
                    <span className="font-semibold text-slate-900">₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Plant Transit Packaging</span>
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between text-base font-black text-slate-900">
                    <span>Total Amount</span>
                    <span className="text-emerald-900">₹{totalAmount}</span>
                  </div>
                </div>

                {/* 10% Platform Commission Preview */}
                <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>• 10% Platform Commission:</span>
                    <strong className="text-emerald-800">₹{platformFee}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>• Seller Net Earnings:</span>
                    <strong className="text-blue-800">₹{sellerNet}</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || cartItems.length === 0}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Splitting Order & Creating Ledger...</span>
                  ) : (
                    <span>Place Order (₹{totalAmount})</span>
                  )}
                </button>
              </div>

              <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Secure SSL Checkout & Plant Transit Guarantee</span>
              </div>
            </div>

          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}
