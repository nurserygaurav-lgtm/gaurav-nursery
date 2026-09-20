import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { callBackendApi } from '@/lib/backendClient'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 })
    }
    if (user.role !== 'SELLER' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Seller access required' }, { status: 403 })
    }

    // 1. Fetch from Render Backend (MongoDB)
    const backendRes = await callBackendApi('/products/seller')
    if (backendRes.ok && backendRes.data?.products && backendRes.data.products.length > 0) {
      return NextResponse.json(backendRes.data)
    }

    // 2. Fallback to Prisma
    const { searchParams } = new URL(request.url)
    const sellerIdParam = searchParams.get('sellerId')

    let sellerId: string | undefined = user.sellerId

    if (user.role === 'SELLER') {
      if (sellerIdParam && user.sellerId && sellerIdParam !== user.sellerId) {
        return NextResponse.json({ error: "Forbidden: Cannot access another seller's products" }, { status: 403 })
      }
      sellerId = user.sellerId
    } else if (user.role === 'SUPER_ADMIN') {
      sellerId = sellerIdParam || user.sellerId
    }

    if (!sellerId) {
      const fallbackSeller = await prisma.sellerProfile.findFirst({
        where: {
          OR: [
            { user: { email: user.email } },
            { userId: user.userId },
            { slug: 'gaurav-greenery-hub' }
          ]
        }
      }).catch(() => null)
      if (fallbackSeller) {
        sellerId = fallbackSeller.id
      }
    }

    if (!sellerId) {
      return NextResponse.json({ products: [] })
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
      name,
      description,
      categoryId,
      category,
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

    const productTitle = (title || name || '').trim()
    if (!productTitle || !price) {
      return NextResponse.json({ error: 'Title and price are required' }, { status: 400 })
    }

    let sellerId: string | undefined = user.sellerId

    if (user.role === 'SELLER') {
      if (inputSellerId && user.sellerId && inputSellerId !== user.sellerId) {
        return NextResponse.json({ error: "Forbidden: Cannot create products for another seller" }, { status: 403 })
      }
      sellerId = user.sellerId
    } else if (user.role === 'SUPER_ADMIN') {
      sellerId = inputSellerId || user.sellerId
    }

    if (!sellerId) {
      const fallbackSeller = await prisma.sellerProfile.findFirst({
        where: {
          OR: [
            { user: { email: user.email } },
            { userId: user.userId },
            { slug: 'gaurav-greenery-hub' }
          ]
        }
      }).catch(() => null)
      if (fallbackSeller) {
        sellerId = fallbackSeller.id
      }
    }

    const initialStatus = submitForReview ? 'PENDING_REVIEW' : 'DRAFT'

    // 1. Mutate in Render Backend (MongoDB)
    const backendRes = await callBackendApi('/products', {
      method: 'POST',
      body: {
        title: productTitle,
        name: productTitle,
        description: description || 'Fresh, healthy plant nursery specimen sourced directly from local growers.',
        category: category || 'Plants',
        price: parseFloat(price),
        offerPrice: mrp ? parseFloat(mrp) : undefined,
        stock: parseInt(String(stock), 10) || 10,
        status: initialStatus.toLowerCase(),
        sunlight,
        waterRequirement,
        plantHeight,
        potSize,
        soilType,
        difficulty,
        plantType,
        careTips,
      },
    })

    // 2. Synchronize Prisma local cache if possible
    let createdProduct = backendRes.data?.product
    try {
      let finalCategoryId = categoryId
      if (finalCategoryId) {
        const found = await prisma.category.findFirst({
          where: {
            OR: [
              { id: finalCategoryId },
              { slug: finalCategoryId },
              { name: { contains: finalCategoryId } }
            ]
          }
        })
        if (found) finalCategoryId = found.id
      }
      if (!finalCategoryId) {
        const cat = await prisma.category.findFirst()
        finalCategoryId = cat?.id
      }

      if (sellerId && finalCategoryId) {
        const slug = `${productTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`
        const sku = `GN-${Math.floor(1000 + Math.random() * 9000)}`

        const localProd = await prisma.product.create({
          data: {
            sellerId,
            categoryId: finalCategoryId,
            title: productTitle,
            slug,
            sku,
            description: description || 'Fresh, healthy plant nursery specimen.',
            price: parseFloat(price),
            mrp: mrp ? parseFloat(mrp) : parseFloat(price) * 1.3,
            stock: parseInt(String(stock), 10) || 10,
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
        if (!createdProduct) createdProduct = localProd
      }
    } catch {
      // Prisma fallback safe
    }

    return NextResponse.json({
      success: true,
      message: submitForReview
        ? 'Plant listed and submitted for Admin quality review! Status: PENDING_REVIEW'
        : 'Plant saved as DRAFT',
      product: createdProduct || { title: productTitle, status: initialStatus },
    }, { status: 201 })
  } catch (error: any) {
    console.error('Create product error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
