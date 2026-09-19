import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  Sun, 
  Droplet, 
  Layers, 
  Ruler, 
  Maximize2, 
  ShieldCheck, 
  Store, 
  Truck, 
  RefreshCw,
  Sparkles,
  HeartHandshake
} from 'lucide-react'
import AddToCartButton from './AddToCartButton'
import ProductReviewsSection from './ProductReviewsSection'

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      seller: true,
      reviews: {
        include: {
          customer: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!product) {
    notFound()
  }

  const images = JSON.parse(product.images || '[]')
  const discountPercent = product.mrp > product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
    : 0

  const initialReviews = product.reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    isVerifiedPurchase: r.isVerifiedPurchase,
    createdAt: r.createdAt.toISOString(),
    customer: { name: r.customer?.name || 'Plant Enthusiast' },
  }))

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200/80 py-2.5 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Link href="/" className="hover:text-emerald-700">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-emerald-700">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category?.slug}`} className="hover:text-emerald-700">
            {product.category?.name}
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium truncate">{product.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Product Images */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm relative">
              <img
                src={images[0] || 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
                {product.category?.name}
              </span>
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className="w-20 h-20 rounded-xl border border-slate-200 overflow-hidden flex-shrink-0 bg-white"
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Guaranteed Live Transit Badge */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-center gap-3.5 text-xs text-emerald-950">
              <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-950">Guaranteed Live Plant Transit</h4>
                <p className="text-emerald-800 text-[11px] mt-0.5">
                  Packaged in specialized ventilated moisture-lock cartons directly from{' '}
                  <Link 
                    href={`/nursery/${product.seller?.slug || 'gaurav-greenery-hub'}`}
                    className="underline font-bold hover:text-emerald-900"
                  >
                    {product.seller?.businessName}
                  </Link>.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Product Details & Specialized Care Attributes */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Seller Badge with Link to Nursery Storefront */}
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <Link 
                href={`/nursery/${product.seller?.slug || 'gaurav-greenery-hub'}`}
                className="flex items-center gap-2 text-xs text-slate-600 hover:text-emerald-800 transition group"
              >
                <Store className="w-4 h-4 text-emerald-700" />
                <span>Dispatched by: <strong className="text-slate-900 group-hover:underline">{product.seller?.businessName}</strong></span>
                <span className="text-slate-400">• {product.seller?.city}, {product.seller?.state}</span>
              </Link>
              <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> KYC Verified
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {product.title}
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-1">SKU: {product.sku}</p>
            </div>

            {/* Price Section */}
            <div className="bg-slate-100/70 p-4 rounded-xl flex items-baseline gap-3">
              <span className="text-3xl font-black text-emerald-900">₹{product.price}</span>
              {product.mrp > product.price && (
                <>
                  <span className="text-base text-slate-400 line-through">₹{product.mrp}</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    {discountPercent}% OFF
                  </span>
                </>
              )}
              <span className="text-[11px] text-slate-500 ml-auto">Inclusive of all taxes</span>
            </div>

            {/* Specialized Plant Care Specs Table */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                  Specialized Plant Specifications
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-amber-50/60 border border-amber-100 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-amber-900 font-semibold text-[11px]">
                    <Sun className="w-3.5 h-3.5 text-amber-600" /> Sunlight
                  </div>
                  <p className="font-bold text-slate-800 mt-1">{product.sunlight}</p>
                </div>

                <div className="bg-blue-50/60 border border-blue-100 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-blue-900 font-semibold text-[11px]">
                    <Droplet className="w-3.5 h-3.5 text-blue-600" /> Watering
                  </div>
                  <p className="font-bold text-slate-800 mt-1">{product.waterRequirement}</p>
                </div>

                <div className="bg-emerald-50/60 border border-emerald-100 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-semibold text-[11px]">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" /> Care Level
                  </div>
                  <p className="font-bold text-slate-800 mt-1">{product.difficulty}</p>
                </div>

                {product.plantHeight && (
                  <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-xl">
                    <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-[11px]">
                      <Ruler className="w-3.5 h-3.5 text-slate-500" /> Plant Height
                    </div>
                    <p className="font-bold text-slate-800 mt-1">{product.plantHeight}</p>
                  </div>
                )}

                {product.potSize && (
                  <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-xl">
                    <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-[11px]">
                      <Maximize2 className="w-3.5 h-3.5 text-slate-500" /> Pot Spec
                    </div>
                    <p className="font-bold text-slate-800 mt-1">{product.potSize}</p>
                  </div>
                )}

                {product.plantType && (
                  <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-xl">
                    <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-slate-500" /> Plant Type
                    </div>
                    <p className="font-bold text-slate-800 mt-1">{product.plantType}</p>
                  </div>
                )}
              </div>

              {product.soilType && (
                <div className="pt-2 text-xs text-slate-600 border-t border-slate-100">
                  <strong className="text-slate-800">Recommended Potting Soil:</strong> {product.soilType}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <h4 className="font-bold text-slate-900 text-sm">About this Plant</h4>
              <p>{product.description}</p>
            </div>

            {/* Care Instructions */}
            {product.careTips && (
              <div className="bg-emerald-900 text-emerald-100 rounded-2xl p-4 text-xs space-y-1.5">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Nursery Expert Care Instructions
                </h4>
                <p className="text-emerald-200/90 leading-relaxed">{product.careTips}</p>
              </div>
            )}

            {/* Add to Cart Client Component */}
            <AddToCartButton
              product={{
                productId: product.id,
                title: product.title,
                price: product.price,
                image: images[0],
                sellerId: product.sellerId,
                sellerBusinessName: product.seller?.businessName || 'Verified Nursery',
              }}
            />

          </div>

        </div>

        {/* Verified Reviews Section */}
        <ProductReviewsSection productId={product.id} initialReviews={initialReviews} />
      </div>

      <Footer />
    </div>
  )
}
