import { useQuery } from '@tanstack/react-query';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ClipboardList,
  FileText,
  Heart,
  Leaf,
  MessageCircle,
  PackageCheck,
  Search,
  ShoppingCart,
  Sprout,
  Star,
  Truck,
  UsersRound,
  Warehouse
} from 'lucide-react';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { brandContact } from '../../data/brandContent.js';
import { featuredProducts } from '../../utils/mockData.js';
import { getApiError } from '../../utils/auth.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { FALLBACK_PLANT_IMAGE, getProductImage, getProductTitle, handleImageError } from '../../utils/product.js';
import { useAuth } from '../../hooks/useAuth.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';
import { useToast } from '../../hooks/useToast.js';
import { addToCart } from '../../services/cartService.js';
import { getProducts } from '../../services/productService.js';
import { addToWishlist } from '../../services/wishlistService.js';
import { setSearchQuery, setSelectedCategory } from '../../store/uiSlice.js';

const heroImage = 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1800&q=85';

const fallbackCatalog = [
  ...featuredProducts,
  {
    _id: 'snake-plant-premium',
    name: 'Snake Plant',
    category: 'Indoor Plants',
    sellerName: 'Gaurav Nursery',
    price: 399,
    mrp: 549,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1593482892290-f54927ae2b8b?auto=format&fit=crop&w=700&q=80'
  },
  {
    _id: 'marigold-seeds',
    name: 'Marigold Seeds Pack',
    category: 'Seeds',
    sellerName: 'Gaurav Nursery',
    price: 99,
    mrp: 149,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=700&q=80'
  },
  {
    _id: 'balcony-planter',
    name: 'Balcony Rail Planter',
    category: 'Planters',
    sellerName: 'Gaurav Nursery',
    price: 599,
    mrp: 799,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=80'
  },
  {
    _id: 'bougainvillea-outdoor',
    name: 'Bougainvillea Plant',
    category: 'Outdoor Plants',
    sellerName: 'Gaurav Nursery',
    price: 349,
    mrp: 499,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=700&q=80'
  }
].map((product) => ({
  ...product,
  images: product.images || [{ url: product.image || FALLBACK_PLANT_IMAGE }]
}));

const categoryTiles = [
  { title: 'Office Plants', text: 'Desk, lobby, meeting room, and reception greenery.', href: '/shop?category=Indoor%20Plants', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=85' },
  { title: 'Landscape Stock', text: 'Outdoor plants for campuses, builders, and societies.', href: '/shop?category=Outdoor%20Plants', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=85' },
  { title: 'Seed Programs', text: 'Seasonal seed packs for institutions and resellers.', href: '/shop?category=Seeds', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=85' },
  { title: 'Planters & Pots', text: 'Bulk planters for projects, offices, and retail shelves.', href: '/shop?category=Planters', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=85' },
  { title: 'Corporate Gifting', text: 'Branded plant gifting for HR, events, and clients.', href: '/shop?search=corporate%20gifting', image: 'https://images.unsplash.com/photo-1525498128493-380d1990a112?auto=format&fit=crop&w=900&q=85' }
];

const reviews = [
  { name: 'Facilities Team', city: 'Delhi NCR', text: 'Clear plant options, quick coordination, and reliable packaging for our office refresh.', rating: 5 },
  { name: 'Event Vendor', city: 'Jaipur', text: 'The gifting plants were consistent in size and easy to distribute at scale.', rating: 5 },
  { name: 'Retail Partner', city: 'Lucknow', text: 'The catalog makes repeat ordering simple and the support team responds fast.', rating: 4.8 }
];

const tradeMetrics = [
  { value: '24h', label: 'Quote response window' },
  { value: '100+', label: 'Bulk-ready plant varieties' },
  { value: 'Pan India', label: 'Support and delivery planning' },
  { value: 'B2B', label: 'Office, reseller, and project supply' }
];

const buyerTypes = [
  { icon: Building2, title: 'Corporate Offices', text: 'Reception, workstations, cafeterias, meeting rooms, and employee gifting.' },
  { icon: Warehouse, title: 'Resellers & Retailers', text: 'Repeatable catalog supply for shops, local sellers, and marketplace operations.' },
  { icon: UsersRound, title: 'Societies & Institutions', text: 'Bulk plantation, campus greenery, seasonal seed drives, and maintenance needs.' },
  { icon: Sprout, title: 'Landscapers', text: 'Outdoor plants, planters, soil inputs, and project-wise fulfillment planning.' }
];

const procurementSteps = [
  { icon: Search, title: 'Share Requirement', text: 'Send plant type, quantity, delivery city, timeline, and budget range.' },
  { icon: ClipboardList, title: 'Get Curated Quote', text: 'Receive suitable SKUs, availability, pricing, and dispatch notes.' },
  { icon: PackageCheck, title: 'Confirm & Pack', text: 'Approved items are checked, grouped, packed, and readied for movement.' },
  { icon: Truck, title: 'Dispatch Support', text: 'Order support continues through delivery and plant-care handover.' }
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 }
};

const fadeLeft = {
  hidden: { opacity: 0, x: 28 },
  show: { opacity: 1, x: 0 }
};

const staggerGroup = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09
    }
  }
};

