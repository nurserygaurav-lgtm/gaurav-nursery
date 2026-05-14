import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-stone-600">Order #{order._id.slice(-8).toUpperCase()}</p>
          <h1 className="mt-1 text-3xl font-black text-leaf-900">{formatCurrency(order.totalAmount)}</h1>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {order.items.map((item) => (
            <article key={`${item.product?._id}-${item.name}`} className="rounded-lg bg-white p-4 shadow-soft">
              <div className="flex justify-between gap-4">
                <div>
                  <h2 className="font-bold text-leaf-900">{item.name}</h2>
                  <p className="mt-1 text-sm text-stone-600">Qty {item.quantity}</p>
                </div>
                <p className="font-bold text-leaf-900">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            </article>
          ))}
        </div>
        <aside className="h-fit rounded-lg bg-white p-5 shadow-soft">
          <h2 className="text-lg font-black text-leaf-900">Shipping</h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            {order.shippingAddress.name}<br />
            {order.shippingAddress.phone}<br />
            {order.shippingAddress.street}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
          </p>
          <h2 className="mt-6 text-lg font-black text-leaf-900">Payment</h2>
          <p className="mt-2 text-sm capitalize text-stone-600">{order.payment.method} · {order.payment.status}</p>
        </aside>
      </div>
    </section>
  );
}
