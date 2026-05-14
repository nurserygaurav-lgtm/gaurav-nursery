import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { getCart } from '../../services/cartService.js';
import { createCodOrder } from '../../services/orderService.js';
import { createPaymentOrder, verifyPayment } from '../../services/paymentService.js';
import { getApiError } from '../../utils/auth.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { loadRazorpayScript } from '../../utils/razorpay.js';

const initialAddress = {
  name: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  pincode: ''
};

export default function Checkout() {
  const [summary, setSummary] = useState({ subtotal: 0, itemCount: 0 });
  const [address, setAddress] = useState(initialAddress);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setAddress((current) => ({ ...current, name: user.name || '', phone: user.phone || '' }));
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    async function loadCart() {
      try {
        const data = await getCart();
        if (isMounted) setSummary(data.summary);
      } catch (err) {
        if (isMounted) setError(getApiError(err, 'Unable to load checkout'));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadCart();
    return () => {
      isMounted = false;
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setAddress((current) => ({ ...current, [name]: value }));
  }

  function validateAddress() {
    const missing = Object.entries(address).find(([, value]) => !value.trim());
    if (missing) return 'Complete the shipping address';
    return '';
  }

  async function handleCodOrder() {
    const validationError = validateAddress();
    if (validationError) {
      showToast(validationError, 'error');
      return;
    }

    try {
      setIsPaying(true);
      const data = await createCodOrder({ shippingAddress: address, paymentMethod: 'cod' });
      showToast('Order placed successfully');
      navigate(`/order-success/${data.order._id}`);
    } catch (err) {
      showToast(getApiError(err, 'Unable to place order'), 'error');
    } finally {
      setIsPaying(false);
    }
  }

  async function handleRazorpayOrder() {
    const validationError = validateAddress();
    if (validationError) {
      showToast(validationError, 'error');
      return;
    }

    try {
      setIsPaying(true);
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Unable to load Razorpay checkout');
      if (!import.meta.env.VITE_RAZORPAY_KEY_ID) throw new Error('Razorpay key is not configured');

      const data = await createPaymentOrder();
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.paymentOrder.amount,
        currency: data.paymentOrder.currency,
        name: 'Gaurav Nursery',
        description: 'Plant and garden essentials order',
        order_id: data.paymentOrder.id,
        prefill: {
          name: address.name,
          contact: address.phone,
          email: user?.email
        },
        handler: async (response) => {
          const verification = await verifyPayment({ ...response, shippingAddress: address });
          showToast('Payment successful');
          navigate(`/order-success/${verification.order._id}`);
        },
        theme: { color: '#3d7d36' }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      showToast(getApiError(err, err.message || 'Payment failed'), 'error');
    } finally {
      setIsPaying(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (paymentMethod === 'cod') await handleCodOrder();
    else await handleRazorpayOrder();
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black text-leaf-900">Checkout</h1>
      {isLoading && (
        <div className="mt-6 rounded-lg bg-white p-6 text-leaf-700 shadow-soft">
          <Spinner label="Loading checkout" />
        </div>
      )}
      {error && <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
      {!isLoading && !error && (
        <form className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]" onSubmit={handleSubmit}>
          <div className="grid gap-4 rounded-lg bg-white p-5 shadow-soft">
            <h2 className="text-xl font-black text-leaf-900">Shipping Address</h2>
            <input className="form-input" name="name" onChange={handleChange} placeholder="Full name" value={address.name} />
            <input className="form-input" name="phone" onChange={handleChange} placeholder="Phone number" value={address.phone} />
            <input className="form-input" name="street" onChange={handleChange} placeholder="Street address" value={address.street} />
            <div className="grid gap-4 sm:grid-cols-3">
              <input className="form-input" name="city" onChange={handleChange} placeholder="City" value={address.city} />
              <input className="form-input" name="state" onChange={handleChange} placeholder="State" value={address.state} />
              <input className="form-input" name="pincode" onChange={handleChange} placeholder="Pincode" value={address.pincode} />
            </div>
            <div>
              <h3 className="mb-3 font-bold text-leaf-900">Payment Method</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="rounded-lg border border-leaf-100 p-4">
                  <input checked={paymentMethod === 'cod'} className="mr-2" onChange={() => setPaymentMethod('cod')} type="radio" />
                  Cash on Delivery
                </label>
                <label className="rounded-lg border border-leaf-100 p-4">
                  <input checked={paymentMethod === 'razorpay'} className="mr-2" onChange={() => setPaymentMethod('razorpay')} type="radio" />
                  Razorpay
                </label>
              </div>
            </div>
          </div>
          <aside className="h-fit rounded-lg bg-white p-5 shadow-soft">
            <h2 className="text-xl font-black text-leaf-900">Payment Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-600">Items</span>
                <span className="font-bold text-leaf-900">{summary.itemCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Subtotal</span>
                <span className="font-bold text-leaf-900">{formatCurrency(summary.subtotal)}</span>
              </div>
            </div>
            <Button className="mt-5 w-full" disabled={isPaying || !summary.itemCount} type="submit">
              {isPaying ? <Spinner label="Processing" /> : paymentMethod === 'cod' ? 'Place COD Order' : 'Pay with Razorpay'}
            </Button>
          </aside>
        </form>
      )}
    </section>
  );
}
