import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Heart,
  Leaf,
  LockKeyhole,
  MessageCircle,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Truck
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

const heroImage = 'https://images.unsplash.com/photo-1524593166156-312f362cada0?auto=format&fit=crop&w=1800&q=85';

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
  { title: 'Indoor Plants', text: 'Low-light, air-purifying, desk-friendly greens.', href: '/shop?category=Indoor%20Plants', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=85' },
  { title: 'Outdoor Plants', text: 'Sun-loving plants for balconies, terraces, and gardens.', href: '/shop?category=Outdoor%20Plants', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=85' },
  { title: 'Seeds', text: 'Vegetable, flower, herb, and seasonal seed packs.', href: '/shop?category=Seeds', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=85' },
  { title: 'Planters', text: 'Ceramic, balcony, tabletop, and decorative planters.', href: '/shop?category=Planters', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=85' },
  { title: 'Corporate Gifting', text: 'Gift-ready plants for teams, events, and clients.', href: '/shop?search=corporate%20gifting', image: 'https://images.unsplash.com/photo-1525498128493-380d1990a112?auto=format&fit=crop&w=900&q=85' }
];

const trustBadges = [
  { icon: ShieldCheck, title: 'Healthy Plant Guarantee', text: 'Checked before packing and supported after delivery.' },
  { icon: LockKeyhole, title: 'Secure Payments', text: 'Protected checkout with trusted payment options.' },
  { icon: Truck, title: 'Fast Delivery', text: 'Quick dispatch with careful live-plant handling.' },
  { icon: MessageCircle, title: 'Customer Support', text: 'WhatsApp help for selection, care, and orders.' }
];

const reviews = [
  { name: 'Priya S.', city: 'Lucknow', text: 'The money plant arrived fresh, packed beautifully, and settled in within days.', rating: 5 },
  { name: 'Aman V.', city: 'Delhi', text: 'Clean shopping experience and helpful support for choosing indoor plants.', rating: 5 },
  { name: 'Neha R.', city: 'Pune', text: 'The planter quality felt premium and the plant care tips were practical.', rating: 4.8 }
];

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
    <div className="mb-7 flex flex-col gap-4 md:mb-9 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#3d7d36]">{eyebrow}</p>
        <h2 className="mt-3 font-serif text-[clamp(1.7rem,3vw,3rem)] font-black leading-tight text-[#10210f]">{title}</h2>
        {text && <p className="mt-3 text-sm leading-7 text-stone-600 sm:text-base">{text}</p>}
      </div>
      {action}
    </div>
  );
}

function ProductCard({ product, onCart, onWishlist }) {
  const productId = product?._id || product?.id || getProductTitle(product);
  const productUrl = String(productId).length === 24 ? `/products/${productId}` : `/shop?search=${encodeURIComponent(getProductTitle(product))}`;
  const rating = Number(product?.rating || 4.8);

  return (
    <motion.article
      className="group relative overflow-hidden rounded-[1.5rem] border border-[#e2e9de] bg-white shadow-[0_16px_55px_rgba(16,33,15,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(16,33,15,0.15)]"
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
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#0b3d1e] shadow-soft">
          {getDiscount(product)}
        </span>
      </Link>
      <button
        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#0b3d1e] shadow-soft transition hover:bg-[#e9f7e7]"
        type="button"
        onClick={() => onWishlist(product)}
        aria-label="Add to wishlist"
      >
        <Heart size={17} />
      </button>
      <div className="space-y-3 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-xs font-black uppercase tracking-[0.18em] text-[#4f7a58]">{product.category || 'Plants'}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#fff7df] px-2.5 py-1 text-xs font-black text-[#7a5230]">
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
        <Button className="h-12 w-full rounded-full bg-[#0b3d1e] font-black hover:bg-[#3d7d36]" onClick={() => onCart(product)}>
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
          <Link className="inline-flex items-center gap-2 rounded-full border border-[#dbe8d8] bg-white px-5 py-3 text-sm font-black text-[#0b3d1e] shadow-soft transition hover:-translate-y-0.5 hover:bg-[#f4fff2]" to="/shop">
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
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { searchQuery, selectedCategory } = useSelector((state) => state.ui);

  usePageMeta({
    title: 'Gaurav Nursery | Premium Plants, Seeds, Planters and Gifting',
    description: 'Shop healthy plants, seeds, planters, and corporate gifting from Gaurav Nursery with secure payments, fast delivery, and customer support.'
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
    <div className="bg-[#f7fbf3] text-[#172315]">
      <section className="relative min-h-[calc(100svh-8rem)] overflow-hidden bg-[#10210f]">
        <img className="absolute inset-0 h-full w-full object-cover opacity-55" src={heroImage} alt="Premium indoor plants from Gaurav Nursery" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07140b]/95 via-[#10210f]/78 to-[#10210f]/28" />
        <div className="premium-container relative grid min-h-[calc(100svh-8rem)] content-center gap-8 py-12 lg:grid-cols-[1fr_24rem]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white backdrop-blur">
              <Leaf size={16} /> Gaurav Nursery
            </span>
            <h1 className="mt-6 max-w-4xl font-serif text-[clamp(2.5rem,7vw,6.5rem)] font-black leading-[0.96] text-white">
              Premium plants for beautiful Indian homes.
            </h1>
            <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-white/82 sm:text-lg">
              Shop healthy plants, seeds, planters, and gift-ready greenery with secure checkout, fast delivery, and real plant care support.
            </p>
            <form className="mt-7 grid max-w-2xl gap-3 rounded-[1.25rem] border border-white/20 bg-white/16 p-2 backdrop-blur-xl sm:grid-cols-[1fr_auto]" onSubmit={handleHeroSearch}>
              <label className="relative">
                <span className="sr-only">Search products</span>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3d7d36]" size={18} />
                <input
                  className="h-14 w-full rounded-full border border-white/40 bg-white px-12 py-4 text-sm font-bold text-[#10210f] outline-none ring-[#b8dfb2] transition focus:ring-4"
                  value={searchQuery}
                  onChange={(event) => dispatch(setSearchQuery(event.target.value))}
                  placeholder="Search plants, seeds, planters"
                />
              </label>
              <Button className="h-full min-h-12 rounded-full bg-[#4f9b45] px-7 font-black text-white hover:bg-[#72ae68]" type="submit">
                Search
              </Button>
            </form>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-black text-[#0b3d1e] shadow-button transition hover:-translate-y-1 hover:bg-[#f1f8ef]" to="/shop?category=Plants">
                Shop Plants <ArrowRight className="ml-2" size={18} />
              </Link>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 bg-white/12 px-7 text-sm font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20" to="/shop?category=Seeds">
                Shop Seeds
              </Link>
            </div>
          </motion.div>

          <motion.aside className="hidden self-end rounded-[1.5rem] border border-white/20 bg-white/18 p-5 text-white shadow-card backdrop-blur-xl lg:block" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, delay: 0.1 }}>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#dff7d8]">Live store promise</p>
            <div className="mt-5 grid gap-4">
              {trustBadges.slice(0, 3).map((badge) => (
                <div key={badge.title} className="flex gap-3 rounded-2xl bg-white/12 p-3">
                  <badge.icon className="mt-1 shrink-0 text-[#b8dfb2]" size={20} />
                  <div>
                    <p className="font-black">{badge.title}</p>
                    <p className="mt-1 text-sm leading-6 text-white/72">{badge.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="border-y border-[#dbe8d8] bg-white py-5">
        <div className="premium-container grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trustBadges.map((badge) => (
            <div key={badge.title} className="flex items-center gap-3 rounded-2xl bg-[#f7fbf3] px-4 py-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e0f2d8] text-[#0b3d1e]">
                <badge.icon size={20} />
              </span>
              <div>
                <p className="font-black text-[#10210f]">{badge.title}</p>
                <p className="text-sm font-semibold text-stone-500">{badge.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {isError && (
        <div className="premium-container pt-6">
          <div className="rounded-2xl border border-[#dbe8d8] bg-white px-5 py-4 text-sm font-bold text-[#3d5a36] shadow-soft">
            Live catalog is refreshing, so curated best sellers are shown temporarily.
          </div>
        </div>
      )}

      <ProductSection eyebrow="Best Sellers" title="Most loved by plant parents" text="Fast-moving live plants and essentials with clear pricing and easy actions." products={bestSellers} isLoading={isLoading} onCart={handleAddToCart} onWishlist={handleWishlist} />
      <ProductSection eyebrow="New Arrivals" title="Fresh from the nursery bench" text="Recently added plants, seed packs, and planters for the season." products={newArrivals} isLoading={isLoading} onCart={handleAddToCart} onWishlist={handleWishlist} />

      <section className="bg-white py-12 sm:py-16">
        <div className="premium-container">
          <SectionHeading eyebrow="Shop Categories" title="Everything for a greener home" text="Inspired by broad nursery commerce navigation, shaped with a cleaner Gaurav Nursery identity." />
          <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
            {['All', 'Indoor Plants', 'Outdoor Plants', 'Seeds', 'Planters', 'Corporate Gifting'].map((category) => (
              <button
                key={category}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-black transition ${selectedCategory === category ? 'bg-[#0b3d1e] text-white shadow-button' : 'border border-[#dbe8d8] bg-white text-[#0b3d1e] hover:bg-[#f4fff2]'}`}
                type="button"
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {categoryTiles.map((category) => (
              <Link key={category.title} className="group relative min-h-72 overflow-hidden rounded-[1.5rem] bg-[#10210f] shadow-soft transition hover:-translate-y-1 hover:shadow-card" to={category.href}>
                <img className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105" src={category.image} alt={category.title} loading="lazy" decoding="async" onError={handleImageError} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07140b]/90 via-[#07140b]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#cdebc8]">{category.title}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-white/80">{category.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ProductSection eyebrow="Indoor Plants" title="Calm greens for rooms and desks" text="Low-maintenance plants for homes, offices, and shaded corners." products={indoorPlants} isLoading={isLoading} onCart={handleAddToCart} onWishlist={handleWishlist} />
      <ProductSection eyebrow="Outdoor Plants" title="Balcony and garden favorites" text="Sun-ready flowering, fruiting, and hardy outdoor plants." products={outdoorPlants} isLoading={isLoading} onCart={handleAddToCart} onWishlist={handleWishlist} />
      <ProductSection eyebrow="Seeds" title="Start your garden from scratch" text="Seasonal flower, vegetable, and herb seed packs for easy growing." products={seeds} isLoading={isLoading} onCart={handleAddToCart} onWishlist={handleWishlist} />
      <ProductSection eyebrow="Planters" title="Premium homes for your plants" text="Planters and pots that make greenery feel finished." products={planters} isLoading={isLoading} onCart={handleAddToCart} onWishlist={handleWishlist} />

      <section className="bg-[#10210f] py-14 text-white sm:py-16">
        <div className="premium-container grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#b8dfb2]">Corporate Gifting</p>
            <h2 className="mt-4 font-serif text-[clamp(2rem,4vw,4rem)] font-black leading-tight">Gift healthy plants to teams, clients, and events.</h2>
            <p className="mt-4 max-w-xl leading-8 text-white/76">Curated plants, elegant planters, branded notes, and delivery coordination for bulk gifting programs.</p>
            <Link className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-black text-[#0b3d1e] transition hover:-translate-y-1 hover:bg-[#f1f8ef]" to="/contact">
              Request gifting quote <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Building2, title: 'Bulk planning', text: 'Quantity, city, budget, and packaging mapped clearly.' },
              { icon: BadgeCheck, title: 'Gift-ready finish', text: 'Premium plant and planter combinations for recipients.' },
              { icon: PackageCheck, title: 'Careful packing', text: 'Live plant packaging suitable for delivery handling.' },
              { icon: CheckCircle2, title: 'Support follow-up', text: 'Care guidance for recipients after delivery.' }
            ].map((item) => (
              <div key={item.title} className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
                <item.icon className="text-[#b8dfb2]" size={24} />
                <h3 className="mt-4 text-lg font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-container py-12 sm:py-16">
        <SectionHeading eyebrow="Customer Reviews" title="Loved by homes and offices" text="Proof points focused on delivery quality, plant health, and support." />
        <div className="grid gap-5 md:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.name} className="rounded-[1.5rem] border border-[#e2e9de] bg-white p-6 shadow-soft">
              <div className="flex gap-1 text-[#c28920]">
                {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={16} fill="currentColor" />)}
              </div>
              <p className="mt-5 text-base font-semibold leading-8 text-stone-700">"{review.text}"</p>
              <div className="mt-6">
                <p className="font-black text-[#10210f]">{review.name}</p>
                <p className="text-sm font-bold text-[#3d7d36]">{review.city}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="premium-container overflow-hidden rounded-[1.75rem] bg-[linear-gradient(135deg,#f1f8ef,#ffffff_45%,#fff7df)] p-6 shadow-soft sm:p-9">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#3d7d36]">Plant care support</p>
              <h2 className="mt-3 font-serif text-[clamp(1.8rem,3vw,3.2rem)] font-black text-[#10210f]">Need help choosing the right plant?</h2>
              <p className="mt-3 max-w-2xl leading-7 text-stone-600">Talk to {brandContact.name} for plant selection, delivery questions, and after-purchase care.</p>
            </div>
            <a className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#25d366] px-7 text-sm font-black text-white shadow-button transition hover:-translate-y-1 hover:bg-[#1ebe5d]" href={`https://wa.me/${brandContact.whatsappPhone}?text=${encodeURIComponent(brandContact.whatsappMessage)}`} rel="noreferrer" target="_blank">
              <MessageCircle className="mr-2" size={18} /> WhatsApp Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
