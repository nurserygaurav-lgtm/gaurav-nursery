import { useEffect, useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useToast } from '../../hooks/useToast.js';
import { deleteTodayProducts, getProducts } from '../../services/productService.js';
import { getApiError } from '../../utils/auth.js';

export default function AdminProducts() {
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeletingToday, setIsDeletingToday] = useState(false);

  async function loadProducts() {
    try {
      setIsLoading(true);
      setError('');
      // Backend getProducts is GET /products and supports query params.
      const data = await getProducts({ page: 1, limit: 48 });
      setProducts(data.products || []);
    } catch (err) {
      setError(getApiError(err, 'Unable to load products'));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDeleteToday() {
    const confirmed = window.confirm('Delete all products uploaded today? This cannot be undone.');
    if (!confirmed) return;

    try {
      setIsDeletingToday(true);
      console.log('[admin] hitting delete-today-products endpoint...');
      const result = await deleteTodayProducts();
      console.log('[admin] deleteTodayProducts result:', result);
      showToast(`Deleted ${result?.deletedCount ?? 0} products`);
      await loadProducts();
    } catch (err) {
      showToast(getApiError(err, 'Failed to delete today products'), 'error');
      console.error('[admin] deleteTodayProducts error:', err);
    } finally {
      setIsDeletingToday(false);
    }
  }

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
        <Button variant="outline" onClick={handleDeleteToday} disabled={isDeletingToday || isLoading}>
          {isDeletingToday ? <Spinner label="" /> : 'Delete Today Uploads'}
        </Button>
      </div>

      {isLoading && (
        <div className="rounded-3xl bg-white p-6 text-leaf-700 shadow-soft">
          <Spinner label="Loading products" />
        </div>
      )}

      {error && <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}

      {!isLoading && !error && (
        <div className="overflow-hidden rounded-3xl border border-leaf-100 bg-white">
          <div className="hidden grid-cols-[1.6fr_0.7fr_0.7fr_1fr_0.8fr] gap-4 border-b border-leaf-100 bg-leaf-50/70 px-5 py-4 text-xs font-black uppercase tracking-[0.16em] text-leaf-800 xl:grid">
            <span>Product</span>
            <span>SKU</span>
            <span>Stock</span>
            <span>Category</span>
            <span>Status</span>
          </div>

          <div className="divide-y divide-leaf-100">
            {products.map((p) => {
              const sku = p.sku || `GN-${String(p._id || p.name || '0000').slice(-4).toUpperCase()}`;
              const stock = Number(p.stock || 0);
              return (
                <article
                  key={p._id}
                  className="grid gap-4 px-5 py-4 xl:grid-cols-[1.6fr_0.7fr_0.7fr_1fr_0.8fr] xl:items-center"
                >
                  <div>
                    <p className="font-black text-leaf-950">{p.title || p.name}</p>
                    <p className="mt-1 text-sm text-stone-500 xl:hidden">{p.category}</p>
                  </div>
                  <p className="text-sm font-bold text-stone-600">{sku}</p>
                  <p className={`text-sm font-black ${stock < 5 ? 'text-red-600' : 'text-leaf-900'}`}>{stock} units</p>
                  <p className="text-sm font-bold text-stone-600">{p.category}</p>
                  <p className="text-sm font-black text-leaf-950">{p.status || 'active'}</p>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}


