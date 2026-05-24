import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUp,
  BadgePercent,
  Check,
  Clock,
  Heart,
  Instagram,
  Leaf,
  Mail,
  MapPin,
  MessageCircle,
  PackageCheck,
  Phone,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  UserRound
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';
import { useToast } from '../../hooks/useToast.js';
import { addToCart } from '../../services/cartService.js';
import { getProducts } from '../../services/productService.js';
import { addToWishlist } from '../../services/wishlistService.js';
import { getApiError } from '../../utils/auth.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { FALLBACK_PLANT_IMAGE, getProductImage, getProductTitle, handleImageError } from '../../utils/product.js';

const categoryArtwork = {
  'Indoor Plants': 'https://images.unsplash.com/photo-1545239705-1564e58b9e4a?auto=format&fit=crop&w=500&q=85',
  'Outdoor Plants': 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=500&q=85',
  'Flowering Plants': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=500&q=85',
  'Fruit Plants': 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=500&q=85',
  'Pots & Planters': 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=500&q=85',
  Seeds: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=500&q=85',
  Fertilizers: 'https://images.unsplash.com/photo-1591955506264-3f5a6834570a?auto=format&fit=crop&w=500&q=85',
  'Gardening Tools': 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=500&q=85'
};

const desiredCategories = Object.keys(categoryArtwork);
const nurseryImage = 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=900&q=85';

const heroBadges = ['10K+ Happy Customers', '4.8 Rating', '100% Healthy Plants', 'Pan India Delivery'];
const featureList = ['Hygienic Packaging', 'Fresh Plants', 'On-Time Delivery', 'Healthy Guarantee'];
const whyChoose = ['Wide Variety of Plants', 'Best Quality Products', 'Affordable Prices', 'Expert Guidance', 'Safe Packaging', 'Pan India Delivery'];
const trustBar = [
  { icon: PackageCheck, label: 'Secure Packaging' },
  { icon: ShieldCheck, label: 'Live Arrival Guarantee' },
  { icon: BadgePercent, label: 'COD Available' },
  { icon: RotateCcw, label: 'Easy Returns' },
  { icon: UserRound, label: 'Expert Guidance' }
];

