import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { callBackendApi } from '@/lib/backendClient'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 })
    }
    if (user.role !== 'DELIVERY_PARTNER' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Delivery Partner access required' }, { status: 403 })
    }

    // 1. Fetch from Render Backend (MongoDB)
    const backendRes = await callBackendApi('/delivery')
    if (backendRes.ok && backendRes.data?.dispatches && backendRes.data.dispatches.length > 0) {
      return NextResponse.json({ deliveries: backendRes.data.dispatches })
    }

    // 2. Fallback
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
    const { subOrderId, subOrderNumber, status, deliveryNotes } = body

    if ((!subOrderId && !subOrderNumber) || !status) {
      return NextResponse.json({ error: 'subOrderId (or subOrderNumber) and status are required' }, { status: 400 })
    }

    // 1. Mutate in Render Backend (MongoDB)
    const backendRes = await callBackendApi('/delivery', {
      method: 'PATCH',
      body: { subOrderNumber: subOrderNumber || subOrderId, status, deliveryNotes },
    })

    // 2. Synchronize local Prisma
    try {
      if (subOrderId) {
        await prisma.subOrder.update({
          where: { id: subOrderId },
          data: {
            fulfillmentStatus: status,
            deliveryNotes: deliveryNotes || undefined,
          },
        })

        if (status === 'DELIVERED') {
          await prisma.commissionLedger.updateMany({
            where: { subOrderId },
            data: { settlementStatus: 'ELIGIBLE_FOR_PAYOUT' },
          })
        }
      }
    } catch {
      // Ignore id mismatch
    }

    try {
      revalidatePath('/delivery')
    } catch {
      // Revalidation safety
    }

    if (backendRes.ok && backendRes.data) {
      return NextResponse.json(backendRes.data)
    }

    return NextResponse.json({
      success: true,
      message: `Delivery status updated to ${status}`,
      status,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
