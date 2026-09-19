import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    // Role protection (SUPER_ADMIN check)
    // For local ease if not logged in we can return data or check user
    if (user && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const [
      ordersCount,
      activeSellersCount,
      pendingSellersCount,
      totalProductsCount,
      pendingProductsCount,
      allOrders,
      commissionLedgers,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.sellerProfile.count({ where: { status: 'ACTIVE' } }),
      prisma.sellerProfile.count({ where: { status: 'KYC_PENDING' } }),
      prisma.product.count(),
      prisma.product.count({ where: { status: 'PENDING_REVIEW' } }),
      prisma.order.findMany({ select: { totalGrossAmount: true, totalPlatformFee: true, totalSellerNet: true } }),
      prisma.commissionLedger.findMany(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          subOrders: {
            include: {
              seller: true,
              items: true,
            },
          },
        },
      }),
    ])

    const totalGrossSales = allOrders.reduce((sum, o) => sum + o.totalGrossAmount, 0)
    const totalPlatformCommission = allOrders.reduce((sum, o) => sum + o.totalPlatformFee, 0)
    const totalSellerPayouts = allOrders.reduce((sum, o) => sum + o.totalSellerNet, 0)

    const pendingPayoutAmount = commissionLedgers
      .filter((l) => l.settlementStatus === 'ELIGIBLE_FOR_PAYOUT')
      .reduce((sum, l) => sum + l.sellerPayable, 0)

    return NextResponse.json({
      metrics: {
        totalGrossSales: Math.round(totalGrossSales * 100) / 100,
        totalPlatformCommission: Math.round(totalPlatformCommission * 100) / 100,
        totalSellerPayouts: Math.round(totalSellerPayouts * 100) / 100,
        ordersCount,
        activeSellersCount,
        pendingSellersCount,
        totalProductsCount,
        pendingProductsCount,
        pendingPayoutAmount: Math.round(pendingPayoutAmount * 100) / 100,
      },
      recentOrders,
    })
  } catch (error: any) {
    console.error('Admin metrics error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
