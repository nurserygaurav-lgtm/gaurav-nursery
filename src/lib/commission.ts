/**
 * Gaurav Nursery — 10% Commission Engine & Multi-Vendor Splitting Logic
 * 
 * Rules:
 * 1. Master Order contains total cart items.
 * 2. Group items by Seller ID.
 * 3. For each Seller:
 *    - Create SubOrder with subOrderNumber (e.g. GN-2026-1001-A).
 *    - Calculate Gross Amount = Sum(unitPrice * quantity).
 *    - Platform Commission = Gross Amount * 10% (0.10).
 *    - Seller Net Payable = Gross Amount - Platform Commission (90%).
 * 4. Write immutable CommissionLedger entry for audit trail.
 */

export interface CartItemInput {
  productId: string
  title: string
  price: number
  quantity: number
  image?: string
  sellerId: string
  sellerBusinessName?: string
}

export interface SplitSubOrderCalculation {
  sellerId: string
  items: {
    productId: string
    title: string
    unitPrice: number
    quantity: number
    image?: string
    lineTotal: number
    commissionRate: number
    commissionAmount: number
    sellerEarning: number
  }[]
  grossAmount: number
  platformFee: number
  sellerNet: number
}

export interface MasterOrderCalculation {
  totalGrossAmount: number
  totalPlatformFee: number
  totalSellerNet: number
  subOrders: SplitSubOrderCalculation[]
}

export function calculateMultiVendorSplits(
  cartItems: CartItemInput[],
  defaultCommissionRate = 0.10
): MasterOrderCalculation {
  // Group cart items by sellerId
  const sellerGroups = new Map<string, CartItemInput[]>()

  for (const item of cartItems) {
    const existing = sellerGroups.get(item.sellerId) || []
    existing.push(item)
    sellerGroups.set(item.sellerId, existing)
  }

  const subOrders: SplitSubOrderCalculation[] = []
  let totalGrossAmount = 0
  let totalPlatformFee = 0
  let totalSellerNet = 0

  for (const [sellerId, items] of sellerGroups.entries()) {
    let sellerGross = 0
    let sellerCommissionTotal = 0
    let sellerNetTotal = 0

    const calculatedItems = items.map((item) => {
      const lineTotal = Math.round(item.price * item.quantity * 100) / 100
      const commissionAmount = Math.round(lineTotal * defaultCommissionRate * 100) / 100
      const sellerEarning = Math.round((lineTotal - commissionAmount) * 100) / 100

      sellerGross += lineTotal
      sellerCommissionTotal += commissionAmount
      sellerNetTotal += sellerEarning

      return {
        productId: item.productId,
        title: item.title,
        unitPrice: item.price,
        quantity: item.quantity,
        image: item.image,
        lineTotal,
        commissionRate: defaultCommissionRate,
        commissionAmount,
        sellerEarning,
      }
    })

    // Round amounts to avoid floating point issues
    sellerGross = Math.round(sellerGross * 100) / 100
    sellerCommissionTotal = Math.round(sellerCommissionTotal * 100) / 100
    sellerNetTotal = Math.round(sellerNetTotal * 100) / 100

    subOrders.push({
      sellerId,
      items: calculatedItems,
      grossAmount: sellerGross,
      platformFee: sellerCommissionTotal,
      sellerNet: sellerNetTotal,
    })

    totalGrossAmount += sellerGross
    totalPlatformFee += sellerCommissionTotal
    totalSellerNet += sellerNetTotal
  }

  return {
    totalGrossAmount: Math.round(totalGrossAmount * 100) / 100,
    totalPlatformFee: Math.round(totalPlatformFee * 100) / 100,
    totalSellerNet: Math.round(totalSellerNet * 100) / 100,
    subOrders,
  }
}
