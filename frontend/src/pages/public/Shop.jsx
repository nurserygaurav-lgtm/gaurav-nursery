import {
  BadgePercent,
  Filter,
  Leaf,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Truck
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard.jsx';
import Button from '../../components/ui/Button.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { shopFilters } from '../../data/brandContent.js';
import { useAuth } from '../../hooks/useAuth.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';
import { useToast } from '../../hooks/useToast.js';
import { addToCart } from '../../services/cartService.js';
import { getProducts } from '../../services/productService.js';
import { addToWishlist } from '../../services/wishlistService.js';
import { getApiError } from '../../utils/auth.js';
import { getProductImage, getProductTitle, getSellerName, handleImageError } from '../../utils/product.js';

const baseCategories = ['', 'Indoor Plants', 'Outdoor Plants', 'Flowering Plants', 'Fruit Plants', 'Pots & Planters', 'Seeds', 'Fertilizers', 'Gardening Tools'];

function matchFilter(product, activeFilters) {
  const text = `${product.category || ''} ${product.subcategory || ''} ${getProductTitle(product)} ${getSellerName(product)} ${(product.tags || []).join(' ')}`.toLowerCase();
  if (!activeFilters.length) return true;
  const checks = {
    indoor: text.includes('indoor'),
    outdoor: text.includes('outdoor'),
    'air purifying': text.includes('air purifying') || text.includes('snake') || text.includes('money plant'),
    'pet friendly': text.includes('pet friendly'),
    'low maintenance': text.includes('low maintenance') || text.includes('easy care'),
    'low light': text.includes('low light'),
    flowering: text.includes('flower') || text.includes('bloom'),
    'fruit plants': text.includes('fruit'),
    'balcony plants': text.includes('balcony'),
    'office plants': text.includes('office') || text.includes('desk'),
    'lucky plants': text.includes('lucky') || text.includes('money plant') || text.includes('bamboo'),
    'medicinal plants': text.includes('medicinal') || text.includes('tulsi') || text.includes('aloe')
  };
  return activeFilters.every((filter) => checks[filter.toLowerCase()] ?? true);
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [activeFilters, setActiveFilters] = useState(() => (searchParams.get('filters') || '').split(',').filter(Boolean));
  const [priceRange, setPriceRange] = useState([99, 9999]);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'Popular');
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const currentPage = Number(searchParams.get('page') || 1);
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const seller = searchParams.get('seller') || '';

  usePageMeta({
    title: category || search ? `Shop ${category || search}` : 'Shop',
    description: 'Browse live Gaurav Nursery plants, planters, seeds, tools, and garden essentials.'
  });

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setError('');
        const data = await getProducts({ page: currentPage, limit: 48, category, search, seller });
        if (isMounted) {
          setProducts(data.products || []);
          setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
        }
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
  }, [category, currentPage, search, seller]);

  function updateParams(nextValues) {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(nextValues).forEach(([key, value]) => {
      if (value) nextParams.set(key, value);
      else nextParams.delete(key);
    });
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  }

  function toggleFilter(filter) {
    setActiveFilters((current) => {
      const next = current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter];
      const nextParams = new URLSearchParams(searchParams);
      if (next.length) nextParams.set('filters', next.join(','));
      else nextParams.delete('filters');
      nextParams.set('page', '1');
      setSearchParams(nextParams);
      return next;
    });
  }

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

  function changePage(page) {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(page));
    setSearchParams(nextParams);
  }

  const filteredProducts = useMemo(() => {
    const base = products.filter((product) => {
      const price = Number(product.price || 0);
      const sellerMatch = !seller || getSellerName(product).toLowerCase().includes(seller.toLowerCase());
      return price >= priceRange[0] && price <= priceRange[1] && sellerMatch && matchFilter(product, activeFilters);
    });

    const sorted = [...base];
    switch (sortBy) {
      case 'Price Low to High':
        sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        break;
      case 'Price High to Low':
        sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        break;
      case 'Best Selling':
        sorted.sort((a, b) => Number(b.stock || 0) - Number(a.stock || 0));
        break;
      case 'New Arrivals':
        sorted.reverse();
        break;
      default:
        break;
    }
    return sorted;
  }, [activeFilters, priceRange, products, seller, sortBy]);

  const previewProducts = filteredProducts.slice(0, 3);
  const cartPreviewTotal = previewProducts.reduce((sum, product) => sum + Number(product.price || 0), 0);

  return (
    <section className="bg-[#e6ebe3] py-6 sm:py-10">
      <div className="premium-container">
        <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-[#f9fbf7] p-3 shadow-[0_28px_90px_rgba(33,45,33,0.16)] sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[5rem_minmax(0,1fr)_21rem]">
            <aside className="hidden rounded-[1.5rem] bg-white/85 p-3 shadow-soft lg:block">
              <div className="flex h-full flex-col items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#10210f] text-white">
                  <Leaf size={19} />
                </span>
                {['Order', 'Promo', 'Product'].map((item, index) => (
                  <button
                    key={item}
                    type="button"
                    className={`w-full rounded-2xl px-2 py-3 text-xs font-black transition ${index === 0 ? 'bg-[#2fd080] text-white shadow-button' : 'text-slate-500 hover:bg-[#eef6ec] hover:text-[#0b3d1e]'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </aside>

            <main className="min-w-0">
              <div className="relative overflow-hidden rounded-[1.75rem] bg-[#efdcd2] p-5 sm:p-7">
                <div className="relative z-10 max-w-xl">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#60745d]">Fresh nursery store</p>
                  <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,4.3rem)] font-black leading-[1.02] text-[#10210f]">
                    Plants for interior decoration
                  </h1>
                  <p className="mt-3 max-w-md text-sm font-semibold leading-6 text-[#586556]">
                    Browse healthy live plants, planters, seeds, and gardening essentials with clean filters and fast checkout.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button className="h-11 rounded-full bg-[#10210f] px-5 text-sm font-black hover:bg-[#315f2e]" onClick={() => updateParams({ search: searchTerm })}>
                      Start from Rs. 99
                    </Button>
                    <span className="inline-flex h-11 items-center rounded-full bg-white/70 px-4 text-sm font-black text-[#10210f]">
                      {pagination.total || filteredProducts.length} Products
                    </span>
                  </div>
                </div>
                <img
                  className="absolute bottom-0 right-2 hidden h-[92%] max-w-[44%] object-cover opacity-90 mix-blend-multiply drop-shadow-[0_25px_35px_rgba(16,33,15,0.18)] md:block"
                  src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=85"
                  alt="Decorative potted plant"
                  onError={handleImageError}
                />
              </div>

              <div className="mt-4 grid gap-4 rounded-[1.5rem] border border-[#e4ebe0] bg-white/90 p-3 shadow-soft xl:grid-cols-[1fr_190px_190px_auto]">
                <label className="relative">
                  <span className="sr-only">Search products</span>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input
                    className="h-12 w-full rounded-2xl border border-[#e1e9dd] bg-[#f7faf5] px-12 text-sm font-bold text-[#10210f] outline-none transition focus:border-[#2fd080] focus:bg-white focus:ring-4 focus:ring-[#2fd080]/15"
                    onChange={(event) => setSearchTerm(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') updateParams({ search: searchTerm });
                    }}
                    placeholder="Search Monstera, Areca, Seeds..."
                    value={searchTerm}
                  />
                </label>
                <select className="h-12 rounded-2xl border border-[#e1e9dd] bg-[#f7faf5] px-4 text-sm font-black text-[#10210f] outline-none" onChange={(event) => updateParams({ category: event.target.value })} value={category}>
                  {baseCategories.map((item) => (
                    <option key={item || 'all'} value={item}>
                      {item || 'All categories'}
                    </option>
                  ))}
                </select>
                <select className="h-12 rounded-2xl border border-[#e1e9dd] bg-[#f7faf5] px-4 text-sm font-black text-[#10210f] outline-none" onChange={(event) => setSortBy(event.target.value)} value={sortBy}>
                  {shopFilters.sortOptions.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
                <Button className="h-12 rounded-2xl bg-[#10210f] px-5" onClick={() => updateParams({ search: searchTerm })}>
                  <SlidersHorizontal className="mr-2" size={16} /> Search
                </Button>
              </div>

              <div className="mt-4 rounded-[1.5rem] border border-[#e4ebe0] bg-white/80 p-3 shadow-soft">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#60745d]">
                    <Filter size={15} /> Smart filters
                  </div>
                  <span className="rounded-full bg-[#eef6ec] px-3 py-1 text-xs font-black text-[#0b3d1e]">
                    Rs. {priceRange[0]} - Rs. {priceRange[1]}
                  </span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {shopFilters.categories.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      className={`shrink-0 rounded-full border px-4 py-2 text-sm font-black transition ${activeFilters.includes(filter) ? 'border-[#10210f] bg-[#10210f] text-white' : 'border-[#e1e9dd] bg-white text-[#475447] hover:bg-[#eef6ec]'}`}
                      onClick={() => toggleFilter(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <input
                  className="mt-2 w-full accent-[#2fd080]"
                  min="99"
                  max="9999"
                  type="range"
                  value={priceRange[1]}
                  onChange={(event) => setPriceRange(([min]) => [min, Number(event.target.value)])}
                />
              </div>

              <div className="mt-5">
                {isLoading && (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <Skeleton key={index} className="h-80 rounded-[1.5rem]" />
                    ))}
                  </div>
                )}
                {error && <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
                {!isLoading && !error && !filteredProducts.length && (
                  <div className="rounded-[1.5rem] bg-white p-8 text-center shadow-soft">
                    <p className="font-bold text-[#0b3d1e]">No products found</p>
                    <p className="mt-2 text-sm text-stone-600">Try a different search, filter, or category.</p>
                  </div>
                )}
                {!isLoading && !error && !!filteredProducts.length && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                      {filteredProducts.map((product) => (
                        <ProductCard key={product._id || product.id} product={product} onAddToCart={handleAddToCart} onAddToWishlist={handleWishlist} />
                      ))}
                    </div>
                    <div className="mt-8 flex items-center justify-center gap-3">
                      <Button disabled={pagination.page <= 1} onClick={() => changePage(pagination.page - 1)} variant="outline">
                        Previous
                      </Button>
                      <span className="text-sm font-bold text-[#0b3d1e]">
                        Page {pagination.page} of {pagination.pages}
                      </span>
                      <Button disabled={pagination.page >= pagination.pages} onClick={() => changePage(pagination.page + 1)} variant="outline">
                        Next
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </main>

            <aside className="rounded-[1.75rem] border border-[#e4ebe0] bg-white p-4 shadow-soft lg:sticky lg:top-28 lg:self-start">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#60745d]">Order Details</p>
                  <h2 className="mt-1 text-xl font-black text-[#10210f]">Mini Cart</h2>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef6ec] text-[#0b3d1e]">
                  <ShoppingCart size={19} />
                </span>
              </div>

              <div className="mt-5 grid gap-3">
                {previewProducts.length ? previewProducts.map((product) => (
                  <div key={product._id || product.id} className="grid grid-cols-[3.75rem_1fr_auto] items-center gap-3 rounded-2xl bg-[#f7faf5] p-2">
                    <img
                      className="h-14 w-14 rounded-xl object-cover"
                      src={getProductImage(product)}
                      alt={getProductTitle(product)}
                      onError={handleImageError}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-[#10210f]">{getProductTitle(product)}</p>
                      <p className="text-xs font-bold text-[#72906e]">{product.category || 'Plant'}</p>
                    </div>
                    <p className="text-sm font-black text-[#10210f]">Rs. {Number(product.price || 0)}</p>
                  </div>
                )) : (
                  <p className="rounded-2xl bg-[#f7faf5] p-4 text-sm font-bold text-slate-500">Products will appear here after loading.</p>
                )}
              </div>

              <div className="mt-5 rounded-2xl bg-[#10210f] p-4 text-white">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Subtotal preview</span>
                  <span className="font-black">Rs. {cartPreviewTotal}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-white/70">Delivery</span>
                  <span className="font-black">Free over Rs. 499</span>
                </div>
                <Button className="mt-4 h-11 w-full rounded-xl bg-[#2fd080] font-black text-[#10210f] hover:bg-[#74e3a9]" onClick={() => navigate('/cart')}>
                  View Cart
                </Button>
              </div>

              <div className="mt-5 grid gap-3 text-sm font-bold text-[#475447]">
                {[
                  { icon: Truck, text: 'Fast dispatch in 24h' },
                  { icon: PackageCheck, text: 'Safe live plant packaging' },
                  { icon: ShieldCheck, text: 'Secure payment options' },
                  { icon: BadgePercent, text: 'Deals and smart filters' },
                  { icon: Sparkles, text: 'Fresh nursery quality' }
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 rounded-2xl bg-[#f7faf5] p-3">
                    <item.icon className="text-[#2f8f5b]" size={17} />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
