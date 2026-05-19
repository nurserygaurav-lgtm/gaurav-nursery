import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgePercent,
  Check,
  Heart,
  Leaf,
  Mail,
  MapPin,
  MessageCircle,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
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
import { getProductImage, getProductTitle } from '../../utils/product.js';

const categoryArtwork = {
  'Indoor Plants': 'https://images.unsplash.com/photo-1545239705-1564e58b9e4a?auto=format&fit=crop&w=500&q=85',
  'Outdoor Plants': 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=500&q=85',
  'Flowering Plants': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=500&q=85',
  'Fruit Plants': 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=500&q=85',
  'Pots & Planters': 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=500&q=85',
  Seeds: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=500&q=85',
  Fertilizers: 'https://images.unsplash.com/photo-1591955506264-3f5a6834570a?auto=format&fit=crop&w=500&q=85',
  'Tools & Accessories': 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=500&q=85'
};

const desiredCategories = Object.keys(categoryArtwork);

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
          <img className="aspect-[5/4] w-full object-cover transition duration-500 group-hover:scale-110" src={getProductImage(product)} alt={getProductTitle(product)} loading="lazy" decoding="async" />
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

  const bestSellers = useMemo(() => products.slice(0, 4), [products]);
  const newArrivals = useMemo(() => [...products].slice(0, 8), [products]);
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
      <section className="relative overflow-hidden">
        <div className="premium-container grid gap-8 py-10 lg:grid-cols-[1fr_22rem] xl:grid-cols-[1fr_24rem]">
          <motion.div className="grid gap-8 rounded-[2rem] border border-[#dbe8d8] bg-white p-6 shadow-[0_26px_80px_rgba(11,61,30,0.10)] md:grid-cols-[0.9fr_1.1fr] md:p-9" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="flex flex-col justify-center">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#eaf7e8] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#0b3d1e]">
                <Leaf size={16} />
                Premium Botanical Store
              </span>
              <h1 className="mt-6 font-serif text-5xl font-black leading-[0.98] tracking-tight text-[#0b3d1e] sm:text-6xl xl:text-7xl">Bring Nature Home</h1>
              <p className="mt-5 max-w-xl text-lg font-semibold leading-8 text-stone-600">Healthy Plants. Happy Homes. Delivered with Love.</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {heroBadges.map((badge) => (
                  <div key={badge} className="flex items-center gap-2 rounded-2xl border border-[#dbe8d8] bg-[#f8fff5] px-4 py-3 text-sm font-black text-[#0b3d1e]">
                    <Check size={17} className="text-[#4caf50]" />
                    {badge}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#0b3d1e] px-7 text-sm font-black text-white shadow-button transition hover:-translate-y-1 hover:bg-[#4caf50]" to="/shop">
                  Shop Now <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#dbe8d8] bg-white px-7 text-sm font-black text-[#0b3d1e] transition hover:-translate-y-1 hover:bg-[#eaf7e8]" to="/categories">
                  Explore Collections
                </Link>
              </div>
            </div>

            <div className="relative min-h-[430px]">
              <motion.img className="absolute right-0 top-0 h-64 w-[72%] rounded-[2rem] object-cover shadow-card" src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=85" alt="Green nursery plants" animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
              <motion.img className="absolute bottom-8 left-0 h-60 w-[62%] rounded-[2rem] object-cover shadow-card" src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=85" alt="Potted plants" animate={{ y: [0, 10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
              <img className="absolute bottom-0 right-6 h-44 w-44 rounded-[1.5rem] object-cover shadow-card" src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=600&q=85" alt="Nursery care" loading="lazy" />
              <div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-8 border-white bg-[#0b3d1e] text-center text-white shadow-card">
                <span className="text-3xl font-black">GN</span>
                <span className="text-[10px] font-black uppercase tracking-[0.16em]">Gaurav Nursery</span>
              </div>
              <div className="absolute bottom-7 right-0 rotate-[-3deg] rounded-2xl bg-[#7a5230] px-5 py-4 text-center font-serif text-lg font-black text-white shadow-card">
                From Our Nursery<br />To Your Home
              </div>
            </div>
          </motion.div>

          <aside className="grid gap-5">
            <div className="rounded-[1.5rem] border border-[#dbe8d8] bg-white p-5 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-2xl font-black text-[#0b3d1e]">Best Sellers</h2>
                <Link className="text-sm font-black text-[#4caf50]" to="/shop">View all</Link>
              </div>
              {isLoading && <div className="grid gap-3">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-28" />)}</div>}
              {error && <p className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}
              {!isLoading && !error && (
                <div className="grid gap-4">
                  {bestSellers.map((product) => (
                    <div key={product._id} className="grid grid-cols-[5rem_1fr] gap-3 rounded-2xl bg-[#f8fff5] p-2">
                      <Link to={`/products/${product._id}`}><img className="h-20 w-20 rounded-xl object-cover" src={getProductImage(product)} alt={getProductTitle(product)} loading="lazy" /></Link>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-black uppercase tracking-[0.12em] text-[#4caf50]">{product.category || 'Plants'}</p>
                        <Link className="line-clamp-1 text-sm font-black text-[#1b2a1f]" to={`/products/${product._id}`}>{getProductTitle(product)}</Link>
                        <div className="mt-1 flex items-center gap-1 text-amber-500"><Star size={13} fill="currentColor" /><span className="text-xs font-bold text-stone-500">4.8</span></div>
                        <div className="mt-1 flex items-center gap-2"><span className="font-black text-[#0b3d1e]">{formatCurrency(product.price)}</span><span className="text-xs font-bold text-stone-400 line-through">{formatCurrency(getOldPrice(product))}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link className="block rounded-[1.5rem] bg-[#0b3d1e] p-6 text-white shadow-card transition hover:-translate-y-1" to="/shop">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#eaf7e8]">Summer Green Sale</p>
              <h3 className="mt-2 font-serif text-3xl font-black">Up to 40% OFF</h3>
              <span className="mt-4 inline-flex items-center text-sm font-black">Shop offers <ArrowRight className="ml-2" size={17} /></span>
            </Link>

            <div className="overflow-hidden rounded-[1.5rem] border border-[#dbe8d8] bg-white shadow-soft">
              <img className="h-44 w-full object-cover" src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=700&q=85" alt="Gardener consultation" loading="lazy" />
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
                  <img className="h-full w-full object-cover transition duration-500 group-hover:scale-110" src={category.image} alt={category.name} loading="lazy" />
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
        <div className="relative overflow-hidden rounded-[2rem] bg-[#0b3d1e] p-8 text-white shadow-card md:p-12">
          <img className="absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover opacity-45 md:block" src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1000&q=85" alt="Beautiful plants" loading="lazy" />
          <div className="relative max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#eaf7e8]">Beautiful Plants Better Living</p>
            <h2 className="mt-3 font-serif text-4xl font-black sm:text-5xl">Handpicked | Hygienic | Carefully Delivered</h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {featureList.map((feature) => (
                <div key={feature} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 font-black backdrop-blur">
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
                  <img className="h-14 w-14 rounded-full object-cover" src={testimonial.image} alt={testimonial.name} loading="lazy" />
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

      <section className="premium-container grid gap-6 py-14 lg:grid-cols-[1fr_24rem]">
        <div className="rounded-[2rem] bg-[#eaf7e8] p-8 shadow-soft md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#4caf50]">Newsletter</p>
          <h2 className="mt-3 font-serif text-4xl font-black text-[#0b3d1e]">Join Our Green Family</h2>
          <form className="mt-7 flex flex-col gap-3 sm:flex-row" onSubmit={handleNewsletter}>
            <label className="relative flex-1">
              <span className="sr-only">Email address</span>
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input className="form-input h-12 pl-11" onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" required type="email" value={email} />
            </label>
            <Button className="h-12 bg-[#0b3d1e] hover:bg-[#4caf50]" type="submit">Subscribe</Button>
          </form>
        </div>
        <div className="overflow-hidden rounded-[2rem] border border-[#dbe8d8] bg-white shadow-soft">
          <img className="h-52 w-full object-cover" src="https://images.unsplash.com/photo-1599685315640-0ca6d2e8f83d?auto=format&fit=crop&w=800&q=85" alt="Our nursery" loading="lazy" />
          <div className="p-6">
            <h2 className="font-serif text-3xl font-black text-[#0b3d1e]">Our Nursery</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Visit Gaurav Nursery for plants, planters, seeds, and expert guidance.</p>
            <a className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#0b3d1e] px-5 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#4caf50]" href="https://www.google.com/maps/search/?api=1&query=Gaurav+Nursery" rel="noreferrer" target="_blank">
              <MapPin className="mr-2" size={17} /> Get Direction
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dbe8d8] bg-white">
        <div className="premium-container grid gap-3 py-5 sm:grid-cols-2 lg:grid-cols-5">
          {trustBar.map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-[#f8fff5] px-4 py-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eaf7e8] text-[#0b3d1e]"><item.icon size={19} /></span>
              <span className="text-sm font-black text-[#0b3d1e]">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <a className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-card transition hover:-translate-y-1 hover:bg-[#1ebe5d]" href="https://wa.me/916352031504" rel="noreferrer" target="_blank" aria-label="Chat on WhatsApp">
        <MessageCircle size={27} />
      </a>
    </div>
  );
}
