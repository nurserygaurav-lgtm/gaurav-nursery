import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    const { searchParams } = new URL(request.url)
    const sellerIdParam = searchParams.get('sellerId')

    let sellerId = user?.sellerId || sellerIdParam

    if (!sellerId) {
      // Demo fallback
      const defaultSeller = await prisma.sellerProfile.findFirst()
      sellerId = defaultSeller?.id
    }

    if (!sellerId) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 })
    }

    // Isolated query: Only fetch subOrders where sellerId = sellerId
    const subOrders = await prisma.subOrder.findMany({
      where: { sellerId },
      include: {
        order: {
          select: {
            orderNumber: true,
            customerName: true,
            customerPhone: true,
            shippingAddress: true,
            shippingCity: true,
            shippingPincode: true,
            createdAt: true,
            paymentStatus: true,
          },
        },
        items: true,
        commissionLedger: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ subOrders })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { subOrderId, fulfillmentStatus, trackingNumber, deliveryNotes } = body

    if (!subOrderId || !fulfillmentStatus) {
      return NextResponse.json({ error: 'subOrderId and fulfillmentStatus are required' }, { status: 400 })
    }

    const updated = await prisma.subOrder.update({
      where: { id: subOrderId },
      data: {
        fulfillmentStatus,
        trackingNumber: trackingNumber || undefined,
        deliveryNotes: deliveryNotes || undefined,
      },
      include: {
        commissionLedger: true,
      },
    })

    // If marked DELIVERED, make commission ledger eligible for payout!
    if (fulfillmentStatus === 'DELIVERED') {
      await prisma.commissionLedger.updateMany({
        where: { subOrderId },
        data: {
          settlementStatus: 'ELIGIBLE_FOR_PAYOUT',
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${fulfillmentStatus}`,
      subOrder: updated,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
