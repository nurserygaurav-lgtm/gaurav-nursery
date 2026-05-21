import { useEffect, useState } from 'react';
import OrderStatusSelect from '../../components/order/OrderStatusSelect.jsx';
import OrderSummaryCard from '../../components/order/OrderSummaryCard.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { Panel, PageHeader } from '../../components/dashboard/DashboardUI.jsx';
import { useToast } from '../../hooks/useToast.js';
import { getSellerOrders, updateOrderStatus } from '../../services/orderService.js';
import { getApiError } from '../../utils/auth.js';

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAppending, setIsAppending] = useState(false);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');
  const [fallbackError, setFallbackError] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;

    async function loadInitial() {
      setError('');
      setFallbackError(false);
      setIsLoading(true);
      try {
        const data = await getSellerOrders({ page: 1, limit: 10 });
        if (!isMounted) return;
        setOrders(data.orders || []);
        setPage(1);
        setHasMore(!!data.pagination?.hasMore);
      } catch (err) {
        if (!isMounted) return;
        const apiErr = getApiError(err, 'Unable to load seller orders');
        setError(apiErr);
        // Show required fallback UI.
        setFallbackError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadInitial();
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

  async function handleLoadMore() {
    if (!hasMore || isAppending) return;

    setIsAppending(true);
    setError('');
    setFallbackError(false);

    try {
      const nextPage = page + 1;
      const data = await getSellerOrders({ page: nextPage, limit: 10 });
      setOrders((current) => [...current, ...(data.orders || [])]);
      setPage(nextPage);
      setHasMore(!!data.pagination?.hasMore);
    } catch (err) {
      setError(getApiError(err, 'Unable to load seller orders'));
      setFallbackError(true);
    } finally {
      setIsAppending(false);
    }
  }

  async function handleRetry() {
    // Reset state to avoid infinite spinners/loops.
    setOrders([]);
    setPage(1);
    setHasMore(true);
    setError('');
    setFallbackError(false);
    setIsLoading(true);

    try {
      const data = await getSellerOrders({ page: 1, limit: 10 });
      setOrders(data.orders || []);
      setHasMore(!!data.pagination?.hasMore);
    } catch (err) {
      setError(getApiError(err, 'Unable to load orders. Retry'));
      setFallbackError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section>
      <PageHeader
        eyebrow="Orders management"
        title="Seller Orders"
        text="View incoming orders and move them through processing, shipping, and delivery."
      />
      <Panel title="Order Queue" subtitle="Fulfillment status, customer details, payment amount, and delivery progress">
        {(isLoading || isAppending) && (
          <div className="space-y-3">
            <Spinner label={isLoading ? 'Loading orders' : 'Loading more orders'} />
          </div>
        )}

        {!isLoading && fallbackError && (
          <div className="rounded-2xl bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">Unable to load orders. Retry</p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-3 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {!fallbackError && error && !isLoading && (
          <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>
        )}

        {!isLoading && !error && !orders.length && !fallbackError && (
          <p className="rounded-2xl bg-leaf-50 p-5 text-stone-600">No seller orders yet.</p>
        )}

        {!isLoading && !error && !!orders.length && (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div key={order._id} className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
                <OrderSummaryCard order={order} showCustomer />
                <OrderStatusSelect
                  disabled={updatingId === order._id}
                  onChange={(status) => handleStatusChange(order._id, status)}
                  value={order.status}
                />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !fallbackError && !!orders.length && (
          <div className="mt-6">
            {hasMore ? (
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isAppending}
                className="w-full rounded-2xl border border-leaf-200 bg-white px-4 py-3 text-sm font-black text-leaf-800 transition hover:bg-leaf-50 disabled:opacity-60"
              >
                {isAppending ? 'Loading...' : 'Load more'}
              </button>
            ) : (
              <p className="mt-2 text-center text-xs font-bold text-stone-500">No more orders</p>
            )}
          </div>
        )}
      </Panel>
    </section>
  );
}

