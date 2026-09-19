import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyRazorpaySignature, reconcileRefund } from '@/lib/payment'

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing webhook signature' }, { status: 400 })
    }

    const isValid = verifyRazorpaySignature(rawBody, signature)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
    }

    const eventData = JSON.parse(rawBody)
    const { event, payload } = eventData

    if (event === 'payment.captured' || event === 'order.paid') {
      const orderNumber = payload?.payment?.entity?.notes?.orderNumber || payload?.order?.entity?.receipt
      if (orderNumber) {
        await prisma.order.updateMany({
          where: { orderNumber },
          data: { paymentStatus: 'PAID' },
        })
      }
    } else if (event === 'refund.processed') {
      const subOrderId = payload?.refund?.entity?.notes?.subOrderId
      const refundAmount = (payload?.refund?.entity?.amount || 0) / 100 // Convert paise to INR

      if (subOrderId && refundAmount > 0) {
        await reconcileRefund({
          subOrderId,
          refundAmount,
          reason: 'Razorpay webhook automated refund processing',
        })
      }
    }

    return NextResponse.json({ received: true, event })
  } catch (error: any) {
    console.error('Razorpay webhook processing error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
