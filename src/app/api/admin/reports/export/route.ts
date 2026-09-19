import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function formatCSVField(val: any): string {
  if (val === null || val === undefined) return '""'
  const str = String(val).replace(/"/g, '""')
  return `"${str}"`
}

function buildCSV(headers: string[], rows: (string | number)[][]): string {
  const headerLine = headers.map(formatCSVField).join(',')
  const rowLines = rows.map(row => row.map(formatCSVField).join(','))
  // Prepend UTF-8 BOM for flawless Excel and spreadsheet import
  return '\uFEFF' + [headerLine, ...rowLines].join('\r\n')
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'orders'
    const timestamp = new Date().toISOString().split('T')[0]

    if (type === 'commission') {
      const ledgers = await prisma.commissionLedger.findMany({
        include: {
          seller: true,
          subOrder: true,
        },
        orderBy: { createdAt: 'desc' },
      })

      const headers = [
        'Sub-Order Number',
        'Date & Time',
        'Nursery Name',
        'Seller Phone',
        'Order Amount (INR)',
        'Commission Rate (%)',
        '10% Platform Fee (INR)',
        'Seller Gross (INR)',
        'Refund Amount (INR)',
        'Seller Payable (INR)',
        'Settlement Status',
        'Payout Reference',
      ]

      const rows = ledgers.map(l => [
        l.subOrder?.subOrderNumber || l.subOrderId,
        new Date(l.createdAt).toLocaleString('en-IN'),
        l.seller?.storeName || 'N/A',
        l.seller?.phone || 'N/A',
        l.orderAmount.toFixed(2),
        `${(l.commissionRate * 100).toFixed(0)}%`,
        l.platformFee.toFixed(2),
        l.sellerGross.toFixed(2),
        l.refundAmount.toFixed(2),
        l.sellerPayable.toFixed(2),
        l.settlementStatus,
        l.payoutId || 'UNSETTLED',
      ])

      const csvContent = buildCSV(headers, rows)

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="gaurav_nursery_commission_ledger_${timestamp}.csv"`,
        },
      })
    }

    // Default: Orders export
    const orders = await prisma.order.findMany({
      include: {
        subOrders: {
          include: {
            seller: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const headers = [
      'Master Order Number',
      'Date & Time',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Shipping City',
      'Shipping State',
      'Shipping Pincode',
      'Payment Status',
      'Payment Method',
      'Fulfillment Status',
      'Gross Total (INR)',
      '10% Platform Fee (INR)',
      'Seller Net Total (INR)',
      'Split Nurseries Involved',
    ]

    const rows = orders.map(o => {
      const nurseries = o.subOrders.map(so => so.seller?.storeName).filter(Boolean).join('; ')
      return [
        o.orderNumber,
        new Date(o.createdAt).toLocaleString('en-IN'),
        o.customerName,
        o.customerEmail,
        o.customerPhone,
        o.shippingCity,
        o.shippingState,
        o.shippingPincode,
        o.paymentStatus,
        o.paymentMethod,
        o.masterStatus,
        o.totalGrossAmount.toFixed(2),
        o.totalPlatformFee.toFixed(2),
        o.totalSellerNet.toFixed(2),
        nurseries || 'N/A',
      ]
    })

    const csvContent = buildCSV(headers, rows)

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="gaurav_nursery_orders_${timestamp}.csv"`,
      },
    })
  } catch (error: any) {
    console.error('CSV Export error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
