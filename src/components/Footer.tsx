import Link from 'next/link'
import { Sprout, ShieldCheck, Truck, RefreshCw, HeartHandshake } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Props Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-10 border-b border-slate-800 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Verified Nurseries Only</h4>
              <p className="text-xs text-slate-400">Admin-audited KYC & plant health checks</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Live Plant Safe Transit</h4>
              <p className="text-xs text-slate-400">Upright ventilation packaging</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white">10% Fair Marketplace Fee</h4>
              <p className="text-xs text-slate-400">Transparent seller commission & fast payouts</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Transit Guarantee</h4>
              <p className="text-xs text-slate-400">Replacement if damaged in delivery</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-10 text-xs">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                GAURAV <span className="text-emerald-400">NURSERY</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed pr-6">
              India’s dedicated marketplace connecting top local nurseries, plant collectors, and home gardeners with an automated 10% commission model.
            </p>
            <div className="pt-2">
              <span className="inline-block bg-slate-800 border border-slate-700 text-slate-300 text-[11px] px-3 py-1 rounded-full">
                Headquarters: Surat & Ahmedabad, Gujarat
              </span>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">Marketplace</h5>
            <ul className="space-y-2">
              <li><Link href="/shop?category=indoor-plants" className="hover:text-emerald-400 transition">Indoor Plants</Link></li>
              <li><Link href="/shop?category=flowering-plants" className="hover:text-emerald-400 transition">Flowering Plants</Link></li>
              <li><Link href="/shop?category=bonsai-succulents" className="hover:text-emerald-400 transition">Bonsai & Succulents</Link></li>
              <li><Link href="/shop?category=pots-planters" className="hover:text-emerald-400 transition">Pots & Planters</Link></li>
              <li><Link href="/shop?category=soil-fertilizers" className="hover:text-emerald-400 transition">Organic Fertilizers</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">Nursery Partners</h5>
            <ul className="space-y-2">
              <li><Link href="/seller/register" className="hover:text-emerald-400 transition">Become a Seller</Link></li>
              <li><Link href="/seller/dashboard" className="hover:text-emerald-400 transition">Seller Dashboard</Link></li>
              <li><Link href="/seller/earnings" className="hover:text-emerald-400 transition">10% Commission Model</Link></li>
              <li><Link href="/seller/products/new" className="hover:text-emerald-400 transition">List Your Plants</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">Platform Control</h5>
            <ul className="space-y-2">
              <li><Link href="/admin" className="text-amber-400 hover:underline transition">Super Admin Panel</Link></li>
              <li><Link href="/admin/sellers" className="hover:text-emerald-400 transition">Seller KYC Queue</Link></li>
              <li><Link href="/admin/commission" className="hover:text-emerald-400 transition">Commission Ledger</Link></li>
              <li><Link href="/delivery" className="hover:text-emerald-400 transition">Delivery Partner</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Gaurav Nursery Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Terms & Conditions</span>
            <span className="hover:text-slate-400 cursor-pointer">Seller Agreement (10% Fee)</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
