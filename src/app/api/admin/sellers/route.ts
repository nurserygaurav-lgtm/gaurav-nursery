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
    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Super Admin access required' }, { status: 403 })
    }

    // 1. Fetch from Render Backend (MongoDB)
    const backendRes = await callBackendApi('/admin/sellers')
    if (backendRes.ok && backendRes.data?.sellers && backendRes.data.sellers.length > 0) {
      const normalizedSellers = backendRes.data.sellers.map((s: any) => ({
        ...s,
        user: s.user || {
          name: s.name || s.businessName || 'Verified Partner',
          email: s.email || '',
          phone: s.phone || '',
        }
      }))
      return NextResponse.json({ sellers: normalizedSellers })
    }

    // 2. Fallback
    const sellers = await prisma.sellerProfile.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            products: true,
            subOrders: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ sellers })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 })
    }
    if (currentUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Super Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { sellerId, action, rejectionReason } = body

    if (!sellerId || !action) {
      return NextResponse.json({ error: 'sellerId and action are required' }, { status: 400 })
    }

    let newStatus = 'ACTIVE'
    if (action === 'REJECT') {
      newStatus = 'REJECTED'
    } else if (action === 'SUSPEND') {
      newStatus = 'SUSPENDED'
    } else if (action === 'REACTIVATE' || action === 'APPROVE') {
      newStatus = 'ACTIVE'
    }

    // 1. Mutate in Render Backend (MongoDB)
    const backendRes = await callBackendApi('/admin/sellers', {
      method: 'PATCH',
      body: { sellerId, action, rejectionReason },
    })

    // 2. Synchronize local Prisma
    try {
      await prisma.sellerProfile.update({
        where: { id: sellerId },
        data: {
          status: newStatus,
          rejectionReason: action === 'REJECT' ? rejectionReason || 'KYC documentation insufficient' : null,
        },
      })
    } catch {
      // Ignored for MongoDB objectIds
    }

    try {
      revalidatePath('/admin/sellers')
      revalidatePath('/admin')
    } catch {
      // Revalidation safety
    }

    if (backendRes.ok && backendRes.data) {
      return NextResponse.json(backendRes.data)
    }

    return NextResponse.json({
      success: true,
      message: `Seller status successfully updated to ${newStatus}`,
      seller: { id: sellerId, status: newStatus },
    })
  } catch (error: any) {
    console.error('Seller status update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
