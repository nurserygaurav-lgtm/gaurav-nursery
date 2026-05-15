import { motion } from 'framer-motion';
import { ArrowRight, Leaf, LockKeyhole, Mail, PackageCheck, Sparkles, Star, Truck } from 'lucide-react';

function AnimatedStat({ value, display }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-4xl font-black tracking-tight text-leaf-950 sm:text-5xl">
        {display}
      </p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-leaf-600">{value ? 'Live' : ''}</p>
    </div>
  );
}
import { Link } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard.jsx';
import Button from '../../components/ui/Button.jsx';
import { featuredProducts } from '../../utils/mockData.js';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 }
};

const features = [
  { icon: Leaf, title: 'Fresh Plants', text: 'Handpicked nursery plants packed with care and shipped healthy.' },
  { icon: Truck, title: 'Free Delivery', text: 'Premium doorstep delivery on eligible plant and planter orders.' },
  { icon: LockKeyhole, title: 'Secure Payments', text: 'Protected checkout with trusted payment workflows.' },
  { icon: PackageCheck, title: 'Easy Returns', text: 'Friendly support for damaged, delayed, or incorrect orders.' }
];

const categories = [
  {
    title: 'Indoor Plants',
    to: '/shop?category=Indoor+Plants',
    image: 'https://images.unsplash.com/photo-1545239705-1564e58b9e4a?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Outdoor Plants',
    to: '/shop?category=Outdoor+Plants',
    image: 'https://images.unsplash.com/photo-1463320898484-cdee8141c787?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Succulents',
    to: '/shop?category=Succulents',
    image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Planters',
    to: '/shop?category=Planters',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Seeds',
    to: '/shop?category=Seeds',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80'
  }
];



const gallery = [
  'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1459156212016-c812468e2115?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=700&q=80'
];

