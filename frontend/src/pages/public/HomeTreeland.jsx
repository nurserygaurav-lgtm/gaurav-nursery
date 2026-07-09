import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BadgeCheck, BookOpen, Leaf, PackageCheck, RefreshCcw, ShieldCheck, Truck } from 'lucide-react';
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
import { featuredProducts } from '../../utils/mockData.js';

const heroImage = 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1600&q=85';
const careImage = 'https://images.unsplash.com/photo-1558693168-c370615b54e0?auto=format&fit=crop&w=1200&q=85';

const fallbackCatalog = featuredProducts.map((product) => ({
  ...product,
  _id: product._id || product.id || product.name,
  images: product.images || [{ url: product.image }]
}));

const collections = [
  {
    title: 'Indoor Plants',
    text: 'Fresh greens for bedrooms, desks, and living rooms.',
    to: '/shop?category=Indoor%20Plants',
    image: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Planters',
    text: 'Minimal pots and balcony-ready planters.',
    to: '/shop?category=Pots%20%26%20Planters',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Garden Tools',
    text: 'Useful care tools for daily plant routines.',
    to: '/shop?category=Gardening%20Tools',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=85'
  }
];

const benefits = [
  { icon: Truck, title: 'Free Shipping', text: 'Free delivery on eligible orders.' },
  { icon: RefreshCcw, title: 'Easy Returns', text: 'Replacement support for damaged plants.' },
  { icon: ShieldCheck, title: 'Secure Payment', text: 'UPI, cards, COD, and safe checkout.' },
  { icon: PackageCheck, title: 'Quality Packing', text: 'Live plants packed with care.' }
];

const journals = [
  'Indoor plant styling ideas for modern homes',
  'How to water plants through Indian summers',
  'Low-maintenance greens for busy beginners'
];

export default function HomeTreeland() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  usePageMeta({
    title: 'Gaurav Nursery | Indoor Plants, Planters and Garden Essentials',
    description: 'Shop fresh indoor plants, outdoor plants, planters, seeds, and gardening essentials from Gaurav Nursery.'
  });

  const { data, isLoading } = useQuery({
    queryKey: ['treeland-home-products'],
    queryFn: () => getProducts({ page: 1, limit: 12 }),
    select: (response) => response.products || []
  });

  const products = useMemo(() => {
    const source = Array.isArray(data) && data.length ? data : fallbackCatalog;
    return source.slice(0, 8);
  }, [data]);

  async function handleAddToCart(product) {
    const productId = product?._id || product?.id;
    if (!productId || String(productId).length !== 24) {
      navigate(`/shop?search=${encodeURIComponent(product?.name || product?.title || 'plant')}`);
      return false;
    }

    if (!isAuthenticated) {
      navigate('/login');
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
    <div className="bg-[#f4f0e8] text-[#1a2618]">
      <section className="relative overflow-hidden bg-[#10210f]">
        <img className="absolute inset-0 h-full w-full object-cover opacity-58" src={heroImage} alt="Potted plants for home decor" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#10210f]/90 via-[#10210f]/58 to-[#10210f]/10" />
        <div className="premium-container relative grid min-h-[42rem] content-center py-14">
          <div className="max-w-2xl text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/14 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] backdrop-blur">
              <Leaf size={15} /> Nature meets style
            </span>
            <h1 className="mt-6 font-serif text-[clamp(2.6rem,6vw,6rem)] font-black leading-[0.96]">
              Bring home plants that thrive with you.
            </h1>
            <p className="mt-5 max-w-xl text-base font-semibold leading-8 text-white/82">
              Handpicked indoor plants, planters, seeds, and garden essentials for bright homes, balconies, offices, and gifting.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="inline-flex min-h-12 items-center justify-center rounded-md bg-white px-7 text-sm font-black text-[#10210f] shadow-button transition hover:-translate-y-1 hover:bg-[#f7fbf4]" to="/shop">
                Shop Now <ArrowRight className="ml-2" size={17} />
              </Link>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/30 bg-white/12 px-7 text-sm font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20" to="/categories">
                View Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="premium-container -mt-14 relative z-10">
        <div className="grid gap-4 rounded-lg border border-white/70 bg-white p-4 shadow-[0_28px_90px_rgba(27,41,27,0.14)] md:grid-cols-3">
          {collections.map((collection) => (
            <Link key={collection.title} className="group relative min-h-52 overflow-hidden rounded-md bg-[#10210f]" to={collection.to}>
              <img className="absolute inset-0 h-full w-full object-cover opacity-82 transition duration-700 group-hover:scale-105" src={collection.image} alt={collection.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10210f]/88 via-[#10210f]/22 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <h2 className="font-serif text-2xl font-black">{collection.title}</h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-white/78">{collection.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="premium-container py-12">
        <div className="grid gap-5 md:grid-cols-4">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="rounded-md border border-[#e4dfd2] bg-[#fbf8f0] p-5 text-center">
              <benefit.icon className="mx-auto text-[#2f6d4c]" size={26} />
              <h3 className="mt-4 font-black text-[#10210f]">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{benefit.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="premium-container py-8">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2f6d4c]">Top Picks</p>
            <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,3.7rem)] font-black text-[#10210f]">Handpicked for you</h2>
          </div>
          <Link className="inline-flex items-center gap-2 text-sm font-black text-[#0b3d1e]" to="/shop">
            Shop all products <ArrowRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-80 rounded-[1.5rem]" />)}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id || product.id || product.name} product={product} onAddToCart={handleAddToCart} onAddToWishlist={handleWishlist} />
            ))}
          </div>
        )}
      </section>

      <section className="premium-container py-12">
        <div className="grid overflow-hidden rounded-lg bg-[#0b3d1e] text-white shadow-card lg:grid-cols-2">
          <div className="p-7 sm:p-10">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#b8dfb2]">Plant Care</p>
            <h2 className="mt-4 font-serif text-[clamp(2rem,4vw,4rem)] font-black leading-tight">Your plant journey starts here.</h2>
            <p className="mt-4 max-w-xl leading-8 text-white/76">
              Choose the right plant, pair it with a beautiful planter, and get care support after purchase.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link className="inline-flex min-h-12 items-center justify-center rounded-md bg-white px-7 text-sm font-black text-[#0b3d1e]" to="/blog">
                Read Care Tips
              </Link>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/20 px-7 text-sm font-black text-white" to="/support">
                Ask Support
              </Link>
            </div>
          </div>
          <img className="h-full min-h-80 w-full object-cover" src={careImage} alt="Plant care and potting" />
        </div>
      </section>

      <section className="premium-container pb-14">
        <div className="mb-7">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2f6d4c]">Our Journal</p>
          <h2 className="mt-3 font-serif text-3xl font-black text-[#10210f]">Guides for greener living</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {journals.map((journal) => (
            <Link key={journal} className="rounded-md border border-[#e4dfd2] bg-white p-5 shadow-soft transition hover:-translate-y-1" to="/blog">
              <BookOpen className="text-[#2f6d4c]" size={24} />
              <h3 className="mt-5 text-xl font-black leading-snug text-[#10210f]">{journal}</h3>
              <p className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#2f6d4c]">
                Read more <ArrowRight size={15} />
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[#e4dfd2] bg-[#fbf8f0] py-5">
        <div className="premium-container flex flex-wrap items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#3d5a36]">
          {['Fresh stock', 'Secure checkout', 'Plant care help', 'COD available'].map((item) => (
            <span key={item} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2">
              <BadgeCheck size={14} className="text-[#2f6d4c]" />
              {item}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
