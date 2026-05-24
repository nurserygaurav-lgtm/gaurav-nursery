import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUp,
  ChevronDown,
  Check,
  Heart,
  Leaf,
  Mail,
  MessageCircle,
  MapPin,
  PackageCheck,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Store,
  Truck
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { brandContact, blogCategories, blogPosts, combos, customerPlantGallery, packagingSteps, plantCareFaqs, recentDeliveryCities, safePackagingHighlights, trustFeatures, urgencySignals } from '../../data/brandContent.js';
import { useAuth } from '../../hooks/useAuth.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';
import { useToast } from '../../hooks/useToast.js';
import { addToCart } from '../../services/cartService.js';
import { getProducts } from '../../services/productService.js';
import { getStoreSummary } from '../../services/publicService.js';
import { addToWishlist } from '../../services/wishlistService.js';
import { getApiError } from '../../utils/auth.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { FALLBACK_PLANT_IMAGE, getProductImage, getProductTitle, getSellerName, handleImageError } from '../../utils/product.js';
import { safeLocalStorageGet } from '../../utils/storage.js';

const categoryArtwork = [
  { name: 'Indoor Plants', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=85' },
  { name: 'Outdoor Plants', image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=900&q=85' },
  { name: 'Flowering Plants', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85' },
  { name: 'Fruit Plants', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=85' },
  { name: 'Pots & Planters', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=85' },
  { name: 'Seeds', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=85' }
];

const heroHighlights = [
  'Live healthy plants',
  'Safe packaging',
  'Pan India delivery',
  'Plant care support'
];

const quickCategories = [
  { name: 'Plants', href: '/categories', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=700&q=85' },
  { name: 'Seeds', href: '/shop?category=Seeds', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=700&q=85' },
  { name: 'Pots & Planters', href: '/shop?category=Pots%20%26%20Planters', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=85' },
  { name: 'Soil & Fertilizer', href: '/shop?search=soil', image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=700&q=85' },
  { name: 'Garden Tools', href: '/shop?search=tools', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=700&q=85' },
  { name: 'Combo Packs', href: '/shop?search=combo', image: 'https://images.unsplash.com/photo-1524593166156-312f362cada0?auto=format&fit=crop&w=700&q=85' }
];

const roomCollections = [
  {
    title: 'Bedroom Plants',
    text: 'Air-purifying plants that stay calm in low-light spaces.',
    href: '/shop?search=air%20purifying',
    image: 'https://images.unsplash.com/photo-1444392061186-9fc38f84f726?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Balcony Plants',
    text: 'Sun-loving greenery for balconies, terraces, and sunny windows.',
    href: '/shop?search=balcony',
    image: 'https://images.unsplash.com/photo-1509423350716-97f2360af5e4?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Office Desk Plants',
    text: 'Low-maintenance desk-friendly plants for workspaces.',
    href: '/shop?search=office',
    image: 'https://images.unsplash.com/photo-1524593166156-312f362cada0?auto=format&fit=crop&w=900&q=85'
  }
];

const deliveryTickerMessages = [
  'Order delivered safely in Delhi',
  'Dispatched from Pune nursery hub',
  'Fresh indoor plants packed in Lucknow',
  'Combo pack shipped to Bangalore',
  'COD order completed in Mumbai'
];

const fallbackSellerTicker = [
  { name: 'Krishna Nursery', city: 'Lucknow', rating: 4.8, speciality: 'Indoor specialists' },
  { name: 'Shyam Nursery', city: 'Malihabad', rating: 4.9, speciality: 'Mango experts' },
  { name: 'Green Thumb Nursery', city: 'Kolkata', rating: 4.7, speciality: 'Flowering plants' },
  { name: 'Urban Leaf Seller', city: 'Pune', rating: 4.6, speciality: 'Office greens' },
  { name: 'Bloom House', city: 'Delhi', rating: 4.7, speciality: 'Combo packs' },
  { name: 'Pot Studio', city: 'Mumbai', rating: 4.5, speciality: 'Pots & planters' }
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
  if (!price || oldPrice <= price) return 'Best value';
  return `${Math.round(((oldPrice - price) / oldPrice) * 100)}% OFF`;
}

function ProductMiniCard({ product, onAddToCart, onAddToWishlist }) {
  const productId = product?._id || product?.id;
  if (!productId) return null;
  const stock = Number(product?.stock ?? product?.quantity ?? 12);
  const urgency = stock > 10 ? 'Nursery fresh stock' : `Only ${stock} left`;
  const sunlight = product?.sunlight || product?.care?.sunlight || 'Bright indirect light';
  const watering = product?.waterLevel || product?.care?.watering || 'Moderate watering';
  const sellerName = getSellerName(product);
  const sellerRating = Number(product?.rating || product?.seller?.rating || 4.7);

  return (
    <motion.article
      className="group overflow-hidden rounded-[1.75rem] border border-[#e2e9de] bg-white shadow-[0_22px_65px_rgba(11,61,14,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_85px_rgba(11,61,14,0.14)]"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
    >
      <div className="relative overflow-hidden bg-[#f3fbf3]">
        <img className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105" src={getProductImage(product)} alt={getProductTitle(product)} loading="lazy" decoding="async" onError={handleImageError} />
        <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3 text-[11px] font-black uppercase tracking-[0.16em]">
          <span className="rounded-full bg-white/90 px-3 py-1 text-[#0b3d1e] shadow-soft">{getDiscount(product)}</span>
          <span className="rounded-full bg-[#0b3d1e]/90 px-3 py-1 text-white shadow-soft">{urgency}</span>
        </div>
        <Link className="absolute inset-0 z-0" to={`/products/${productId}`} aria-label={getProductTitle(product)} />
        <div className="absolute bottom-4 right-4 z-10 flex gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#0b3d1e] shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:bg-[#f2fbf1]"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onAddToWishlist(product);
            }}
            aria-label="Save to wishlist"
          >
            <Heart size={16} />
          </button>
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-full bg-[#0b3d1e] px-3 text-xs font-black text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-[#4caf50]"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onAddToCart(product);
            }}
            aria-label="Quick add to cart"
          >
            <Plus size={15} />
            Quick add
          </button>
        </div>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-[#4a7d41]">{product.category || 'Plants'}</span>
          <span className="rounded-full bg-[#f1faf1] px-3 py-1 text-[11px] font-black uppercase tracking-[0.15em] text-[#2f5f34]">COD</span>
        </div>
        <Link to={`/products/${productId}`} className="block truncate text-lg font-black leading-snug text-[#0b3d1e] transition hover:text-[#4caf50]">
          {getProductTitle(product)}
        </Link>
        <div className="flex items-center gap-2 text-sm font-bold text-stone-500">
          <Store size={14} className="text-[#4caf50]" />
          <span className="truncate">Sold by: {sellerName}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#f2fbf1] px-2 py-1 text-[11px] font-black text-[#2f5f34]">
            <Star size={11} />
            {sellerRating.toFixed(1)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-stone-500">
          <span className="rounded-2xl bg-[#f2fbf1] px-2 py-2">{watering}</span>
          <span className="rounded-2xl bg-[#f2fbf1] px-2 py-2">{sunlight}</span>
        </div>
        <div className="flex items-end gap-2 pt-1">
          <span className="text-xl font-black text-[#0b3d1e]">{formatCurrency(product.price)}</span>
          <span className="pb-1 text-sm font-bold text-stone-400 line-through">{formatCurrency(getOldPrice(product))}</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button className="h-12 w-full bg-[#0b3d1e] hover:bg-[#4caf50]" onClick={() => onAddToCart(product)}>
            <ShoppingCart size={16} /> Add
          </Button>
          <Button className="h-12 w-full" variant="outline" onClick={() => onAddToWishlist(product)}>
            <Heart size={16} /> Save
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
      <p className="text-xs font-black uppercase tracking-[0.28em] text-[#4caf50]">{eyebrow}</p>
      <h2 className="mt-4 font-serif text-[clamp(1.8rem,3vw,3.4rem)] font-black tracking-tight text-[#0b3d1e]">{title}</h2>
      {text && <p className="mt-4 text-[clamp(0.92rem,1vw,1.05rem)] leading-8 text-stone-600">{text}</p>}
    </div>
  );
}

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-[#dbe8d8] bg-white shadow-soft">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
        <span className="font-black text-[#0b3d1e]">{item.question}</span>
        <ChevronDown className={`shrink-0 text-[#4caf50] transition ${isOpen ? 'rotate-180' : ''}`} size={18} />
      </button>
      {isOpen && <div className="border-t border-[#edf5ea] px-5 py-4 text-sm leading-7 text-stone-600">{item.answer}</div>}
    </div>
  );
}

export default function HomePremium() {
  const [products, setProducts] = useState([]);
  const [storeSummary, setStoreSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [openFaq, setOpenFaq] = useState(0);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  usePageMeta({
    title: 'Gaurav Nursery | Trusted Plants, Safe Delivery, Real Support',
    description: 'Premium nursery shopping with safe packaging, plant care support, combo packs, and real customer trust signals.'
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
    let isMounted = true;

    async function loadStoreSummary() {
      try {
        const data = await getStoreSummary();
        if (isMounted) setStoreSummary(data);
      } catch {
        if (isMounted) setStoreSummary(null);
      }
    }

    loadStoreSummary();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      const stored = JSON.parse(safeLocalStorageGet('recentlyViewedProducts') || '[]');
      if (Array.isArray(stored)) setRecentlyViewed(stored.slice(0, 6));
    } catch {
      setRecentlyViewed([]);
    }
  }, []);

  const bestSellers = useMemo(() => products.slice(0, 4), [products]);
  const newArrivals = useMemo(() => products.slice(0, 8), [products]);
  const featuredSellers = useMemo(() => {
    const sellers = new Map();

    products.forEach((product) => {
      const name = getSellerName(product);
      if (!name || sellers.has(name)) return;

      sellers.set(name, {
        name,
        city: product?.seller?.city || product?.seller?.sellerProfile?.city || product?.sellerCity || 'Pan India',
        rating: Number(product?.seller?.rating || product?.rating || 4.7),
        speciality: product?.seller?.speciality || product?.category || 'Nursery fresh stock'
      });
    });

    return sellers.size ? Array.from(sellers.values()).slice(0, 6) : fallbackSellerTicker;
  }, [products]);

  const sellerTicker = useMemo(() => [...featuredSellers, ...featuredSellers], [featuredSellers]);
  const deliveryTicker = useMemo(() => [...deliveryTickerMessages, ...deliveryTickerMessages], []);
  async function handleAddToCart(product) {
    const productId = product?._id || product?.id;
    if (!productId) {
      showToast('Product is still loading, please try again.', 'error');
      return false;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/products/${productId}` } } });
      return false;
    }

    try {
      await addToCart(productId, 1);
      showToast('Added to cart');
      return true;
    } catch (err) {
      showToast(getApiError(err, 'Unable to add to cart'), 'error');
      return false;
    }
  }

  async function handleWishlist(product) {
    const productId = product?._id || product?.id;
    if (!productId) {
      showToast('Product is still loading, please try again.', 'error');
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await addToWishlist(productId);
      showToast('Saved to wishlist');
    } catch (err) {
      showToast(getApiError(err, 'Unable to update wishlist'), 'error');
    }
  }

  function handleNewsletter(event) {
    event.preventDefault();
    if (!email.trim()) {
      showToast('Enter a valid email', 'error');
      return;
    }
    setEmail('');
    showToast('Thanks for subscribing');
  }

  const trustCities = [...recentDeliveryCities, ...recentDeliveryCities];

  return (
    <div className="bg-[#f8fff5] text-[#1b2a1f]">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_20%_10%,rgba(155,201,145,0.22),transparent_24rem),linear-gradient(135deg,#061507_0%,#0d2a15_44%,#17391c_100%)]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 10 }).map((_, index) => (
            <motion.span
              key={index}
              className="absolute h-8 w-4 rounded-full bg-emerald-200/20 blur-[0.2px]"
              style={{ left: `${8 + index * 9}%`, top: `${(index * 16) % 82}%` }}
              animate={{ y: [0, 24, 0], rotate: [0, 18, -10, 0], opacity: [0.18, 0.4, 0.18] }}
              transition={{ duration: 7 + index, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
        <div className="premium-container grid gap-6 py-8 sm:py-10 lg:grid-cols-[1fr_22rem] xl:grid-cols-[1fr_24rem]">
          <motion.div className="grid gap-6 rounded-[2rem] border border-white/15 bg-[#0f172a]/90 p-5 text-white shadow-[0_30px_100px_rgba(0,0,0,0.34)] backdrop-blur md:grid-cols-[0.95fr_1.05fr] md:p-8 lg:gap-8 lg:p-9" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="flex flex-col justify-center">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-[#14532d]/95 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white backdrop-blur">
                <Leaf size={16} />
                Trusted Nursery Brand
              </span>
              <h1 className="mt-5 font-serif text-[clamp(2.2rem,5vw,5.2rem)] font-black leading-[0.98] tracking-tight text-white">
                Premium plants, delivered with real care.
              </h1>
              <p className="mt-4 max-w-xl text-[clamp(0.95rem,1vw,1.1rem)] font-semibold leading-8 text-emerald-50/85">
                Safe packaging, transparent support, and fresh nursery stock for homes, offices, balconies, and gifts.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {heroHighlights.map((badge) => (
                  <div key={badge} className="flex items-center gap-2 rounded-2xl border border-white/15 bg-[#0f172a]/70 px-4 py-3 text-sm font-black text-white backdrop-blur">
                    <Check size={17} className="text-emerald-200" />
                    {badge}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-black text-[#0b3d1e] shadow-[0_18px_40px_rgba(0,0,0,0.25)] transition hover:-translate-y-1 hover:bg-emerald-50" to="/shop">
                  Shop Now <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-[#14532d]/95 px-7 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#166534]" to="/contact">
                  Contact Support
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-bold text-emerald-50/80">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2"><Truck size={16} /> Pan India delivery</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2"><PackageCheck size={16} /> Safe packaging</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2"><MessageCircle size={16} /> WhatsApp help</span>
              </div>
            </div>

            <div className="relative min-h-[24rem] sm:min-h-[28rem]">
              <motion.img className="absolute right-0 top-0 h-52 w-[72%] rounded-[1.5rem] object-cover shadow-card sm:h-64 sm:rounded-[2rem]" src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=85" alt="Green nursery plants" onError={handleImageError} animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
              <motion.img className="absolute bottom-8 left-0 h-48 w-[62%] rounded-[1.5rem] object-cover shadow-card sm:h-60 sm:rounded-[2rem]" src={FALLBACK_PLANT_IMAGE} alt="Potted plants" onError={handleImageError} animate={{ y: [0, 10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
              <img className="absolute bottom-0 right-4 h-32 w-32 rounded-[1.25rem] object-cover shadow-card sm:right-6 sm:h-44 sm:w-44 sm:rounded-[1.5rem]" src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=900&q=85" alt="Nursery care" loading="lazy" onError={handleImageError} />
              <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-8 border-white/80 bg-[#0b3d1e]/90 text-center text-white shadow-card backdrop-blur sm:h-32 sm:w-32">
                <span className="text-3xl font-black">GN</span>
                <span className="text-[10px] font-black uppercase tracking-[0.16em]">Gaurav Nursery</span>
              </div>
              <div className="absolute bottom-6 right-0 rotate-[-3deg] rounded-2xl border border-white/20 bg-[#0f172a]/80 px-4 py-3 text-center font-serif text-base font-black text-white shadow-card backdrop-blur sm:px-5 sm:py-4 sm:text-lg">
                Real plants.<br />Real support.
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
                        <p className="mt-1 text-xs font-semibold text-emerald-50/70">{product.stock > 10 ? 'Nursery fresh stock' : `Only ${product.stock || 1} left`}</p>
                        <div className="mt-1 flex items-center gap-2"><span className="font-black text-white">{formatCurrency(product.price)}</span><span className="text-xs font-bold text-emerald-50/70 line-through">{formatCurrency(getOldPrice(product))}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5 text-white shadow-soft backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100">Trusted by customers in</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {recentDeliveryCities.map((city) => (
                  <span key={city} className="rounded-full bg-white/10 px-3 py-2 text-sm font-black text-white">{city}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-b border-[#dbe8d8] bg-white">
        <div className="premium-container grid gap-3 py-5 sm:grid-cols-2 lg:grid-cols-4">
          {trustFeatures.map((item) => (
            <div key={item.label} className="rounded-[1.35rem] border border-[#e8f6ec] bg-[#f7fff5] p-4 shadow-[0_12px_32px_rgba(11,61,30,0.06)]">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0b3d1e] text-white shadow-soft"><item.icon size={18} /></span>
                <div>
                  <p className="font-black text-[#0b3d1e]">{item.label}</p>
                  <p className="mt-1 text-sm leading-6 text-stone-600">{item.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="premium-container py-10">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Link className="flex items-center justify-center gap-2 rounded-[1.35rem] bg-[#0b3d1e] px-5 py-4 text-sm font-black text-white shadow-soft transition hover:-translate-y-1 hover:bg-[#4caf50]" to="/shop">
            <ShoppingBag size={18} />
            Shop Catalog
          </Link>
          <Link className="flex items-center justify-center gap-2 rounded-[1.35rem] border border-[#dbe8d8] bg-white px-5 py-4 text-sm font-black text-[#0b3d1e] shadow-soft transition hover:-translate-y-1 hover:bg-[#f7fff5]" to="/register?role=seller">
            <Store size={18} />
            Sell on Gaurav Nursery
          </Link>
          <button className="flex items-center justify-center gap-2 rounded-[1.35rem] border border-[#dbe8d8] bg-white px-5 py-4 text-sm font-black text-[#0b3d1e] shadow-soft transition hover:-translate-y-1 hover:bg-[#f7fff5]" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <MapPin size={18} />
            Check Delivery Pin
          </button>
          <Link className="flex items-center justify-center gap-2 rounded-[1.35rem] border border-[#dbe8d8] bg-white px-5 py-4 text-sm font-black text-[#0b3d1e] shadow-soft transition hover:-translate-y-1 hover:bg-[#f7fff5]" to="/orders">
            <Truck size={18} />
            Track Order
          </Link>
        </div>
      </section>

      <section className="premium-container pb-10">
        <SectionTitle eyebrow="Quick Categories" title="Shop the essentials at a glance" text="Direct shortcuts for the most common nursery purchases." />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {quickCategories.map((category, index) => (
            <motion.div key={category.name} className="group relative overflow-hidden rounded-[1.75rem] border border-[#dbe8d8] bg-white text-center shadow-soft transition hover:-translate-y-1 hover:shadow-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.04 }}>
              <Link className="block p-3 sm:p-4" to={category.href}>
                <div className="mx-auto aspect-square w-24 overflow-hidden rounded-full border-4 border-[#f1faf1] shadow-soft sm:w-28">
                  <img className="h-full w-full object-cover transition duration-700 group-hover:scale-105" src={category.image} alt={category.name} loading="lazy" decoding="async" onError={handleImageError} />
                </div>
                <p className="mt-4 text-sm font-black text-[#0b3d1e]">{category.name}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="premium-container pb-10">
        <SectionTitle eyebrow="Shop by Purpose" title="Choose plants by room or need" text="Helpful shortcuts for buyers who want a specific result, not just a product." />
        <div className="grid gap-5 lg:grid-cols-3">
          {roomCollections.map((collection, index) => (
            <motion.article key={collection.title} className="group relative overflow-hidden rounded-[2rem] border border-[#dbe8d8] bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.05 }}>
              <img className="h-60 w-full object-cover transition duration-700 group-hover:scale-105" src={collection.image} alt={collection.title} loading="lazy" decoding="async" onError={handleImageError} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08170c]/80 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b7f2bb]">Smart collection</p>
                <h3 className="mt-2 text-2xl font-black">{collection.title}</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-white/80">{collection.text}</p>
                <Link className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-black text-[#0b3d1e]" to={collection.href}>
                  Explore
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="bg-[#0b3d1e] py-5 text-white">
        <div className="premium-container overflow-hidden">
          <motion.div className="flex w-max gap-3" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 18, ease: 'linear', repeat: Infinity }}>
            {sellerTicker.map((seller, index) => (
              <span key={`${seller.name}-${index}`} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-white">
                <Store size={14} className="text-emerald-200" />
                {seller.name} - {seller.city} <Star size={13} className="text-emerald-200" /> {seller.rating.toFixed(1)} {seller.speciality}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-[#eef8eb] py-4">
        <div className="premium-container overflow-hidden">
          <motion.div className="flex w-max gap-3" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 20, ease: 'linear', repeat: Infinity }}>
            {deliveryTicker.map((message, index) => (
              <span key={`${message}-${index}`} className="inline-flex items-center gap-2 rounded-full border border-[#dbe8d8] bg-white px-4 py-2 text-sm font-black text-[#0b3d1e] shadow-soft">
                <Truck size={14} className="text-[#4caf50]" />
                {message}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="premium-container py-16">
        <SectionTitle eyebrow="Shop by Category" title="Find the right plant quickly" text="Browse the most requested collections without the template-heavy clutter." />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categoryArtwork.map((category, index) => (
            <motion.div key={category.name} className="group relative overflow-hidden rounded-[2rem] border border-[#e2e9de] bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-card" whileHover={{ y: -4 }} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: index * 0.05 }}>
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
          <SectionTitle eyebrow="New Arrivals" title="Fresh picks from the nursery" text="Hand-picked products with real stock, not fake urgency." />
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
        <SectionTitle eyebrow="Combo Packs" title="Ready-made bundles that sell well" text="Create a simpler decision path with value-packed combinations." />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {combos.map((combo, index) => (
            <motion.article key={combo.title} className="overflow-hidden rounded-[2rem] border border-[#e2e9de] bg-[#f8fff5] shadow-soft" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.45, delay: index * 0.05 }}>
              <div className="p-6">
                <p className="inline-flex rounded-full bg-[#0b3d1e] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white">{combo.savings}</p>
                <h3 className="mt-4 text-2xl font-black text-[#0b3d1e]">{combo.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">{combo.subtitle}</p>
                <Link className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0b3d1e] px-5 py-3 text-sm font-black text-white transition hover:bg-[#4caf50]" to={combo.href}>
                  Shop bundle <ArrowRight size={16} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="premium-container py-16">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-[#e2e9de] bg-white p-7 shadow-soft sm:p-8">
            <SectionTitle eyebrow="Safe Packaging" title="How we deliver plants safely" text="The packing flow is designed to reduce damage and keep the plant healthy." />
            <div className="grid gap-4 sm:grid-cols-2">
              {packagingSteps.map((step, index) => (
                <div key={step} className="flex items-start gap-3 rounded-3xl border border-[#e2e9de] bg-[#f7fff5] p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0b3d1e] text-sm font-black text-white">{index + 1}</span>
                  <div>
                    <p className="font-black text-[#0b3d1e]">{step}</p>
                    <p className="mt-1 text-sm leading-6 text-stone-600">Each step reduces handling stress before dispatch.</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[1.5rem] bg-[#0b3d1e] p-5 text-white">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-100">Live Arrival Guarantee</p>
              <p className="mt-2 text-lg font-black">Packed for healthy transit and easier acclimatization on arrival.</p>
            </div>
          </div>

          <div className="grid gap-5">
            {safePackagingHighlights.map((item, index) => (
              <motion.div key={item.title} className="flex items-start gap-4 rounded-[1.5rem] border border-[#e2e9de] bg-white p-5 shadow-soft" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: index * 0.05 }}>
                <span className="mt-1 flex h-12 w-12 items-center justify-center rounded-full bg-[#eaf7e8] text-[#0b3d1e]">
                  <item.icon size={20} />
                </span>
                <div>
                  <h3 className="font-black text-[#0b3d1e]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0b3d1e] py-5 text-white">
        <div className="premium-container overflow-hidden">
          <motion.div
            className="flex w-max gap-3"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 18, ease: 'linear', repeat: Infinity }}
          >
            {trustCities.map((city, index) => (
              <span key={`${city}-${index}`} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-white">
                <Sparkles size={14} className="text-emerald-200" />
                Recently delivered in {city}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="premium-container py-16">
        <div className="grid gap-8 lg:grid-cols-[0.62fr_0.38fr]">
          <div className="space-y-6">
            <SectionTitle eyebrow="Customer Plant Gallery" title="Real deliveries, real cities" text="Show actual customer outcomes instead of fake names or star ratings." />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {customerPlantGallery.map((item, index) => (
                <motion.article key={`${item.city}-${item.plant}`} className="overflow-hidden rounded-[1.75rem] border border-[#e2e9de] bg-white shadow-soft" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.45, delay: index * 0.05 }}>
                  <img className="h-56 w-full object-cover" src={item.image} alt={`${item.plant} in ${item.city}`} loading="lazy" onError={handleImageError} />
                  <div className="p-5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4caf50]">{item.city}</p>
                    <h3 className="mt-2 text-lg font-black text-[#0b3d1e]">{item.plant}</h3>
                    <p className="mt-3 text-sm leading-7 text-stone-600">{item.message}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[2rem] border border-[#e2e9de] bg-white p-7 shadow-soft">
              <p className="text-xs font-black uppercase tracking-[0.26em] text-[#4caf50]">Store Summary</p>
              <h3 className="mt-4 font-serif text-4xl font-black text-[#10210f]">Growth you can trust</h3>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Total Plants Sold', value: storeSummary?.totalPlantsSold ?? '500+' },
                  { label: 'Cities Delivered', value: storeSummary?.citiesDelivered ?? '50+' },
                  { label: 'Active Customers', value: storeSummary?.activeCustomers ?? '1K+' },
                  { label: 'Daily Orders', value: storeSummary?.dailyOrders ?? '20+' }
                ].map((stat) => (
                  <div key={stat.label} className="rounded-[1.5rem] border border-[#e0f2e9] bg-[#f4fff4] p-5">
                    <p className="text-3xl font-black text-[#0b3d1e]">{stat.value}</p>
                    <p className="mt-2 text-sm font-bold uppercase tracking-[0.16em] text-[#4caf50]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#e2e9de] bg-[#0b3d1e] p-7 text-white shadow-card">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9debb3]">Contact</p>
              <h3 className="mt-3 font-serif text-3xl font-black">{brandContact.name}</h3>
              <div className="mt-6 grid gap-3 text-sm leading-7 text-emerald-50/90">
                <p className="flex items-center gap-3"><span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10"><Truck size={18} /></span> {brandContact.address}</p>
                <p className="flex items-center gap-3"><span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10"><MessageCircle size={18} /></span> Customer support available across India</p>
              </div>
              <Link className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[#0b3d1e]" to="/contact">
                View contact details <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="premium-container">
          <SectionTitle eyebrow="Plant Care Blog" title="Grow better every week" text="Short, SEO-friendly articles for common plant care problems." />
          <div className="mb-5 flex flex-wrap gap-2">
            {blogCategories.map((category) => (
              <span key={category} className="rounded-full border border-[#dbe8d8] bg-[#f7fff5] px-4 py-2 text-sm font-black text-[#0b3d1e]">
                {category}
              </span>
            ))}
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {blogPosts.map((post, index) => (
              <motion.article key={post.slug} className="overflow-hidden rounded-[1.75rem] border border-[#dbe8d8] bg-white shadow-soft" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.45, delay: index * 0.05 }}>
                <img className="h-52 w-full object-cover" src={post.image} alt={post.title} loading="lazy" onError={handleImageError} />
                <div className="p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4caf50]">{post.category}</p>
                  <h3 className="mt-2 text-xl font-black text-[#0b3d1e]">{post.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-stone-600">{post.excerpt}</p>
                  <Link className="mt-4 inline-flex items-center text-sm font-black text-[#4caf50]" to={`/blog/${post.slug}`}>
                    Read article <ArrowRight className="ml-2" size={15} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-container py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-[2rem] border border-[#e2e9de] bg-white p-8 shadow-soft">
            <SectionTitle eyebrow="FAQ" title="Questions customers ask before ordering" text="Short answers that build trust before checkout." />
            <div className="grid gap-3">
              {plantCareFaqs.map((item, index) => (
                <AccordionItem key={item.question} item={item} isOpen={openFaq === index} onToggle={() => setOpenFaq((current) => (current === index ? -1 : index))} />
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[2rem] border border-[#e2e9de] bg-[#0b3d1e] p-8 text-white shadow-card">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9debb3]">Newsletter</p>
              <h3 className="mt-3 font-serif text-4xl font-black">Stay in the green loop.</h3>
              <p className="mt-5 text-base leading-7 text-[#c8f8c9]">Get product drops, plant care tips, and practical updates. No fake scarcity, just useful content.</p>
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
              <div className="mt-5 flex flex-wrap gap-2">
                {urgencySignals.map((signal) => (
                  <span key={signal} className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-[#eaf7e8]">{signal}</span>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#e2e9de] bg-white p-8 shadow-soft">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#4caf50]">Quick Support</p>
              <h3 className="mt-3 font-serif text-3xl font-black text-[#10210f]">Need help choosing plants?</h3>
              <p className="mt-4 text-sm leading-7 text-stone-600">{brandContact.supportEmail} and WhatsApp support are available for plant selection and delivery questions.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <a className="inline-flex h-12 items-center justify-center rounded-full bg-[#0b3d1e] px-5 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#4caf50]" href={`https://wa.me/${brandContact.whatsappPhone}?text=${encodeURIComponent(brandContact.whatsappMessage)}`} rel="noreferrer" target="_blank">
                  <MessageCircle className="mr-2" size={17} /> WhatsApp Help
                </a>
                <Link className="inline-flex h-12 items-center justify-center rounded-full border border-[#dbe8d8] bg-[#f8fff5] px-5 text-sm font-black text-[#0b3d1e] transition hover:-translate-y-1 hover:bg-[#eaf7e8]" to="/shop">
                  Browse plants
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {recentlyViewed.length > 0 && (
        <section className="bg-[#f4f9f1] py-16">
          <div className="premium-container">
            <SectionTitle eyebrow="Recently Viewed" title="Continue where you left off" text="Helpful for returning customers and repeat buying." />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {recentlyViewed.map((product) => (
                <ProductMiniCard key={product._id || product.id || product.name} product={product} onAddToCart={handleAddToCart} onAddToWishlist={handleWishlist} />
              ))}
            </div>
          </div>
        </section>
      )}

      <button className="fixed bottom-24 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#0b3d1e] text-white shadow-card transition hover:-translate-y-1 hover:bg-[#4caf50]" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
        <ArrowUp size={22} />
      </button>
    </div>
  );
}
