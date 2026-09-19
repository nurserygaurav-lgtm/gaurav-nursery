import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 })
    }
    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Super Admin access required' }, { status: 403 })
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ coupons })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 })
    }
    if (currentUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Super Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const {
      code,
      discountType = 'PERCENTAGE',
      discountValue,
      minOrderAmount = 0,
      maxDiscount,
      validUntil,
    } = body

    if (!code || !discountValue) {
      return NextResponse.json({ error: 'Coupon code and discount value are required' }, { status: 400 })
    }

    const cleanCode = code.toUpperCase().trim()
    const existing = await prisma.coupon.findUnique({ where: { code: cleanCode } })
    if (existing) {
      return NextResponse.json({ error: `Coupon code '${cleanCode}' already exists` }, { status: 400 })
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: cleanCode,
        discountType,
        discountValue: parseFloat(discountValue),
        minOrderAmount: parseFloat(minOrderAmount || '0'),
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        validUntil: validUntil ? new Date(validUntil) : null,
        isActive: true,
      },
    })

    await prisma.auditLog.create({
      data: {
        actorId: currentUser.userId,
        action: 'COUPON_CREATED',
        entityType: 'COUPON',
        entityId: coupon.id,
        metadata: JSON.stringify({ code: coupon.code, discountValue, discountType }),
      },
    })

    return NextResponse.json({ success: true, message: `Coupon ${coupon.code} created!`, coupon })
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
    const { id, isActive } = body

    if (!id) {
      return NextResponse.json({ error: 'Coupon ID is required' }, { status: 400 })
    }

    const updated = await prisma.coupon.update({
      where: { id },
      data: { isActive },
    })

    return NextResponse.json({ success: true, coupon: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
