import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
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

    const currentUser = await getCurrentUser()
    await prisma.auditLog.create({
      data: {
        actorId: currentUser?.userId || null,
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
