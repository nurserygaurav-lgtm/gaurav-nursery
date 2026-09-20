import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { callBackendApi } from '@/lib/backendClient'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('category') || undefined
    const sunlight = searchParams.get('sunlight') || undefined
    const water = searchParams.get('water') || undefined
    const difficulty = searchParams.get('difficulty') || undefined
    const search = searchParams.get('q') || undefined

    // 1. Fetch from Render Backend (MongoDB)
    const backendRes = await callBackendApi('/admin/products', {
      params: { status: 'LIVE' },
    })

    if (backendRes.ok && backendRes.data?.products && backendRes.data.products.length > 0) {
      let filtered = backendRes.data.products.filter((p: any) => p.status === 'LIVE' || p.status === 'live' || p.status === 'active')

      if (categorySlug) {
        filtered = filtered.filter((p: any) =>
          (p.category?.slug === categorySlug) || (p.category?.name?.toLowerCase().includes(categorySlug.replace('-', ' ')))
        )
      }

      if (sunlight) {
        filtered = filtered.filter((p: any) => p.sunlight?.toLowerCase().includes(sunlight.toLowerCase()))
      }

      if (water) {
        filtered = filtered.filter((p: any) => p.waterRequirement?.toLowerCase().includes(water.toLowerCase()))
      }

      if (difficulty) {
        filtered = filtered.filter((p: any) => p.difficulty?.toLowerCase() === difficulty.toLowerCase())
      }

      if (search) {
        const q = search.toLowerCase()
        filtered = filtered.filter((p: any) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.plantType?.toLowerCase().includes(q)
        )
      }

      return NextResponse.json({ products: filtered })
    }

    // 2. Fallback
    const whereClause: any = {
      status: 'LIVE',
      seller: {
        status: 'ACTIVE',
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
