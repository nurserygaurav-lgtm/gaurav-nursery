import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { calculateMultiVendorSplits, CartItemInput } from '@/lib/commission'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPincode,
      paymentMethod = 'TEST_PAYMENT',
      items,
    } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    if (!customerName || !customerEmail || !shippingAddress || !shippingCity || !shippingPincode) {
      return NextResponse.json({ error: 'Please provide all shipping address details' }, { status: 400 })
    }

    // 1. Identify or link Customer
    const currentUser = await getCurrentUser()
    let customerId = currentUser?.userId

    if (!customerId) {
      // Find or create customer account by email
      let customerUser = await prisma.user.findUnique({
        where: { email: customerEmail.toLowerCase().trim() },
      })

      if (!customerUser) {
        customerUser = await prisma.user.create({
          data: {
            email: customerEmail.toLowerCase().trim(),
            name: customerName,
            phone: customerPhone,
            passwordHash: 'guest-account',
            role: 'CUSTOMER',
          },
        })
      }
      customerId = customerUser.id
    }

    // 2. Resolve & validate real products and sellers from DB
    const activeSellers = await prisma.sellerProfile.findMany({
      where: { status: 'ACTIVE' },
      include: { products: true },
    })

    if (activeSellers.length === 0) {
      return NextResponse.json({ error: 'No active nurseries available to fulfill orders' }, { status: 400 })
    }

    const liveProducts = await prisma.product.findMany({
      where: { status: 'LIVE' },
      include: { seller: true },
    })

    const sanitizedItems: CartItemInput[] = items.map((it: any, index: number) => {
      let matched = liveProducts.find((p) => p.id === it.productId)
      if (!matched) {
        matched = liveProducts.find((p) => p.title.toLowerCase() === it.title?.toLowerCase())
      }
      if (!matched) {
        // Fallback to distinct seeded live product for demo multi-vendor split
        matched = liveProducts[index % liveProducts.length] || liveProducts[0]
      }

      return {
        productId: matched?.id || it.productId,
        title: it.title || matched?.title || 'Live Nursery Plant',
        price: parseFloat(it.price) || matched?.price || 499,
        quantity: Math.max(1, parseInt(it.quantity, 10) || 1),
        image: it.image || 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80',
        sellerId: matched?.sellerId || activeSellers[0].id,
        sellerBusinessName: matched?.seller?.businessName || activeSellers[0].businessName,
      }
    })

    // 3. Perform Multi-Vendor Order Splitting & 10% Commission Calculations (Frozen at creation)
    const splitCalculation = calculateMultiVendorSplits(sanitizedItems, 0.10)

    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const orderNumber = `GN-${new Date().getFullYear()}-${randomSuffix}`

    // 4. Execute Transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create Master Order
      const masterOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId,
          customerName,
          customerEmail,
          customerPhone: customerPhone || '+91 99999 99999',
          shippingAddress,
          shippingCity,
          shippingState: shippingState || 'Gujarat',
          shippingPincode,
          totalGrossAmount: splitCalculation.totalGrossAmount,
          totalPlatformFee: splitCalculation.totalPlatformFee,
          totalSellerNet: splitCalculation.totalSellerNet,
          paymentMethod,
          paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
          masterStatus: 'PLACED',
        },
      })

      const subOrderLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
      const createdSubOrders = []

      // Create each SubOrder and its immutable CommissionLedger entry
      for (let i = 0; i < splitCalculation.subOrders.length; i++) {
        const sub = splitCalculation.subOrders[i]
        const letter = subOrderLetters[i] || `${i + 1}`
        const subOrderNumber = `${orderNumber}-${letter}`

        // Create SubOrder
        const subOrder = await tx.subOrder.create({
          data: {
            subOrderNumber,
            orderId: masterOrder.id,
            sellerId: sub.sellerId,
            grossAmount: sub.grossAmount,
            platformFee: sub.platformFee,
            sellerNet: sub.sellerNet,
            fulfillmentStatus: 'PLACED',
            trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
          },
        })

        // Create Order Items
        for (const it of sub.items) {
          await tx.orderItem.create({
            data: {
              subOrderId: subOrder.id,
              productId: it.productId,
              productTitle: it.title,
              productImage: it.image || null,
              unitPrice: it.unitPrice,
              quantity: it.quantity,
              lineTotal: it.lineTotal,
              commissionRate: it.commissionRate,
              commissionAmount: it.commissionAmount,
              sellerEarning: it.sellerEarning,
            },
          })

          // Decrement stock
          await tx.product.update({
            where: { id: it.productId },
            data: {
              stock: { decrement: it.quantity },
            },
          })
        }

        // Create 10% Immutable Commission Ledger Entry
        await tx.commissionLedger.create({
          data: {
            subOrderId: subOrder.id,
            sellerId: sub.sellerId,
            orderAmount: sub.grossAmount,
            commissionRate: 0.10,
            platformFee: sub.platformFee,
            sellerGross: sub.sellerNet,
            refundAmount: 0.0,
            sellerPayable: sub.sellerNet,
            settlementStatus: 'PENDING_DELIVERY',
          },
        })

        createdSubOrders.push(subOrder)
      }

      // Record Audit Log
      await tx.auditLog.create({
        data: {
          actorId: customerId,
          action: 'ORDER_PLACED_MULTI_SPLIT',
          entityType: 'ORDER',
          entityId: masterOrder.id,
          metadata: JSON.stringify({
            orderNumber,
            gross: splitCalculation.totalGrossAmount,
            platformFee10Percent: splitCalculation.totalPlatformFee,
            subOrdersCount: splitCalculation.subOrders.length,
          }),
        },
      })

      return { masterOrder, createdSubOrders }
    })

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully! Multi-vendor split and 10% commission ledger created.',
      order: result.masterOrder,
      subOrders: result.createdSubOrders,
      splits: splitCalculation,
    })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to place order' },
      { status: 500 }
    )
  }
}
