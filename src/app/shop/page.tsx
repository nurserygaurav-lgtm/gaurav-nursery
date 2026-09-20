import { prisma } from '@/lib/prisma'
import { callBackendApi } from '@/lib/backendClient'
import ShopClient from './ShopClient'

export const dynamic = 'force-dynamic'

interface ShopPageProps {
  searchParams: { [key: string]: string | undefined }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  let formattedProducts: any[] = []

  // 1. Fetch from Render Backend (MongoDB)
  try {
    const backendRes = await callBackendApi('/admin/products', {
      params: { status: 'LIVE' },
    })

    if (backendRes.ok && backendRes.data?.products && backendRes.data.products.length > 0) {
      formattedProducts = backendRes.data.products.filter(
        (p: any) => p.status === 'LIVE' || p.status === 'live' || p.status === 'active'
      )
    }
  } catch (err) {
    console.warn('Backend fetch for shop warning:', err)
  }

  // 2. Fallback to local DB if backend empty
  if (formattedProducts.length === 0) {
    const products = await prisma.product.findMany({
      where: {
        status: 'LIVE',
        seller: {
          status: 'ACTIVE',
        },
      },
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

    formattedProducts = products.map((p) => ({
      ...p,
      images: typeof p.images === 'string' ? JSON.parse(p.images || '[]') : p.images,
    }))
  }

  return (
    <ShopClient
      initialProducts={formattedProducts}
      initialParams={{
        q: searchParams?.q,
        category: searchParams?.category,
        sunlight: searchParams?.sunlight,
        water: searchParams?.water,
        difficulty: searchParams?.difficulty,
      }}
    />
  )
}
