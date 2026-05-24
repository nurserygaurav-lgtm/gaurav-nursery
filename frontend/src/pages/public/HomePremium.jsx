import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUp,
  Check,
  Clock,
  Heart,
  Mail,
  MessageCircle,
  ShoppingCart,
  Star
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
import { getProductImage, getProductTitle, handleImageError } from '../../utils/product.js';

const heroSlides = [
  {
    title: 'Luxury Indoor Greens',
    subtitle: 'Curated houseplants for designer homes and premium workspaces.',
    action: 'Shop Indoor Plants',
    category: 'Indoor Plants',
    badge: 'New Arrivals',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=85',
    accent: 'From ₹299',
    label: 'Grow your sanctuary'
  },
  {
    title: 'Fruit Plants for Home',
    subtitle: 'Harvest fresh fruits from your balcony and terrace garden.',
    action: 'Explore Fruit Plants',
    category: 'Fruit Plants',
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1442207073788-27f1f1b4b6f5?auto=format&fit=crop&w=1200&q=85',
    accent: 'Organic varieties',
    label: 'Sweet, healthy harvests'
  },
  {
    title: 'Premium Gardening Kits',
    subtitle: 'Everything you need for an effortless green setup.',
    action: 'Grab Garden Kits',
    category: 'Gardening Kits',
    badge: 'Limited Edition',
    image: 'https://images.unsplash.com/photo-1518977956816-ae52a5565b71?auto=format&fit=crop&w=1200&q=85',
    accent: 'Ready to grow',
    label: 'Complete starter packs'
  },
  {
    title: 'Designer Planters & Pots',
    subtitle: 'Luxury pots, self-watering planters, and statement planters.',
    action: 'Shop Planters',
    category: 'Premium Pots',
    badge: 'Trending',
    image: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=85',
    accent: 'Free decor advice',
    label: 'Elevate every corner'
  },
  {
    title: 'Seasonal Green Offers',
    subtitle: 'Limited-time collections for monsoon, summer and festive gifting.',
    action: 'View Offers',
    category: 'Seasonal Offers',
    badge: 'Flash Sale',
    image: 'https://images.unsplash.com/photo-1545235617-124c6114e373?auto=format&fit=crop&w=1200&q=85',
    accent: 'Up to 40% OFF',
    label: 'Seasons of savings'
  }
];