const testimonials = [
  {
    name: 'Priya Sharma',
    review: 'The plants arrived fresh, carefully packed, and looked even better than expected.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=85'
  },
  {
    name: 'Rahul Verma',
    review: 'Beautiful collection, quick delivery, and helpful guidance for plant care.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=85'
  },
  {
    name: 'Anjali Singh',
    review: 'My balcony looks lovely now. The packaging and quality felt truly premium.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=85'
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

function getOldPrice(product) {
  const price = Number(product?.price || 0);
  return Number(product?.oldPrice || product?.originalPrice || product?.mrp || Math.round(price * 1.25));
}

function getDiscount(product) {
  const price = Number(product?.price || 0);
  const oldPrice = getOldPrice(product);
  if (!price || oldPrice <= price) return 'Best Value';
  return `${Math.round(((oldPrice - price) / oldPrice) * 100)}% OFF`;
}

function ProductMiniCard({ product, onAddToCart, onAddToWishlist }) {
  return (
    <article className="group rounded-[1.25rem] border border-[#dbe8d8] bg-white p-3 shadow-[0_18px_45px_rgba(11,61,30,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(11,61,30,0.14)]">
      <div className="relative overflow-hidden rounded-2xl bg-[#eaf7e8]">
        <Link to={`/products/${product._id}`}>
          <img className="aspect-[5/4] w-full object-cover transition duration-500 group-hover:scale-110" src={getProductImage(product)} alt={getProductTitle(product)} loading="lazy" decoding="async" onError={handleImageError} />
        </Link>
        <span className="absolute left-3 top-3 rounded-full bg-[#4caf50] px-3 py-1 text-[11px] font-black text-white">{getDiscount(product)}</span>
        <button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0b3d1e] shadow-soft transition hover:bg-[#0b3d1e] hover:text-white" onClick={() => onAddToWishlist(product)} aria-label="Add to wishlist">
          <Heart size={17} />
        </button>
      </div>
      <div className="pt-4">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#4caf50]">{product.category || 'Plants'}</p>
        <Link className="mt-1 line-clamp-2 block min-h-[3rem] text-base font-black leading-snug text-[#1b2a1f] transition hover:text-[#4caf50]" to={`/products/${product._id}`}>
          {getProductTitle(product)}
        </Link>
        <div className="mt-2 flex items-center gap-1 text-amber-500">
          {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={14} fill="currentColor" />)}
          <span className="ml-1 text-xs font-bold text-stone-500">4.8</span>
        </div>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-lg font-black text-[#0b3d1e]">{formatCurrency(product.price)}</span>
          <span className="text-sm font-bold text-stone-400 line-through">{formatCurrency(getOldPrice(product))}</span>
        </div>
        <Button className="mt-4 w-full bg-[#0b3d1e] hover:bg-[#4caf50]" onClick={() => onAddToCart(product)}>
          <ShoppingCart className="mr-2" size={17} />
          Add to Cart
        </Button>
      </div>
    </article>
  );
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="mx-auto mb-8 max-w-2xl text-center">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#4caf50]">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-4xl font-black tracking-tight text-[#0b3d1e] sm:text-5xl">{title}</h2>
      {text && <p className="mt-3 text-sm leading-7 text-stone-600 sm:text-base">{text}</p>}
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ hours: '00', minutes: '00', seconds: '00' });
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  usePageMeta({
    title: 'Bring Nature Home',
    description: 'Shop healthy plants, seeds, pots, planters, fertilizers, and garden tools from Gaurav Nursery.'
  });

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setError('');
        const data = await getProducts({ page: 1, limit: 16 });
        if (isMounted) setProducts(data.products || []);
      } catch (err) {
        if (isMounted) setError(getApiError(err, 'Unable to load products'));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('recentlyViewedProducts') || '[]');
      if (Array.isArray(stored)) setRecentlyViewed(stored.slice(0, 4));
    } catch {
      setRecentlyViewed([]);
    }
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const diff = Math.max(0, end.getTime() - now.getTime());
      const hours = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const bestSellers = useMemo(() => products.slice(0, 4), [products]);
  const newArrivals = useMemo(() => [...products].slice(0, 8), [products]);
  const trendingProducts = useMemo(() => [...products].sort((a, b) => Number(b.stock || 0) - Number(a.stock || 0)).slice(0, 4), [products]);
  const categories = useMemo(() => {
    return desiredCategories.map((name) => ({
      name,
      image: categoryArtwork[name],
      count: products.filter((product) => (product.category || '').toLowerCase() === name.toLowerCase()).length
    }));
  }, [products]);

  async function handleAddToCart(product) {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/products/${product._id}` } } });
      return false;
    }

    try {
      await addToCart(product._id, 1);
      showToast('Added to cart');
      return true;
    } catch (err) {
      showToast(getApiError(err, 'Unable to add to cart'), 'error');
      return false;
    }
  }

  async function handleWishlist(product) {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await addToWishlist(product._id);
      showToast('Saved to wishlist');
    } catch (err) {
      showToast(getApiError(err, 'Unable to update wishlist'), 'error');
    }
  }

  function handleNewsletter(event) {
    event.preventDefault();
    setEmail('');
    showToast('Thanks for subscribing');
  }

  return (
    <div className="bg-[#f8fff5] text-[#1b2a1f]">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_20%_10%,rgba(155,201,145,0.22),transparent_24rem),linear-gradient(135deg,#061507_0%,#0d2a15_44%,#17391c_100%)]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 12 }).map((_, index) => (
            <motion.span
              key={index}
              className="absolute h-8 w-4 rounded-full bg-emerald-200/20 blur-[0.2px]"
              style={{ left: `${8 + index * 8}%`, top: `${(index * 17) % 82}%` }}
              animate={{ y: [0, 24, 0], rotate: [0, 18, -10, 0], opacity: [0.18, 0.42, 0.18] }}
              transition={{ duration: 7 + index, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
        <div className="premium-container grid gap-8 py-10 lg:grid-cols-[1fr_22rem] xl:grid-cols-[1fr_24rem]">
          <motion.div className="grid gap-8 rounded-[2rem] border border-white/15 bg-[#0f172a]/90 p-6 text-white shadow-[0_30px_100px_rgba(0,0,0,0.34)] backdrop-blur md:grid-cols-[0.9fr_1.1fr] md:p-9" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="flex flex-col justify-center">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-[#14532d]/95 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white backdrop-blur">
                <Leaf size={16} />
                Premium Botanical Store
              </span>
              <h1 className="mt-6 font-serif text-5xl font-black leading-[0.98] tracking-tight text-white sm:text-6xl xl:text-7xl">Bring Nature Home</h1>
              <p className="mt-5 max-w-xl text-lg font-semibold leading-8 text-emerald-50/85">Healthy Plants. Happy Homes. Delivered with Love.</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {heroBadges.map((badge) => (
                  <div key={badge} className="flex items-center gap-2 rounded-2xl border border-white/15 bg-[#0f172a]/70 px-4 py-3 text-sm font-black text-white backdrop-blur">
                    <Check size={17} className="text-emerald-200" />
                    {badge}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-black text-[#0b3d1e] shadow-[0_18px_40px_rgba(0,0,0,0.25)] transition hover:-translate-y-1 hover:bg-emerald-50" to="/shop">
                  Shop Now <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-[#14532d]/95 px-7 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#166534]" to="/categories">
                  Explore Collections
                </Link>
              </div>
            </div>

            <div className="relative min-h-[430px]">
              <motion.img className="absolute right-0 top-0 h-64 w-[72%] rounded-[2rem] object-cover shadow-card" src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=85" alt="Green nursery plants" onError={handleImageError} animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
              <motion.img className="absolute bottom-8 left-0 h-60 w-[62%] rounded-[2rem] object-cover shadow-card" src={FALLBACK_PLANT_IMAGE} alt="Potted plants" onError={handleImageError} animate={{ y: [0, 10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
              <img className="absolute bottom-0 right-6 h-44 w-44 rounded-[1.5rem] object-cover shadow-card" src={nurseryImage} alt="Nursery care" loading="lazy" onError={handleImageError} />
              <div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-8 border-white/80 bg-[#0b3d1e]/90 text-center text-white shadow-card backdrop-blur">
                <span className="text-3xl font-black">GN</span>
                <span className="text-[10px] font-black uppercase tracking-[0.16em]">Gaurav Nursery</span>
              </div>
              <div className="absolute bottom-7 right-0 rotate-[-3deg] rounded-2xl border border-white/20 bg-[#0f172a]/80 px-5 py-4 text-center font-serif text-lg font-black text-white shadow-card backdrop-blur">
                From Our Nursery<br />To Your Home
              </div>
            </div>
          </motion.div>

          <aside className="grid gap-5">
            <div className="rounded-[1.5rem] border border-white/15 bg-[#0f172a]/85 p-5 text-white shadow-soft backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-2xl font-black text-white">Best Sellers</h2>
                <Link className="text-sm font-black text-emerald-100" to="/shop">View all</Link>
              </div>
              {isLoading && <div className="grid gap-3">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-28" />)}</div>}
              {error && <p className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}
              {!isLoading && !error && (
                <div className="grid gap-4">
                  {bestSellers.map((product) => (
                    <div key={product._id} className="grid grid-cols-[5rem_1fr] gap-3 rounded-2xl border border-white/10 bg-[#0f172a]/65 p-2 backdrop-blur">
                      <Link to={`/products/${product._id}`}><img className="h-20 w-20 rounded-xl object-cover" src={getProductImage(product)} alt={getProductTitle(product)} loading="lazy" onError={handleImageError} /></Link>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-black uppercase tracking-[0.12em] text-emerald-100">{product.category || 'Plants'}</p>
                        <Link className="line-clamp-1 text-sm font-black text-white" to={`/products/${product._id}`}>{getProductTitle(product)}</Link>
                        <div className="mt-1 flex items-center gap-1 text-amber-300"><Star size={13} fill="currentColor" /><span className="text-xs font-bold text-emerald-50/80">4.8</span></div>
                        <div className="mt-1 flex items-center gap-2"><span className="font-black text-white">{formatCurrency(product.price)}</span><span className="text-xs font-bold text-emerald-50/50 line-through">{formatCurrency(getOldPrice(product))}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link className="block rounded-[1.5rem] border border-white/15 bg-[#14532d]/85 p-6 text-white shadow-card backdrop-blur transition hover:-translate-y-1 hover:bg-[#166534]" to="/shop">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#c8f8c9]">Summer Green Sale</p>
              <h3 className="mt-2 font-serif text-3xl font-black">Up to 40% OFF</h3>
              <span className="mt-4 inline-flex items-center text-sm font-black">Shop offers <ArrowRight className="ml-2" size={17} /></span>
            </Link>

            <div className="overflow-hidden rounded-[1.5rem] border border-[#dbe8d8] bg-white shadow-soft">
              <img className="h-44 w-full object-cover" src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=700&q=85" alt="Gardener consultation" loading="lazy" onError={handleImageError} />
              <div className="p-5">
                <h3 className="font-serif text-2xl font-black text-[#0b3d1e]">Free Plant Consultation</h3>
                <a className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-[#25d366] px-5 text-sm font-black text-white transition hover:-translate-y-1" href="https://wa.me/916352031504" rel="noreferrer" target="_blank">
                  <MessageCircle className="mr-2" size={17} /> Chat Now
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="premium-container py-12">
        <SectionTitle eyebrow="Shop by Category" title="Curated for Every Green Corner" />
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-8">
          {categories.map((category, index) => (
            <motion.div key={category.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: index * 0.03 }}>
              <Link className="group block text-center" to={`/shop?category=${encodeURIComponent(category.name)}`}>
                <span className="mx-auto block h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-[#eaf7e8] shadow-soft transition group-hover:-translate-y-1 group-hover:shadow-card">
                  <img className="h-full w-full object-cover transition duration-500 group-hover:scale-110" src={category.image} alt={category.name} loading="lazy" onError={handleImageError} />
                </span>
                <span className="mt-4 block text-sm font-black text-[#0b3d1e]">{category.name}</span>
                <span className="mt-1 block text-xs font-bold text-stone-500">{category.count || 'Explore'} items</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="premium-container">
          <SectionTitle eyebrow="New Arrivals" title="Fresh From the Nursery" text="Latest live products from the Gaurav Nursery catalog." />
          {isLoading && <div className="grid gap-5 md:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-96" />)}</div>}
          {!isLoading && !error && (
            <div className="flex snap-x gap-5 overflow-x-auto pb-4">
              {newArrivals.map((product) => (
                <div key={product._id} className="w-72 shrink-0 snap-start">
                  <ProductMiniCard product={product} onAddToCart={handleAddToCart} onAddToWishlist={handleWishlist} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="premium-container py-14">
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <motion.div className="relative overflow-hidden rounded-[2rem] bg-[#0b3d1e] p-7 text-white shadow-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Clock className="absolute right-5 top-5 h-16 w-16 text-white/10" />
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-100">Flash Sale</p>
            <h2 className="mt-3 font-serif text-4xl font-black">Today&apos;s Green Deals</h2>
            <p className="mt-3 text-sm leading-7 text-emerald-50/80">Limited-time offers on live catalog products. Ends tonight.</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                ['Hours', timeLeft.hours],
                ['Minutes', timeLeft.minutes],
                ['Seconds', timeLeft.seconds]
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/15 bg-[#0f172a]/70 p-4 text-center backdrop-blur shadow-soft">
                  <span className="block text-3xl font-black text-white">{value}</span>
                  <span className="mt-1 block text-[11px] font-black uppercase tracking-[0.16em] text-emerald-100">{label}</span>
                </div>
              ))}
            </div>
            <Link className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-black text-[#0b3d1e] transition hover:-translate-y-1 hover:bg-emerald-50" to="/shop">
              Shop Sale <ArrowRight className="ml-2" size={17} />
            </Link>
          </motion.div>

          <div>
            <SectionTitle eyebrow="Trending Now" title="Most Loved This Week" text="Curated from products currently available in the store." />
            {isLoading && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-80" />)}</div>}
            {!isLoading && !error && (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {trendingProducts.map((product) => (
                  <ProductMiniCard key={product._id} product={product} onAddToCart={handleAddToCart} onAddToWishlist={handleWishlist} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {!!recentlyViewed.length && (
        <section className="bg-white py-14">
          <div className="premium-container">
            <SectionTitle eyebrow="Recently Viewed" title="Pick Up Where You Left Off" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {recentlyViewed.map((product) => (
                <ProductMiniCard key={product._id || product.id || product.name} product={product} onAddToCart={handleAddToCart} onAddToWishlist={handleWishlist} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="premium-container py-14">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#0b3d1e] p-8 text-white shadow-card md:p-12">
          <img className="absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover opacity-45 md:block" src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1000&q=85" alt="Beautiful plants" loading="lazy" onError={handleImageError} />
          <div className="relative max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#eaf7e8]">Beautiful Plants Better Living</p>
            <h2 className="mt-3 font-serif text-4xl font-black sm:text-5xl">Handpicked | Hygienic | Carefully Delivered</h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {featureList.map((feature) => (
                <div key={feature} className="flex items-center gap-3 rounded-2xl bg-[#0f172a]/60 px-4 py-3 font-black text-white backdrop-blur shadow-soft">
                  <Check size={18} className="text-[#eaf7e8]" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="premium-container py-12">
        <SectionTitle eyebrow="Why Choose Us" title="Why Choose Gaurav Nursery" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyChoose.map((item, index) => (
            <motion.div key={item} className="rounded-[1.5rem] border border-[#dbe8d8] bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: index * 0.04 }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eaf7e8] text-[#0b3d1e]"><Check size={22} /></div>
              <h3 className="mt-5 text-lg font-black text-[#0b3d1e]">{item}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="premium-container">
          <SectionTitle eyebrow="Testimonials" title="Loved by Plant Parents" />
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.article key={testimonial.name} className="rounded-[1.5rem] border border-[#dbe8d8] bg-[#f8fff5] p-6 shadow-soft" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: index * 0.05 }}>
                <div className="flex items-center gap-4">
                  <img className="h-14 w-14 rounded-full object-cover" src={testimonial.image} alt={testimonial.name} loading="lazy" onError={handleImageError} />
                  <div>
                    <div className="flex text-amber-500">{Array.from({ length: 5 }).map((_, starIndex) => <Star key={starIndex} size={15} fill="currentColor" />)}</div>
                    <h3 className="mt-1 font-black text-[#0b3d1e]">{testimonial.name}</h3>
                  </div>
                </div>
                <p className="mt-5 leading-7 text-stone-600">{testimonial.review}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-container py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionTitle eyebrow="Plant Care Blog" title="Grow Better Every Week" text="Simple care notes for healthier balconies, homes, and gardens." />
            <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { title: 'How to Water Indoor Plants', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=700&q=85', tag: 'Indoor care' },
                { title: 'Best Flowering Plants for Indian Homes', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=700&q=85', tag: 'Seasonal' },
                { title: 'Balcony Garden Starter Guide', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=700&q=85', tag: 'Beginner' }
              ].map((post, index) => (
                <motion.article key={post.title} className="grid overflow-hidden rounded-[1.5rem] border border-[#dbe8d8] bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-card sm:block lg:grid lg:grid-cols-[11rem_1fr]" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: index * 0.04 }}>
                  <img className="h-44 w-full object-cover lg:h-full" src={post.image} alt={post.title} loading="lazy" onError={handleImageError} />
                  <div className="p-5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4caf50]">{post.tag}</p>
                    <h3 className="mt-2 text-lg font-black text-[#0b3d1e]">{post.title}</h3>
                    <Link className="mt-4 inline-flex items-center text-sm font-black text-[#4caf50]" to="/shop">Explore plants <ArrowRight className="ml-2" size={15} /></Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle eyebrow="Instagram Gallery" title="From Our Green Corners" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=500&q=85',
                'https://images.unsplash.com/photo-1545239705-1564e58b9e4a?auto=format&fit=crop&w=500&q=85',
                'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=500&q=85',
                'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=500&q=85',
                'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=500&q=85',
                'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=500&q=85'
              ].map((image, index) => (
                <motion.a key={image} className="group relative block overflow-hidden rounded-[1.25rem] bg-[#eaf7e8] shadow-soft" href="https://www.instagram.com/" target="_blank" rel="noreferrer" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: index * 0.03 }} aria-label="Open Instagram gallery">
                  <img className="aspect-square w-full object-cover transition duration-500 group-hover:scale-110" src={image} alt="Gaurav Nursery plant gallery" loading="lazy" onError={handleImageError} />
                  <span className="absolute inset-0 flex items-center justify-center bg-[#0b3d1e]/0 text-white opacity-0 transition group-hover:bg-[#0b3d1e]/35 group-hover:opacity-100">
                    <Instagram size={24} />
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="premium-container grid items-stretch gap-6 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,25rem)]">
        <motion.div
          className="relative flex overflow-hidden rounded-[2rem] border border-white bg-gradient-to-br from-[#f7fff3] via-white to-[#edf8ea] p-6 shadow-[0_24px_70px_rgba(11,61,30,0.10)] transition duration-300 sm:p-8 lg:p-10"
          initial="hidden"
          whileInView="visible"
          whileHover={{ y: -6 }}
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.45 }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]">
            <Leaf className="absolute -left-2 top-5 h-24 w-24 rotate-[-18deg] text-[#0b3d1e]" />
            <Leaf className="absolute right-8 top-8 h-20 w-20 rotate-[28deg] text-[#0b3d1e]" />
            <Leaf className="absolute bottom-4 left-1/2 h-24 w-24 rotate-[12deg] text-[#0b3d1e]" />
          </div>
          <Leaf className="pointer-events-none absolute -right-12 bottom-0 h-40 w-40 rotate-[-18deg] text-[#4caf50] opacity-[0.08]" />
          <div className="relative flex max-w-3xl flex-col justify-center">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#4caf50]">NEWSLETTER</p>
            <h2 className="mt-3 font-serif text-4xl font-black leading-tight tracking-tight text-[#0b3d1e] sm:text-5xl">Join Our Green Family</h2>
            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-stone-600">
              Subscribe to get updates on new arrivals, exclusive offers, and expert gardening tips.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {['New arrivals', 'Exclusive offers', 'Plant care tips'].map((item) => (
                <span key={item} className="rounded-full border border-[#dbe8d8] bg-white/80 px-4 py-2 text-sm font-black text-[#0b3d1e] shadow-soft">
                  {item}
                </span>
              ))}
            </div>
            <form className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-stretch" onSubmit={handleNewsletter}>
              <label className="relative flex-1">
                <span className="sr-only">Email address</span>
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#4caf50]" size={20} />
                <input className="form-input h-14 bg-white pl-14 pr-5 text-base shadow-soft" onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email address" required type="email" value={email} />
              </label>
              <Button className="h-14 w-full bg-gradient-to-r from-[#0b3d1e] to-[#4caf50] px-8 font-black hover:-translate-y-1 hover:from-[#4caf50] hover:to-[#0b3d1e] sm:w-auto" type="submit">Subscribe</Button>
            </form>
            <p className="mt-4 text-sm font-black text-[#0b3d1e]">Join 10,000+ plant lovers across India.</p>
          </div>
        </motion.div>

        <motion.div
          className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#dbe8d8] bg-white shadow-[0_24px_70px_rgba(11,61,30,0.10)] transition duration-300"
          initial="hidden"
          whileInView="visible"
          whileHover={{ y: -6 }}
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.45, delay: 0.06 }}
        >
          <div className="relative h-52 overflow-hidden sm:h-56">
            <img className="h-full w-full object-cover transition duration-700 hover:scale-105" src={nurseryImage} alt="Rows of healthy nursery plants" loading="lazy" onError={handleImageError} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b3d1e]/30 to-transparent" />
            <Leaf className="pointer-events-none absolute right-5 top-5 h-10 w-10 rotate-12 text-white/45" />
          </div>
          <div className="flex flex-1 flex-col p-6 sm:p-7">
            <h2 className="font-serif text-3xl font-black text-[#0b3d1e]">Our Nursery</h2>
            <p className="mt-3 text-sm leading-7 text-stone-600">Visit our nursery in Aliganj Bazar, Sultanpur and explore hundreds of healthy plants.</p>
            <div className="mt-5 grid gap-3 text-sm font-bold text-[#1b2a1f]">
              <span className="flex items-center gap-3"><MapPin size={17} className="text-[#4caf50]" /> Aliganj Bazar, Sultanpur</span>
              <span className="flex items-center gap-3"><Leaf size={17} className="text-[#4caf50]" /> 500+ Plant Varieties</span>
              <span className="flex items-center gap-3"><UserRound size={17} className="text-[#4caf50]" /> Expert Guidance</span>
            </div>
            <div className="mt-auto grid gap-3 pt-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <a className="inline-flex h-12 items-center justify-center rounded-full bg-[#0b3d1e] px-5 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#4caf50]" href="https://www.google.com/maps/search/?api=1&query=Gaurav+Nursery" rel="noreferrer" target="_blank">
                <MapPin className="mr-2" size={17} /> Get Direction
              </a>
              <a className="inline-flex h-12 items-center justify-center rounded-full border border-[#dbe8d8] bg-[#f8fff5] px-5 text-sm font-black text-[#0b3d1e] transition hover:-translate-y-1 hover:bg-[#eaf7e8]" href="tel:+916352031504">
                <Phone className="mr-2" size={17} />
                Call Now
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="border-y border-[#dbe8d8] bg-white">
        <div className="premium-container grid gap-3 py-5 sm:grid-cols-2 lg:grid-cols-5">
          {trustBar.map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-[1.25rem] bg-[#f8fff5] px-4 py-4 shadow-[0_12px_32px_rgba(11,61,30,0.06)] transition hover:-translate-y-1 hover:bg-[#eaf7e8]">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0b3d1e] shadow-soft"><item.icon size={19} /></span>
              <span className="text-sm font-black text-[#0b3d1e]">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <a className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-card transition hover:-translate-y-1 hover:bg-[#1ebe5d]" href="https://wa.me/916352031504" rel="noreferrer" target="_blank" aria-label="Chat on WhatsApp">
        <MessageCircle size={27} />
      </a>
      <button className="fixed bottom-24 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-[#0b3d1e] text-white shadow-card transition hover:-translate-y-1 hover:bg-[#4caf50]" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
        <ArrowUp size={22} />
      </button>
    </div>
  );
}
