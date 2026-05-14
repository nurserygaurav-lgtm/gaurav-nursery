import { ShoppingCart, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useToast } from '../../hooks/useToast.js';
import { addToCart } from '../../services/cartService.js';
import { getWishlist, removeFromWishlist } from '../../services/wishlistService.js';
import { getApiError } from '../../utils/auth.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { getProductImage, getProductTitle } from '../../utils/product.js';

export default function Wishlist() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;

    async function loadWishlist() {
      try {
        const data = await getWishlist();
        if (isMounted) setProducts(data.wishlist.products || []);
      } catch (err) {
        if (isMounted) setError(getApiError(err, 'Unable to load wishlist'));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadWishlist();
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleRemove(productId) {
    try {
      setUpdatingId(productId);
      const data = await removeFromWishlist(productId);
      setProducts(data.wishlist.products || []);
      showToast('Removed from wishlist');
    } catch (err) {
      showToast(getApiError(err, 'Unable to update wishlist'), 'error');
    } finally {
      setUpdatingId('');
    }
  }

  async function handleAddToCart(productId) {
    try {
      setUpdatingId(productId);
      await addToCart(productId, 1);
      showToast('Added to cart');
    } catch (err) {
      showToast(getApiError(err, 'Unable to add to cart'), 'error');
    } finally {
      setUpdatingId('');
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black text-leaf-900">Wishlist</h1>
      {isLoading && (
        <div className="mt-6 rounded-lg bg-white p-6 text-leaf-700 shadow-soft">
          <Spinner label="Loading wishlist" />
        </div>
      )}
      {error && <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
      {!isLoading && !error && !products.length && (
        <div className="mt-6 rounded-lg bg-white p-8 text-center shadow-soft">
          <p className="font-bold text-leaf-900">No saved products</p>
          <p className="mt-2 text-sm text-stone-600">Save products you want to revisit later.</p>
          <Link className="mt-5 inline-block" to="/shop">
            <Button>Browse Shop</Button>
          </Link>
        </div>
      )}
      {!isLoading && !error && !!products.length && (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article key={product._id} className="rounded-lg bg-white p-4 shadow-soft">
              <Link to={`/products/${product._id}`}>
                <img className="aspect-[4/3] w-full rounded-lg object-cover" src={getProductImage(product)} alt={getProductTitle(product)} />
              </Link>
              <h2 className="mt-4 font-bold text-leaf-900">{getProductTitle(product)}</h2>
              <p className="mt-1 text-sm text-stone-600">{product.category}</p>
              <p className="mt-3 text-lg font-black text-leaf-900">{formatCurrency(product.price)}</p>
              <div className="mt-4 flex gap-2">
                <Button className="flex-1" disabled={updatingId === product._id} onClick={() => handleAddToCart(product._id)}>
                  <ShoppingCart className="mr-2" size={18} />
                  Cart
                </Button>
                <Button variant="outline" disabled={updatingId === product._id} onClick={() => handleRemove(product._id)}>
                  <Trash2 size={18} />
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
