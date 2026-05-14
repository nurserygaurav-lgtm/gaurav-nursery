import { Link } from 'react-router-dom';
import OrderStatusBadge from './OrderStatusBadge.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function OrderSummaryCard({ order, showCustomer = false }) {
  return (
    <article className="rounded-lg bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-stone-600">Order #{order._id.slice(-8).toUpperCase()}</p>
          <h2 className="mt-1 font-black text-leaf-900">{formatCurrency(order.totalAmount)}</h2>
          {showCustomer && <p className="mt-1 text-sm text-stone-600">{order.customer?.name}</p>}
        </div>
        <OrderStatusBadge status={order.status} />
      </div>
      <div className="mt-4 space-y-2">
        {order.items.slice(0, 3).map((item) => (
          <div key={`${order._id}-${item.product?._id || item.name}`} className="flex justify-between gap-4 text-sm">
            <span className="text-stone-600">{item.name} x {item.quantity}</span>
            <span className="font-bold text-leaf-900">{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <Link className="mt-4 inline-block text-sm font-bold text-leaf-700" to={`/orders/${order._id}`}>
        View details
      </Link>
    </article>
  );
}