function SectionHeader({ eyebrow, title, text, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.22em] text-leaf-600">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-leaf-950 sm:text-4xl">{title}</h2>
        {text && <p className="mt-3 max-w-2xl leading-7 text-stone-600">{text}</p>}
      </div>
      {action}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <section className="overflow-hidden bg-gradient-to-br from-white via-leaf-50 to-cream">
        <div className="premium-container grid min-h-[calc(100vh-5rem)] gap-12 py-12 md:grid-cols-[0.92fr_1.08fr] md:items-center lg:py-16">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.65 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-leaf-200 bg-white/80 px-4 py-2 text-sm font-bold text-leaf-800 shadow-soft">
              <Sparkles size={16} />
              Premium nursery marketplace
            </span>
            <h1 className="mt-6 max-w-2xl text-5xl font-black leading-[1.02] tracking-tight text-leaf-950 sm:text-6xl lg:text-7xl">
              Bring Nature Into Your Home
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">
              Discover lush indoor plants, sculptural planters, seeds, and garden essentials from trusted nursery sellers.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-leaf-800 px-6 text-sm font-black text-white shadow-button transition hover:-translate-y-0.5 hover:bg-leaf-700"
              >
                Shop Plants <ArrowRight className="ml-2" size={18} />
              </Link>
              <Link
                to="/categories"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-leaf-200 bg-white/80 px-6 text-sm font-black text-leaf-950 transition hover:-translate-y-0.5 hover:bg-white"
              >
                Explore Categories
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.1 }}
          >
            <div className="grid grid-cols-[0.72fr_1fr] gap-4 sm:gap-5">
              <img
                className="mt-16 aspect-[3/4] rounded-[2rem] object-cover shadow-card"
                src="https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=900&q=80"
                alt="Indoor plant shelf with warm natural light"
              />
              <div className="space-y-4 sm:space-y-5">
                <img
                  className="aspect-[4/3] rounded-[2rem] object-cover shadow-card"
                  src="https://images.unsplash.com/photo-1525498128493-380d1990a112?auto=format&fit=crop&w=900&q=80"
                  alt="Premium potted plants near a bright window"
                />
                <div className="rounded-[2rem] bg-leaf-950 p-6 text-white shadow-card">
                  <p className="text-4xl font-black">4.9</p>
                  <div className="mt-2 flex text-amber-300">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} size={17} fill="currentColor" />
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-leaf-100">Rated by plant lovers for fresh delivery and beautiful packaging.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="premium-container py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => (
            <motion.div
              key={item.title}
              className="rounded-3xl border border-leaf-100 bg-white p-6 shadow-soft"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.45, delay: index * 0.06 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-800">
                <item.icon size={23} />
              </div>
              <h2 className="mt-5 text-lg font-black text-leaf-950">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="premium-container py-12">
        <SectionHeader
          eyebrow="Featured"
          title="Popular Plants"
          text="Fresh picks with premium presentation, ratings, wishlist actions, and smooth ecommerce interactions."
          action={
            <Link className="text-sm font-black text-leaf-700 transition hover:text-leaf-950" to="/shop">
              View all products
            </Link>
          }
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      <section className="premium-container py-12">
        <SectionHeader eyebrow="Shop by Category" title="Curated for Every Corner" text="Explore image-led collections for homes, balconies, workspaces, and gifting." />
        <div className="grid gap-5 md:grid-cols-5">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              className={index === 0 ? 'md:col-span-2' : ''}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.45, delay: index * 0.05 }}
            >
              <Link className="group relative block h-72 overflow-hidden rounded-3xl shadow-soft" to={category.to}>
                <img className="h-full w-full object-cover transition duration-700 group-hover:scale-110" src={category.image} alt={category.title} loading="lazy" />
                <span className="absolute inset-0 bg-gradient-to-t from-leaf-950/70 via-leaf-950/15 to-transparent" />
                <span className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white">
                  <span className="text-xl font-black">{category.title}</span>
                  <ArrowRight className="transition group-hover:translate-x-1" size={20} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us + Marketplace Premium Sections */}
      <section className="bg-white/65 py-14">
        <div className="premium-container">
          {/* 1. Why Choose Us */}
          <SectionHeader
            eyebrow="Why Choose Us"
            title="Premium Nursery Experience"
            text="Fresh plants, secure checkout, fast delivery, expert care notes, and a healthy root guarantee — every order." 
          />

          <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                icon: Leaf,
                title: 'Fresh Nursery Plants',
                text: 'Packed for transit with nursery-grade freshness — no guesswork.'
              },
              {
                icon: LockKeyhole,
                title: 'Secure Payments',
                text: 'Protected checkout that fits modern payment expectations.'
              },
              {
                icon: Truck,
                title: 'Fast Delivery',
                text: 'Quick dispatch and careful handling from nursery to doorstep.'
              },
              {
                icon: Sparkles,
                title: 'Expert Plant Care',
                text: 'Care guidance with every plant so it thrives at home.'
              },
              {
                icon: PackageCheck,
                title: 'Healthy Root Guarantee',
                text: 'Confidence in every order with a root-first healthy start.'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="rounded-3xl border border-leaf-100 bg-white p-6 shadow-soft"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ duration: 0.45, delay: index * 0.04 }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-800 shadow-sm">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-leaf-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{item.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 2. Premium plant banner */}
          <motion.div
            className="mt-10 overflow-hidden rounded-[2rem] bg-gradient-to-br from-leaf-950 via-leaf-950 to-leaf-900 p-6 text-white shadow-card md:p-10"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white/90">
                  <Sparkles size={16} /> Premium indoor plant picks
                </div>
                <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">Bring Nature Into Your Home</h2>
                <p className="mt-3 max-w-xl leading-7 text-leaf-100/95">
                  Shop curated indoor plants and premium planters from trusted nursery sellers.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/shop?category=Indoor+Plants"
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-black text-leaf-950 shadow-button transition hover:-translate-y-0.5 hover:bg-leaf-50"
                  >
                    Shop Indoor Plants <ArrowRight className="ml-2" size={18} />
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="grid grid-cols-2 gap-4">
                  {[
                    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=700&q=80',
                    'https://images.unsplash.com/photo-1545239705-1564e58b9e4a?auto=format&fit=crop&w=700&q=80',
                    'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&w=700&q=80',
                    'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=700&q=80'
                  ].map((src, i) => (
                    <motion.div
                      key={src}
                      className={`overflow-hidden rounded-3xl shadow-card ${i === 0 ? 'aspect-[1/1]' : 'aspect-[4/5]'} relative`}
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.25 }}
                    >
                      <img
                        src={src}
                        alt="Premium indoor plant"
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3. Community / Instagram style gallery */}
          <div className="mt-12">
            <SectionHeader
              eyebrow="Community"
              title="Real Homes, Real Plants"
              text="A premium community gallery inspired by Instagram — fresh styling, warm light, and thriving corners." 
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  src: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&w=800&q=80',
                  alt: 'Plant shelf styling in natural light'
                },
                {
                  src: 'https://images.unsplash.com/photo-1525498128493-380d1990a112?auto=format&fit=crop&w=800&q=80',
                  alt: 'Potted plants near a bright window'
                },
                {
                  src: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=800&q=80',
                  alt: 'Indoor plant corner with decor'
                },
                {
                  src: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
                  alt: 'Planters and greenery on a balcony'
                },
                {
                  src: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80',
                  alt: 'Indoor plant display'
                },
                {
                  src: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?auto=format&fit=crop&w=800&q=80',
                  alt: 'Green leaves in a modern interior'
                },
                {
                  src: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80',
                  alt: 'Succulents on a table'
                },
                {
                  src: 'https://images.unsplash.com/photo-1545239705-1564e58b9e4a?auto=format&fit=crop&w=800&q=80',
                  alt: 'Nursery plants in sunlight'
                }
              ].map((item, index) => (
                <motion.figure
                  key={item.src}
                  className="group relative overflow-hidden rounded-[1.75rem] shadow-soft"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.02 }}
                  whileHover={{ y: -6 }}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  <figcaption className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur">
                      #PlantPeople
                    </span>
                    <span className="text-xs font-bold text-white/90">{['cozy', 'fresh', 'green', 'home'][index % 4]}</span>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>

          {/* 4. Animated stats section */}
          <motion.div
            className="mt-12 rounded-[2rem] bg-gradient-to-br from-white to-leaf-50 p-6 shadow-soft md:p-10"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Happy Customers', value: 10000, display: '10K+' },
                { label: 'Plants Delivered', value: 25000, display: '25K+' },
                { label: 'Sellers', value: 120, display: '120+' },
                { label: 'Rating', value: 49, display: '4.9' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="rounded-3xl border border-leaf-100 bg-white p-6 text-center"
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.25, delay: index * 0.01 }}
                >
                  <AnimatedStat value={stat.value} display={stat.display} />
                  <p className="mt-3 text-sm font-black text-leaf-950">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>


        </div>
      </section>

      <section className="premium-container py-14">
        <SectionHeader eyebrow="Instagram Gallery" title="Green Corners, Styled Beautifully" text="A Pinterest-inspired plant photography grid for an editorial ecommerce feel." />
        <div className="columns-2 gap-4 md:columns-3 lg:columns-6">
          {gallery.map((image, index) => (
            <motion.img
              key={image}
              className={`mb-4 w-full break-inside-avoid rounded-3xl object-cover shadow-soft ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`}
              src={image}
              alt="Plant styling inspiration"
              loading="lazy"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
            />
          ))}
        </div>
      </section>

      <section className="premium-container pb-16">
        <div className="grid gap-8 overflow-hidden rounded-[2rem] bg-leaf-950 p-6 text-white shadow-card md:grid-cols-[1fr_0.85fr] md:items-center md:p-10">
          <div>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Mail size={22} />
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">Get plant care notes and fresh arrivals.</h2>
            <p className="mt-3 max-w-xl leading-7 text-leaf-100">Join the nursery list for seasonal drops, styling ideas, and offers before everyone else.</p>
          </div>
          <form className="rounded-3xl bg-white p-2 shadow-soft" onSubmit={(event) => event.preventDefault()}>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input className="min-h-12 flex-1 rounded-full px-5 text-leaf-950 outline-none" type="email" placeholder="Enter your email" aria-label="Email address" />
              <Button type="submit" variant="dark">
                Subscribe
              </Button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
