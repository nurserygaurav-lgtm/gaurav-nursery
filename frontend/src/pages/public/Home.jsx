import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  Clock3,
  Headphones,
  Heart,
  Leaf,
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
import { useToast } from '../../hooks/useToast.js';
import { addToCart } from '../../services/cartService.js';
import { getProducts } from '../../services/productService.js';
import { addToWishlist } from '../../services/wishlistService.js';
import { getApiError } from '../../utils/auth.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { getProductImage, getProductTitle } from '../../utils/product.js';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

const categories = [
  { label: 'Indoor Plants', to: '/shop?category=Indoor+Plants', image: 'https://images.unsplash.com/photo-1545239705-1564e58b9e4a?auto=format&fit=crop&w=400&q=80' },
  { label: 'Outdoor Plants', to: '/shop?category=Outdoor+Plants', image: 'https://images.unsplash.com/photo-1463320898484-cdee8141c787?auto=format&fit=crop&w=400&q=80' },
  { label: 'Flowering Plants', to: '/shop?category=Flowering+Plants', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=400&q=80' },
  { label: 'Seeds', to: '/shop?category=Seeds', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=80' },
  { label: 'Pots & Planters', to: '/shop?category=Planters', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80' },
  { label: 'Fertilizers', to: '/shop?category=Fertilizers', image: 'https://images.unsplash.com/photo-1591955506264-3f5a6834570a?auto=format&fit=crop&w=400&q=80' },
  { label: 'Gardening Tools', to: '/shop?category=Garden+Tools', image: 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=400&q=80' },
  { label: 'Pebbles', to: '/shop?category=Pebbles', image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=400&q=80' },
  { label: 'Accessories', to: '/shop?category=Accessories', image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=400&q=80' },
  { label: 'Offers', to: '/shop?sort=discount', image: 'https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=400&q=80' }
];

const features = [
  { icon: Truck, label: 'Fast Delivery' },
  { icon: PackageCheck, label: 'Secure Packaging' },
  { icon: ShieldCheck, label: 'Trusted Sellers' },
  { icon: BadgePercent, label: 'COD Available' },
  { icon: RotateCcw, label: 'Easy Returns' },
  { icon: Headphones, label: 'Customer Support' }
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
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setError('');
        const data = await getProducts({ page: 1, limit: 8 });
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
  const dealProduct = products[4] || products[0];
  const dealPrice = Number(dealProduct?.salePrice || dealProduct?.discountedPrice || dealProduct?.price || 0);
  const originalPrice = Number(dealProduct?.originalPrice || dealProduct?.mrp || Math.round(dealPrice * 1.3));

  async function handleAddToCart(product) {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/products/${product._id}` } } });
      return;
    }

    try {
      await addToCart(product._id, 1);
      showToast('Added to cart');
    } catch (err) {
      showToast(getApiError(err, 'Unable to add to cart'), 'error');
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

  return (
    <>
      <section className="overflow-hidden bg-gradient-to-br from-white via-leaf-50 to-white">
        <div className="premium-container py-8 sm:py-12">
          <motion.div
            className="relative overflow-hidden rounded-[2rem] border border-leaf-100 bg-white shadow-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <div className="grid min-h-[540px] gap-8 p-6 sm:p-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:p-14">
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 rounded-full bg-leaf-100 px-4 py-2 text-sm font-black text-leaf-800">
                  <Sparkles size={16} />
                  Gaurav Nursery
                </span>
                <h1 className="mt-6 max-w-2xl text-5xl font-black leading-[1.02] tracking-tight text-leaf-950 sm:text-6xl">
                  Bring Nature Home Today!
                </h1>
                <p className="mt-5 max-w-xl text-lg leading-8 text-stone-600">
                  Shop premium quality plants, planters, seeds, and gardening essentials packed with care by trusted nursery sellers.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-leaf-900 px-7 text-sm font-black text-white shadow-button transition hover:-translate-y-0.5 hover:bg-leaf-700" to="/shop">
                    Shop Plants <ArrowRight className="ml-2" size={18} />
                  </Link>
                  <Link className="inline-flex min-h-12 items-center justify-center rounded-full border border-leaf-200 bg-white px-7 text-sm font-black text-leaf-950 transition hover:-translate-y-0.5 hover:bg-leaf-50" to="/categories">
                    Explore Categories
                  </Link>
                </div>
                <div className="mt-10 flex items-center gap-4">
                  <button className="flex h-11 w-11 items-center justify-center rounded-full border border-leaf-100 bg-white text-leaf-900 shadow-soft" aria-label="Previous slide">
                    <ArrowLeft size={18} />
                  </button>
                  <div className="flex gap-2" aria-label="Slider pagination">
                    <span className="h-2.5 w-8 rounded-full bg-leaf-800" />
                    <span className="h-2.5 w-2.5 rounded-full bg-leaf-200" />
                    <span className="h-2.5 w-2.5 rounded-full bg-leaf-200" />
                  </div>
                  <button className="flex h-11 w-11 items-center justify-center rounded-full border border-leaf-100 bg-white text-leaf-900 shadow-soft" aria-label="Next slide">
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>

              <motion.div
                className="relative min-h-[360px]"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-leaf-100" />
                <img
                  className="relative ml-auto h-[360px] w-full max-w-xl rounded-[2rem] object-cover object-center shadow-card sm:h-[440px]"
                  src="https://images.unsplash.com/photo-1525498128493-380d1990a112?auto=format&fit=crop&w=1100&q=85"
                  alt="Large premium indoor plant arrangement"
                />
                <div className="absolute left-2 top-6 flex h-28 w-28 items-center justify-center rounded-full bg-leaf-900 text-center text-white shadow-card sm:left-8 sm:h-32 sm:w-32">
                  <span className="text-3xl font-black leading-none">30%<span className="block text-sm">OFF</span></span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="premium-container py-10">
        <div className="flex gap-5 overflow-x-auto pb-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.label}
              className="min-w-[116px]"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.4, delay: index * 0.03 }}
            >
              <Link className="group block text-center" to={category.to}>
                <span className="mx-auto block h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-leaf-50 shadow-soft transition group-hover:-translate-y-1 group-hover:shadow-card">
                  <img className="h-full w-full object-cover transition duration-500 group-hover:scale-110" src={category.image} alt={category.label} loading="lazy" />
                </span>
                <span className="mt-3 block text-sm font-black leading-tight text-leaf-950">{category.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-y border-leaf-100 bg-white">
        <div className="premium-container grid gap-3 py-5 sm:grid-cols-2 lg:grid-cols-6">
          {features.map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-leaf-50 px-4 py-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-leaf-800 shadow-soft">
                <item.icon size={19} />
              </span>
              <span className="text-sm font-black text-leaf-950">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="premium-container py-12">
        <SectionHeader
          eyebrow="Best Sellers"
          title="Loved by Plant Parents"
          action={
            <Link className="inline-flex items-center gap-2 rounded-full border border-leaf-200 px-5 py-3 text-sm font-black text-leaf-900 transition hover:bg-leaf-50" to="/shop">
              View All <ArrowRight size={17} />
            </Link>
          }
        />
        {isLoading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
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

      <section className="premium-container py-12">
        <SectionHeader eyebrow="Daily Deal" title="Deal of the Day" />
        {dealProduct && (
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
                <Clock3 size={16} /> Ends in 08:24:36
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
        )}
      </section>

      <section className="premium-container pb-16">
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
    </>
  );
}