function getOldPrice(product) {
  const price = Number(product?.price || 0);
  return Number(product?.mrp || product?.oldPrice || product?.originalPrice || Math.round(price * 1.25));
}

function getDiscount(product) {
  const price = Number(product?.price || 0);
  const oldPrice = getOldPrice(product);
  if (!price || oldPrice <= price) return 'New';
  return `${Math.round(((oldPrice - price) / oldPrice) * 100)}% OFF`;
}

function sectionProducts(products, matcher, count = 4) {
  const matched = products.filter((product) => matcher(product)).slice(0, count);
  return matched.length >= count ? matched : [...matched, ...products.filter((product) => !matched.includes(product))].slice(0, count);
}

function SectionHeading({ eyebrow, title, text, action }) {
  return (
    <motion.div
      className="mb-7 flex flex-col gap-4 md:mb-9 md:flex-row md:items-end md:justify-between"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={fadeUp}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div className="max-w-2xl">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2f6d4c]">{eyebrow}</p>
        <h2 className="mt-3 font-serif text-[clamp(1.55rem,2.4vw,2.65rem)] font-black leading-tight text-[#10210f]">{title}</h2>
        {text && <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{text}</p>}
      </div>
      {action}
    </motion.div>
  );
}

function AnimatedCard({ children, className = '', delay = 0 }) {
  return (
    <motion.article
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      variants={fadeUp}
      transition={{ duration: 0.46, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.article>
  );
}

function ProductCard({ product, onCart, onWishlist }) {
  const productId = product?._id || product?.id || getProductTitle(product);
  const productUrl = String(productId).length === 24 ? `/products/${productId}` : `/shop?search=${encodeURIComponent(getProductTitle(product))}`;
  const rating = Number(product?.rating || 4.8);

  return (
    <motion.article
      className="group relative overflow-hidden rounded-lg border border-[#dfe8dd] bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
    >
      <Link className="relative block overflow-hidden bg-[#eff7ef]" to={productUrl}>
        <img
          className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
          src={getProductImage(product)}
          alt={getProductTitle(product)}
          loading="lazy"
          decoding="async"
          onError={handleImageError}
        />
        <span className="absolute left-3 top-3 rounded bg-white/95 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#0b3d1e] shadow-soft">
          {getDiscount(product)}
        </span>
      </Link>
      <button
        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded bg-white/95 text-[#0b3d1e] shadow-soft transition hover:bg-[#e9f7e7]"
        type="button"
        onClick={() => onWishlist(product)}
        aria-label="Add to wishlist"
      >
        <Heart size={17} />
      </button>
      <div className="space-y-3 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-xs font-black uppercase tracking-[0.18em] text-[#4f7a58]">{product.category || 'Plants'}</span>
          <span className="inline-flex items-center gap-1 rounded bg-[#fff7df] px-2.5 py-1 text-xs font-black text-[#7a5230]">
            <Star size={12} fill="currentColor" /> {rating.toFixed(1)}
          </span>
        </div>
        <Link className="block min-h-12 text-lg font-black leading-snug text-[#10210f] transition hover:text-[#3d7d36]" to={productUrl}>
          {getProductTitle(product)}
        </Link>
        <div className="flex items-end gap-2">
          <span className="text-xl font-black text-[#0b3d1e]">{formatCurrency(product.price)}</span>
          <span className="pb-0.5 text-sm font-bold text-stone-400 line-through">{formatCurrency(getOldPrice(product))}</span>
        </div>
        <Button className="h-12 w-full rounded-md bg-[#0b3d1e] font-black hover:bg-[#3d7d36]" onClick={() => onCart(product)}>
          <ShoppingCart size={16} /> Add to Cart
        </Button>
      </div>
    </motion.article>
  );
}

function ProductSection({ eyebrow, title, text, products, onCart, onWishlist, isLoading }) {
  return (
    <section className="premium-container py-12 sm:py-16">
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        text={text}
        action={
          <Link className="inline-flex items-center gap-2 rounded-md border border-[#dbe8d8] bg-white px-5 py-3 text-sm font-black text-[#0b3d1e] shadow-soft transition hover:-translate-y-0.5 hover:bg-[#f4fff2]" to="/shop">
            View all <ArrowRight size={16} />
          </Link>
        }
      />
      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-[25rem] rounded-[1.5rem]" />)}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id || product.id || product.name} product={product} onCart={onCart} onWishlist={onWishlist} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function HomePremium() {
  const prefersReducedMotion = useReducedMotion();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { searchQuery, selectedCategory } = useSelector((state) => state.ui);

  usePageMeta({
    title: 'Gaurav Nursery B2B | Bulk Plants, Planters, Seeds and Corporate Gifting',
    description: 'Source bulk plants, planters, seeds, and corporate gifting from Gaurav Nursery with quote support, coordinated dispatch, and B2B ordering.'
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['homepage-products'],
    queryFn: () => getProducts({ page: 1, limit: 24 }),
    select: (response) => response.products || []
  });

  const catalog = useMemo(() => {
    const liveProducts = Array.isArray(data) && data.length ? data : fallbackCatalog;
    return liveProducts.map((product) => ({
      ...product,
      rating: product.rating || 4.7,
      mrp: product.mrp || product.originalPrice || product.oldPrice || Math.round(Number(product.price || 0) * 1.25)
    }));
  }, [data]);

  const bestSellers = useMemo(() => catalog.slice(0, 4), [catalog]);
  const newArrivals = useMemo(() => [...catalog].reverse().slice(0, 4), [catalog]);
  const indoorPlants = useMemo(() => sectionProducts(catalog, (product) => /indoor|air/i.test(product.category || product.name)), [catalog]);
  const outdoorPlants = useMemo(() => sectionProducts(catalog, (product) => /outdoor|flower|fruit|rose|bougainvillea/i.test(product.category || product.name)), [catalog]);
  const seeds = useMemo(() => sectionProducts(catalog, (product) => /seed/i.test(product.category || product.name)), [catalog]);
  const planters = useMemo(() => sectionProducts(catalog, (product) => /pot|planter/i.test(product.category || product.name)), [catalog]);

  async function handleAddToCart(product) {
    const productId = product?._id || product?.id;
    if (!isAuthenticated) {
      navigate('/login');
      return false;
    }

    if (!productId || String(productId).length !== 24) {
      navigate(`/shop?search=${encodeURIComponent(getProductTitle(product))}`);
      return false;
    }

    try {
      await addToCart(productId, 1);
      showToast('Added to cart');
      return true;
    } catch (error) {
      showToast(getApiError(error, 'Unable to add to cart'), 'error');
      return false;
    }
  }

  async function handleWishlist(product) {
    const productId = product?._id || product?.id;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!productId || String(productId).length !== 24) {
      navigate(`/shop?search=${encodeURIComponent(getProductTitle(product))}`);
      return;
    }

    try {
      await addToWishlist(productId);
      showToast('Saved to wishlist');
    } catch (error) {
      showToast(getApiError(error, 'Unable to update wishlist'), 'error');
    }
  }

  function handleHeroSearch(event) {
    event.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/shop?search=${encodeURIComponent(query)}` : '/shop');
  }

  function handleCategorySelect(category) {
    dispatch(setSelectedCategory(category));
    navigate(category === 'All' ? '/shop' : `/shop?category=${encodeURIComponent(category)}`);
  }

  return (
    <div className="bg-[#f4f7f2] text-[#172315]">
      <section className="relative min-h-[calc(100svh-8rem)] overflow-hidden bg-[#10210f]">
        <motion.img
          className="absolute inset-0 h-full w-full object-cover opacity-48"
          src={heroImage}
          alt="Bulk nursery plants arranged for business orders"
          fetchPriority="high"
          initial={prefersReducedMotion ? false : { scale: 1.06, x: -14 }}
          animate={prefersReducedMotion ? undefined : { scale: 1.12, x: 10 }}
          transition={{ duration: 18, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07140b]/96 via-[#10210f]/84 to-[#10210f]/36" />
        <motion.div
          className="pointer-events-none absolute right-[8%] top-[18%] hidden h-28 w-28 rounded-full border border-white/15 bg-white/8 backdrop-blur-sm lg:block"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: [0, -14, 0] }}
          transition={{ opacity: { duration: 0.8, delay: 0.45 }, y: { duration: 7, repeat: Infinity, ease: 'easeInOut' } }}
        />
        <motion.div
          className="pointer-events-none absolute bottom-[14%] left-[45%] hidden h-20 w-20 rounded-full border border-[#b8dfb2]/25 bg-[#b8dfb2]/10 backdrop-blur-sm xl:block"
          initial={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: [0, 12, 0] }}
          transition={{ opacity: { duration: 0.8, delay: 0.7 }, y: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' } }}
        />
        <div className="premium-container relative grid min-h-[calc(100svh-8rem)] content-center gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_26rem]">
          {/* ambient flip/shine */}
          <motion.div
            className="pointer-events-none absolute right-6 top-6 z-10 hidden h-20 w-20 rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur-sm lg:block"
            initial={prefersReducedMotion ? false : { opacity: 0, rotateY: -65, scale: 0.9 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, rotateY: 25, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />
          <motion.div
            initial="hidden"
            animate="show"
            variants={staggerGroup}
          >
            <motion.span variants={fadeUp} transition={{ duration: 0.48 }} className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/12 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white backdrop-blur">
              <Leaf size={16} /> Gaurav Nursery B2B Supply
            </motion.span>
            <motion.h1 variants={fadeUp} transition={{ duration: 0.52 }} className="mt-6 max-w-4xl font-serif text-[clamp(2.35rem,5.8vw,5.8rem)] font-black leading-[0.98] text-white">
              Bulk plants and nursery supplies for business buyers.
            </motion.h1>
            <motion.p variants={fadeUp} transition={{ duration: 0.52 }} className="mt-5 max-w-2xl text-base font-semibold leading-8 text-white/82 sm:text-lg">
              Source office plants, landscape stock, planters, seeds, and corporate gifting with quote support, clear pricing, and coordinated dispatch.
            </motion.p>
            <motion.form variants={fadeUp} transition={{ duration: 0.52 }} className="mt-7 grid max-w-2xl gap-3 rounded-lg border border-white/20 bg-white/14 p-2 backdrop-blur-xl sm:grid-cols-[1fr_auto]" onSubmit={handleHeroSearch}>
              <label className="relative">
                <span className="sr-only">Search wholesale products</span>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3d7d36]" size={18} />
                <input
                  className="h-14 w-full rounded-md border border-white/40 bg-white px-12 py-4 text-sm font-bold text-[#10210f] outline-none ring-[#b8dfb2] transition focus:ring-4"
                  value={searchQuery}
                  onChange={(event) => dispatch(setSearchQuery(event.target.value))}
                  placeholder="Search bulk plants, planters, seeds"
                />
              </label>
              <Button className="h-full min-h-12 rounded-md bg-[#4f9b45] px-7 font-black text-white hover:bg-[#72ae68]" type="submit">
                Search
              </Button>
            </motion.form>
            <motion.div variants={fadeUp} transition={{ duration: 0.52 }} className="mt-6 flex flex-wrap gap-3">
              <Link className="inline-flex min-h-12 items-center justify-center rounded-md bg-white px-7 text-sm font-black text-[#0b3d1e] shadow-button transition hover:-translate-y-1 hover:bg-[#f1f8ef]" to="/shop?category=Plants">
                Browse trade catalog <ArrowRight className="ml-2" size={18} />
              </Link>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/30 bg-white/12 px-7 text-sm font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20" to="/contact">
                Request bulk quote
              </Link>
            </motion.div>
          </motion.div>

          <motion.aside className="hidden self-end rounded-lg border border-white/20 bg-white/16 p-5 text-white shadow-card backdrop-blur-xl lg:block" initial="hidden" animate="show" variants={fadeLeft} transition={{ duration: 0.55, delay: 0.18 }}>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#dff7d8]">Procurement desk</p>
            <div className="mt-5 grid gap-4">
              {procurementSteps.slice(0, 3).map((badge, index) => (
                <motion.div key={badge.title} className="flex gap-3 rounded-md bg-white/12 p-3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.42, delay: 0.36 + index * 0.12 }}>
                  <badge.icon className="mt-1 shrink-0 text-[#b8dfb2]" size={20} />
                  <div>
                    <p className="font-black">{badge.title}</p>
                    <p className="mt-1 text-sm leading-6 text-white/72">{badge.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="border-y border-[#dbe8d8] bg-white py-5">
        <div className="premium-container grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tradeMetrics.map((metric, index) => (
            <motion.div key={metric.label} className="border-l-4 border-[#4f9b45] bg-[#f8fbf6] px-5 py-4" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.42, delay: index * 0.08 }}>
              <p className="text-2xl font-black text-[#0b3d1e]">{metric.value}</p>
              <p className="mt-1 text-sm font-bold text-slate-600">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {isError && (
        <div className="premium-container pt-6">
          <div className="rounded-2xl border border-[#dbe8d8] bg-white px-5 py-4 text-sm font-bold text-[#3d5a36] shadow-soft">
            Live catalog is refreshing, so curated B2B-ready items are shown temporarily.
          </div>
        </div>
      )}

      <section className="bg-[#eef4ec] py-12 sm:py-16">
        <div className="premium-container">
          <SectionHeading eyebrow="Who We Supply" title="Built for repeat business buying" text="A cleaner B2B experience for buyers who need availability, quantity, dispatch planning, and support before placing orders." />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {buyerTypes.map((item, index) => (
              <AnimatedCard key={item.title} delay={index * 0.06} className="rounded-lg border border-[#dbe8d8] bg-white p-5 shadow-soft">
                <item.icon className="text-[#2f6d4c]" size={24} />
                <h3 className="mt-4 text-lg font-black text-[#10210f]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      <ProductSection eyebrow="Trade Catalog" title="Bulk-ready nursery products" text="Fast-moving live plants and essentials with clear pricing, catalog actions, and quick quote support." products={bestSellers} isLoading={isLoading} onCart={handleAddToCart} onWishlist={handleWishlist} />
      <ProductSection eyebrow="Fresh Availability" title="Recently listed stock for business orders" text="New plants, seeds, and planters suitable for office, retail, gifting, and project requirements." products={newArrivals} isLoading={isLoading} onCart={handleAddToCart} onWishlist={handleWishlist} />

      <section className="bg-white py-12 sm:py-16">
        <div className="premium-container">
          <SectionHeading eyebrow="B2B Categories" title="Source by business requirement" text="Browse by use case, then contact the team for quantity, dispatch city, packaging, and availability confirmation." />
          <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
            {['All', 'Indoor Plants', 'Outdoor Plants', 'Seeds', 'Planters', 'Corporate Gifting'].map((category) => (
              <button
                key={category}
                className={`shrink-0 rounded-md px-4 py-2 text-sm font-black transition ${selectedCategory === category ? 'bg-[#0b3d1e] text-white shadow-button' : 'border border-[#dbe8d8] bg-white text-[#0b3d1e] hover:bg-[#f4fff2]'}`}
                type="button"
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {categoryTiles.map((category, index) => (
              <motion.div key={category.title} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-30px' }} variants={fadeUp} transition={{ duration: 0.46, delay: index * 0.05 }}>
              <Link className="group relative block min-h-72 overflow-hidden rounded-lg bg-[#10210f] shadow-soft transition hover:-translate-y-1 hover:shadow-card" to={category.href}>
                <img className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105" src={category.image} alt={category.title} loading="lazy" decoding="async" onError={handleImageError} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07140b]/90 via-[#07140b]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#cdebc8]">{category.title}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-white/80">{category.text}</p>
                </div>
              </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-container py-12 sm:py-16">
        <SectionHeading eyebrow="Procurement Flow" title="Simple ordering for larger requirements" text="Use the catalog for discovery and the quote desk for anything that needs quantity pricing, timelines, or custom packaging." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {procurementSteps.map((item, index) => (
            <AnimatedCard key={item.title} delay={index * 0.06} className="rounded-lg border border-[#dbe8d8] bg-white p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <item.icon className="text-[#2f6d4c]" size={24} />
                <span className="text-sm font-black text-slate-300">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-4 text-lg font-black text-[#10210f]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            </AnimatedCard>
          ))}
        </div>
      </section>

      <ProductSection eyebrow="Office Plants" title="Desk, lobby, and workspace greens" text="Low-maintenance plants for offices, commercial interiors, and shaded corporate spaces." products={indoorPlants} isLoading={isLoading} onCart={handleAddToCart} onWishlist={handleWishlist} />
      <ProductSection eyebrow="Landscape Stock" title="Outdoor plants for projects" text="Sun-ready flowering, fruiting, and hardy outdoor plants for societies, campuses, and builders." products={outdoorPlants} isLoading={isLoading} onCart={handleAddToCart} onWishlist={handleWishlist} />
      <ProductSection eyebrow="Seeds" title="Seasonal seeds for institutions and resellers" text="Flower, vegetable, and herb seed packs for campaigns, retail shelves, and community programs." products={seeds} isLoading={isLoading} onCart={handleAddToCart} onWishlist={handleWishlist} />
      <ProductSection eyebrow="Planters" title="Bulk planters for finished installations" text="Planters and pots for office decor, gifting kits, retail displays, and project handovers." products={planters} isLoading={isLoading} onCart={handleAddToCart} onWishlist={handleWishlist} />

      <section className="bg-[#10210f] py-14 text-white sm:py-16">
        <div className="premium-container grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={fadeUp} transition={{ duration: 0.48 }}>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#b8dfb2]">Corporate Gifting</p>
            <h2 className="mt-4 font-serif text-[clamp(2rem,3.5vw,3.8rem)] font-black leading-tight">Plant gifting programs with business-grade coordination.</h2>
            <p className="mt-4 max-w-xl leading-8 text-white/76">Curated plants, planter options, branded notes, recipient lists, and dispatch planning for HR teams, events, real estate handovers, and client gifting.</p>
            <Link className="mt-7 inline-flex min-h-12 items-center justify-center rounded-md bg-white px-7 text-sm font-black text-[#0b3d1e] transition hover:-translate-y-1 hover:bg-[#f1f8ef]" to="/contact">
              Request gifting quote <ArrowRight className="ml-2" size={18} />
            </Link>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Building2, title: 'Bulk planning', text: 'Quantity, city, budget, and packaging mapped clearly.' },
              { icon: BadgeCheck, title: 'Gift-ready finish', text: 'Premium plant and planter combinations for recipients.' },
              { icon: PackageCheck, title: 'Careful packing', text: 'Live plant packaging suitable for delivery handling.' },
              { icon: FileText, title: 'Quote documentation', text: 'Clear order notes for internal approvals and repeat buying.' }
            ].map((item, index) => (
              <AnimatedCard key={item.title} delay={index * 0.06} className="rounded-lg border border-white/15 bg-white/10 p-5 backdrop-blur">
                <item.icon className="text-[#b8dfb2]" size={24} />
                <h3 className="mt-4 text-lg font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{item.text}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-container py-12 sm:py-16">
        <SectionHeading eyebrow="Buyer Feedback" title="Trusted by teams that need coordination" text="Proof points focused on delivery quality, plant health, and responsive support." />
        <div className="grid gap-5 md:grid-cols-3">
          {reviews.map((review, index) => (
            <AnimatedCard key={review.name} delay={index * 0.06} className="rounded-lg border border-[#e2e9de] bg-white p-6 shadow-soft">
              <div className="flex gap-1 text-[#c28920]">
                {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={16} fill="currentColor" />)}
              </div>
              <p className="mt-5 text-base font-semibold leading-8 text-stone-700">&ldquo;{review.text}&rdquo;</p>
              <div className="mt-6">
                <p className="font-black text-[#10210f]">{review.name}</p>
                <p className="text-sm font-bold text-[#3d7d36]">{review.city}</p>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="premium-container">
          <div className="overflow-hidden rounded-lg border border-[#dbe8d8] bg-[linear-gradient(135deg,#f1f8ef,#ffffff_45%,#eef4ec)] p-6 shadow-soft sm:p-9">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#3d7d36]">Trade support</p>
              <h2 className="mt-3 font-serif text-[clamp(1.8rem,3vw,3.2rem)] font-black text-[#10210f]">Send your quantity, city, and timeline.</h2>
              <p className="mt-3 max-w-2xl leading-7 text-slate-600">Talk to {brandContact.name} for bulk plant selection, availability, delivery questions, and after-purchase care.</p>
            </div>
            <a className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#25d366] px-7 text-sm font-black text-white shadow-button transition hover:-translate-y-1 hover:bg-[#1ebe5d]" href={`https://wa.me/${brandContact.whatsappPhone}?text=${encodeURIComponent(brandContact.whatsappMessage)}`} rel="noreferrer" target="_blank">
              <MessageCircle className="mr-2" size={18} /> WhatsApp Support
            </a>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
}
