import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { getProductImage, getProductTitle, getSellerName } from '../../utils/product.js';

export default function ProductCard({ product, onAddToCart, onAddToWishlist }) {
  return (
    <article className="overflow-hidden rounded-lg border border-leaf-100 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/products/${product._id}`} className="block">
        <img
          className="aspect-[4/3] w-full object-cover"
          src={getProductImage(product)}
          alt={getProductTitle(product)}
          loading="lazy"
          decoding="async"
        />
      </Link>
      <div className="space-y-4 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-leaf-600">{product.category}</p>
          <Link to={`/products/${product._id}`} className="mt-1 block text-lg font-bold text-leaf-900">
            {getProductTitle(product)}
          </Link>
          <p className="mt-1 text-sm text-stone-600">{getSellerName(product)}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xl font-bold text-leaf-900">{formatCurrency(product.price)}</span>
          <div className="flex gap-2">
            <Button variant="secondary" className="h-11 w-11 p-0" onClick={() => onAddToWishlist?.(product)} aria-label="Add to wishlist">
              <Heart size={18} />
            </Button>
            <Button className="h-11 w-11 p-0" onClick={() => onAddToCart?.(product)} aria-label="Add to cart">
              <ShoppingCart size={18} />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
