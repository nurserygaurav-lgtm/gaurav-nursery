import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CartItem from '../../components/cart/CartItem.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useToast } from '../../hooks/useToast.js';
import { getCart, removeCartItem, updateCartItem } from '../../services/cartService.js';
import { getApiError } from '../../utils/auth.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function Cart() {
  const [cart, setCart] = useState({ items: [] });
  const [summary, setSummary] = useState({ subtotal: 0, itemCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;

    async function loadCart() {
      try {
        const data = await getCart();
        if (isMounted) {
          setCart(data.cart);
          setSummary(data.summary);
        }
      } catch (err) {
        if (isMounted) setError(getApiError(err, 'Unable to load cart'));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadCart();
    return () => {
      isMounted = false;
    };
  }, []);

  async function applyCartUpdate(action, successMessage) {
    try {
      const data = await action();
      setCart(data.cart);
      setSummary(data.summary);
      showToast(successMessage);
    } catch (err) {
      showToast(getApiError(err, 'Unable to update cart'), 'error');
    } finally {
      setUpdatingId('');
    }
  }

  function handleQuantityChange(productId, quantity) {
    setUpdatingId(productId);
    applyCartUpdate(() => updateCartItem(productId, quantity), 'Cart updated');
  }

  function handleRemove(productId) {
    setUpdatingId(productId);
    applyCartUpdate(() => removeCartItem(productId), 'Item removed');
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black text-leaf-900">Cart</h1>
      {isLoading && (
        <div className="mt-6 rounded-lg bg-white p-6 text-leaf-700 shadow-soft">
          <Spinner label="Loading cart" />
        </div>
      )}
      {error && <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
      {!isLoading && !error && !cart.items.length && (
        <div className="mt-6 rounded-lg bg-white p-8 text-center shadow-soft">
          <p className="font-bold text-leaf-900">Your cart is empty</p>
          <p className="mt-2 text-sm text-stone-600">Find plants and garden essentials for your space.</p>
          <Link className="mt-5 inline-block" to="/shop">
            <Button>Shop Products</Button>
          </Link>
        </div>
      )}
      {!isLoading && !error && !!cart.items.length && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <CartItem
                key={item.product._id}
                item={item}
                isUpdating={updatingId === item.product._id}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            ))}
          </div>
          <aside className="h-fit rounded-lg bg-white p-5 shadow-soft">
            <h2 className="text-xl font-black text-leaf-900">Order Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-600">Items</span>
                <span className="font-bold text-leaf-900">{summary.itemCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Subtotal</span>
                <span className="font-bold text-leaf-900">{formatCurrency(summary.subtotal)}</span>
              </div>
              <div className="flex justify-between border-t border-leaf-100 pt-3 text-base">
                <span className="font-bold text-leaf-900">Total</span>
                <span className="font-black text-leaf-900">{formatCurrency(summary.subtotal)}</span>
              </div>
            </div>
            <Link to="/checkout" className="mt-5 block">
              <Button className="w-full">Proceed to Checkout</Button>
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
