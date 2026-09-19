import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Leaf, PackageCheck, RefreshCw, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';
import { useToast } from '../../hooks/useToast.js';
import { addToCart } from '../../services/cartService.js';
import { getProducts } from '../../services/productService.js';
import { addToWishlist } from '../../services/wishlistService.js';
import { getApiError } from '../../utils/auth.js';

const heroImage = 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1800&q=85';

const trustPoints = [
  { icon: Truck, title: 'Safe Express Delivery', text: 'Damage-free guarantee' },
  { icon: Leaf, title: 'Fresh From Nursery', text: 'Healthy plants, handpicked' },
  { icon: ShieldCheck, title: 'Secure Payment', text: 'UPI, card, and net banking' },
  { icon: RefreshCw, title: 'Replacement Support', text: 'Help for damaged arrivals' }
];

const categories = [
  { name: 'Indoor Plants', image: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Air Purifying', image: 'https://images.unsplash.com/photo-1593482892290-f54927ae2b8b?auto=format&fit=crop&w=600&q=80' },
  { name: 'Flowering Plants', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80' },
  { name: 'Succulents', image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=600&q=80' },
  { name: 'Pots & Planters', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80' },
  { name: 'Gardening Tools', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80' },
  { name: 'Plant Care', image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=600&q=80' }
];

export default function HomeTreeland() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  usePageMeta({
    title: 'Gaurav Nursery | Fresh Plants for Every Space',
    description: 'Shop healthy indoor plants, flowering plants, planters, and garden essentials from Gaurav Nursery.'
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['treeland-home-products'],
    queryFn: () => getProducts({ page: 1, limit: 12 }),
    select: (response) => response.products || []
  });

  const products = useMemo(() => (Array.isArray(data) ? data.slice(0, 6) : []), [data]);

  async function handleAddToCart(product, quantity = 1) {
    const productId = product?._id || product?.id;
    if (!isAuthenticated) {
      navigate('/login');
      return false;
    }
    if (!productId || String(productId).length !== 24) {
      navigate(`/shop?search=${encodeURIComponent(product?.name || product?.title || 'plant')}`);
      return false;
    }

    try {
      await addToCart(productId, quantity);
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
      navigate(`/shop?search=${encodeURIComponent(product?.name || product?.title || 'plant')}`);
      return;
    }

    try {
      await addToWishlist(productId);
      showToast('Saved to wishlist');
    } catch (error) {
      showToast(getApiError(error, 'Unable to update wishlist'), 'error');
    }
  }

  return (
    <div className="bg-[#fbfcfa] text-[#142217]">
      <section className="relative min-h-[31rem] overflow-hidden bg-[#e8ede5]">
        <img className="absolute inset-0 h-full w-full object-cover object-[62%_center]" src={heroImage} alt="Lush indoor plants from Gaurav Nursery" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fbfcfa] via-[#fbfcfa]/88 to-white/10" />
        <div className="premium-container relative flex min-h-[31rem] items-center py-14 sm:py-20">
          <div className="max-w-xl text-[#10210f]">
            <span className="inline-flex items-center gap-2 rounded-md border border-[#cbdcc9] bg-white/80 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#176334] backdrop-blur">
              <Leaf size={15} /> Trusted Plant Studio
            </span>
            <h1 className="mt-6 font-serif text-[clamp(2.6rem,5vw,5.2rem)] font-black leading-[1.02]">Bring home plants that thrive with you.</h1>
            <p className="mt-5 max-w-xl text-base font-semibold leading-8 text-[#415143] sm:text-lg">Handpicked indoor plants, planters, seeds, and garden essentials for your home, balcony, office, and gifting.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#087331] px-6 text-sm font-black text-white shadow-button transition hover:bg-[#0d9142]" to="/shop">
                <ShoppingBag size={18} /> Shop Plants
              </Link>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#9ab79d] bg-white/70 px-6 text-sm font-black text-[#0b3d1e] transition hover:bg-white" to="/categories">
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#dce7da] bg-white py-4">
        <div className="premium-container grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <item.icon className="shrink-0 text-[#16864f]" size={23} />
              <div>
                <p className="text-sm font-black text-[#142217]">{item.title}</p>
                <p className="mt-0.5 text-xs font-semibold text-slate-500">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="premium-container py-10 sm:py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#16864f]">Shop by need</p>
            <h2 className="mt-2 text-2xl font-black text-[#142217] sm:text-3xl">Explore Categories</h2>
          </div>
          <Link className="inline-flex items-center gap-1 text-sm font-black text-[#0b3d1e]" to="/categories">All categories <ChevronRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {categories.map((category) => (
            <Link key={category.name} className="group overflow-hidden rounded-lg border border-[#dce7da] bg-white transition hover:-translate-y-0.5 hover:shadow-soft" to={`/shop?category=${encodeURIComponent(category.name)}`}>
              <img className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" src={category.image} alt={category.name} loading="lazy" />
              <p className="flex items-center justify-between gap-1 p-3 text-sm font-black text-[#142217]">{category.name}<ChevronRight size={14} /></p>
            </Link>
          ))}
        </div>
      </section>

      <section className="premium-container pb-10 sm:pb-14">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#16864f]">Customer favourites</p>
            <h2 className="mt-2 text-2xl font-black text-[#142217] sm:text-3xl">Best Sellers</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">Handpicked top choices for greener spaces.</p>
          </div>
          <Link className="inline-flex items-center gap-1 text-sm font-black text-[#0b3d1e]" to="/shop">View all <ChevronRight size={16} /></Link>
        </div>
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-[26rem] rounded-lg" />)}</div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            Live products could not be loaded from the backend. Please check the API and database connection.
          </div>
        ) : products.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {products.map((product) => <ProductCard key={product._id || product.id} product={product} onAddToCart={handleAddToCart} onAddToWishlist={handleWishlist} />)}
          </div>
        ) : (
          <div className="rounded-xl border border-[#dce7da] bg-white px-4 py-3 text-sm font-semibold text-[#10210f]">
            No live products are currently available from the backend.
          </div>
        )}
        <div className="mt-10 grid gap-4 border-y border-[#dce7da] py-5 sm:grid-cols-3">
          <div className="flex items-center justify-center gap-3 text-sm font-black text-[#0b3d1e]"><ShieldCheck size={21} /> 100% secure payment</div>
          <div className="flex items-center justify-center gap-3 text-sm font-black text-[#0b3d1e]"><Truck size={21} /> Pan India fast delivery</div>
          <div className="flex items-center justify-center gap-3 text-sm font-black text-[#0b3d1e]"><PackageCheck size={21} /> Fresh and healthy plants</div>
        </div>
      </section>
    </div>
  );
}
