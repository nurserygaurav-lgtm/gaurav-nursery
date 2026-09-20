import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'
import { 
  Store, 
  Sprout, 
  PackageCheck, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  PlusCircle,
  ArrowUpRight,
  ExternalLink,
  Truck,
  Layers,
  ShoppingBag,
  BarChart3
} from 'lucide-react'

export default async function SellerDashboardPage() {
  const currentUser = await getCurrentUser()

  const seller = (currentUser?.sellerId 
    ? await prisma.sellerProfile.findUnique({
        where: { id: currentUser.sellerId },
        include: {
          products: true,
          subOrders: {
            include: { items: true, order: true },
            orderBy: { createdAt: 'desc' },
          },
          commissionLedgers: true,
        }
      })
    : null) || (currentUser?.email
    ? await prisma.sellerProfile.findFirst({
        where: { user: { email: currentUser.email } },
        include: {
          products: true,
          subOrders: {
            include: { items: true, order: true },
            orderBy: { createdAt: 'desc' },
          },
          commissionLedgers: true,
        }
      })
    : null) || await prisma.sellerProfile.findFirst({
    where: { status: 'ACTIVE' },
    include: {
      products: true,
      subOrders: {
        include: {
          items: true,
          order: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      commissionLedgers: true,
    },
  })

  if (!seller) {
    return <div className="p-8 text-center text-xs">No active seller profile found.</div>
  }

  const grossSales = seller.commissionLedgers.reduce((sum, l) => sum + l.orderAmount, 0)
  const platformFeePaid = seller.commissionLedgers.reduce((sum, l) => sum + l.platformFee, 0)
  const netEarnings = seller.commissionLedgers.reduce((sum, l) => sum + l.sellerPayable, 0)

  // Low stock calculation (threshold <= 5 units)
  const lowStockProducts = seller.products.filter((p) => p.stock <= 5)
  const outOfStockProducts = seller.products.filter((p) => p.stock === 0)

  // Fulfillment breakdown
  const totalSubOrders = seller.subOrders.length
  const deliveredOrders = seller.subOrders.filter((s) => s.fulfillmentStatus === 'DELIVERED').length
  const inTransitOrders = seller.subOrders.filter((s) => 
    ['CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(s.fulfillmentStatus)
  ).length
  const pendingOrders = seller.subOrders.filter((s) => s.fulfillmentStatus === 'PLACED').length

  const aov = totalSubOrders > 0 ? Math.round(grossSales / totalSubOrders) : 0
  const fulfillmentRate = totalSubOrders > 0 ? Math.round((deliveredOrders / totalSubOrders) * 100) : 100

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Onboarding & KYC Status Banner */}
      <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">{seller.businessName}</h1>
              <span className="bg-emerald-100 text-emerald-900 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" /> KYC Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {seller.nurseryAddress}, {seller.city}, {seller.state} • PAN: {seller.panNumber ? '•••••' + seller.panNumber.slice(-4) : 'Submitted'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/nursery/${seller.slug || 'gaurav-greenery-hub'}`}
            target="_blank"
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <span>View Nursery Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </Link>

          <Link
            href="/seller/products/new"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Plant to Catalog</span>
          </Link>
        </div>
      </div>

      {/* Priority 2 Requirement: Low Stock Alert Banner (<= 5 units) */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-sm text-amber-900">
                Low Inventory Alert: {lowStockProducts.length} plant {lowStockProducts.length === 1 ? 'variety is' : 'varieties are'} running low (≤ 5 units)
              </h4>
              <p className="text-xs text-amber-800/90 leading-relaxed">
                {outOfStockProducts.length > 0 && `${outOfStockProducts.length} items are currently completely OUT OF STOCK. `}
                Restock these saplings immediately to maintain high search visibility and avoid customer order cancellations:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {lowStockProducts.slice(0, 4).map((p) => (
                  <span key={p.id} className="bg-white/80 border border-amber-300 px-2.5 py-0.5 rounded-md text-[11px] font-bold text-amber-900">
                    {p.title}: {p.stock} left
                  </span>
                ))}
                {lowStockProducts.length > 4 && (
                  <span className="text-[11px] font-bold text-amber-800 self-center">+{lowStockProducts.length - 4} more</span>
                )}
              </div>
            </div>
          </div>

          <Link
            href="/seller/products"
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex-shrink-0 shadow-sm"
          >
            Update Inventory →
          </Link>
        </div>
      )}

      {/* Financial & Operational KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Sales</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">₹{grossSales.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-slate-400">Total customer orders value</span>
        </div>

        <div className="bg-emerald-950 text-white p-5 rounded-2xl border border-emerald-900 shadow-md space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Net Earnings (90%)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-emerald-300 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400">₹{netEarnings.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-emerald-200/80">Available after 10% platform fee</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">10% Platform Fee</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">₹{platformFeePaid.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-slate-400">Fixed marketplace commission</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Plant Catalog</span>
            <div className="w-8 h-8 rounded-lg bg-green-50 text-green-700 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{seller.products.length} Varieties</div>
          <span className="text-[11px] text-emerald-700 font-semibold">Live in customer marketplace</span>
        </div>
      </div>

      {/* Priority 2 Requirement: Sales & Fulfillment Analytics Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Nursery Sales & Fulfillment Telemetry</h3>
              <p className="text-xs text-slate-500">Real-time status of orders containing plants from your greenhouse</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Live Analytics</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Delivered</span>
              <div className="text-xl font-black text-emerald-700">{deliveredOrders}</div>
              <span className="text-[10px] text-emerald-600 font-semibold">{fulfillmentRate}% fulfilled</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">In Transit</span>
              <div className="text-xl font-black text-blue-700">{inTransitOrders}</div>
              <span className="text-[10px] text-blue-600 font-semibold">With courier</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Awaiting Pack</span>
              <div className="text-xl font-black text-amber-700">{pendingOrders}</div>
              <span className="text-[10px] text-amber-600 font-semibold">Action needed</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg Order Value</span>
              <div className="text-xl font-black text-slate-900">₹{aov}</div>
              <span className="text-[10px] text-slate-500">Per sub-order</span>
            </div>
          </div>

          {/* Visual Fulfillment Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs text-slate-600 font-medium">
              <span>Fulfillment Health Pipeline</span>
              <span className="font-bold text-slate-800">{deliveredOrders} of {totalSubOrders} orders delivered</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div 
                style={{ width: `${totalSubOrders > 0 ? (deliveredOrders / totalSubOrders) * 100 : 0}%` }} 
                className="bg-emerald-600 transition-all duration-500" 
                title="Delivered"
              />
              <div 
                style={{ width: `${totalSubOrders > 0 ? (inTransitOrders / totalSubOrders) * 100 : 0}%` }} 
                className="bg-blue-500 transition-all duration-500" 
                title="In Transit"
              />
              <div 
                style={{ width: `${totalSubOrders > 0 ? (pendingOrders / totalSubOrders) * 100 : 0}%` }} 
                className="bg-amber-500 transition-all duration-500" 
                title="Pending"
              />
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-600" /> Delivered</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> In Transit</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Action Required</span>
            </div>
          </div>
        </div>

        {/* Nursery Catalog Health */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Catalog Stock Health</h3>
            <p className="text-xs text-slate-500">Live inventory distribution</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Total Live Varieties:</span>
              <span className="font-bold text-slate-900">{seller.products.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Healthy Stock (&gt; 5 units):</span>
              <span className="font-bold text-emerald-700">{seller.products.length - lowStockProducts.length} varieties</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Low Stock (&le; 5 units):</span>
              <span className="font-bold text-amber-700">{lowStockProducts.length} varieties</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Out of Stock (0 units):</span>
              <span className="font-bold text-rose-700">{outOfStockProducts.length} varieties</span>
            </div>
          </div>

          <Link
            href="/seller/products"
            className="w-full text-center py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
          >
            Manage Plant Inventory
          </Link>
        </div>
      </div>

      {/* Orders specific to this Nursery */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Nursery Fulfillment Queue</h3>
            <p className="text-xs text-slate-500">Orders containing plants from {seller.businessName}</p>
          </div>
          <Link href="/seller/orders" className="text-xs font-semibold text-emerald-700 hover:underline">
            Manage Orders →
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {seller.subOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No sub-orders received yet.</div>
          ) : (
            seller.subOrders.map((sub) => (
              <div key={sub.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50/60">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900">{sub.subOrderNumber}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                      Master #{sub.order.orderNumber}
                    </span>
                    <span className="text-[11px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                      {sub.fulfillmentStatus}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Deliver to: <strong className="text-slate-800">{sub.order.customerName}</strong> ({sub.order.shippingCity})
                  </div>
                  <div className="text-xs text-slate-500">
                    {sub.items.map((it) => `${it.quantity}x ${it.productTitle}`).join(', ')}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Your Net Earning (90%)</span>
                    <strong className="text-base text-emerald-800 font-black">₹{sub.sellerNet}</strong>
                  </div>

                  <Link
                    href="/seller/orders"
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-lg text-xs transition"
                  >
                    Update Status
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  )
}
