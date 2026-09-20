import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { callBackendApi } from '@/lib/backendClient'
import { UGAOO_BESTSELLERS } from '@/lib/ugaooCatalog'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 })
    }
    if (user.role !== 'SELLER' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Seller or Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { action, products: incomingProducts, targetStatus = 'LIVE' } = body

    let productsToImport = []

    if (action === 'IMPORT_UGAOO_BESTSELLERS') {
      productsToImport = UGAOO_BESTSELLERS
    } else if (Array.isArray(incomingProducts) && incomingProducts.length > 0) {
      productsToImport = incomingProducts
    } else {
      return NextResponse.json({ error: 'No products provided for bulk import' }, { status: 400 })
    }

    let sellerId = user.sellerId
    if (!sellerId && user.role === 'SUPER_ADMIN') {
      const firstSeller = await prisma.sellerProfile.findFirst()
      sellerId = firstSeller?.id
    }

    if (!sellerId) {
      return NextResponse.json({ error: 'No linked seller profile found' }, { status: 404 })
    }

    const imported = []
    const errors = []

    // Ensure common categories exist in Prisma
    const categoriesMap: Record<string, string> = {}
    const defaultCategories = [
      { name: 'Indoor Plants', slug: 'indoor-plants' },
      { name: 'Bonsai & Succulents', slug: 'bonsai-succulents' },
      { name: 'Outdoor Plants', slug: 'outdoor-plants' },
      { name: 'Flowering Plants', slug: 'flowering-plants' },
      { name: 'Pots & Planters', slug: 'pots-planters' },
    ]

    for (const cat of defaultCategories) {
      const existing = await prisma.category.findFirst({
        where: { OR: [{ slug: cat.slug }, { name: cat.name }] }
      })
      if (existing) {
        categoriesMap[cat.slug] = existing.id
        categoriesMap[cat.name] = existing.id
      } else {
        const created = await prisma.category.create({
          data: { name: cat.name, slug: cat.slug, description: `Specialized ${cat.name}` }
        })
        categoriesMap[cat.slug] = created.id
        categoriesMap[cat.name] = created.id
      }
    }

    for (const p of productsToImport) {
      try {
        const title = (p.title || p.name || '').trim()
        if (!title) continue

        const price = parseFloat(p.price) || 299
        const mrp = p.mrp ? parseFloat(p.mrp) : Math.round(price * 1.35)
        const stock = parseInt(p.stock, 10) || 30
        const images = Array.isArray(p.images) ? p.images : (p.imageUrl ? [p.imageUrl] : [])
        const categoryKey = p.categoryId || p.category || 'indoor-plants'
        let finalCategoryId = categoriesMap[categoryKey] || categoriesMap['indoor-plants']

        if (!finalCategoryId) {
          const firstCat = await prisma.category.findFirst()
          finalCategoryId = firstCat?.id || ''
        }

        const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`
        const sku = `GN-UGA-${Math.floor(1000 + Math.random() * 9000)}`

        // 1. Persist to Render Backend (MongoDB Atlas)
        callBackendApi('/products', {
          method: 'POST',
          body: {
            title,
            name: title,
            description: p.description || `${title} from specialized nursery collection.`,
            category: p.category || 'Indoor Plants',
            price,
            offerPrice: mrp,
            stock,
            status: targetStatus === 'LIVE' ? 'live' : 'pending_review',
            images,
            sunlight: p.sunlight || 'Low Light (Indoor)',
            waterRequirement: p.waterRequirement || 'Moderate (2-3 days)',
            plantHeight: p.plantHeight || '12 - 15 inches',
            potSize: p.potSize || '6 inch nursery pot',
            soilType: p.soilType || 'Aerated potting soil',
            difficulty: p.difficulty || 'Beginner Friendly',
            plantType: p.plantType || 'Air Purifying',
            careTips: p.careTips || 'Keep in filtered indirect light and water moderately.'
          }
        }).catch((err) => console.warn('Backend proxy sync warning:', err.message))

        // 2. Persist to Prisma SQLite Cache
        const localProduct = await prisma.product.create({
          data: {
            sellerId,
            categoryId: finalCategoryId,
            title,
            slug,
            sku,
            description: p.description || `${title} from specialized nursery collection.`,
            price,
            mrp,
            stock,
            images: JSON.stringify(images.length ? images : ['https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80']),
            sunlight: p.sunlight || 'Low Light (Indoor)',
            waterRequirement: p.waterRequirement || 'Moderate (2-3 days)',
            plantHeight: p.plantHeight || '12 - 15 inches',
            potSize: p.potSize || '6 inch nursery pot',
            soilType: p.soilType || 'Aerated potting soil',
            difficulty: p.difficulty || 'Beginner Friendly',
            plantType: p.plantType || 'Air Purifying',
            careTips: p.careTips || 'Keep in filtered indirect light and water moderately.',
            status: targetStatus,
          }
        })

        imported.push({ id: localProduct.id, title: localProduct.title, price: localProduct.price, sku: localProduct.sku })
      } catch (err: any) {
        errors.push({ title: p.title, message: err.message })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${imported.length} plant listings!`,
      importedCount: imported.length,
      imported,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error: any) {
    console.error('Bulk product import error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
