import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('category')
    const sunlight = searchParams.get('sunlight')
    const water = searchParams.get('water')
    const difficulty = searchParams.get('difficulty')
    const search = searchParams.get('q')

    const whereClause: any = {
      status: 'LIVE', // Only live products in public customer shop
      seller: {
        status: 'ACTIVE', // Automatically hides products if a seller is SUSPENDED or PENDING
      },
    }

    if (categorySlug) {
      whereClause.category = {
        slug: categorySlug,
      }
    }

    if (sunlight) {
      whereClause.sunlight = {
        contains: sunlight,
      }
    }

    if (water) {
      whereClause.waterRequirement = {
        contains: water,
      }
    }

    if (difficulty) {
      whereClause.difficulty = difficulty
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { plantType: { contains: search } },
      ]
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            businessName: true,
            slug: true,
            city: true,
            state: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Parse image JSON strings
    const formatted = products.map((p) => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
    }))

    return NextResponse.json({ products: formatted })
  } catch (error: any) {
    console.error('Products fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
