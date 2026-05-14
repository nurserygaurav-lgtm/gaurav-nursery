import { useEffect, useState } from 'react';
import OrderStatusSelect from '../../components/order/OrderStatusSelect.jsx';
import OrderSummaryCard from '../../components/order/OrderSummaryCard.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useToast } from '../../hooks/useToast.js';
import { getAllOrders, updateOrderStatus } from '../../services/orderService.js';
import { getApiError } from '../../utils/auth.js';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      try {
        const data = await getAllOrders();
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

  async function handleStatusChange(orderId, status) {
    try {
      setUpdatingId(orderId);
      const data = await updateOrderStatus(orderId, status);
      setOrders((current) => current.map((order) => (order._id === orderId ? data.order : order)));
      showToast('Order status updated');
    } catch (err) {
      showToast(getApiError(err, 'Unable to update order'), 'error');
    } finally {
      setUpdatingId('');
    }
  }

  return (
    <section>
      <h1 className="text-3xl font-black text-leaf-900">Orders</h1>
      <p className="mt-2 text-sm text-stone-600">Manage marketplace orders, payment states, and fulfillment progress.</p>
      {isLoading && <div className="mt-6"><Spinner label="Loading orders" /></div>}
      {error && <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
      {!isLoading && !error && (
        <div className="mt-6 grid gap-4">
          {orders.map((order) => (
            <div key={order._id} className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
              <OrderSummaryCard order={order} showCustomer />
              <OrderStatusSelect disabled={updatingId === order._id} isAdmin onChange={(status) => handleStatusChange(order._id, status)} value={order.status} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
