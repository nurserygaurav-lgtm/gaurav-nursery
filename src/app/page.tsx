import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PlantCard from '@/components/PlantCard'
import { prisma } from '@/lib/prisma'
import { 
  Sun, 
  Droplet, 
  Sparkles, 
  ArrowRight, 
  Store, 
  ShieldCheck, 
  Award, 
  Truck,
  Leaf,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Tag,
  ExternalLink
} from 'lucide-react'

export const dynamic = 'force-dynamic'

const CATEGORIES = [
  { name: 'Indoor Plants', slug: 'indoor-plants', count: '120+ varieties', image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80' },
  { name: 'Outdoor Plants', slug: 'outdoor-plants', count: '85+ varieties', image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600&q=80' },
  { name: 'Flowering Plants', slug: 'flowering-plants', count: '64+ varieties', image: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=600&q=80' },
  { name: 'Bonsai & Succulents', slug: 'bonsai-succulents', count: '45+ varieties', image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=600&q=80' },
  { name: 'Pots & Planters', slug: 'pots-planters', count: '90+ designs', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80' },
  { name: 'Organic Fertilizers', slug: 'soil-fertilizers', count: '30+ items', image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&q=80' },
]

export default async function HomePage() {
  const [banners, lowLightPlants, beginnerPlants] = await Promise.all([
    prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.product.findMany({
      where: {
        status: 'LIVE',
        seller: { status: 'ACTIVE' },
        sunlight: { contains: 'Low' },
      },
      include: {
        category: true,
        seller: true,
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.findMany({
      where: {
        status: 'LIVE',
        seller: { status: 'ACTIVE' },
        difficulty: 'Beginner Friendly',
      },
      include: {
        category: true,
        seller: true,
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white overflow-hidden py-16 md:py-20">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-green-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-700/80 px-3.5 py-1.5 rounded-full text-xs text-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>India&apos;s Dedicated Multi-Vendor Plant Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                Fresh Plants Directly From <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-teal-200">
                  Local Nurseries
                </span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 max-w-xl font-normal leading-relaxed">
                Connect directly with verified regional nurseries. Buy healthy saplings with specific sunlight and watering specifications delivered securely to your door.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/shop"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-950/40 flex items-center gap-2 text-sm transition"
                >
                  <span>Explore 200+ Plants</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/seller/register"
                  className="bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-semibold px-5 py-3.5 rounded-xl text-sm transition flex items-center gap-2"
                >
                  <Store className="w-4 h-4 text-emerald-400" />
                  <span>List Your Nursery</span>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-emerald-800/60 max-w-md text-xs text-emerald-200">
                <div>
                  <strong className="block text-xl font-black text-white">100%</strong>
                  <span>Live Plant Guarantee</span>
                </div>
                <div>
                  <strong className="block text-xl font-black text-white">1,000+</strong>
                  <span>Fresh Plant Varieties</span>
                </div>
                <div>
                  <strong className="block text-xl font-black text-white">Verified</strong>
                  <span>Regional Nurseries</span>
                </div>
              </div>
            </div>

            {/* Quick Plant Finder Widget */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-emerald-700/40 shadow-2xl space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Interactive Plant Matcher</span>
                </div>
                
                <h3 className="text-xl font-bold text-white">Find Plants Suited to Your Room</h3>

                <form action="/shop" method="GET" className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5">Sunlight Available in Your Space</label>
                    <select
                      name="sunlight"
                      className="w-full bg-slate-800/90 border border-slate-700 text-white rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="">Any Sunlight (All Plants)</option>
                      <option value="Low Light">Low Light (Bedrooms, Shady Corners)</option>
                      <option value="Moderate">Moderate Indirect (Living Rooms)</option>
                      <option value="Full Sun">Full Direct Sun (Balconies, Terraces)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5">Watering Effort</label>
                    <select
                      name="water"
                      className="w-full bg-slate-800/90 border border-slate-700 text-white rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="">Any Watering Frequency</option>
                      <option value="Low">Low Care (Once a week)</option>
                      <option value="Moderate">Moderate (Every 2-3 days)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5">Plant Category</label>
                    <select
                      name="category"
                      className="w-full bg-slate-800/90 border border-slate-700 text-white rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="">All Categories</option>
                      <option value="indoor-plants">Indoor Air Purifiers</option>
                      <option value="flowering-plants">Flowering & Adeniums</option>
                      <option value="bonsai-succulents">Bonsai & Hardy Succulents</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-emerald-950 font-bold py-3 rounded-xl text-sm shadow transition"
                  >
                    Find Matching Plants
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Priority 1 & 3: Banner CMS Promotional Strip */}
      {banners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.slice(0, 2).map((b) => (
              <Link
                key={b.id}
                href={b.linkUrl}
                className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200 group h-40 bg-slate-900 block"
              >
                <img
                  src={b.imageUrl}
                  alt={b.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-between text-white">
                  <div>
                    {b.badgeText && (
                      <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                        {b.badgeText}
                      </span>
                    )}
                    <h3 className="font-black text-lg sm:text-xl leading-tight text-white group-hover:text-emerald-300 transition">
                      {b.title}
                    </h3>
                    {b.subtitle && (
                      <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{b.subtitle}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <span>Shop Special Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Browse by Category</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Explore Nursery Collections</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
            View All Categories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="group bg-white rounded-2xl border border-slate-200/80 p-3 shadow-sm hover:shadow-md hover:border-emerald-300 transition flex flex-col items-center text-center overflow-hidden"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 relative bg-slate-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition">
                {cat.name}
              </h3>
              <span className="text-[11px] text-slate-400 mt-0.5">{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Priority 3 Curated Shelf 1: "Low Sunlight Plants" */}
      <section className="bg-white border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full mb-1">
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                <span>Low Light Collection</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Low Sunlight Plants</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Specially acclimatized foliage plants that flourish in bedrooms, interior corners, and air-conditioned offices with minimal direct sun.
              </p>
            </div>
            <Link
              href="/shop?sunlight=Low"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              Explore All Low Light Plants <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lowLightPlants.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={{
                  id: plant.id,
                  title: plant.title,
                  slug: plant.slug,
                  price: plant.price,
                  mrp: plant.mrp,
                  images: plant.images,
                  sunlight: plant.sunlight,
                  waterRequirement: plant.waterRequirement,
                  difficulty: plant.difficulty,
                  category: { name: plant.category.name, slug: plant.category.slug },
                  seller: {
                    id: plant.seller.id,
                    businessName: plant.seller.businessName,
                    city: plant.seller.city,
                    slug: plant.seller.slug || undefined,
                  },
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Priority 3 Curated Shelf 2: "Beginner Plants" */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full mb-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Zero Frustration</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Beginner Friendly Plants</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Hardy, resilient varieties that forgive missed waterings, naturally resist pests, and grow effortlessly.
              </p>
            </div>
            <Link
              href="/shop?difficulty=Beginner+Friendly"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              Explore All Beginner Plants <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {beginnerPlants.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={{
                  id: plant.id,
                  title: plant.title,
                  slug: plant.slug,
                  price: plant.price,
                  mrp: plant.mrp,
                  images: plant.images,
                  sunlight: plant.sunlight,
                  waterRequirement: plant.waterRequirement,
                  difficulty: plant.difficulty,
                  category: { name: plant.category.name, slug: plant.category.slug },
                  seller: {
                    id: plant.seller.id,
                    businessName: plant.seller.businessName,
                    city: plant.seller.city,
                    slug: plant.seller.slug || undefined,
                  },
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How Online Plant Ordering Works */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">How It Works</span>
            <h2 className="text-3xl font-black text-slate-900 mt-1">Ordering Live Plants Online Made Simple</h2>
            <p className="text-slate-600 text-sm mt-2">
              From verified botanical greenhouses straight to your home with 100% safe transit guarantee.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mx-auto mb-3">
                1
              </div>
              <h4 className="font-bold text-sm text-slate-900">Choose Plants</h4>
              <p className="text-xs text-slate-500 mt-1.5">
                Explore 1,000+ curated indoor, flowering, bonsai, and rare exotic varieties.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mx-auto mb-3">
                2
              </div>
              <h4 className="font-bold text-sm text-slate-900">Greenhouse Selection</h4>
              <p className="text-xs text-slate-500 mt-1.5">
                Nursery experts select healthy specimens with vigorous roots and prime foliage.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm mx-auto mb-3">
                3
              </div>
              <h4 className="font-bold text-sm text-slate-900">Safe Eco Packaging</h4>
              <p className="text-xs text-slate-500 mt-1.5">
                Secure root-ball wrapping and upright ventilated corrugated boxes prevent damage.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm mx-auto mb-3">
                4
              </div>
              <h4 className="font-bold text-sm text-slate-900">Express Transit</h4>
              <p className="text-xs text-slate-500 mt-1.5">
                Fast, climate-aware shipping across all Indian pin codes right to your doorstep.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-800 flex items-center justify-center font-bold text-sm mx-auto mb-3">
                5
              </div>
              <h4 className="font-bold text-sm text-slate-900">Unpack & Thrive</h4>
              <p className="text-xs text-slate-500 mt-1.5">
                Receive care cards and enjoy our 7-day plant health and replacement guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
