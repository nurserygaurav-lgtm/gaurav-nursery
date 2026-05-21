import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgePercent, CreditCard, Home, IndianRupee, MapPin, PackageCheck, ShieldCheck, Smartphone, Truck } from 'lucide-react';
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
  const [coupon, setCoupon] = useState('');
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
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-[2rem] bg-[linear-gradient(135deg,#0d1f0e,#315f2e)] p-6 text-white shadow-card sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-leaf-100">Secure checkout</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Complete your plant order</h1>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ['Address', Home],
            ['Order Summary', PackageCheck],
            ['Payment', ShieldCheck]
          ].map(([label, Icon], index) => (
            <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 font-black backdrop-blur">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-leaf-950">{index + 1}</span>
              <Icon size={18} />
              {label}
            </div>
          ))}
        </div>
      </div>
      {isLoading && (
        <div className="mt-6 rounded-[1.5rem] bg-white p-6 text-leaf-700 shadow-soft">
          <Spinner label="Loading checkout" />
        </div>
      )}
      {error && <p className="mt-6 rounded-[1.25rem] bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
      {!isLoading && !error && (
        <form className="grid gap-6 lg:grid-cols-[1fr_360px]" onSubmit={handleSubmit}>
          <div className="grid gap-5">
            <div className="grid gap-4 rounded-[1.5rem] border border-leaf-100 bg-white p-5 shadow-soft sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-leaf-50 text-leaf-800"><MapPin size={20} /></span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-leaf-600">Step 1</p>
                  <h2 className="text-xl font-black text-leaf-900">Delivery Address</h2>
                </div>
              </div>
            <input className="form-input" name="name" onChange={handleChange} placeholder="Full name" value={address.name} />
            <input className="form-input" name="phone" onChange={handleChange} placeholder="Phone number" value={address.phone} />
            <input className="form-input" name="street" onChange={handleChange} placeholder="Street address" value={address.street} />
            <div className="grid gap-4 sm:grid-cols-3">
              <input className="form-input" name="city" onChange={handleChange} placeholder="City" value={address.city} />
              <input className="form-input" name="state" onChange={handleChange} placeholder="State" value={address.state} />
              <input className="form-input" name="pincode" onChange={handleChange} placeholder="Pincode" value={address.pincode} />
            </div>
              <div className="rounded-2xl bg-leaf-50 p-4 text-sm font-bold text-leaf-800">
                <Truck className="mr-2 inline" size={17} />
                Estimated delivery: 2-5 business days after dispatch.
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-leaf-100 bg-white p-5 shadow-soft sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-leaf-50 text-leaf-800"><CreditCard size={20} /></span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-leaf-600">Step 3</p>
                  <h2 className="text-xl font-black text-leaf-900">Payment Method</h2>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <label className={`rounded-2xl border p-4 transition ${paymentMethod === 'cod' ? 'border-leaf-700 bg-leaf-50 shadow-soft' : 'border-leaf-100 bg-white'}`}>
                  <input checked={paymentMethod === 'cod'} className="sr-only" onChange={() => setPaymentMethod('cod')} type="radio" />
                  <IndianRupee size={22} className="text-leaf-700" />
                  <span className="mt-3 block font-black text-leaf-950">Cash on Delivery</span>
                  <span className="mt-1 block text-xs font-bold text-stone-500">Pay when plants arrive.</span>
                </label>
                <label className={`rounded-2xl border p-4 transition ${paymentMethod === 'razorpay' ? 'border-leaf-700 bg-leaf-50 shadow-soft' : 'border-leaf-100 bg-white'}`}>
                  <input checked={paymentMethod === 'razorpay'} className="sr-only" onChange={() => setPaymentMethod('razorpay')} type="radio" />
                  <CreditCard size={22} className="text-leaf-700" />
                  <span className="mt-3 block font-black text-leaf-950">Card / Netbanking</span>
                  <span className="mt-1 block text-xs font-bold text-stone-500">Secure Razorpay checkout.</span>
                </label>
                <label className={`rounded-2xl border p-4 transition ${paymentMethod === 'upi' ? 'border-leaf-700 bg-leaf-50 shadow-soft' : 'border-leaf-100 bg-white'}`}>
                  <input checked={paymentMethod === 'upi'} className="sr-only" onChange={() => setPaymentMethod('upi')} type="radio" />
                  <Smartphone size={22} className="text-leaf-700" />
                  <span className="mt-3 block font-black text-leaf-950">UPI</span>
                  <span className="mt-1 block text-xs font-bold text-stone-500">Processed via Razorpay.</span>
                </label>
              </div>
              {paymentMethod !== 'cod' && (
                <div className="mt-4 grid gap-3 rounded-2xl bg-[#f8fff5] p-4 sm:grid-cols-2">
                  <input className="form-input" placeholder={paymentMethod === 'upi' ? 'UPI ID (optional)' : 'Card number (shown in Razorpay)'} readOnly />
                  <input className="form-input" placeholder="Secure details open after Pay" readOnly />
                </div>
              )}
            </div>
          </div>
          <aside className="h-fit rounded-[1.5rem] border border-leaf-100 bg-white p-5 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-leaf-600">Step 2</p>
            <h2 className="mt-1 text-xl font-black text-leaf-900">Order Summary</h2>
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
                <Button type="button" variant="outline" onClick={() => showToast('Coupon will be validated at payment when available')}>Apply</Button>
              </div>
            </div>
            <Button className="mt-5 w-full" disabled={isPaying || !summary.itemCount} type="submit">
              {isPaying ? <Spinner label="Processing" /> : paymentMethod === 'cod' ? 'Place COD Order' : 'Pay with Razorpay'}
            </Button>
            <div className="mt-5 grid gap-2 text-xs font-black text-stone-500">
              <span className="inline-flex items-center"><ShieldCheck className="mr-2 text-leaf-700" size={16} /> SSL secure payment</span>
              <span className="inline-flex items-center"><BadgePercent className="mr-2 text-leaf-700" size={16} /> Transparent pricing</span>
              <span className="inline-flex items-center"><PackageCheck className="mr-2 text-leaf-700" size={16} /> Safe plant packaging</span>
            </div>
          </aside>
        </form>
      )}
    </section>
  );
}
