import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { callBackendApi } from '@/lib/backendClient'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { 
  Package, 
  Store, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/orders')
  }

  let orders: any[] = []

  // 1. Fetch from Render Backend (MongoDB)
  try {
    const backendRes = await callBackendApi('/orders/my')
    if (backendRes.ok && backendRes.data?.orders && backendRes.data.orders.length > 0) {
      orders = backendRes.data.orders.map((o: any) => ({
        ...o,
        id: o._id?.toString() || o.id,
        orderNumber: o.orderNumber || `GN-${(o._id || o.id).slice(-4)}`,
        totalGrossAmount: o.totalGrossAmount || o.totalAmount || 0,
        paymentMethod: o.paymentMethod || o.payment?.method || 'ONLINE',
        paymentStatus: o.paymentStatus || o.payment?.status || 'PAID',
        createdAt: o.createdAt,
        subOrders: (o.subOrders || []).map((sub: any) => ({
          id: sub._id?.toString() || sub.id,
          subOrderNumber: sub.subOrderNumber || '1',
          fulfillmentStatus: sub.fulfillmentStatus || 'PLACED',
          trackingNumber: sub.trackingNumber || 'TRK-LIVE',
          grossAmount: sub.grossAmount || 0,
          seller: {
            businessName: sub.sellerBusinessName || sub.seller?.sellerProfile?.businessName || 'Partner Nursery',
          },
          items: (sub.items || []).map((it: any) => ({
            id: it._id?.toString() || it.id,
            productTitle: it.productTitle || it.title || 'Plant',
            productImage: it.productImage || it.image,
            unitPrice: it.unitPrice || it.price || 0,
            quantity: it.quantity || 1,
            lineTotal: it.lineTotal || (it.unitPrice || 0) * (it.quantity || 1),
          })),
        })),
      }))
    }
  } catch (err) {
    console.warn('Backend orders fetch warning:', err)
  }

  // 2. Fallback
  if (orders.length === 0) {
    const whereClause: any = {}
    if (user.role !== 'SUPER_ADMIN') {
      whereClause.OR = [
        { customerId: user.userId },
        { customerEmail: user.email },
      ]
    }

    orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        subOrders: {
          include: {
            seller: true,
            items: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Your Plant Orders</h1>
            <p className="text-xs text-slate-500">Live multi-vendor dispatch tracking directly from partner nurseries</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No orders yet</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">Explore our curated plant collections and place your first order.</p>
            <Link href="/shop" className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl">
              Shop Plants
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
              >
                {/* Master Order Top Bar */}
                <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap justify-between items-center gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Master Order</span>
                      <strong className="font-mono text-emerald-400 font-bold">{order.orderNumber}</strong>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Payment</span>
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono text-[11px]">
                        {order.paymentMethod} • {order.paymentStatus}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px]">Total Amount</span>
                      <strong className="text-base text-emerald-400 font-black">₹{order.totalGrossAmount}</strong>
                    </div>
                  </div>
                </div>

                {/* Sub-Orders Grid (Multi-Vendor Splitting Showcase) */}
                <div className="p-6 space-y-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Store className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Multi-Vendor Split Deliveries ({order.subOrders.length} Nurseries)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.subOrders.map((sub) => (
                      <div
                        key={sub.id}
                        className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between"
                      >
                        <div>
                          {/* Sub Order header */}
                          <div className="flex justify-between items-start pb-2 border-b border-slate-200/80">
                            <div>
                              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                                <Store className="w-3.5 h-3.5 text-emerald-700" />
                                <span>{sub.seller.businessName}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Sub-Order #{sub.subOrderNumber}
                              </span>
                            </div>

                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                              {sub.fulfillmentStatus}
                            </span>
                          </div>

                          {/* Items in this sub order */}
                          <div className="space-y-2 mt-3">
                            {sub.items.map((it) => (
                              <div key={it.id} className="flex items-center gap-2.5 text-xs">
                                <img
                                  src={it.productImage || 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80'}
                                  alt=""
                                  className="w-10 h-10 rounded-lg object-cover border"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-slate-800 truncate">{it.productTitle}</p>
                                  <p className="text-[10px] text-slate-400">Qty: {it.quantity} × ₹{it.unitPrice}</p>
                                </div>
                                <span className="font-bold text-slate-900">₹{it.lineTotal}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tracking status bar */}
                        <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1 text-slate-600 font-mono">
                            <Truck className="w-3.5 h-3.5 text-slate-400" />
                            <span>{sub.trackingNumber || 'Live Transit Transit'}</span>
                          </div>
                          <span className="text-emerald-800 font-bold">Subtotal: ₹{sub.grossAmount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
