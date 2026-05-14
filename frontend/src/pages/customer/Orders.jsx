import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OrderSummaryCard from '../../components/order/OrderSummaryCard.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { getMyOrders } from '../../services/orderService.js';
import { getApiError } from '../../utils/auth.js';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      try {
        const data = await getMyOrders();
        if (isMounted) setOrders(data.orders || []);
      } catch (err) {
        if (isMounted) setError(getApiError(err, 'Unable to load orders'));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black text-leaf-900">My Orders</h1>
      {isLoading && <Spinner label="Loading orders" />}
      {error && <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
      {!isLoading && !error && !orders.length && (
        <div className="mt-6 rounded-lg bg-white p-8 text-center shadow-soft">
          <p className="font-bold text-leaf-900">No orders yet</p>
          <Link className="mt-5 inline-block" to="/shop">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      )}
      {!isLoading && !error && !!orders.length && (
        <div className="mt-6 grid gap-4">
          {orders.map((order) => (
            <OrderSummaryCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </section>
  );
}
