import crypto from 'crypto'
import { prisma } from './prisma'

/**
 * Validates Razorpay Webhook Signature using HMAC SHA256 (Constant-time comparison)
 */
export function verifyRazorpaySignature(
  rawBody: string,
  signature: string,
  secret: string = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_webhook_secret_key'
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex')

    const sigBuffer = Buffer.from(signature)
    const expectedBuffer = Buffer.from(expectedSignature)

    if (sigBuffer.length !== expectedBuffer.length) {
      return false
    }

    return crypto.timingSafeEqual(sigBuffer, expectedBuffer)
  } catch (error) {
    console.error('Razorpay signature verification failed:', error)
    return false
  }
}

/**
 * Validates Cashfree Webhook Signature using HMAC SHA256
 */
export function verifyCashfreeSignature(
  rawBody: string,
  signature: string,
  timestamp: string,
  secret: string = process.env.CASHFREE_CLIENT_SECRET || 'test_cashfree_secret_key'
): boolean {
  try {
    const payload = timestamp + rawBody
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('base64')

    const sigBuffer = Buffer.from(signature)
    const expectedBuffer = Buffer.from(expectedSignature)

    if (sigBuffer.length !== expectedBuffer.length) {
      return false
    }

    return crypto.timingSafeEqual(sigBuffer, expectedBuffer)
  } catch (error) {
    console.error('Cashfree signature verification failed:', error)
    return false
  }
}

/**
 * Reconciles refund against sub-order & freezes 10% platform commission accounting
 */
export async function reconcileRefund({
  subOrderId,
  refundAmount,
  reason = 'Customer cancellation or damaged plant return',
}: {
  subOrderId: string
  refundAmount: number
  reason?: string
}) {
  const ledger = await prisma.commissionLedger.findUnique({
    where: { subOrderId },
    include: { subOrder: true },
  })

  if (!ledger) {
    throw new Error(`No commission ledger found for sub-order: ${subOrderId}`)
  }

  const updatedRefund = ledger.refundAmount + refundAmount
  // Seller gross (90%) absorbs product return deduction; platform fee remains auditable
  const newSellerPayable = Math.max(0, ledger.sellerGross - updatedRefund)

  const updatedLedger = await prisma.commissionLedger.update({
    where: { id: ledger.id },
    data: {
      refundAmount: updatedRefund,
      sellerPayable: newSellerPayable,
    },
  })

  // Update sub-order fulfillment status if fully refunded
  if (updatedRefund >= ledger.orderAmount) {
    await prisma.subOrder.update({
      where: { id: subOrderId },
      data: { fulfillmentStatus: 'CANCELLED' },
    })
  }

  // Record immutable audit log
  await prisma.auditLog.create({
    data: {
      action: 'REFUND_RECONCILED',
      entityType: 'ORDER',
      entityId: subOrderId,
      metadata: JSON.stringify({
        subOrderId,
        refundAmount,
        previousRefund: ledger.refundAmount,
        newSellerPayable,
        reason,
      }),
    },
  })

  return updatedLedger
}
