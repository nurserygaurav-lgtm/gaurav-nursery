import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  Clock3,
  Headphones,
  Heart,
  Leaf,
  Mail,
  MessageCircle,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Sprout,
  Truck
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard.jsx';
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

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 }
};

const categoryImages = [
  'https://images.unsplash.com/photo-1545239705-1564e58b9e4a?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1591955506264-3f5a6834570a?auto=format&fit=crop&w=500&q=80'
];

const fallbackCategories = ['Indoor Plants', 'Flowering Plants', 'Fruit Plants', 'Seeds', 'Planters', 'Garden Tools'];

const slides = [
  {
    eyebrow: 'Premium nursery e-commerce',
    title: 'Bring Nature Home Today',
    text: 'Healthy plants, planters, seeds, soil, and garden essentials delivered with care from Gaurav Nursery.',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1600&q=80'
  },
  {
    eyebrow: 'Fresh arrivals weekly',
    title: 'Plants for Every Corner',
    text: 'Style your balcony, office, living room, and garden with curated indoor and outdoor collections.',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1600&q=85'
  },
  {
    eyebrow: 'Garden essentials',
    title: 'Grow More With Less Guesswork',
    text: 'Shop trusted soil mixes, seeds, planters, and care tools that keep every plant thriving.',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1600&q=85'
  }
];

const heroStats = ['10,000+ Happy Customers', '500+ Plant Varieties', 'PAN India Delivery'];

const promotionalSlides = [
  {
    title: 'Happiness is having more plants...',
    offer: 'Get up to 35% OFF',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1200&q=85'
  },
  {
    title: 'Create your green corner today...',
    offer: 'Fresh plants, pots, and seeds',
    image: 'https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1200&q=85'
  },
  {
    title: 'Premium plants delivered safely...',
    offer: 'COD available on eligible orders',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=85'
  }
];

const trustBadges = [
  { icon: Truck, label: 'Fast Delivery' },
  { icon: PackageCheck, label: 'Secure Packaging' },
  { icon: ShieldCheck, label: 'Trusted Quality' },
  { icon: BadgePercent, label: 'COD Available' },
  { icon: RotateCcw, label: 'Easy Returns' },
  { icon: Headphones, label: 'Support' }
];

const premiumGuarantees = [
  { icon: Truck, label: 'Free Delivery', text: 'On orders above ₹499' },
  { icon: ShieldCheck, label: 'Secure Payment', text: 'Protected Razorpay checkout' },
  { icon: RotateCcw, label: 'Easy Returns', text: 'Simple support for every order' },
  { icon: PackageCheck, label: 'Best Quality', text: 'Fresh plants packed with care' },
  { icon: Headphones, label: '24/7 Support', text: 'Help whenever you need it' }
];

