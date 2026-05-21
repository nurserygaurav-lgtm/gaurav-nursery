import { useEffect, useMemo, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Bell, Boxes, IndianRupee, PackageCheck, ShoppingBag, Star, TrendingUp, Truck } from 'lucide-react';
import SellerProductTable from '../../components/product/SellerProductTable.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { ActivityFeed, Panel, PageHeader, MetricCard, StatusPill } from '../../components/dashboard/DashboardUI.jsx';
import { useSellerProducts } from '../../hooks/useSellerProducts.js';
import { getSellerDashboard } from '../../services/dashboardService.js';
import { getApiError } from '../../utils/auth.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { getProductImage, getProductTitle, handleImageError } from '../../utils/product.js';

const categoryColors = ['#315f2e', '#72ae68', '#9bc991', '#c4dfbd', '#7a5230', '#d4a373', '#588157'];

const defaultDashboard = {
  metrics: {
    totalSales: 0,
    revenue: 0,
    orders: 0,
    pendingOrders: 0,
    productsSold: 0,
    monthlyGrowth: 0
  },
  charts: {
    revenueAnalytics: [],
    categoryMix: [],
    salesAnalytics: []
  },
  recentOrders: [],
  topProducts: []
};

function formatNumber(value) {
  return new Intl.NumberFormat('en-IN').format(Number(value || 0));
}

function formatPercent(value) {
  const number = Number(value || 0);
  return `${number > 0 ? '+' : ''}${number.toFixed(1)}%`;
}

function withCategoryColors(categories = []) {
  return categories.map((category, index) => ({
    ...category,
    fill: categoryColors[index % categoryColors.length]
  }));
}

function getActivity({ dashboard, lowStockProducts, activeProducts }) {
  return [
    dashboard.metrics.orders > 0 && { title: 'Orders received', text: `${formatNumber(dashboard.metrics.orders)} total orders are currently in your seller queue.` },
    dashboard.metrics.pendingOrders > 0 && { title: 'Pending fulfillment', text: `${formatNumber(dashboard.metrics.pendingOrders)} orders are waiting for seller action.` },
    lowStockProducts.length > 0 && { title: 'Inventory health', text: `${formatNumber(lowStockProducts.length)} products are below the preferred stock level.` },
    { title: 'Active listings', text: `${formatNumber(activeProducts.length)} products are live in your storefront.` }
  ].filter(Boolean);
}

function getDeliveryLabel(status) {
  const labels = {
    pending: 'Awaiting action',
    paid: 'Paid',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };

  return labels[status] || status || 'Updated';
}

function hasPositiveChartValue(rows = [], keys = []) {
  return rows.some((row) => keys.some((key) => Number(row?.[key] || 0) > 0));
}

function EmptyState({ children = 'No sales data available yet.' }) {
  return (
    <div className="flex h-full min-h-48 items-center justify-center rounded-2xl border border-dashed border-leaf-100 bg-leaf-50/70 p-6 text-center text-sm font-bold text-stone-600">
      {children}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-36 rounded-3xl" />
      ))}
    </div>
  );
}

