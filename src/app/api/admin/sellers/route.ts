import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
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
    const body = await request.json()
    const { sellerId, action, rejectionReason } = body

    if (!sellerId || !action) {
      return NextResponse.json({ error: 'sellerId and action are required' }, { status: 400 })
    }

    const currentUser = await getCurrentUser()

    let newStatus = 'ACTIVE'
    if (action === 'REJECT') {
      newStatus = 'REJECTED'
    } else if (action === 'SUSPEND') {
      newStatus = 'SUSPENDED'
    } else if (action === 'REACTIVATE' || action === 'APPROVE') {
      newStatus = 'ACTIVE'
    }

    const updatedSeller = await prisma.sellerProfile.update({
      where: { id: sellerId },
      data: {
        status: newStatus,
        rejectionReason: action === 'REJECT' ? rejectionReason || 'KYC documentation insufficient' : null,
      },
      include: {
        user: true,
      },
    })

    // Record Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: currentUser?.userId || null,
        action: `SELLER_STATUS_${newStatus}`,
        entityType: 'SELLER',
        entityId: sellerId,
        metadata: JSON.stringify({
          businessName: updatedSeller.businessName,
          status: newStatus,
          reason: rejectionReason || null,
        }),
      },
    })

    // Create notification for seller user
    await prisma.notification.create({
      data: {
        userId: updatedSeller.userId,
        title: action === 'APPROVE' ? 'Nursery Approved! 🎉' : 'Nursery KYC Update',
        message: action === 'APPROVE' 
          ? 'Your nursery profile and bank KYC have been approved. You can now list plants and receive orders!'
          : `Your seller application status has been updated to ${newStatus}. Reason: ${rejectionReason || 'Contact support'}.`,
        link: '/seller/dashboard',
      },
    })

    return NextResponse.json({
      success: true,
      message: `Seller status successfully updated to ${newStatus}`,
      seller: updatedSeller,
    })
  } catch (error: any) {
    console.error('Seller status update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
