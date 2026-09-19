import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    const { searchParams } = new URL(request.url)
    const sellerIdParam = searchParams.get('sellerId')

    let sellerId = user?.sellerId || sellerIdParam

    if (!sellerId) {
      // Fallback to flagship seller for demo if not logged in
      const defaultSeller = await prisma.sellerProfile.findFirst()
      sellerId = defaultSeller?.id
    }

    if (!sellerId) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 })
    }

    const products = await prisma.product.findMany({
      where: { sellerId },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const formatted = products.map((p) => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
    }))

    return NextResponse.json({ products: formatted })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      categoryId,
      price,
      mrp,
      stock = 10,
      images = [],
      sunlight = 'Moderate',
      waterRequirement = 'Moderate (2-3 days)',
      plantHeight,
      potSize,
      soilType,
      difficulty = 'Beginner Friendly',
      plantType,
      careTips,
      submitForReview = true,
      sellerId: inputSellerId,
    } = body

    const user = await getCurrentUser()
    let sellerId = user?.sellerId || inputSellerId

    if (!sellerId) {
      const defaultSeller = await prisma.sellerProfile.findFirst()
      sellerId = defaultSeller?.id
    }

    if (!sellerId) {
      return NextResponse.json({ error: 'Seller profile required to list products' }, { status: 400 })
    }

    if (!title || !price || !categoryId) {
      return NextResponse.json({ error: 'Title, price, and category are required' }, { status: 400 })
    }

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`
    const sku = `GN-${Math.floor(1000 + Math.random() * 9000)}`

    // Product approval workflow: DRAFT -> PENDING_REVIEW -> APPROVED -> LIVE
    const initialStatus = submitForReview ? 'PENDING_REVIEW' : 'DRAFT'

    const product = await prisma.product.create({
      data: {
        sellerId,
        categoryId,
        title,
        slug,
        sku,
        description: description || 'Healthy fresh plant sourced directly from local nursery.',
        price: parseFloat(price),
        mrp: mrp ? parseFloat(mrp) : parseFloat(price) * 1.3,
        stock: parseInt(stock, 10),
        images: JSON.stringify(images.length ? images : ['https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80']),
        sunlight,
        waterRequirement,
        plantHeight,
        potSize,
        soilType,
        difficulty,
        plantType,
        careTips,
        status: initialStatus,
      },
    })

    // Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: user?.userId || null,
        action: 'PRODUCT_CREATED',
        entityType: 'PRODUCT',
        entityId: product.id,
        metadata: JSON.stringify({ title: product.title, status: initialStatus }),
      },
    })

    return NextResponse.json({
      success: true,
      message: submitForReview 
        ? 'Plant listed and submitted for Admin quality review! Status: PENDING_REVIEW' 
        : 'Plant saved as DRAFT',
      product,
    })
  } catch (error: any) {
    console.error('Create product error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
