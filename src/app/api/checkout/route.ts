import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { calculateMultiVendorSplits, CartItemInput } from '@/lib/commission'
import { callBackendApi } from '@/lib/backendClient'

export const dynamic = 'force-dynamic'

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

    // 1. Send to Render Backend (MongoDB)
    const backendRes = await callBackendApi('/checkout', {
      method: 'POST',
      body,
    })

    if (backendRes.ok && backendRes.data?.success) {
      // Also try to mirror locally for offline fallback
      try {
        const currentUser = await getCurrentUser()
        let customerId = currentUser?.userId

        if (!customerId) {
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

        const activeSellers = await prisma.sellerProfile.findMany({
          where: { status: 'ACTIVE' },
          include: { products: true },
        })

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
            matched = liveProducts[index % (liveProducts.length || 1)] || liveProducts[0]
          }

          return {
            productId: matched?.id || it.productId || 'demo',
            title: it.title || matched?.title || 'Live Nursery Plant',
            price: parseFloat(it.price) || matched?.price || 499,
            quantity: Math.max(1, parseInt(it.quantity, 10) || 1),
            image: it.image || 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80',
            sellerId: matched?.sellerId || activeSellers[0]?.id || 'demo-seller',
            sellerBusinessName: matched?.seller?.businessName || activeSellers[0]?.businessName || 'Nursery',
          }
        })

        const splitCalculation = calculateMultiVendorSplits(sanitizedItems, 0.10)
        const orderNumber = backendRes.data.order?.orderNumber || `GN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`

        await prisma.$transaction(async (tx) => {
          const masterOrder = await tx.order.create({
            data: {
              orderNumber,
              customerId: customerId || 'customer',
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

          const subOrderLetters = ['A', 'B', 'C', 'D']
          for (let i = 0; i < splitCalculation.subOrders.length; i++) {
            const sub = splitCalculation.subOrders[i]
            const subOrderNumber = `${orderNumber}-${subOrderLetters[i] || i}`
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
            }
          }
        })
      } catch (localErr) {
        console.warn('Local Prisma mirror warning:', localErr)
      }

      return NextResponse.json(backendRes.data)
    }

    // Fallback if backend offline
    const currentUser = await getCurrentUser()
    let customerId = currentUser?.userId

    if (!customerId) {
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

    const activeSellers = await prisma.sellerProfile.findMany({
      where: { status: 'ACTIVE' },
      include: { products: true },
    })

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
        matched = liveProducts[index % (liveProducts.length || 1)] || liveProducts[0]
      }

      return {
        productId: matched?.id || it.productId,
        title: it.title || matched?.title || 'Live Nursery Plant',
        price: parseFloat(it.price) || matched?.price || 499,
        quantity: Math.max(1, parseInt(it.quantity, 10) || 1),
        image: it.image || 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80',
        sellerId: matched?.sellerId || activeSellers[0]?.id,
        sellerBusinessName: matched?.seller?.businessName || activeSellers[0]?.businessName,
      }
    })

    const splitCalculation = calculateMultiVendorSplits(sanitizedItems, 0.10)
    const orderNumber = `GN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`

    const result = await prisma.$transaction(async (tx) => {
      const masterOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: customerId || 'customer',
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

      const subOrderLetters = ['A', 'B', 'C', 'D']
      const createdSubOrders = []

      for (let i = 0; i < splitCalculation.subOrders.length; i++) {
        const sub = splitCalculation.subOrders[i]
        const letter = subOrderLetters[i] || `${i + 1}`
        const subOrderNumber = `${orderNumber}-${letter}`

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
        }

        createdSubOrders.push(subOrder)
      }

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
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 500 })
  }
}
