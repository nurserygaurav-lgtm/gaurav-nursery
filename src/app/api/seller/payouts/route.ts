import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    const { searchParams } = new URL(request.url)
    let sellerId = user?.sellerId || searchParams.get('sellerId')

    if (!sellerId) {
      const first = await prisma.sellerProfile.findFirst()
      sellerId = first?.id
    }

    if (!sellerId) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 })
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
    const body = await request.json()
    const { sellerId: inputSellerId, amount } = body

    const user = await getCurrentUser()
    let sellerId = user?.sellerId || inputSellerId

    if (!sellerId) {
      const first = await prisma.sellerProfile.findFirst()
      sellerId = first?.id
    }

    if (!sellerId) {
      return NextResponse.json({ error: 'Seller profile required' }, { status: 400 })
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
