import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard.jsx';
import Button from '../../components/ui/Button.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { addToCart } from '../../services/cartService.js';
import { getProducts } from '../../services/productService.js';
import { addToWishlist } from '../../services/wishlistService.js';
import { getApiError } from '../../utils/auth.js';

const categories = ['', 'Indoor Plants', 'Flowering Plants', 'Fruit Plants', 'Seeds', 'Planters', 'Garden Tools'];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const currentPage = Number(searchParams.get('page') || 1);
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setError('');
        const data = await getProducts({ page: currentPage, limit: 12, category, search });
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

  function updateFilters(nextValues) {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(nextValues).forEach(([key, value]) => {
      if (value) nextParams.set(key, value);
      else nextParams.delete(key);
    });
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  }

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

  function changePage(page) {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(page));
    setSearchParams(nextParams);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-wide text-leaf-600">Shop</p>
        <h1 className="mt-2 text-3xl font-black text-leaf-900">Plants and Garden Essentials</h1>
      </div>

      <div className="mb-8 grid gap-3 rounded-lg bg-white p-4 shadow-soft md:grid-cols-[1fr_220px_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 text-stone-400" size={18} />
          <input
            className="form-input pl-10"
            onChange={(event) => setSearchTerm(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') updateFilters({ search: searchTerm });
            }}
            placeholder="Search plants, seeds, tools"
            value={searchTerm}
          />
        </div>
        <select className="form-input" onChange={(event) => updateFilters({ category: event.target.value })} value={category}>
          {categories.map((item) => (
            <option key={item || 'all'} value={item}>
              {item || 'All categories'}
            </option>
          ))}
        </select>
        <Button onClick={() => updateFilters({ search: searchTerm })}>Search</Button>
      </div>

      {isLoading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-80" />
          ))}
        </div>
      )}
      {error && <p className="rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
      {!isLoading && !error && !products.length && (
        <div className="rounded-lg bg-white p-8 text-center shadow-soft">
          <p className="font-bold text-leaf-900">No products found</p>
          <p className="mt-2 text-sm text-stone-600">Try a different search or category.</p>
        </div>
      )}
      {!isLoading && !error && !!products.length && (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} onAddToWishlist={handleWishlist} />
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button disabled={pagination.page <= 1} onClick={() => changePage(pagination.page - 1)} variant="outline">
              Previous
            </Button>
            <span className="text-sm font-bold text-leaf-900">
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
