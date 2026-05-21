import { motion } from 'framer-motion';
import { Eye, Heart, PackageCheck, ShoppingCart, Star, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../ui/Button.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { getProductImage, getProductTitle, getSellerName, handleImageError } from '../../utils/product.js';

function getOldPrice(product) {
  const price = Number(product?.price || 0);
  return Number(product?.oldPrice || product?.originalPrice || product?.mrp || (price ? Math.round(price * 1.18) : 0));
}

function getDiscountLabel(product) {
  const price = Number(product?.price || 0);
  const oldPrice = getOldPrice(product);
  if (!price || oldPrice <= price) return 'Fresh Pick';
  return `${Math.round(((oldPrice - price) / oldPrice) * 100)}% OFF`;
}

function getStockCopy(product) {
  const stock = Number(product?.stock ?? product?.quantity ?? 10);
  if (stock <= 0) return { text: 'Out of stock', tone: 'text-red-700 bg-red-50' };
  if (stock < 5) return { text: `Only ${stock} left`, tone: 'text-amber-700 bg-amber-50' };
  return { text: 'In stock', tone: 'text-emerald-700 bg-emerald-50' };
}

export default function ProductCard({ product, onAddToCart, onAddToWishlist }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const stock = getStockCopy(product);
  const oldPrice = getOldPrice(product);
  const rating = Number(product?.rating || product?.averageRating || 4.8);
  const reviewCount = Number(product?.reviewCount || product?.reviewsCount || 0);
  const isOutOfStock = Number(product?.stock ?? product?.quantity ?? 1) <= 0;

  async function handleBuyNow() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/products/${product._id}` } } });
      return;
    }

    const added = await onAddToCart?.(product);
    if (added === false) return;
    navigate('/checkout');
  }

  return (
    <motion.article
      className="group overflow-hidden rounded-[1.35rem] border border-leaf-100/80 bg-white shadow-[0_18px_50px_rgba(13,31,14,0.08)] transition hover:shadow-[0_28px_80px_rgba(13,31,14,0.16)]"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35 }}
    >
      <div className="relative overflow-hidden bg-leaf-50">
        <Link to={`/products/${product._id}`} className="block">
          <img
            className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-110"
            src={getProductImage(product)}
            alt={getProductTitle(product)}
            loading="lazy"
            decoding="async"
            onError={handleImageError}
          />
        </Link>
        <button
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-leaf-900 shadow-soft backdrop-blur transition hover:bg-leaf-700 hover:text-white"
          onClick={() => onAddToWishlist?.(product)}
          aria-label="Add to wishlist"
        >
          <Heart size={18} />
        </button>
        <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-black text-white shadow-soft">
          {getDiscountLabel(product)}
        </span>
        <Link
          className="absolute bottom-3 left-3 right-3 flex h-10 translate-y-3 items-center justify-center rounded-full bg-white/95 text-sm font-black text-leaf-950 opacity-0 shadow-soft backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          to={`/products/${product._id}`}
        >
          <Eye className="mr-2" size={16} />
          Quick View
        </Link>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-xs font-bold uppercase tracking-[0.18em] text-leaf-600">{product.category || 'Plants'}</p>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black ${stock.tone}`}>{stock.text}</span>
          </div>
          <Link to={`/products/${product._id}`} className="mt-2 block text-lg font-black leading-snug text-leaf-950 transition hover:text-leaf-700">
            {getProductTitle(product)}
          </Link>
          <p className="mt-1 text-sm text-stone-600">{getSellerName(product)}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 font-black text-amber-600">
              <Star className="mr-1" size={14} fill="currentColor" />
              {rating.toFixed(1)}
            </span>
            <span className="text-xs font-bold text-stone-500">{reviewCount ? `${reviewCount} reviews` : 'Premium rated'}</span>
          </div>
          <div className="mt-3 grid gap-2 text-xs font-bold text-stone-600">
            <span className="inline-flex items-center"><Truck className="mr-2 text-leaf-600" size={15} /> Delivery in 2-5 days</span>
            <span className="inline-flex items-center"><PackageCheck className="mr-2 text-leaf-600" size={15} /> Safe nursery packaging</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-leaf-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xl font-black text-leaf-950">{formatCurrency(product.price)}</span>
            {oldPrice > Number(product.price || 0) && <span className="ml-2 text-sm font-bold text-stone-400 line-through">{formatCurrency(oldPrice)}</span>}
          </div>
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <Button
              className="h-11 flex-1 px-4 sm:flex-none sm:px-4"
              disabled={isOutOfStock}
              onClick={() => onAddToCart?.(product)}
              aria-label="Add to cart"
            >
              <ShoppingCart className="mr-2" size={17} />
              Add
            </Button>
            <Button
              className="h-11 flex-1 px-4 sm:flex-none sm:px-4"
              disabled={isOutOfStock}
              onClick={handleBuyNow}
              aria-label="Buy now"
              variant="secondary"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
