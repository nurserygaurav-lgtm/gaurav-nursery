import { motion } from 'framer-motion';
import { Eye, Heart, PackageCheck, ShoppingCart, Truck, Watch } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../ui/Button.jsx';
import { getProductImage, getProductTitle, getSellerName, handleImageError } from '../../utils/product.js';

function getOldPrice(product) {
  const price = Number(product?.price || 0);
  return Number(product?.oldPrice || product?.originalPrice || product?.mrp || Math.round(price * 1.25));
}

function getDiscountLabel(product) {
  const price = Number(product?.price || 0);
  const oldPrice = getOldPrice(product);
  if (!price || oldPrice <= price) return 'Best Value';
  return `${Math.round(((oldPrice - price) / oldPrice) * 100)}% OFF`;
}

function getStockCopy(product) {
  const stock = Number(product?.stock ?? product?.quantity ?? 12);
  if (stock <= 0) return { text: 'Out of stock', tone: 'text-red-700 bg-red-50' };
  if (stock < 5) return { text: `Only ${stock} left`, tone: 'text-amber-700 bg-amber-50' };
  return { text: 'In stock', tone: 'text-emerald-700 bg-emerald-50' };
}

export default function ProductCard({ product, onAddToCart, onAddToWishlist }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const stock = getStockCopy(product);
  const isOutOfStock = Number(product?.stock ?? product?.quantity ?? 1) <= 0;
  const size = product?.size || 'M';
  const water = product?.waterLevel || 'Moderate';
  const sunlight = product?.sunlight || 'Partial';

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
      className="group relative overflow-hidden rounded-[2rem] border border-[#e7efe4] bg-white shadow-[0_18px_60px_rgba(11,61,14,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_85px_rgba(11,61,14,0.16)]"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
    >
      <div className="relative overflow-hidden">
        <Link to={`/products/${product._id}`} className="block">
          <img
            className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
            src={getProductImage(product)}
            alt={getProductTitle(product)}
            loading="lazy"
            decoding="async"
            onError={handleImageError}
          />
        </Link>
        <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
          <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#0b3d1e] shadow-soft">{getDiscountLabel(product)}</span>
          <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#0b3d1e] shadow-soft">COD</span>
        </div>
        <button
          type="button"
          className="absolute right-4 top-16 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#0b3d1e] shadow-soft backdrop-blur transition hover:bg-[#4caf50] hover:text-white"
          onClick={() => onAddToWishlist?.(product)}
          aria-label="Add to wishlist"
        >
          <Heart size={18} />
        </button>
        <Link
          className="absolute bottom-4 left-4 right-4 hidden items-center justify-center rounded-full bg-white/95 py-3 text-sm font-black text-[#0b3d1e] shadow-soft transition duration-300 group-hover:flex"
          to={`/products/${product._id}`}
        >
          <Eye className="mr-2" size={16} /> Quick View
        </Link>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-xs font-black uppercase tracking-[0.18em] text-[#4f7a58]">{product.category || 'Plants'}</span>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${stock.tone}`}>{stock.text}</span>
        </div>
        <Link to={`/products/${product._id}`} className="block truncate text-xl font-black leading-tight text-[#10210f] transition hover:text-[#3d7d36]">
          {getProductTitle(product)}
        </Link>
        <p className="text-sm text-stone-500">{getSellerName(product)}</p>
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#3a5f38]">
          <span className="rounded-full bg-[#eff7ef] px-3 py-1 font-black">Live plant</span>
          <span className="rounded-full bg-[#eff7ef] px-3 py-1 font-black">Safe packaging</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#526f58]">
          <span className="rounded-2xl bg-[#f2fbf1] px-2 py-2">Size {size}</span>
          <span className="rounded-2xl bg-[#f2fbf1] px-2 py-2">{water} water</span>
          <span className="rounded-2xl bg-[#f2fbf1] px-2 py-2">{sunlight}</span>
        </div>
        <div className="grid gap-3 rounded-[1.75rem] border border-[#e2e9de] bg-[#f6fbf6] p-4 text-sm text-[#364f3d] shadow-sm">
          <div className="flex items-center gap-2">
            <Truck size={16} className="text-[#4caf50]" />
            <span>Delivery estimate 2-4 days</span>
          </div>
          <div className="flex items-center gap-2">
            <PackageCheck size={16} className="text-[#4caf50]" />
            <span>Free shipping above ₹499</span>
          </div>
          <div className="flex items-center gap-2">
            <Watch size={16} className="text-[#4caf50]" />
            <span>Fresh dispatch within 24h</span>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="primary" className="h-12 w-full" disabled={isOutOfStock} onClick={() => onAddToCart?.(product)}>
            <ShoppingCart size={16} /> Add
          </Button>
          <Button variant="outline" className="h-12 w-full" disabled={isOutOfStock} onClick={handleBuyNow}>
            Buy Now
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
