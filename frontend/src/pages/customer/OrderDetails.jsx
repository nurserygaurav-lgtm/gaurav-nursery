import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Download, Headphones, MessageCircle, Package, PackageCheck, Star, Truck, XCircle } from 'lucide-react';
import OrderStatusBadge from '../../components/order/OrderStatusBadge.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { getOrderById } from '../../services/orderService.js';
import { getApiError } from '../../utils/auth.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadOrder() {
      try {
        const data = await getOrderById(id);
        if (isMounted) setOrder(data.order);
      } catch (err) {
        if (isMounted) setError(getApiError(err, 'Unable to load order'));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadOrder();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) return <section className="mx-auto max-w-5xl px-4 py-10"><Spinner label="Loading order" /></section>;
  if (error || !order) return <p className="mx-auto mt-10 max-w-3xl rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-700">{error || 'Order not found'}</p>;

  const statusOrder = ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
  const normalizedStatus = order.status === 'paid' ? 'processing' : order.status;
  const currentIndex = statusOrder.includes(normalizedStatus) ? statusOrder.indexOf(normalizedStatus) : 0;
  const timeline = [
    { key: 'pending', label: 'Order confirmed', icon: PackageCheck },
    { key: 'processing', label: 'Packed', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'out_for_delivery', label: 'Out for delivery', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: PackageCheck }
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] bg-[linear-gradient(135deg,#0d1f0e,#315f2e)] p-6 text-white shadow-card sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-leaf-100">Order #{order._id.slice(-8).toUpperCase()}</p>
            <h1 className="mt-1 text-3xl font-black">{formatCurrency(order.totalAmount)}</h1>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {timeline.map((step, index) => {
            const Icon = step.icon;
            const isDone = order.status === 'delivered' || index <= currentIndex;
            const isCancelled = order.status === 'cancelled';
            return (
              <div key={step.key} className={`relative rounded-2xl border p-4 ${isDone && !isCancelled ? 'border-white/25 bg-white/15' : 'border-white/10 bg-white/5'} backdrop-blur`}>
                <span className={`flex h-10 w-10 items-center justify-center rounded-full ${isDone && !isCancelled ? 'bg-white text-leaf-950' : 'bg-white/10 text-white/60'}`}>
                  <Icon size={19} />
                </span>
                <p className="mt-3 text-sm font-black">{step.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#25d366] px-5 text-sm font-black text-white shadow-soft transition hover:-translate-y-1" href="https://wa.me/916352031504" target="_blank" rel="noreferrer">
          <MessageCircle className="mr-2" size={17} /> Chat support
        </a>
        <button className="inline-flex min-h-11 items-center justify-center rounded-full border border-leaf-200 bg-white px-5 text-sm font-black text-leaf-900 shadow-soft">
          <Download className="mr-2" size={17} /> Download invoice
        </button>
        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <button className="inline-flex min-h-11 items-center justify-center rounded-full border border-red-100 bg-red-50 px-5 text-sm font-black text-red-700">
            <XCircle className="mr-2" size={17} /> Cancel order
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <div className="rounded-[1.5rem] bg-white p-5 shadow-soft">
            <h2 className="text-lg font-black text-leaf-900">Products</h2>
          </div>
          {order.items.map((item) => (
            <article key={`${item.product?._id || item.product?.id || item.name}`} className="rounded-[1.25rem] bg-white p-4 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-leaf-900">{item.name}</h3>
                  <p className="mt-1 text-sm text-stone-600">Qty {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-leaf-900">{formatCurrency(item.price * item.quantity)}</p>
                  {order.status === 'delivered' && (
                    <Link className="mt-2 inline-flex items-center text-sm font-black text-leaf-700" to={`/products/${item.product?._id || item.product?.id || ''}`}>
                      <Star className="mr-1" size={15} /> Review product
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
        <aside className="grid h-fit gap-4">
          <div className="rounded-[1.5rem] bg-white p-5 shadow-soft">
            <h2 className="text-lg font-black text-leaf-900">Delivery Details</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              {order.shippingAddress.name}<br />
              {order.shippingAddress.phone}<br />
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-white p-5 shadow-soft">
            <h2 className="text-lg font-black text-leaf-900">Payment Details</h2>
            <p className="mt-2 text-sm capitalize text-stone-600">{order.payment.method} - {order.payment.status}</p>
            <p className="mt-3 text-2xl font-black text-leaf-950">{formatCurrency(order.totalAmount)}</p>
          </div>
          <div className="rounded-[1.5rem] bg-leaf-50 p-5">
            <Headphones className="text-leaf-700" size={24} />
            <h2 className="mt-3 text-lg font-black text-leaf-900">Need help?</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Contact nursery support for delivery, plant health, or payment questions.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
