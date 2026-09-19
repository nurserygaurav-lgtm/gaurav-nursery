import { prisma } from '@/lib/prisma'
import ShopClient from './ShopClient'

export const dynamic = 'force-dynamic'

interface ShopPageProps {
  searchParams: { [key: string]: string | undefined }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
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

  // Format images
  const formattedProducts = products.map((p) => ({
    ...p,
    images: typeof p.images === 'string' ? JSON.parse(p.images || '[]') : p.images,
  }))

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
