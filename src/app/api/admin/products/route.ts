import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { callBackendApi } from '@/lib/backendClient'

export const dynamic = 'force-dynamic'

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
    const status = searchParams.get('status') || undefined

    // 1. Fetch from Render Backend (MongoDB)
    const backendRes = await callBackendApi('/admin/products', { params: { status } })
    if (backendRes.ok && backendRes.data?.products && backendRes.data.products.length > 0) {
      return NextResponse.json(backendRes.data)
    }

    // 2. Fallback to local DB if backend temporarily cold/unreachable
    const where: any = {}
    if (status) where.status = status

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

    // 1. Mutate in Render Backend (MongoDB)
    const backendRes = await callBackendApi('/admin/products', {
      method: 'PATCH',
      body: { productId, action, rejectionReason },
    })

    // 2. Synchronize local Prisma record if present
    try {
      await prisma.product.update({
        where: { id: productId },
        data: {
          status: newStatus,
          rejectionReason: action === 'REJECT' ? rejectionReason || 'Product specs do not meet quality guidelines' : null,
        },
      })
    } catch {
      // Handled if MongoDB ObjectId
    }

    try {
      revalidatePath('/admin/products')
      revalidatePath('/shop')
      revalidatePath('/seller/products')
    } catch {
      // Revalidation context safety
    }

    if (backendRes.ok && backendRes.data) {
      return NextResponse.json(backendRes.data)
    }

    return NextResponse.json({
      success: true,
      message: `Product is now ${newStatus}`,
      product: { id: productId, status: newStatus },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
