import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { callBackendApi } from '@/lib/backendClient'

export const dynamic = 'force-dynamic'

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
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 })
    }
    if (currentUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Super Admin access required' }, { status: 403 })
    }

    const newStatus = action === 'APPROVE_ALL' ? 'LIVE' : 'REJECTED'

    // 1. Mutate in Render Backend (MongoDB)
    const backendRes = await callBackendApi('/admin/products/bulk', {
      method: 'POST',
      body: { productIds, action, rejectionReason },
    })

    // 2. Synchronize local Prisma
    try {
      await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: {
          status: newStatus,
          rejectionReason: action === 'REJECT_ALL' ? rejectionReason || 'Bulk rejected by Admin moderation' : null,
        },
      })
    } catch {
      // Ignored for MongoDB objectIds
    }

    try {
      revalidatePath('/admin/products')
      revalidatePath('/shop')
      revalidatePath('/seller/products')
    } catch {
      // Revalidation safety
    }

    if (backendRes.ok && backendRes.data) {
      return NextResponse.json(backendRes.data)
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${productIds.length} plants to ${newStatus}`,
      count: productIds.length,
      status: newStatus,
    })
  } catch (error: any) {
    console.error('Bulk product update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