const categoryArtwork = [
  { name: 'Indoor Plants', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=640&q=85' },
  { name: 'Outdoor Plants', image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=640&q=85' },
  { name: 'Fruit Plants', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=640&q=85' },
  { name: 'Pots & Planters', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=640&q=85' },
  { name: 'Seeds', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=640&q=85' },
  { name: 'Gardening Tools', image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=640&q=85' }
];

const floatingCards = [
  { title: 'COD', text: 'Pay on delivery', color: 'from-[#d6f5dc] to-[#eaf7e8]' },
  { title: 'Free Shipping', text: 'Above ₹499', color: 'from-[#eaf5ff] to-[#e8f7ff]' },
  { title: 'Eco Box', text: 'Sustainable packaging', color: 'from-[#fff5e6] to-[#fff8eb]' }
];

const featureList = ['Hygienic Packaging', 'Fresh Plants', 'On-Time Delivery', 'Expert Care Support'];
const whyChoose = ['Handpicked Selection', 'Luxury Presentation', 'Tailored Delivery', 'Plant Care Experts', 'Fast Support', 'Easy Returns'];

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
  const rating = Number(product?.rating || product?.averageRating || 4.8);
  const reviews = Number(product?.reviewCount || product?.reviewsCount || 0);
  const stock = Number(product?.stock ?? product?.quantity ?? 12);
  const sizeLabel = product?.size || 'Medium';
  const waterLevel = product?.waterLevel || 'Moderate';
  const sunlight = product?.sunlight || 'Partial';

  return (
    <motion.article className="group overflow-hidden rounded-[1.75rem] border border-[#e2e9de] bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(13,31,14,0.14)]" whileHover={{ y: -6 }}>
      <Link to={`/products/${product._id}`} className="relative block overflow-hidden rounded-[1.75rem] bg-[#f3fbf3]">
        <img className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105" src={getProductImage(product)} alt={getProductTitle(product)} loading="lazy" decoding="async" onError={handleImageError} />
        <div className="pointer-events-none absolute inset-x-0 top-4 flex items-center justify-between px-4 text-xs uppercase tracking-[0.18em] text-[#0b3d1e]">
          <span className="rounded-full bg-white/80 px-3 py-1 font-black text-[#0b3d1e] shadow-soft">{getDiscount(product)}</span>
          <span className="rounded-full bg-white/80 px-3 py-1 font-black text-[#0b3d1e] shadow-soft">COD</span>
        </div>
      </Link>
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#4a7d41]">{product.category || 'Plants'}</span>
          <span className="text-xs font-bold text-[#6e8a6a]">{stock > 10 ? 'In stock' : `Only ${stock} left`}</span>
        </div>
        <Link to={`/products/${product._id}`} className="block truncate text-lg font-black leading-snug text-[#0b3d1e] transition hover:text-[#4caf50]">{getProductTitle(product)}</Link>
        <div className="flex items-center gap-2 text-sm text-[#6b7b62]">
          <Star className="text-amber-400" size={14} fill="currentColor" />
          <span className="font-bold text-[#0b3d1e]">{rating.toFixed(1)}</span>
          <span>({reviews || '100+'})</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-stone-500">
          <span>{sizeLabel}</span>
          <span>{waterLevel}</span>
          <span>{sunlight}</span>
        </div>
        <div className="flex items-center justify-between gap-3 pt-3">
          <div>
            <p className="text-xl font-black text-[#0b3d1e]">{formatCurrency(product.price)}</p>
            <p className="text-xs line-through text-stone-400">{formatCurrency(getOldPrice(product))}</p>
          </div>
          <button type="button" className="rounded-full bg-[#0b3d1e] px-4 py-2 text-sm font-black text-white transition hover:bg-[#4caf50]" onClick={() => onAddToCart(product)}>
            <ShoppingCart size={16} />
          </button>
        </div>
        <button type="button" className="inline-flex items-center gap-2 rounded-full border border-[#e2e9de] bg-white px-4 py-2 text-sm font-black text-[#0b3d1e] transition hover:-translate-y-0.5 hover:bg-[#f3fbf3]" onClick={() => onAddToWishlist(product)}>
          <Heart size={16} /> Wishlist
        </button>
      </div>
    </motion.article>
  );
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className="text-xs font-black uppercase tracking-[0.28em] text-[#4caf50]">{eyebrow}</p>
      <h2 className="mt-4 font-serif text-5xl font-black tracking-tight text-[#0b3d1e] sm:text-6xl">{title}</h2>
      {text && <p className="mt-4 text-base leading-8 text-stone-600">{text}</p>}
    </div>
  );
}

const heroVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95
  }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (direction) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.95
  })
};

