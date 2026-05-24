import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BadgeCheck,
  CreditCard,
  IndianRupee,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Smartphone,
  Truck
} from 'lucide-react';
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

const paymentOptions = [
  { id: 'cod', title: 'Cash on Delivery', subtitle: 'Pay when the plants arrive.', icon: IndianRupee },
  { id: 'upi', title: 'UPI', subtitle: 'Fast mobile payments via Razorpay.', icon: Smartphone },
  { id: 'card', title: 'Card / Netbanking', subtitle: 'Secure checkout via Razorpay.', icon: CreditCard }
];

export default function Checkout() {
  const [summary, setSummary] = useState({ subtotal: 0, itemCount: 0 });
  const [address, setAddress] = useState(initialAddress);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [coupon, setCoupon] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('');
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

  useEffect(() => {
    const pin = address.pincode.trim();
    if (!pin) {
      setDeliveryStatus('');
      return;
    }

    if (!/^\d{6}$/.test(pin)) {
      setDeliveryStatus('Enter a valid 6 digit pincode');
      return;
    }

    const days = 2 + (Number(pin.slice(-1)) % 3);
    setDeliveryStatus(`Delivery usually takes ${days}-${days + 2} business days.`);
  }, [address.pincode]);

  function handleChange(event) {
    const { name, value } = event.target;
    setAddress((current) => ({ ...current, [name]: value }));
  }

  function validateAddress() {
    const missing = Object.entries(address).find(([, value]) => !value.trim());
    if (missing) return 'Complete the shipping address';
    if (!/^\d{6}$/.test(address.pincode.trim())) return 'Enter a valid 6 digit pincode';
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

  const isReady = useMemo(() => summary.itemCount > 0, [summary.itemCount]);

  return (
    <section className="premium-container py-10 sm:py-12">
      <div className="mx-auto mb-8 max-w-5xl overflow-hidden rounded-[2rem] border border-[#dbe8d8] bg-[linear-gradient(135deg,#0d1f0e,#315f2e)] p-6 text-white shadow-card sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-leaf-100">Secure checkout</p>
        <h1 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-black tracking-tight">Complete your plant order</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">
          Keep the checkout short, safe, and easy to scan on mobile.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {['SSL Secured', 'Razorpay Protected', 'UPI, Cards & COD'].map((badge) => (
            <span key={badge} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em]">
              <ShieldCheck size={14} className="text-emerald-200" />
              {badge}
            </span>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="rounded-[1.5rem] bg-white p-6 text-leaf-700 shadow-soft">
          <Spinner label="Loading checkout" />
        </div>
      )}

      {error && <p className="rounded-[1.25rem] bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}

      {!isLoading && !error && (
        <form className="grid gap-6 lg:grid-cols-[1fr_360px]" onSubmit={handleSubmit}>
          <div className="grid gap-5">
            <div className="rounded-[1.5rem] border border-leaf-100 bg-white p-5 shadow-soft sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-leaf-50 text-leaf-800">
                  <MapPin size={20} />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-leaf-600">Step 1</p>
                  <h2 className="text-xl font-black text-leaf-900">Delivery address</h2>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                <input className="form-input" name="name" onChange={handleChange} placeholder="Full name" value={address.name} />
                <input className="form-input" name="phone" onChange={handleChange} placeholder="Phone number" value={address.phone} />
                <input className="form-input" name="street" onChange={handleChange} placeholder="Street address" value={address.street} />
                <div className="grid gap-3 sm:grid-cols-3">
                  <input className="form-input" name="city" onChange={handleChange} placeholder="City" value={address.city} />
                  <input className="form-input" name="state" onChange={handleChange} placeholder="State" value={address.state} />
                  <input className="form-input" name="pincode" onChange={handleChange} placeholder="Pincode" value={address.pincode} />
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-leaf-50 p-4 text-sm font-bold text-leaf-800">
                <Truck className="mr-2 inline" size={17} />
                {deliveryStatus || 'Enter your pincode for a quick delivery estimate.'}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-leaf-100 bg-white p-5 shadow-soft sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-leaf-50 text-leaf-800">
                  <CreditCard size={20} />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-leaf-600">Step 2</p>
                  <h2 className="text-xl font-black text-leaf-900">Choose payment</h2>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {paymentOptions.map((option) => {
                  const Icon = option.icon;
                  const active = paymentMethod === option.id;

                  return (
                    <label
                      key={option.id}
                      className={`cursor-pointer rounded-2xl border p-4 transition ${active ? 'border-leaf-700 bg-leaf-50 shadow-soft' : 'border-leaf-100 bg-white hover:border-leaf-200 hover:bg-leaf-50'}`}
                    >
                      <input checked={active} className="sr-only" onChange={() => setPaymentMethod(option.id)} type="radio" />
                      <Icon size={22} className="text-leaf-700" />
                      <span className="mt-3 block font-black text-leaf-950">{option.title}</span>
                      <span className="mt-1 block text-xs font-bold text-stone-500">{option.subtitle}</span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {['UPI', 'Card', 'Netbanking', 'COD'].map((badge) => (
                  <span key={badge} className="rounded-full bg-[#f4fbf2] px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#2f5f34]">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-[1.5rem] border border-leaf-100 bg-white p-5 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-leaf-600">Step 3</p>
            <h2 className="mt-1 text-xl font-black text-leaf-900">Order summary</h2>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-600">Items</span>
                <span className="font-bold text-leaf-900">{summary.itemCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Subtotal</span>
                <span className="font-bold text-leaf-900">{formatCurrency(summary.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Delivery</span>
                <span className="font-bold text-emerald-700">Calculated at dispatch</span>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-leaf-200 bg-leaf-50 p-3">
              <label className="text-xs font-black uppercase tracking-[0.14em] text-leaf-700">Coupon</label>
              <div className="mt-2 flex gap-2">
                <input className="form-input min-w-0 flex-1" onChange={(event) => setCoupon(event.target.value)} placeholder="Enter code" value={coupon} />
                <Button type="button" variant="outline" onClick={() => showToast('Coupon validation will be available when promotions go live')}>
                  Apply
                </Button>
              </div>
            </div>

            <Button className="mt-5 w-full" disabled={isPaying || !isReady} type="submit">
              {isPaying ? <Spinner label="Processing" /> : paymentMethod === 'cod' ? 'Place COD order' : 'Pay securely now'}
            </Button>

            <div className="mt-5 grid gap-2 text-xs font-black text-stone-500">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="text-leaf-700" size={16} /> SSL secure payment
              </span>
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="text-leaf-700" size={16} /> 100% safe checkout
              </span>
              <span className="inline-flex items-center gap-2">
                <PackageCheck className="text-leaf-700" size={16} /> Safe plant packaging
              </span>
            </div>
          </aside>
        </form>
      )}
    </section>
  );
}
