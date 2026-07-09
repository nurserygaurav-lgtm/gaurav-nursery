import { motion } from 'framer-motion';
import { Eye, Heart, Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { getProductImage, getProductTitle, getSellerName, handleImageError } from '../../utils/product.js';

function getOldPrice(product) {
  const price = Number(product?.price || 0);
  return Number(product?.oldPrice || product?.originalPrice || product?.mrp || Math.round(price * 1.25));
}

function getDiscountLabel(product) {
  const price = Number(product?.price || 0);
  const oldPrice = getOldPrice(product);
  if (!price || oldPrice <= price) return 'Fresh';
  return `${Math.round(((oldPrice - price) / oldPrice) * 100)}% Stocks`;
}

function getStockCopy(product) {
  const stock = Number(product?.stock ?? product?.quantity ?? 12);
  if (stock <= 0) return { text: 'Out', tone: 'bg-red-50 text-red-700' };
  if (stock < 5) return { text: `${stock} left`, tone: 'bg-amber-50 text-amber-700' };
  return { text: 'In stock', tone: 'bg-[#eaf8ef] text-[#16864f]' };
}

export default function ProductCard({ product, onAddToCart, onAddToWishlist }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const productId = product?._id || product?.id;
  const stock = getStockCopy(product);
  const isOutOfStock = Number(product?.stock ?? product?.quantity ?? 1) <= 0;
  const rating = Number(product?.rating || 4.8);

  if (!productId) return null;

  async function handleBuyNow() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/products/${productId}` } } });
      return;
    }

    const added = await onAddToCart?.(product);
    if (added === false) return;
    navigate('/checkout');
  }

  return (
    <motion.article
      className="group relative overflow-hidden rounded-[1.6rem] border border-[#edf2ea] bg-white shadow-[0_18px_55px_rgba(27,41,27,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(27,41,27,0.16)]"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
    >
      <div className="relative bg-[#f2f6ef] p-3">
        <Link to={`/products/${productId}`} className="block overflow-hidden rounded-[1.25rem] bg-white">
          <img
            className="aspect-[1.05/1] w-full object-cover transition duration-700 group-hover:scale-105"
            src={getProductImage(product)}
            alt={getProductTitle(product)}
            loading="lazy"
            decoding="async"
            onError={handleImageError}
          />
        </Link>

        <div className="absolute left-5 top-5 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-black text-[#16864f] shadow-soft">
          <Star size={12} fill="currentColor" /> {rating.toFixed(1)}
        </div>

        <button
          type="button"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#10210f] shadow-soft transition hover:bg-[#10210f] hover:text-white"
          onClick={() => onAddToWishlist?.(product)}
          aria-label="Add to wishlist"
        >
          <Heart size={17} />
        </button>

        <Link
          className="absolute inset-x-5 bottom-5 flex translate-y-3 items-center justify-center rounded-full bg-[#10210f] py-2.5 text-xs font-black text-white opacity-0 shadow-soft transition group-hover:translate-y-0 group-hover:opacity-100"
          to={`/products/${productId}`}
        >
          <Eye className="mr-2" size={15} /> Quick View
        </Link>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-[11px] font-black uppercase tracking-[0.16em] text-[#7b8a77]">{product.category || 'Plants'}</span>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${stock.tone}`}>{stock.text}</span>
        </div>

        <Link to={`/products/${productId}`} className="mt-3 block min-h-12 text-base font-black leading-snug text-[#10210f] transition hover:text-[#2f8f5b]">
          {getProductTitle(product)}
        </Link>

        <p className="mt-1 truncate text-xs font-bold text-slate-400">{getSellerName(product)}</p>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-black text-[#10210f]">Rs. {Number(product.price || 0)}</p>
            <p className="text-xs font-black text-[#1cb86a]">{getDiscountLabel(product)}</p>
          </div>
          <div className="flex items-center rounded-full bg-[#f1f6ee] p-1">
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-[#60745d]" type="button" aria-label="Decrease quantity">
              <Minus size={14} />
            </button>
            <span className="w-5 text-center text-sm font-black text-[#10210f]">1</span>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#10210f] shadow-soft" type="button" aria-label="Increase quantity">
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-[1fr_3rem] gap-2">
          <button
            type="button"
            className="h-11 rounded-2xl border border-[#e1e9dd] bg-white text-sm font-black text-[#10210f] transition hover:bg-[#f7faf5] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isOutOfStock}
            onClick={handleBuyNow}
          >
            Buy Now
          </button>
          <button
            type="button"
            className="flex h-11 items-center justify-center rounded-2xl bg-[#10210f] text-white shadow-button transition hover:bg-[#2f8f5b] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isOutOfStock}
            onClick={() => onAddToCart?.(product)}
            aria-label="Add to cart"
          >
            <ShoppingCart size={17} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
