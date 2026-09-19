import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 })
    }
    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Super Admin access required' }, { status: 403 })
    }
    const ledgers = await prisma.commissionLedger.findMany({
      include: {
        seller: {
          select: {
            id: true,
            businessName: true,
            city: true,
            bankName: true,
            accountNumber: true,
            ifscCode: true,
          },
        },
        subOrder: {
          include: {
            order: {
              select: {
                orderNumber: true,
                customerName: true,
                paymentStatus: true,
                paymentMethod: true,
              },
            },
            items: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const summary = ledgers.reduce(
      (acc, l) => {
        acc.totalVolume += l.orderAmount
        acc.totalCommission += l.platformFee
        acc.totalSellerPayable += l.sellerPayable
        if (l.settlementStatus === 'SETTLED') {
          acc.settledAmount += l.sellerPayable
        } else {
          acc.pendingSettlementAmount += l.sellerPayable
        }
        return acc
      },
      {
        totalVolume: 0,
        totalCommission: 0,
        totalSellerPayable: 0,
        settledAmount: 0,
        pendingSettlementAmount: 0,
      }
    )

    return NextResponse.json({
      ledgers,
      summary: {
        totalVolume: Math.round(summary.totalVolume * 100) / 100,
        totalCommission: Math.round(summary.totalCommission * 100) / 100,
        totalSellerPayable: Math.round(summary.totalSellerPayable * 100) / 100,
        settledAmount: Math.round(summary.settledAmount * 100) / 100,
        pendingSettlementAmount: Math.round(summary.pendingSettlementAmount * 100) / 100,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
