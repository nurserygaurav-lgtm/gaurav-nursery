import { useEffect, useState } from 'react';
import StatCard from '../../components/dashboard/StatCard.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { getAllOrders } from '../../services/orderService.js';
import { getApiError } from '../../utils/auth.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function Analytics() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadAnalytics() {
      try {
        const data = await getAllOrders();
        if (isMounted) setOrders(data.orders || []);
      } catch (err) {
        if (isMounted) setError(getApiError(err, 'Unable to load analytics'));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadAnalytics();
    return () => {
      isMounted = false;
    };
  }, []);

  const paidOrders = orders.filter((order) => ['paid', 'processing', 'shipped', 'delivered'].includes(order.status));
  const revenue = paidOrders.reduce((total, order) => total + Number(order.totalAmount || 0), 0);
  const codOrders = orders.filter((order) => order.payment?.method === 'cod').length;
  const razorpayOrders = orders.filter((order) => order.payment?.method === 'razorpay').length;

  return (
    <section>
      <h1 className="text-3xl font-black text-leaf-900">Analytics</h1>
      {isLoading && <div className="mt-6"><Spinner label="Loading analytics" /></div>}
      {error && <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
      {!isLoading && !error && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Revenue" value={formatCurrency(revenue)} />
          <StatCard label="Orders" value={String(orders.length)} />
          <StatCard label="Razorpay" value={String(razorpayOrders)} />
          <StatCard label="COD" value={String(codOrders)} />
        </div>
      )}
    </section>
  );
}
