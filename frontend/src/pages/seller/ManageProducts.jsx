import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import SellerProductTable from '../../components/product/SellerProductTable.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useSellerProducts } from '../../hooks/useSellerProducts.js';
import { useToast } from '../../hooks/useToast.js';
import { deleteProduct } from '../../services/productService.js';
import { getApiError } from '../../utils/auth.js';

export default function ManageProducts() {
  const { products, setProducts, isLoading, error } = useSellerProducts();
  const [isDeletingId, setIsDeletingId] = useState('');
  const { showToast } = useToast();

  async function handleDelete(productId) {
    const confirmed = window.confirm('Delete this product listing?');
    if (!confirmed) return;

    try {
      setIsDeletingId(productId);
      await deleteProduct(productId);
      setProducts((current) => current.filter((product) => product._id !== productId));
      showToast('Product deleted');
    } catch (err) {
      showToast(getApiError(err, 'Unable to delete product'), 'error');
    } finally {
      setIsDeletingId('');
    }
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-leaf-600">Product management</p>
          <h1 className="mt-2 text-3xl font-black text-leaf-950">Manage Products</h1>
          <p className="mt-2 text-sm text-stone-600">Edit pricing, stock, images, and availability for your listings.</p>
        </div>
        <Link to="/seller/products/new">
          <Button>
            <Plus className="mr-2" size={18} />
            Add Product
          </Button>
        </Link>
      </div>
      <div className="mt-6">
        {isLoading && (
          <div className="rounded-3xl bg-white p-6 text-leaf-700 shadow-soft">
            <Spinner label="Loading products" />
          </div>
        )}
        {error && <p className="rounded-3xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
        {!isLoading && !error && <SellerProductTable products={products} isDeletingId={isDeletingId} onDelete={handleDelete} showToolbar />}
      </div>
    </section>
  );
}