export default function SellerDashboard() {
  const { products, isLoading, error } = useSellerProducts();
  const [dashboard, setDashboard] = useState(defaultDashboard);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState('');
  const activeProducts = products.filter((product) => product.status === 'active');
  const lowStockProducts = products.filter((product) => Number(product.stock) < 5);
  const revenueData = dashboard.charts.revenueAnalytics || [];
  const salesData = dashboard.charts.salesAnalytics || [];
  const hasRevenueData = hasPositiveChartValue(revenueData, ['revenue']);
  const hasSalesData = hasPositiveChartValue(salesData, ['orders', 'productsSold']);
  const categoryData = useMemo(() => withCategoryColors(dashboard.charts.categoryMix), [dashboard.charts.categoryMix]);
  const hasCategoryData = hasPositiveChartValue(categoryData, ['value']);
  const activity = useMemo(() => getActivity({ dashboard, lowStockProducts, activeProducts }), [dashboard, lowStockProducts, activeProducts]);
  const topProducts = dashboard.topProducts || [];

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        setDashboardLoading(true);
        setDashboardError('');
        const data = await getSellerDashboard();
        if (isMounted) {
          setDashboard({
            ...defaultDashboard,
            ...data,
            charts: { ...defaultDashboard.charts, ...(data.charts || {}) },
            topProducts: data.topProducts || []
          });
        }
      } catch (err) {
        if (isMounted) {
          setDashboard(defaultDashboard);
          setDashboardError(getApiError(err, 'Unable to load dashboard data'));
        }
      } finally {
        if (isMounted) setDashboardLoading(false);
      }
    }

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section>
      <PageHeader
        eyebrow="Seller dashboard"
        title="Nursery sales command center"
        text="Track revenue, orders, inventory health, and recent storefront activity from one premium seller workspace."
      />

      {dashboardError && <p className="mb-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{dashboardError}</p>}

      {dashboardLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <MetricCard label="Total Sales" value={formatNumber(dashboard.metrics.totalSales)} change="Items sold" icon={TrendingUp} tone="dark" />
          <MetricCard label="Revenue" value={formatCurrency(dashboard.metrics.revenue)} change="Paid/completed" icon={IndianRupee} />
          <MetricCard label="Orders" value={formatNumber(dashboard.metrics.orders)} change="All seller orders" icon={ShoppingBag} />
          <MetricCard label="Pending Orders" value={formatNumber(dashboard.metrics.pendingOrders)} change="Needs action" icon={Truck} />
          <MetricCard label="Products Sold" value={formatNumber(dashboard.metrics.productsSold)} change="Order items" icon={PackageCheck} />
          {hasRevenueData && <MetricCard label="Monthly Growth" value={formatPercent(dashboard.metrics.monthlyGrowth)} change="Vs previous month" icon={Boxes} />}
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Panel title="Revenue Analytics" subtitle="Monthly sales performance">
          <div className="h-80">
            {dashboardLoading ? (
              <Skeleton className="h-full rounded-2xl" />
            ) : hasRevenueData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="sellerRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#315f2e" stopOpacity={0.32} />
                      <stop offset="95%" stopColor="#315f2e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7f0e3" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#315f2e" strokeWidth={3} fill="url(#sellerRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState>No sales data available yet.</EmptyState>
            )}
          </div>
        </Panel>

        <Panel title="Category Mix" subtitle="Sales by plant collection">
          <div className="h-80">
            {dashboardLoading ? (
              <Skeleton className="h-full rounded-2xl" />
            ) : hasCategoryData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={68} outerRadius={105} paddingAngle={4}>
                    {categoryData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState>No category sales data available yet.</EmptyState>
            )}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Monthly Sales Graph" subtitle="Orders and items sold">
          <div className="h-72">
            {dashboardLoading ? (
              <Skeleton className="h-full rounded-2xl" />
            ) : hasSalesData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7f0e3" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#315f2e" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="productsSold" fill="#9bc991" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState>No sales data available yet.</EmptyState>
            )}
          </div>
        </Panel>

        <Panel title="Recent Orders" subtitle="Latest marketplace activity">
          <div className="space-y-3">
            {dashboardLoading ? (
              Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-20 rounded-2xl" />)
            ) : dashboard.recentOrders.length ? (
              dashboard.recentOrders.map((order) => (
                <div key={order.id} className="grid gap-3 rounded-2xl border border-leaf-100 bg-white p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-leaf-100 font-black text-leaf-800">{(order.customer || 'C')[0]}</span>
                    <div>
                      <p className="font-black text-leaf-950">{order.customer}</p>
                      <p className="text-sm text-stone-500">{order.orderNumber}</p>
                    </div>
                  </div>
                  <p className="font-black text-leaf-950">{formatCurrency(order.amount)}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill status={order.status} />
                    <span className="text-xs font-bold text-stone-500">{getDeliveryLabel(order.delivery)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-2xl bg-leaf-50 p-5 text-stone-600">No recent seller orders yet.</p>
            )}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Panel title="Products Management" subtitle="Stock, SKU, category, price, and product actions">
          {isLoading && <Spinner label="Loading products" />}
          {error && <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
          {!isLoading && !error && <SellerProductTable products={products.slice(0, 6)} isDeletingId="" onDelete={() => {}} />}
        </Panel>
        <Panel title="Top Products" subtitle="Best-selling products from completed order data">
          {dashboardLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-20 rounded-2xl" />)}
            </div>
          ) : topProducts.length ? (
            <div className="space-y-3">
              {topProducts.map((product) => (
                <div key={product.id || product._id || product.name} className="flex items-center gap-3 rounded-2xl border border-leaf-100 bg-white p-3">
                  <img
                    className="h-14 w-14 rounded-2xl object-cover"
                    src={getProductImage(product)}
                    alt={getProductTitle(product)}
                    loading="lazy"
                    decoding="async"
                    onError={handleImageError}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black text-leaf-950">{getProductTitle(product)}</p>
                    <p className="text-sm text-stone-500">{formatNumber(product.quantitySold || product.productsSold || product.sold || 0)} sold</p>
                  </div>
                  {!!product.revenue && <p className="text-sm font-black text-leaf-900">{formatCurrency(product.revenue)}</p>}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState>Top products will appear after sales are recorded.</EmptyState>
          )}

          <div className="mt-5 border-t border-leaf-100 pt-5">
            <h3 className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-leaf-700">Store Health</h3>
            <ActivityFeed items={activity} />
          </div>
          {!!lowStockProducts.length && (
            <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-800">
              {lowStockProducts.length} products need replenishment.
            </div>
          )}
          <div className="mt-4 text-sm font-bold text-leaf-700">{activeProducts.length} active listings currently live.</div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Inventory Alerts" subtitle="Live stock signals from your listings">
          <div className="space-y-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-16 rounded-2xl" />)
            ) : lowStockProducts.length ? (
              lowStockProducts.slice(0, 5).map((product) => (
                <div key={product._id} className="flex items-center gap-3 rounded-2xl bg-amber-50 p-3">
                  <Boxes className="shrink-0 text-amber-700" size={20} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-leaf-950">{getProductTitle(product)}</p>
                    <p className="text-xs font-bold text-amber-700">{formatNumber(product.stock)} in stock</p>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState>Inventory alerts will appear when products run low.</EmptyState>
            )}
          </div>
        </Panel>

        <Panel title="Notifications" subtitle="Actionable seller updates">
          <div className="space-y-3">
            {dashboardLoading ? (
              Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-16 rounded-2xl" />)
            ) : activity.length ? (
              activity.slice(0, 4).map((item) => (
                <div key={item.title} className="flex gap-3 rounded-2xl border border-leaf-100 bg-white p-3">
                  <Bell className="mt-1 shrink-0 text-leaf-700" size={18} />
                  <div>
                    <p className="text-sm font-black text-leaf-950">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-stone-500">{item.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState>No seller notifications yet.</EmptyState>
            )}
          </div>
        </Panel>

        <Panel title="Reviews" subtitle="Customer feedback workspace">
          <div className="rounded-2xl bg-leaf-50 p-5 text-center">
            <Star className="mx-auto text-leaf-700" size={28} />
            <h3 className="mt-3 font-black text-leaf-950">Reviews will appear here</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">No review analytics are shown until real customer reviews are available from the backend.</p>
          </div>
        </Panel>
      </div>
    </section>
  );
}
