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
        return NextResponse.json({ error: "Forbidden: Cannot access another seller's products" }, { status: 403 })
      }
      sellerId = user.sellerId
    } else if (user.role === 'SUPER_ADMIN') {
      sellerId = sellerIdParam || user.sellerId
    }

    if (!sellerId) {
      return NextResponse.json({ error: 'Seller profile not found or unlinked' }, { status: 404 })
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
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 })
    }
    if (user.role !== 'SELLER' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Seller access required' }, { status: 403 })
    }

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

    let sellerId: string | undefined = user.sellerId

    if (user.role === 'SELLER') {
      if (inputSellerId && inputSellerId !== user.sellerId) {
        return NextResponse.json({ error: "Forbidden: Cannot create products for another seller" }, { status: 403 })
      }
      sellerId = user.sellerId
    } else if (user.role === 'SUPER_ADMIN') {
      sellerId = inputSellerId || user.sellerId
    }

    if (!sellerId) {
      return NextResponse.json({ error: 'Seller profile not found or unlinked' }, { status: 404 })
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
        actorId: user.userId,
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
