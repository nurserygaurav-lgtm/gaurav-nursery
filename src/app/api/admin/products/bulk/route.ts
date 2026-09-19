import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productIds, action, rejectionReason } = body

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: 'productIds array is required' }, { status: 400 })
    }

    if (!action || !['APPROVE_ALL', 'REJECT_ALL'].includes(action)) {
      return NextResponse.json({ error: 'Valid action (APPROVE_ALL or REJECT_ALL) is required' }, { status: 400 })
    }

    const currentUser = await getCurrentUser()
    const newStatus = action === 'APPROVE_ALL' ? 'LIVE' : 'REJECTED'

    const result = await prisma.product.updateMany({
      where: {
        id: { in: productIds },
      },
      data: {
        status: newStatus,
        rejectionReason: action === 'REJECT_ALL' ? rejectionReason || 'Bulk rejected by Admin moderation' : null,
      },
    })

    // Log Audit event
    await prisma.auditLog.create({
      data: {
        actorId: currentUser?.userId || null,
        action: `BULK_PRODUCTS_${newStatus}`,
        entityType: 'PRODUCT',
        metadata: JSON.stringify({
          count: result.count,
          productIds,
          action,
        }),
      },
    })

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${result.count} plants to ${newStatus}`,
      count: result.count,
      status: newStatus,
    })
  } catch (error: any) {
    console.error('Bulk product update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