function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.22em] text-leaf-600">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-leaf-950 sm:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [activePromoSlide, setActivePromoSlide] = useState(0);
  const [email, setEmail] = useState('');
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  usePageMeta({
    title: 'Premium Plants and Garden Essentials',
    description: 'Shop Gaurav Nursery for plants, planters, seeds, soil, and garden essentials with COD and free delivery offers.'
  });

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setError('');
        const data = await getProducts({ page: 1, limit: 12 });
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
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePromoSlide((current) => (current + 1) % promotionalSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const liveCategories = useMemo(() => {
    const names = [...new Set(products.map((product) => product.category).filter(Boolean))];
    return (names.length ? names : fallbackCategories).slice(0, 6).map((name, index) => ({
      name,
      image: categoryImages[index % categoryImages.length],
      count: products.filter((product) => product.category === name).length
    }));
  }, [products]);

  const bestSellers = useMemo(() => products.slice(0, 8), [products]);
  const dealProduct = products[4] || products[0];
  const dealPrice = Number(dealProduct?.salePrice || dealProduct?.discountedPrice || dealProduct?.price || 0);
  const originalPrice = Number(dealProduct?.originalPrice || dealProduct?.mrp || Math.round(dealPrice * 1.3));
  const slide = slides[activeSlide];
  const promotionalSlide = promotionalSlides[activePromoSlide];

  function goToSlide(index) {
    setActiveSlide((index + slides.length) % slides.length);
  }

  function goToPromoSlide(index) {
    setActivePromoSlide((index + promotionalSlides.length) % promotionalSlides.length);
  }

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
    <>
      <section className="overflow-hidden bg-white">
        <div className="premium-container pt-6">
          <motion.div
            className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-[#f3f8ef] shadow-card md:min-h-[500px]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <motion.div
              key={promotionalSlide.title}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55 }}
            >
              <img className="absolute inset-y-0 right-0 h-full w-full object-cover object-center opacity-45 md:w-[62%] md:opacity-95" src={promotionalSlide.image} alt={promotionalSlide.title} />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/25" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(220,237,216,0.9),transparent_22rem)]" />
            </motion.div>

            <div className="relative z-10 flex min-h-[420px] flex-col justify-center p-7 md:min-h-[500px] md:p-12 lg:w-[56%]">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-leaf-100 px-4 py-2 text-sm font-black text-leaf-800">
                <Sparkles size={16} />
                Premium Plant Sale
              </span>
              <h1 className="mt-6 max-w-2xl text-5xl font-black leading-[1.02] tracking-tight text-leaf-950 sm:text-6xl">
                {promotionalSlide.title}
              </h1>
              <p className="mt-5 text-2xl font-black text-leaf-700 sm:text-3xl">{promotionalSlide.offer}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-leaf-900 px-7 text-sm font-black text-white shadow-button transition hover:-translate-y-0.5 hover:bg-leaf-700" to="/shop">
                  Shop Now <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link className="inline-flex min-h-12 items-center justify-center rounded-full border border-leaf-200 bg-white/80 px-7 text-sm font-black text-leaf-950 transition hover:-translate-y-0.5 hover:bg-white" to="/categories">
                  Explore Collections
                </Link>
              </div>
            </div>

            <button className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-leaf-100 bg-white/85 text-leaf-900 shadow-soft backdrop-blur transition hover:bg-leaf-900 hover:text-white" onClick={() => goToPromoSlide(activePromoSlide - 1)} aria-label="Previous promotional slide">
              <ArrowLeft size={18} />
            </button>
            <button className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-leaf-100 bg-white/85 text-leaf-900 shadow-soft backdrop-blur transition hover:bg-leaf-900 hover:text-white" onClick={() => goToPromoSlide(activePromoSlide + 1)} aria-label="Next promotional slide">
              <ArrowRight size={18} />
            </button>
            <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2" aria-label="Promotional slider pagination">
              {promotionalSlides.map((item, index) => (
                <button
                  key={item.title}
                  className={`h-2.5 rounded-full transition ${activePromoSlide === index ? 'w-8 bg-leaf-900' : 'w-2.5 bg-leaf-300'}`}
                  onClick={() => goToPromoSlide(index)}
                  aria-label={`Go to promotional slide ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="overflow-hidden bg-white">
        <div className="premium-container py-6 sm:py-8">
          <motion.div
            className="relative overflow-hidden rounded-[1.75rem] bg-leaf-950 text-white shadow-card"
            style={{
              background: `linear-gradient(90deg, rgba(6,40,15,0.88) 0%, rgba(8,55,22,0.72) 45%, rgba(8,55,22,0.35) 100%), url(${slide.image}) center/cover no-repeat`
            }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="relative z-10 flex min-h-[460px] items-center px-6 py-20 text-center sm:min-h-[540px] sm:px-10 lg:min-h-[600px] lg:px-14 lg:text-left">
              <div className="mx-auto max-w-3xl lg:mx-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-leaf-50 ring-1 ring-white/20 backdrop-blur sm:text-sm">
                  <Sparkles size={16} />
                  {slide.eyebrow}
                </span>
                <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
                  {slide.title}
                </h1>
                <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-8 text-leaf-50/90 sm:text-lg lg:mx-0">{slide.text}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                  <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-black text-leaf-950 shadow-button transition hover:-translate-y-0.5 hover:bg-leaf-50" to="/shop">
                    Shop Now <ArrowRight className="ml-2" size={18} />
                  </Link>
                  <Link className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/70 bg-transparent px-7 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/15" to="/categories">
                    Explore Collections
                  </Link>
                </div>
                <div className="mt-8 grid gap-3 text-sm font-black text-white/90 sm:grid-cols-3">
                  {heroStats.map((item) => (
                    <span key={item} className="rounded-full border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute bottom-5 left-5 right-5 z-20 flex items-center justify-between gap-4 sm:bottom-8 sm:left-8 sm:right-8">
              <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/12 text-white backdrop-blur transition hover:bg-white hover:text-leaf-950" onClick={() => goToSlide(activeSlide - 1)} aria-label="Previous slide">
                <ArrowLeft size={18} />
              </button>
              <div className="flex gap-2" aria-label="Slider pagination">
                {slides.map((item, index) => (
                  <button
                    key={item.title}
                    className={`h-2.5 rounded-full transition ${activeSlide === index ? 'w-8 bg-white' : 'w-2.5 bg-white/45'}`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/12 text-white backdrop-blur transition hover:bg-white hover:text-leaf-950" onClick={() => goToSlide(activeSlide + 1)} aria-label="Next slide">
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-leaf-100 bg-white">
        <div className="premium-container grid gap-3 py-5 sm:grid-cols-2 lg:grid-cols-6">
          {trustBadges.map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-leaf-50 px-4 py-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-leaf-800 shadow-soft">
                <item.icon size={19} />
              </span>
              <span className="text-sm font-black text-leaf-950">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="premium-container py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {premiumGuarantees.map((item, index) => (
            <motion.div
              key={item.label}
              className="rounded-[1.25rem] border border-leaf-100 bg-white p-5 shadow-soft"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.4, delay: index * 0.04 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-leaf-100 text-leaf-800">
                <item.icon size={22} />
              </div>
              <h3 className="mt-4 text-lg font-black text-leaf-950">{item.label}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="premium-container py-12">
        <SectionHeader
          eyebrow="Shop by Categories"
          title="Find Your Planting Style"
          action={
            <Link className="inline-flex items-center gap-2 rounded-full border border-leaf-200 px-5 py-3 text-sm font-black text-leaf-900 transition hover:bg-leaf-50" to="/categories">
              View All <ArrowRight size={17} />
            </Link>
          }
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {liveCategories.map((category, index) => (
            <motion.div key={category.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: index * 0.04 }}>
              <Link className="group relative block overflow-hidden rounded-[1.25rem] bg-leaf-900 shadow-soft" to={`/shop?category=${encodeURIComponent(category.name)}`}>
                <img className="h-56 w-full object-cover opacity-75 transition duration-500 group-hover:scale-105 group-hover:opacity-90" src={category.image} alt={category.name} loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-leaf-950/90 via-leaf-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <h3 className="text-2xl font-black">{category.name}</h3>
                  <p className="mt-1 text-sm font-bold text-leaf-50/85">{category.count || 'Curated'} products</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-[#f4f7ef] py-12">
        <div className="premium-container">
          <SectionHeader
            eyebrow="Best Sellers"
            title="Loved by Plant Parents"
            action={
              <Link className="inline-flex items-center gap-2 rounded-full border border-leaf-200 bg-white px-5 py-3 text-sm font-black text-leaf-900 transition hover:bg-leaf-50" to="/shop">
                View All <ArrowRight size={17} />
              </Link>
            }
          />
          {isLoading && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-80" />
              ))}
            </div>
          )}
          {error && <p className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}
          {!isLoading && !error && !!bestSellers.length && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {bestSellers.map((product) => (
                <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} onAddToWishlist={handleWishlist} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="premium-container py-6">
        <motion.div
          className="grid gap-6 overflow-hidden rounded-[2rem] bg-leaf-950 p-7 text-white shadow-card md:grid-cols-[1fr_auto] md:items-center md:p-10"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-leaf-200">Limited time offer</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">Spring Plant Sale</h2>
            <p className="mt-3 max-w-2xl leading-7 text-leaf-100">Refresh your balcony, living room, and garden with seasonal plants and essentials.</p>
          </div>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-black text-leaf-950 shadow-button transition hover:-translate-y-0.5 hover:bg-leaf-50" to="/shop">
            Shop Now <ArrowRight className="ml-2" size={18} />
          </Link>
        </motion.div>
      </section>

      {dealProduct && (
        <section className="premium-container py-12">
          <SectionHeader eyebrow="Daily Deal" title="Deal of the Day" />
          <motion.div
            className="grid overflow-hidden rounded-[2rem] border border-leaf-100 bg-white shadow-card md:grid-cols-[0.9fr_1.1fr]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link className="block bg-leaf-50" to={`/products/${dealProduct._id}`}>
              <img className="h-full min-h-[320px] w-full object-cover" src={getProductImage(dealProduct)} alt={getProductTitle(dealProduct)} loading="lazy" />
            </Link>
            <div className="flex flex-col justify-center p-7 md:p-10">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-amber-800">
                <Clock3 size={16} /> Limited availability
              </span>
              <Link to={`/products/${dealProduct._id}`} className="mt-5 text-3xl font-black tracking-tight text-leaf-950 transition hover:text-leaf-700">
                {getProductTitle(dealProduct)}
              </Link>
              <div className="mt-5 flex items-end gap-3">
                <span className="text-lg font-bold text-stone-400 line-through">{formatCurrency(originalPrice)}</span>
                <span className="text-4xl font-black text-leaf-900">{formatCurrency(dealPrice)}</span>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button onClick={() => handleAddToCart(dealProduct)}>
                  <ShoppingCart className="mr-2" size={18} />
                  Add to Cart
                </Button>
                <Button onClick={() => handleWishlist(dealProduct)} variant="outline">
                  <Heart className="mr-2" size={18} />
                  Wishlist
                </Button>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      <section className="premium-container py-12">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { icon: Leaf, title: 'Premium Quality', text: 'Healthy plants selected for home, balcony, and garden spaces.' },
            { icon: Sprout, title: 'Fresh Arrivals', text: 'New plants, seeds, and essentials added regularly.' },
            { icon: ShieldCheck, title: 'Secure Checkout', text: 'Cart, wishlist, authentication, and payments stay connected.' }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              className="rounded-3xl border border-leaf-100 bg-white p-6 shadow-soft"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.45, delay: index * 0.05 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-800">
                <item.icon size={23} />
              </div>
              <h3 className="mt-5 text-lg font-black text-leaf-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="premium-container pb-16">
        <div className="grid gap-6 overflow-hidden rounded-[1.5rem] bg-leaf-950 p-7 text-white shadow-card lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:p-10">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-leaf-200">Newsletter</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Get plant care tips and offers</h2>
            <p className="mt-3 leading-7 text-leaf-100">Fresh arrivals, seasonal offers, and simple care reminders from Gaurav Nursery.</p>
          </div>
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleNewsletter}>
            <label className="relative flex-1">
              <span className="sr-only">Email address</span>
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input className="form-input h-12 pl-11 text-leaf-950" onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" required type="email" value={email} />
            </label>
            <Button className="h-12 bg-white text-leaf-950 hover:bg-leaf-50" type="submit">Subscribe</Button>
          </form>
        </div>
      </section>

      <a
        className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-card transition hover:-translate-y-1 hover:bg-[#1ebe5d]"
        href="https://wa.me/916352031504"
        rel="noreferrer"
        target="_blank"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={27} />
      </a>
    </>
  );
}
