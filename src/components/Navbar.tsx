'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Sprout, 
  ShieldCheck, 
  Store, 
  Truck, 
  User, 
  Heart,
  ChevronDown,
  Sun,
  Droplet,
  ExternalLink,
  Loader2
} from 'lucide-react'
import SignOutButton from '@/components/SignOutButton'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [portalDropdown, setPortalDropdown] = useState(false)

  // Search Autocomplete state
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Read cart and wishlist count from local storage
    try {
      const savedCart = localStorage.getItem('gn_cart')
      if (savedCart) {
        const parsed = JSON.parse(savedCart)
        setCartCount(parsed.length)
      }
      const savedWishlist = localStorage.getItem('gn_wishlist')
      if (savedWishlist) {
        const parsedW = JSON.parse(savedWishlist)
        setWishlistCount(parsedW.length)
      }
    } catch {}

    const handleStorage = () => {
      try {
        const c = localStorage.getItem('gn_cart')
        if (c) setCartCount(JSON.parse(c).length)
        const w = localStorage.getItem('gn_wishlist')
        if (w) setWishlistCount(JSON.parse(w).length)
      } catch {}
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      }
    }

    checkUser()
    const handleAuth = () => checkUser()
    window.addEventListener('auth-change', handleAuth)
    return () => window.removeEventListener('auth-change', handleAuth)
  }, [])

  // Debounced search autocomplete
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true)
        const res = await fetch(`/api/products?q=${encodeURIComponent(searchQuery.trim())}`)
        const data = await res.json()
        if (data.products) {
          setSuggestions(data.products.slice(0, 5))
          setShowSuggestions(true)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setSearchLoading(false)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Click outside listener for search autocomplete
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      {/* Top Bar with Platform Highlights & Quick Portal Switcher */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-800 text-emerald-300 px-2 py-0.5 rounded font-medium text-[11px]">
              Marketplace Model
            </span>
            <span>🌱 Direct from verified nurseries with 10% platform commission & fast doorstep transit</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button 
                onClick={() => setPortalDropdown(!portalDropdown)}
                className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-700 text-white px-2.5 py-0.5 rounded font-semibold text-[11px] transition"
              >
                Switch Portal <ChevronDown className="w-3 h-3" />
              </button>

              {portalDropdown && (
                <div 
                  className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800"
                  onMouseLeave={() => setPortalDropdown(false)}
                >
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400">All 4 Portals</div>
                  <Link 
                    href="/admin" 
                    className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-emerald-50 hover:text-emerald-700"
                    onClick={() => setPortalDropdown(false)}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span className="font-semibold">Super Admin (/admin)</span>
                  </Link>
                  <Link 
                    href="/seller/dashboard" 
                    className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-emerald-50 hover:text-emerald-700"
                    onClick={() => setPortalDropdown(false)}
                  >
                    <Store className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-semibold">Seller Portal (/seller)</span>
                  </Link>
                  <Link 
                    href="/delivery" 
                    className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-emerald-50 hover:text-emerald-700"
                    onClick={() => setPortalDropdown(false)}
                  >
                    <Truck className="w-3.5 h-3.5 text-purple-600" />
                    <span className="font-semibold">Delivery Partner (/delivery)</span>
                  </Link>
                  <Link 
                    href="/" 
                    className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-emerald-50 hover:text-emerald-700"
                    onClick={() => setPortalDropdown(false)}
                  >
                    <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-semibold">Customer Store (/)</span>
                  </Link>
                </div>
              )}
            </div>

            <Link href="/seller/register" className="hover:text-white transition flex items-center gap-1">
              <Store className="w-3 h-3 text-emerald-400" /> Become a Seller
            </Link>
            <Link href="/delivery" className="hover:text-white transition flex items-center gap-1">
              <Truck className="w-3 h-3 text-emerald-400" /> Delivery
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-emerald-950 block leading-tight">
                GAURAV <span className="text-emerald-600">NURSERY</span>
              </span>
              <span className="text-[10px] font-medium tracking-wider text-slate-500 block uppercase">
                Multi-Vendor Plant Hub
              </span>
            </div>
          </Link>

          {/* Search Bar with live autocomplete & plant thumbnails */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-xl mx-4 relative">
            <form action="/shop" method="GET" className="w-full relative">
              <input
                type="text"
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true) }}
                placeholder="Search plants, adenium, low light, indoor, pots..."
                className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-10 pr-24 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              {searchLoading && (
                <Loader2 className="w-4 h-4 text-emerald-600 animate-spin absolute right-24 top-2.5" />
              )}
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs font-semibold transition"
              >
                Search
              </button>
            </form>

            {/* Live Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-12 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <span>Plant Suggestions</span>
                  <span>{suggestions.length} matching</span>
                </div>

                <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                  {suggestions.map((p) => {
                    const img = p.images?.[0] || 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=300&q=80'
                    return (
                      <Link
                        key={p.id}
                        href={`/product/${p.slug}`}
                        onClick={() => setShowSuggestions(false)}
                        className="p-3 flex items-center gap-3.5 hover:bg-emerald-50/60 transition group"
                      >
                        <img
                          src={img}
                          alt={p.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0 group-hover:scale-105 transition"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 truncate">
                            {p.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                            <span className="text-emerald-700 font-semibold">{p.category?.name}</span>
                            <span>•</span>
                            <span className="truncate">{p.seller?.businessName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            {p.sunlight && <span className="flex items-center gap-0.5"><Sun className="w-2.5 h-2.5 text-amber-500" /> {p.sunlight}</span>}
                            {p.waterRequirement && <span className="flex items-center gap-0.5"><Droplet className="w-2.5 h-2.5 text-blue-500" /> {p.waterRequirement}</span>}
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="font-black text-xs text-slate-900">₹{p.price}</span>
                          {p.mrp > p.price && (
                            <span className="text-[10px] text-slate-400 line-through block">₹{p.mrp}</span>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>

                <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                  <Link
                    href={`/shop?q=${encodeURIComponent(searchQuery)}`}
                    onClick={() => setShowSuggestions(false)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    View all matching results in Shop →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-slate-700 hover:text-emerald-700 transition">
              Home
            </Link>
            <Link href="/shop" className="text-sm font-medium text-slate-700 hover:text-emerald-700 transition">
              Shop Plants
            </Link>
            <Link href="/shop?category=indoor-plants" className="text-sm font-medium text-slate-700 hover:text-emerald-700 transition">
              Indoor
            </Link>
            <Link href="/shop?category=flowering-plants" className="text-sm font-medium text-slate-700 hover:text-emerald-700 transition">
              Flowering
            </Link>
          </div>

          {/* Action Icons: Wishlist, Orders, Cart */}
          <div className="flex items-center gap-3">
            <Link
              href="/wishlist"
              className="relative p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
              title="Saved Plants Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="hidden sm:flex items-center gap-1.5">
                <Link
                  href={
                    user.role === 'SUPER_ADMIN'
                      ? '/admin'
                      : user.role === 'SELLER'
                      ? '/seller/dashboard'
                      : user.role === 'DELIVERY_PARTNER'
                      ? '/delivery'
                      : '/orders'
                  }
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition bg-slate-50/50"
                  title={`Signed in as ${user.email}`}
                >
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="max-w-[90px] truncate">{user.name?.split(' ')[0] || 'Account'}</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold uppercase">
                    {user.role === 'SUPER_ADMIN' ? 'Admin' : user.role === 'SELLER' ? 'Seller' : user.role === 'DELIVERY_PARTNER' ? 'Delivery' : 'Customer'}
                  </span>
                </Link>
                <SignOutButton text="" className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition" />
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl transition shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            <Link
              href="/cart"
              className="relative flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 px-3.5 py-2 rounded-xl border border-emerald-200/80 transition"
            >
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
              <span className="text-xs font-bold hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center -ml-1">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <form action="/shop" method="GET" className="relative mb-3">
            <input
              type="text"
              name="q"
              placeholder="Search plants, fertilizers..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <Link href="/" className="p-2 rounded-lg hover:bg-slate-50 text-slate-800">Home</Link>
            <Link href="/shop" className="p-2 rounded-lg hover:bg-slate-50 text-slate-800">Shop All</Link>
            <Link href="/shop?category=indoor-plants" className="p-2 rounded-lg hover:bg-slate-50 text-slate-800">Indoor Plants</Link>
            <Link href="/shop?category=flowering-plants" className="p-2 rounded-lg hover:bg-slate-50 text-slate-800">Flowering</Link>
            <Link href="/seller/register" className="p-2 rounded-lg bg-emerald-50 text-emerald-800 font-semibold">Seller Register</Link>
            {user ? (
              <>
                <Link
                  href={
                    user.role === 'SUPER_ADMIN'
                      ? '/admin'
                      : user.role === 'SELLER'
                      ? '/seller/dashboard'
                      : user.role === 'DELIVERY_PARTNER'
                      ? '/delivery'
                      : '/orders'
                  }
                  className="p-2 rounded-lg hover:bg-slate-50 text-emerald-800 font-bold"
                >
                  Portal ({user.role === 'SUPER_ADMIN' ? 'Admin' : user.role === 'SELLER' ? 'Seller' : user.role === 'DELIVERY_PARTNER' ? 'Delivery' : 'Orders'})
                </Link>
                <div className="col-span-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 truncate">{user.email}</span>
                  <SignOutButton text="Sign Out" />
                </div>
              </>
            ) : (
              <Link href="/login" className="p-2 rounded-lg bg-emerald-700 text-white font-bold text-center col-span-2">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
