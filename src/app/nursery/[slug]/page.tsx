import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NurseryStorefrontClient from './NurseryStorefrontClient'
import Link from 'next/link'
import { Store, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  params: {
    slug: string
  }
}

export default async function NurseryStorefrontPage({ params }: Props) {
  const { slug } = params

  const seller = await prisma.sellerProfile.findUnique({
    where: { slug },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      products: {
        where: { status: 'LIVE' },
        include: {
          category: true,
          reviews: {
            include: {
              customer: {
                select: { name: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  // If seller does not exist or has been SUSPENDED by Super Admin, hide storefront
  if (!seller || seller.status === 'SUSPENDED') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Nursery Not Available
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            This nursery storefront is currently inactive, under compliance review, or does not exist. Browse our other verified plant partners below.
          </p>
          <div className="pt-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Explore Marketplace Catalog</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Aggregate customer reviews across this nursery's plants
  const allReviews = seller.products.flatMap((p) =>
    p.reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      isVerifiedPurchase: r.isVerifiedPurchase,
      createdAt: r.createdAt.toISOString(),
      customer: { name: r.customer?.name || 'Plant Enthusiast' },
      productTitle: p.title,
      productSlug: p.slug,
    }))
  )

  const formattedSeller = {
    id: seller.id,
    businessName: seller.businessName,
    slug: seller.slug || slug,
    bio: seller.bio || undefined,
    city: seller.city,
    state: seller.state,
    pincode: seller.pincode,
    rating: seller.rating,
    totalSalesCount: seller.totalSalesCount,
    user: {
      name: seller.user?.name || '',
      email: seller.user?.email || '',
      phone: seller.user?.phone || undefined,
    },
    products: seller.products.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      price: p.price,
      mrp: p.mrp,
      stock: p.stock,
      images: p.images,
      sunlight: p.sunlight,
      waterRequirement: p.waterRequirement,
      difficulty: p.difficulty,
      plantHeight: p.plantHeight || undefined,
      potSize: p.potSize || undefined,
      category: {
        name: p.category?.name || 'General',
        slug: p.category?.slug || 'general',
      },
      reviews: p.reviews,
    })),
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <NurseryStorefrontClient seller={formattedSeller} allReviews={allReviews} />
      </main>

      <Footer />
    </div>
  )
}