export default function HomePremium() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ hours: '00', minutes: '00', seconds: '00' });
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  usePageMeta({
    title: 'Gaurav Nursery | Premium Plants & Garden Living',
    description: 'Luxury plant marketplace for home, office, gifts and garden essentials.'
  });

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setError('');
        const data = await getProducts({ page: 1, limit: 18 });
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
      if (Array.isArray(stored)) setRecentlyViewed(stored.slice(0, 6));
    } catch {
      setRecentlyViewed([]);
    }
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
      setDirection(1);
    }, 6200);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const countdown = window.setInterval(() => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const diff = Math.max(0, end.getTime() - now.getTime());
      const hours = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => window.clearInterval(countdown);
  }, []);

  const newArrivals = useMemo(() => products.slice(0, 8), [products]);
  const trendingProducts = useMemo(() => products.filter((product) => Number(product.stock || 0) > 0).slice(0, 4), [products]);

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
    if (!email) {
      showToast('Enter a valid email', 'error');
      return;
    }
    setEmail('');
    showToast('Welcome to the green club');
  }

  function changeSlide(nextDirection) {
    setDirection(nextDirection);
    setActiveSlide((current) => {
      const next = current + nextDirection;
      if (next < 0) return heroSlides.length - 1;
      if (next >= heroSlides.length) return 0;
      return next;
    });
  }

  return (
    <div className="bg-[#f4f9f1] text-[#10210f]">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(74,151,63,0.22),transparent_28rem),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.8),transparent_30rem)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(77,156,69,0.16),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.18),transparent_24%)]" />
        <div className="premium-container relative grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/35 bg-white/80 p-6 shadow-[0_40px_120px_rgba(11,61,14,0.16)] backdrop-blur-xl sm:p-8">
            <motion.div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#d9f0d7]/90 to-transparent" />
            <div className="relative grid gap-6 lg:grid-cols-[1fr_0.6fr] lg:items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 rounded-full bg-[#eef9ed] px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#2f5f34] shadow-soft">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#4caf50] text-white">GN</span>
                  Luxury Nursery Marketplace
                </div>
                <div className="space-y-4">
                  <motion.h1 className="font-serif text-5xl font-black leading-tight tracking-[-0.03em] text-[#10210f] sm:text-6xl lg:text-7xl" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                    Garden Luxury, Delivered.
                  </motion.h1>
                  <motion.p className="max-w-2xl text-lg leading-8 text-[#4f6a52]" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
                    Discover premium plants, designer planters, curated garden kits and expert plant care with a next-generation nursery shopping experience.
                  </motion.p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Button className="h-14 bg-[#0b3d1e] px-8 font-black text-white shadow-button hover:bg-[#4caf50]" onClick={() => navigate('/shop')}>
                    Shop the Collection
                  </Button>
                  <Button className="h-14 border border-[#dbe8d8] bg-white text-[#0b3d1e] hover:bg-[#f4fbf2]" onClick={() => navigate('/support')}>
                    Need Plant Advice
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                  {['100% Live Plants', 'Gourmet Fruit Plants', 'Designer Pots', 'Expert Support'].map((label) => (
                    <div key={label} className="rounded-3xl border border-[#dbe8d8] bg-[#f7fff5] p-4 text-sm font-black text-[#10210f] shadow-soft">
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-[#f7fff5]/85 shadow-[0_30px_90px_rgba(13,31,14,0.12)]">
                <motion.div
                  key={activeSlide}
                  className="relative h-96 w-full overflow-hidden rounded-[2rem]"
                  custom={direction}
                  variants={heroVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                >
                  <img src={heroSlides[activeSlide].image} alt={heroSlides[activeSlide].title} className="h-full w-full object-cover" loading="eager" decoding="async" onError={handleImageError} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#072110]/80 via-transparent to-transparent" />
                  <div className="absolute left-5 bottom-5 right-5 rounded-[1.75rem] border border-white/15 bg-[#0f172a]/90 p-6 text-white shadow-card backdrop-blur-lg">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#14532d]/95 px-3 py-2 text-xs font-black uppercase tracking-[0.22em] text-white">
                      {heroSlides[activeSlide].badge}
                    </div>
                    <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{heroSlides[activeSlide].title}</h2>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-white/90">{heroSlides[activeSlide].subtitle}</p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Button className="h-12 bg-[#ffffff] px-6 text-sm font-black text-[#0b3d1e] hover:bg-[#f4f7f1]" onClick={() => navigate('/shop?category=' + encodeURIComponent(heroSlides[activeSlide].category))}>
                        {heroSlides[activeSlide].action}
                      </Button>
                      <Button className="h-12 border border-white/40 bg-[#14532d] text-sm font-black text-white shadow-button hover:bg-[#166534]" onClick={() => navigate('/products')}>
                        Explore now
                      </Button>
                    </div>
                  </div>
                </motion.div>
                <div className="absolute inset-x-0 bottom-5 flex items-center justify-between px-5 sm:px-8">
                  <button type="button" className="rounded-full border border-white/25 bg-[#0f172a]/70 p-3 text-white shadow-soft transition hover:bg-[#14532d]/80" onClick={() => changeSlide(-1)} aria-label="Previous slide">
                    <ArrowRight className="rotate-180" size={18} />
                  </button>
                  <div className="flex items-center gap-2">
                    {heroSlides.map((_, index) => (
                      <button key={index} type="button" className={`h-2.5 w-2.5 rounded-full transition ${index === activeSlide ? 'bg-white' : 'bg-white/40'}`} onClick={() => setActiveSlide(index)} aria-label={`Select slide ${index + 1}`} />
                    ))}
                  </div>
                  <button type="button" className="rounded-full border border-white/25 bg-[#0f172a]/70 p-3 text-white shadow-soft transition hover:bg-[#14532d]/80" onClick={() => changeSlide(1)} aria-label="Next slide">
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute -left-10 top-24 hidden h-36 w-36 rounded-full bg-[#d2f0cc] opacity-60 blur-3xl md:block" />
            <div className="pointer-events-none absolute right-14 top-10 hidden h-28 w-28 rounded-full bg-[#f2f7eb] opacity-70 blur-3xl md:block" />
            <div className="pointer-events-none absolute bottom-12 left-1/3 hidden h-28 w-28 rounded-full bg-[#e6f8ff] opacity-50 blur-3xl lg:block" />
          </div>

          <aside className="grid gap-5">
            {floatingCards.map((card, index) => (
              <motion.div key={card.title} className={`overflow-hidden rounded-[1.75rem] border border-white/50 bg-gradient-to-br ${card.color} p-5 shadow-card`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: index * 0.08 }}>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#1f4228]">{card.title}</p>
                <p className="mt-3 text-lg font-black text-[#10210f]">{card.text}</p>
              </motion.div>
            ))}
            <motion.div className="overflow-hidden rounded-[2rem] border border-white/50 bg-[#0b3d1e] p-6 text-white shadow-[0_24px_70px_rgba(11,61,14,0.2)]" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.35 }}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-200">Flash Offer</p>
                  <h3 className="mt-3 text-3xl font-black text-white">Limited Time Deal</h3>
                </div>
                <Clock size={34} className="text-emerald-200" />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {Object.entries(timeLeft).map(([label, value]) => (
                  <div key={label} className="rounded-3xl bg-[#0f172a]/75 px-4 py-3 text-center text-sm font-black text-white backdrop-blur shadow-soft">
                    <span className="block text-2xl">{value}</span>
                    <span className="block text-[11px] uppercase tracking-[0.22em] text-emerald-100">{label}</span>
                  </div>
                ))}
              </div>
              <Button className="mt-6 h-14 w-full bg-gradient-to-r from-[#4caf50] to-[#0b3d1e] text-white shadow-button hover:from-[#5fd768] hover:to-[#17391c]" onClick={() => navigate('/shop')}>
                Claim the Offer
              </Button>
            </motion.div>
          </aside>
        </div>
      </section>

      <section className="premium-container py-16">
        <SectionTitle eyebrow="Shop by Category" title="Discover Every Green Experience" text="Browse premium plant collections, pots, seed packs and garden essentials." />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categoryArtwork.map((category, index) => (
            <motion.div key={category.name} className="group relative overflow-hidden rounded-[2rem] border border-[#e2e9de] bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-card" whileHover={{ y: -4 }} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: index * 0.07 }}>
              <img className="h-60 w-full object-cover transition duration-700 group-hover:scale-105" src={category.image} alt={category.name} loading="lazy" decoding="async" onError={handleImageError} />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0c2212]/90 to-transparent px-6 py-6 text-white">
                <p className="text-sm font-black uppercase tracking-[0.22em] text-[#b7f2bb]">{category.name}</p>
                <h3 className="mt-2 text-3xl font-black tracking-tight">Shop now</h3>
              </div>
              <Link className="absolute inset-0" to={`/shop?category=${encodeURIComponent(category.name)}`} />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="premium-container">
          <SectionTitle eyebrow="New Arrivals" title="Fresh Picks from the Nursery" text="Hand-picked fresh products added to the store this week." />
          {isLoading && <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-96" />)}</div>}
          {!isLoading && !error && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {newArrivals.map((product) => (
                <ProductMiniCard key={product._id} product={product} onAddToCart={handleAddToCart} onAddToWishlist={handleWishlist} />
              ))}
            </div>
          )}
          {error && <p className="rounded-3xl border border-red-100 bg-red-50 px-6 py-4 text-sm font-bold text-red-700">{error}</p>}
        </div>
      </section>

      <section className="premium-container py-16">
        <div className="grid gap-8 lg:grid-cols-[0.6fr_0.4fr]">
          <div className="space-y-6">
            <SectionTitle eyebrow="Best Sellers" title="Plants Customers Keep Buying" text="Discover the most loved picks with premium delivery and care support." />
            <div className="grid gap-5 sm:grid-cols-2">
              {trendingProducts.map((product) => (
                <ProductMiniCard key={product._id} product={product} onAddToCart={handleAddToCart} onAddToWishlist={handleWishlist} />
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-[#e2e9de] bg-[#eff8ef] p-8 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.26em] text-[#4caf50]">Why Gaurav Nursery</p>
            <h3 className="mt-4 font-serif text-4xl font-black text-[#10210f]">Luxury delivered with trusted care.</h3>
            <div className="mt-8 grid gap-4">
              {whyChoose.map((item) => (
                <div key={item} className="rounded-3xl bg-white p-5 shadow-sm">
                  <p className="font-black text-[#10210f]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {recentlyViewed.length > 0 && (
        <section className="bg-[#f4f9f1] py-16">
          <div className="premium-container">
            <SectionTitle eyebrow="Recently Viewed" title="Continue Your Garden Journey" text="Quickly revisit the products you explored most recently." />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {recentlyViewed.map((product) => (
                <ProductMiniCard key={product._id || product.id || product.name} product={product} onAddToCart={handleAddToCart} onAddToWishlist={handleWishlist} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="premium-container py-16">
        <div className="grid gap-8 xl:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[2rem] border border-[#e2e9de] bg-white p-10 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.26em] text-[#4caf50]">Expertise</p>
            <h3 className="mt-4 font-serif text-5xl font-black text-[#10210f]">Plant Care, Simplified.</h3>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {featureList.map((feature) => (
                <div key={feature} className="flex items-start gap-4 rounded-3xl border border-[#e2e9de] bg-[#f7fff5] p-5">
                  <span className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4caf50] text-white shadow-soft"><Check size={18} /></span>
                  <div>
                    <h4 className="font-black text-[#10210f]">{feature}</h4>
                    <p className="mt-2 text-sm leading-6 text-stone-600">Plant care made effortless with trusted guidance and packaging.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#e2e9de] bg-[#0b3d1e] p-10 text-white shadow-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9debb3]">Newsletter</p>
                <h3 className="mt-3 font-serif text-4xl font-black">Stay in the green loop.</h3>
              </div>
              <span className="inline-flex rounded-full bg-[#ffffff]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#c8f8c9]">Join 10,000+</span>
            </div>
            <p className="mt-6 text-base leading-7 text-[#c8f8c9]">Subscribe for plant styling tips, new launches, and flash deals.</p>
            <form className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={handleNewsletter}>
              <label className="relative block">
                <span className="sr-only">Email address</span>
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9debb3]" />
                <input className="form-input h-14 w-full rounded-full bg-white text-[#0b3d1e] pl-14 pr-5 shadow-soft" placeholder="Email address" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
              </label>
              <Button className="h-14 rounded-full bg-[#4caf50] px-8 font-black text-white shadow-button hover:bg-[#3c7d34]" type="submit">
                Subscribe
              </Button>
            </form>
            <p className="mt-4 text-sm text-[#b8e9c2]">Get plant care guides, video reels, and early access to premium drops.</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="premium-container">
          <SectionTitle eyebrow="Reviews" title="What Our Customers Say" text="Trusted by plant parents across India for premium quality and service." />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { name: 'Priya Sharma', review: 'Arrived fresh and beautifully packed. The plant is thriving after a month.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=85' },
              { name: 'Rahul Verma', review: 'Impressive delivery and the pot looks so elegant. Excellent service.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=85' },
              { name: 'Anjali Singh', review: 'The expert guidance made my balcony garden a success. Highly recommend.', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=85' }
            ].map((item, index) => (
              <motion.article key={item.name} className="rounded-[2rem] border border-[#e2e9de] bg-[#f4f9f2] p-6 shadow-soft" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: index * 0.06 }}>
                <div className="flex items-center gap-4">
                  <img className="h-16 w-16 rounded-full object-cover" src={item.image} alt={item.name} loading="lazy" />
                  <div>
                    <h4 className="font-black text-[#10210f]">{item.name}</h4>
                    <div className="mt-2 flex items-center gap-1 text-amber-400">{Array.from({ length: 5 }).map((_, idx) => <Star key={idx} size={14} fill="currentColor" />)}</div>
                  </div>
                </div>
                <p className="mt-6 text-sm leading-7 text-[#34483a]">{item.review}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <a className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-card transition hover:-translate-y-1 hover:bg-[#1ebe5d]" href="https://wa.me/916352031504" target="_blank" rel="noreferrer" aria-label="WhatsApp support">
        <MessageCircle size={24} />
      </a>
      <button className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#0b3d1e] text-white shadow-card transition hover:-translate-y-1 hover:bg-[#4caf50]" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Scroll to top">
        <ArrowUp size={22} />
      </button>
    </div>
  );
}
