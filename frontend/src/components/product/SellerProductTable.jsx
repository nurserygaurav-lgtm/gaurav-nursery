import { Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import Spinner from '../ui/Spinner.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function SellerProductTable({ products, isDeletingId, onDelete }) {
  if (!products.length) {
    return (
      <div className="rounded-lg bg-white p-6 text-center shadow-soft">
        <p className="font-semibold text-leaf-900">No products yet</p>
        <p className="mt-2 text-sm text-stone-600">Add your first plant or garden product to start selling.</p>
        <Link to="/seller/products/new" className="mt-5 inline-block">
          <Button>Add Product</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-soft">
      <div className="hidden grid-cols-[1.5fr_1fr_0.8fr_0.8fr_0.8fr] gap-4 border-b border-leaf-100 px-5 py-3 text-sm font-bold text-leaf-900 md:grid">
        <span>Product</span>
        <span>Category</span>
        <span>Price</span>
        <span>Stock</span>
        <span className="text-right">Actions</span>
      </div>
      <div className="divide-y divide-leaf-100">
        {products.map((product) => (
          <article key={product._id} className="grid gap-4 px-5 py-4 md:grid-cols-[1.5fr_1fr_0.8fr_0.8fr_0.8fr] md:items-center">
            <div className="flex items-center gap-3">
              <img
                className="h-16 w-16 rounded-lg object-cover"
                src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=300&q=80'}
                alt={product.title || product.name}
                loading="lazy"
                decoding="async"
              />
              <div>
                <h2 className="font-bold text-leaf-900">{product.title || product.name}</h2>
                <p className="text-sm text-stone-600">{product.status}</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-stone-700">{product.category}</p>
            <p className="text-sm font-semibold text-leaf-900">{formatCurrency(product.price)}</p>
            <p className={`text-sm font-semibold ${product.stock < 5 ? 'text-red-600' : 'text-stone-700'}`}>{product.stock}</p>
            <div className="flex justify-end gap-2">
              <Link className="rounded-lg p-2 text-leaf-900 hover:bg-leaf-50" to={`/seller/products/${product._id}/edit`} aria-label="Edit product">
                <Edit size={18} />
              </Link>
              <button
                className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isDeletingId === product._id}
                onClick={() => onDelete(product._id)}
                aria-label="Delete product"
              >
                {isDeletingId === product._id ? <Spinner label="" /> : <Trash2 size={18} />}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
