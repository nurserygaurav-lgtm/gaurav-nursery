import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import QuantityControl from './QuantityControl.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { getProductImage, getProductTitle } from '../../utils/product.js';

export default function CartItem({ item, isUpdating, onRemove, onQuantityChange }) {
  const product = item.product;

  return (
    <article className="grid gap-4 rounded-lg bg-white p-4 shadow-soft sm:grid-cols-[96px_1fr_auto] sm:items-center">
      <Link to={`/products/${product._id}`}>
        <img className="h-24 w-24 rounded-lg object-cover" src={getProductImage(product)} alt={getProductTitle(product)} loading="lazy" decoding="async" />
      </Link>
      <div>
        <Link to={`/products/${product._id}`} className="font-bold text-leaf-900">
          {getProductTitle(product)}
        </Link>
        <p className="mt-1 text-sm text-stone-600">{product.category}</p>
        <p className="mt-2 font-bold text-leaf-900">{formatCurrency(product.price)}</p>
      </div>
      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
        <QuantityControl disabled={isUpdating} max={product.stock} onChange={(quantity) => onQuantityChange(product._id, quantity)} value={item.quantity} />
        <button className="rounded-lg p-2 text-red-600 hover:bg-red-50" disabled={isUpdating} onClick={() => onRemove(product._id)} type="button" aria-label="Remove item">
          <Trash2 size={18} />
        </button>
      </div>
    </article>
  );
}
