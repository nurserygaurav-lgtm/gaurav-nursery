import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 })
    }
    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Super Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: any = {}
    if (status) {
      where.status = status
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            businessName: true,
            city: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const formatted = products.map((p) => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
    }))

    return NextResponse.json({ products: formatted })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { productId, action, rejectionReason } = body

    if (!productId || !action) {
      return NextResponse.json({ error: 'productId and action are required' }, { status: 400 })
    }

    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 })
    }
    if (currentUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Super Admin access required' }, { status: 403 })
    }

    const newStatus = action === 'APPROVE' ? 'LIVE' : 'REJECTED'

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        status: newStatus,
        rejectionReason: action === 'REJECT' ? rejectionReason || 'Product specs do not meet quality guidelines' : null,
      },
      include: {
        seller: true,
      },
    })

    // Log Audit event
    await prisma.auditLog.create({
      data: {
        actorId: currentUser?.userId || null,
        action: `PRODUCT_STATUS_${newStatus}`,
        entityType: 'PRODUCT',
        entityId: productId,
        metadata: JSON.stringify({ title: updated.title, newStatus }),
      },
    })

    return NextResponse.json({
      success: true,
      message: `Product is now ${newStatus}`,
      product: updated,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
