import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'
import { PlusCircle, Sprout, Sun, Droplet, Clock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'

export default async function SellerProductsPage() {
  const currentUser = await getCurrentUser()

  const seller = (currentUser?.sellerId 
    ? await prisma.sellerProfile.findUnique({
        where: { id: currentUser.sellerId },
        include: {
          products: {
            include: { category: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      })
    : null) || (currentUser?.email
    ? await prisma.sellerProfile.findFirst({
        where: { user: { email: currentUser.email } },
        include: {
          products: {
            include: { category: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      })
    : null) || await prisma.sellerProfile.findFirst({
    where: { status: 'ACTIVE' },
    include: {
      products: {
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  const products = seller?.products || []

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            My Plant Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your nursery listings, track Admin approval status, and update inventory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/seller/products/import"
            className="bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-300 font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Bulk / Ugaoo Import</span>
          </Link>

          <Link
            href="/seller/products/new"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Plant</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Active & Pending Listings</h3>
          <span className="text-xs text-slate-400 font-mono">{products.length} Items</span>
        </div>

        <div className="divide-y divide-slate-100">
          {products.map((p) => {
            let images: string[] = []
            if (Array.isArray(p.images)) {
              images = p.images
            } else if (typeof p.images === 'string') {
              try {
                images = JSON.parse(p.images)
              } catch {
                images = [p.images].filter(Boolean)
              }
            }
            return (
              <div key={p.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50">
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={images[0] || 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80'}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover border flex-shrink-0"
                  />
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 truncate">{p.title}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.status === 'LIVE'
                            ? 'bg-emerald-100 text-emerald-900'
                            : p.status === 'PENDING_REVIEW'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                      <span>Category: {p.category?.name}</span>
                      <span>•</span>
                      <span>SKU: <span className="font-mono">{p.sku}</span></span>
                      <span>•</span>
                      {p.stock <= 0 ? (
                        <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[10px]">
                          Out of Stock (0)
                        </span>
                      ) : p.stock <= 5 ? (
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-600" /> Low Stock: {p.stock} units left
                        </span>
                      ) : (
                        <span>Stock: <strong className="text-slate-800 font-bold">{p.stock}</strong> units</span>
                      )}
                    </p>
                    <div className="flex gap-2 text-[11px] text-slate-600">
                      <span className="flex items-center gap-1"><Sun className="w-3 h-3 text-amber-600" /> {p.sunlight}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Droplet className="w-3 h-3 text-blue-600" /> {p.waterRequirement}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0">
                  <span className="text-base font-black text-emerald-900">₹{p.price}</span>
                  <span className="text-[10px] text-slate-400">Net payout: ₹{(p.price * 0.9).toFixed(0)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
