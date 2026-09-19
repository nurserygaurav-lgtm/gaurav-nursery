import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 })
    }
    if (user.role !== 'SELLER' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Seller access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const sellerIdParam = searchParams.get('sellerId')

    let sellerId: string | undefined = user.sellerId

    // If user is SELLER and tries to query a different seller's ID, forbid it
    if (user.role === 'SELLER') {
      if (sellerIdParam && sellerIdParam !== user.sellerId) {
        return NextResponse.json({ error: "Forbidden: Cannot access another seller's data" }, { status: 403 })
      }
      sellerId = user.sellerId
    } else if (user.role === 'SUPER_ADMIN') {
      sellerId = sellerIdParam || user.sellerId
    }

    if (!sellerId) {
      return NextResponse.json({ error: 'Seller profile not found or unlinked' }, { status: 404 })
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
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 })
    }
    if (user.role !== 'SELLER' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Seller access required' }, { status: 403 })
    }

    const body = await request.json()
    const { subOrderId, fulfillmentStatus, trackingNumber, deliveryNotes } = body

    if (!subOrderId || !fulfillmentStatus) {
      return NextResponse.json({ error: 'subOrderId and fulfillmentStatus are required' }, { status: 400 })
    }

    const existingSubOrder = await prisma.subOrder.findUnique({
      where: { id: subOrderId },
    })

    if (!existingSubOrder) {
      return NextResponse.json({ error: 'SubOrder not found' }, { status: 404 })
    }

    // Resource ownership check: ensure the subOrder belongs to this seller
    if (user.role === 'SELLER' && existingSubOrder.sellerId !== user.sellerId) {
      return NextResponse.json({ error: "Forbidden: Cannot modify another seller's order" }, { status: 403 })
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
