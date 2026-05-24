import { Filter, Search, SlidersHorizontal } from 'lucide-react';
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

const baseCategories = ['', 'Indoor Plants', 'Outdoor Plants', 'Flowering Plants', 'Fruit Plants', 'Pots & Planters', 'Seeds', 'Fertilizers', 'Gardening Tools'];

function matchFilter(product, activeFilters) {
  const text = `${product.category || ''} ${product.subcategory || ''} ${product.name || ''} ${product.title || ''} ${(product.tags || []).join(' ')}`.toLowerCase();
  if (!activeFilters.length) return true;
  const checks = {
    'indoor': text.includes('indoor'),
    'outdoor': text.includes('outdoor'),
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
        const data = await getProducts({ page: currentPage, limit: 48, category, search });
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
  }, [category, currentPage, search]);

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

  function changePage(page) {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(page));
    setSearchParams(nextParams);
  }

  const filteredProducts = useMemo(() => {
    const base = products.filter((product) => {
      const price = Number(product.price || 0);
      return price >= priceRange[0] && price <= priceRange[1] && matchFilter(product, activeFilters);
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
  }, [activeFilters, priceRange, products, sortBy]);

  return (
    <section className="premium-container py-10">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-wide text-[#4caf50]">Shop</p>
        <h1 className="mt-2 text-3xl font-black text-[#0b3d1e]">Plants and garden essentials</h1>
      </div>

      <div className="mb-6 grid gap-4 rounded-[1.75rem] border border-[#dbe8d8] bg-white p-4 shadow-soft lg:grid-cols-[1fr_220px_220px_auto]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            className="form-input input-with-leading-icon"
            onChange={(event) => setSearchTerm(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') updateParams({ search: searchTerm });
            }}
            placeholder="Search plants, seeds, tools"
            value={searchTerm}
          />
        </div>
        <select className="form-input" onChange={(event) => updateParams({ category: event.target.value })} value={category}>
          {baseCategories.map((item) => (
            <option key={item || 'all'} value={item}>
              {item || 'All categories'}
            </option>
          ))}
        </select>
        <select className="form-input" onChange={(event) => setSortBy(event.target.value)} value={sortBy}>
          {shopFilters.sortOptions.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <Button onClick={() => updateParams({ search: searchTerm })}><SlidersHorizontal className="mr-2" size={16} /> Search</Button>
      </div>

      <div className="mb-6 grid gap-4 rounded-[1.75rem] border border-[#dbe8d8] bg-[#f8fff5] p-4 shadow-soft">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[#4caf50]">
          <Filter size={16} /> Smart Filters
        </div>
        <div className="flex flex-wrap gap-2">
          {shopFilters.categories.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`rounded-full border px-4 py-2 text-sm font-black transition ${activeFilters.includes(filter) ? 'border-[#0b3d1e] bg-[#0b3d1e] text-white' : 'border-[#dbe8d8] bg-white text-[#0b3d1e] hover:bg-[#eaf7e8]'}`}
              onClick={() => toggleFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <label className="block">
            <div className="mb-2 flex items-center justify-between text-sm font-bold text-[#0b3d1e]">
              <span>Price range</span>
              <span>₹{priceRange[0]} - ₹{priceRange[1]}</span>
            </div>
            <input
              className="w-full accent-[#4caf50]"
              min="99"
              max="9999"
              type="range"
              value={priceRange[1]}
              onChange={(event) => setPriceRange(([min]) => [min, Number(event.target.value)])}
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input className="form-input" min="99" max="9999" type="number" value={priceRange[0]} onChange={(event) => setPriceRange(([, max]) => [Number(event.target.value || 99), max])} />
            <input className="form-input" min="99" max="9999" type="number" value={priceRange[1]} onChange={(event) => setPriceRange(([min]) => [min, Number(event.target.value || 9999)])} />
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} onAddToWishlist={handleWishlist} />
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
    </section>
  );
}
