import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 })
    }
    if (user.role !== 'SELLER' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Seller access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const sellerIdParam = searchParams.get('sellerId')

    let sellerId: string | undefined = user.sellerId

    if (user.role === 'SELLER') {
      if (sellerIdParam && sellerIdParam !== user.sellerId) {
        return NextResponse.json({ error: "Forbidden: Cannot access another seller's financial data" }, { status: 403 })
      }
      sellerId = user.sellerId
    } else if (user.role === 'SUPER_ADMIN') {
      sellerId = sellerIdParam || user.sellerId
    }

    if (!sellerId) {
      return NextResponse.json({ error: 'Seller profile not found or unlinked' }, { status: 404 })
    }

    const [seller, ledgers, payouts] = await Promise.all([
      prisma.sellerProfile.findUnique({ where: { id: sellerId } }),
      prisma.commissionLedger.findMany({ where: { sellerId } }),
      prisma.sellerPayout.findMany({
        where: { sellerId },
        orderBy: { requestedAt: 'desc' },
      }),
    ])

    const totalGross = ledgers.reduce((acc, l) => acc + l.orderAmount, 0)
    const totalCommission = ledgers.reduce((acc, l) => acc + l.platformFee, 0)
    const totalNetPayable = ledgers.reduce((acc, l) => acc + l.sellerPayable, 0)

    const availableForPayout = ledgers
      .filter((l) => l.settlementStatus === 'ELIGIBLE_FOR_PAYOUT')
      .reduce((acc, l) => acc + l.sellerPayable, 0)

    const alreadySettled = ledgers
      .filter((l) => l.settlementStatus === 'SETTLED')
      .reduce((acc, l) => acc + l.sellerPayable, 0)

    return NextResponse.json({
      seller,
      stats: {
        totalGross: Math.round(totalGross * 100) / 100,
        totalCommission: Math.round(totalCommission * 100) / 100,
        totalNetPayable: Math.round(totalNetPayable * 100) / 100,
        availableForPayout: Math.round(availableForPayout * 100) / 100,
        alreadySettled: Math.round(alreadySettled * 100) / 100,
      },
      ledgers,
      payouts,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 })
    }
    if (user.role !== 'SELLER' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Seller access required' }, { status: 403 })
    }

    const body = await request.json()
    const { sellerId: inputSellerId, amount } = body

    let sellerId: string | undefined = user.sellerId

    if (user.role === 'SELLER') {
      if (inputSellerId && inputSellerId !== user.sellerId) {
        return NextResponse.json({ error: "Forbidden: Cannot request payout for another seller" }, { status: 403 })
      }
      sellerId = user.sellerId
    } else if (user.role === 'SUPER_ADMIN') {
      sellerId = inputSellerId || user.sellerId
    }

    if (!sellerId) {
      return NextResponse.json({ error: 'Seller profile not found or unlinked' }, { status: 404 })
    }

    const seller = await prisma.sellerProfile.findUnique({ where: { id: sellerId } })
    if (!seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 })
    }

    const payoutNumber = `PAY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`

    const payout = await prisma.sellerPayout.create({
      data: {
        payoutNumber,
        sellerId,
        amount: parseFloat(amount || '500'),
        status: 'REQUESTED',
        bankName: seller.bankName,
        accountNumber: seller.accountNumber,
        ifscCode: seller.ifscCode,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Payout request submitted to Admin for processing.',
      payout,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
