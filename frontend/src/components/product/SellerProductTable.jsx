import { Edit, SlidersHorizontal, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import Spinner from '../ui/Spinner.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { StatusPill, TableToolbar } from '../dashboard/DashboardUI.jsx';

export default function SellerProductTable({ products, isDeletingId, onDelete, showToolbar = false }) {
  if (!products.length) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-soft">
        <p className="font-black text-leaf-950">No products yet</p>
        <p className="mt-2 text-sm text-stone-600">Add your first plant or garden product to start selling.</p>
        <Link to="/seller/products/new" className="mt-5 inline-block">
          <Button>Add Product</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {showToolbar && (
        <TableToolbar
          placeholder="Search products, SKU, category"
          right={
            <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-leaf-100 bg-white px-4 text-sm font-black text-leaf-900 shadow-soft">
              <SlidersHorizontal size={17} />
              Filters
            </button>
          }
        />
      )}
      <div className="overflow-hidden rounded-3xl border border-leaf-100 bg-white shadow-soft">
        <div className="hidden grid-cols-[1.45fr_0.75fr_0.65fr_0.7fr_0.75fr_0.65fr_0.6fr] gap-4 border-b border-leaf-100 bg-leaf-50/70 px-5 py-4 text-xs font-black uppercase tracking-[0.16em] text-leaf-800 xl:grid">
          <span>Product</span>
          <span>SKU</span>
          <span>Stock</span>
          <span>Price</span>
          <span>Category</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-leaf-100">
          {products.map((product) => {
            const stock = Number(product.stock || 0);
            const sku = product.sku || `GN-${String(product._id || product.name || '0000').slice(-4).toUpperCase()}`;
            return (
              <article key={product._id} className="grid gap-4 px-5 py-4 xl:grid-cols-[1.45fr_0.75fr_0.65fr_0.7fr_0.75fr_0.65fr_0.6fr] xl:items-center">
                <div className="flex items-center gap-3">
                  <img
                    className="h-16 w-16 rounded-2xl object-cover"
                    src={product.images?.[0]?.url || product.image || 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=300&q=80'}
                    alt={product.title || product.name}
                    loading="lazy"
                    decoding="async"
                  />
                  <div>
                    <h2 className="font-black leading-tight text-leaf-950">{product.title || product.name}</h2>
                    <p className="mt-1 text-sm text-stone-500 xl:hidden">{product.category} · {sku}</p>
                  </div>
                </div>
                <p className="hidden text-sm font-bold text-stone-600 xl:block">{sku}</p>
                <p className={`text-sm font-black ${stock < 5 ? 'text-red-600' : 'text-leaf-900'}`}>{stock} units</p>
                <p className="text-sm font-black text-leaf-950">{formatCurrency(product.price)}</p>
                <p className="hidden text-sm font-bold text-stone-600 xl:block">{product.category}</p>
                <StatusPill status={stock < 5 ? 'low stock' : product.status || 'active'} />
                <div className="flex justify-end gap-2">
                  <Link className="rounded-full p-2 text-leaf-900 transition hover:bg-leaf-50" to={`/seller/products/${product._id}/edit`} aria-label="Edit product">
                    <Edit size={18} />
                  </Link>
                  <button
                    className="rounded-full p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isDeletingId === product._id}
                    onClick={() => onDelete(product._id)}
                    aria-label="Delete product"
                  >
                    {isDeletingId === product._id ? <Spinner label="" /> : <Trash2 size={18} />}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
