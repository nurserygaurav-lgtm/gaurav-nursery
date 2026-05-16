import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../ui/Button.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { getProductImage, getProductTitle, getSellerName } from '../../utils/product.js';

export default function ProductCard({ product, onAddToCart, onAddToWishlist }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  function handleBuyNow() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/products/${product._id}` } } });
      return;
    }

    navigate('/checkout');
  }

  return (
    <motion.article
      className="group overflow-hidden rounded-3xl border border-leaf-100/80 bg-white shadow-soft transition hover:shadow-card"
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
          />
        </Link>
        <button
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-leaf-900 shadow-soft backdrop-blur transition hover:bg-leaf-700 hover:text-white"
          onClick={() => onAddToWishlist?.(product)}
          aria-label="Add to wishlist"
        >
          <Heart size={18} />
        </button>
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-leaf-800 shadow-soft backdrop-blur">
          Bestseller
        </span>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-600">{product.category}</p>
          <Link to={`/products/${product._id}`} className="mt-2 block text-lg font-black leading-snug text-leaf-950 transition hover:text-leaf-700">
            {getProductTitle(product)}
          </Link>
          <p className="mt-1 text-sm text-stone-600">{getSellerName(product)}</p>
        </div>
        <div className="flex flex-col gap-3 border-t border-leaf-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xl font-black text-leaf-950">{formatCurrency(product.price)}</span>
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <Button
              className="h-11 flex-1 px-4 sm:flex-none sm:px-4"
              onClick={() => onAddToCart?.(product)}
              aria-label="Add to cart"
            >
              <ShoppingCart className="mr-2" size={17} />
              Add
            </Button>
            <Button
              className="h-11 flex-1 px-4 sm:flex-none sm:px-4"
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
