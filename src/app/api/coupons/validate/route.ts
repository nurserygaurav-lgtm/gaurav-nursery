import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function handleValidation(codeStr: string | null, subtotalStr: string | null) {
  if (!codeStr) {
    return NextResponse.json({ error: 'Please enter a coupon code' }, { status: 400 })
  }

  const subtotal = parseFloat(subtotalStr || '1000')
  const coupon = await prisma.coupon.findUnique({
    where: { code: codeStr.toUpperCase().trim() },
  })

  if (!coupon || !coupon.isActive) {
    // If not in local DB, check fallback for demo
    if (codeStr.toUpperCase().trim() === 'MONSOON10') {
      return NextResponse.json({
        valid: true,
        code: 'MONSOON10',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        discountAmount: 100,
        finalAmount: Math.max(0, subtotal - 100),
        message: 'Coupon MONSOON10 applied! Saved ₹100.',
      })
    }
    return NextResponse.json({ error: 'Invalid or expired promo coupon' }, { status: 404 })
  }

  if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
    return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 })
  }

  if (subtotal < coupon.minOrderAmount) {
    return NextResponse.json(
      { error: `Minimum cart value of ₹${coupon.minOrderAmount} required for this coupon` },
      { status: 400 }
    )
  }

  let discountAmount = 0
  if (coupon.discountType === 'PERCENTAGE') {
    discountAmount = Math.round((subtotal * coupon.discountValue) / 100)
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount
    }
  } else {
    discountAmount = Math.min(coupon.discountValue, subtotal)
  }

  return NextResponse.json({
    valid: true,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount,
    finalAmount: Math.max(0, subtotal - discountAmount),
    message: `Coupon ${coupon.code} applied! Saved ₹${discountAmount}.`,
  })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const cartSubtotal = searchParams.get('cartSubtotal')
  return handleValidation(code, cartSubtotal)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { code, cartSubtotal } = body
    return handleValidation(code, cartSubtotal)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
