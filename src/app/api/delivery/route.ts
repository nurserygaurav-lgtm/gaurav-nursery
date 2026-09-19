import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 })
    }
    if (user.role !== 'DELIVERY_PARTNER' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Delivery Partner access required' }, { status: 403 })
    }

    const deliveries = await prisma.subOrder.findMany({
      include: {
        seller: {
          select: {
            businessName: true,
            nurseryAddress: true,
            city: true,
            pincode: true,
          },
        },
        order: {
          select: {
            orderNumber: true,
            customerName: true,
            customerPhone: true,
            shippingAddress: true,
            shippingCity: true,
            shippingPincode: true,
            paymentMethod: true,
            paymentStatus: true,
          },
        },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ deliveries })
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
    if (user.role !== 'DELIVERY_PARTNER' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Delivery Partner access required' }, { status: 403 })
    }

    const body = await request.json()
    const { subOrderId, status, deliveryNotes } = body

    if (!subOrderId || !status) {
      return NextResponse.json({ error: 'subOrderId and status are required' }, { status: 400 })
    }

    const updated = await prisma.subOrder.update({
      where: { id: subOrderId },
      data: {
        fulfillmentStatus: status,
        deliveryNotes: deliveryNotes || undefined,
      },
    })

    // If delivered, update commission ledger to ELIGIBLE_FOR_PAYOUT
    if (status === 'DELIVERED') {
      await prisma.commissionLedger.updateMany({
        where: { subOrderId },
        data: {
          settlementStatus: 'ELIGIBLE_FOR_PAYOUT',
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: `Delivery status updated to ${status}`,
      subOrder: updated,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
