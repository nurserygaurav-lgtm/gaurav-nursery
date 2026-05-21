import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { IndianRupee, PackageCheck, ShoppingBag, TrendingUp } from 'lucide-react';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { Panel, PageHeader, MetricCard } from '../../components/dashboard/DashboardUI.jsx';
import { useSellerDashboard } from '../../hooks/useSellerDashboard.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

function formatNumber(value) {
  return new Intl.NumberFormat('en-IN').format(Number(value || 0));
}

function formatPercent(value) {
  const number = Number(value || 0);
  return `${number > 0 ? '+' : ''}${number.toFixed(1)}%`;
}

function hasChartValue(rows = [], keys = []) {
  return rows.some((row) => keys.some((key) => Number(row?.[key] || 0) > 0));
}

function EmptyState({ children }) {
  return (
    <div className="flex h-full min-h-48 items-center justify-center rounded-2xl border border-dashed border-leaf-100 bg-leaf-50/70 p-6 text-center text-sm font-bold text-stone-600">
      {children}
    </div>
  );
}

export default function SellerAnalytics() {
  const { dashboard, isLoading, error } = useSellerDashboard();
  const monthlyRevenue = dashboard.charts.monthlyRevenue;
  const ordersAnalytics = dashboard.charts.ordersAnalytics;
  const weeklySales = dashboard.charts.weeklySales;
  const hasRevenueData = hasChartValue(monthlyRevenue, ['revenue']);
  const hasOrdersData = hasChartValue(ordersAnalytics, ['orders', 'productsSold']);
  const hasWeeklyData = hasChartValue(weeklySales, ['orders', 'productsSold', 'revenue']);

  return (
    <section>
      <PageHeader eyebrow="Seller analytics" title="Sales performance and order intelligence" text="Revenue, weekly sales, order history, and product movement calculated from completed seller orders." />
      {error && <p className="mb-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-36 rounded-3xl" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Net Revenue" value={formatCurrency(dashboard.analytics.totalRevenue)} change={`${formatPercent(dashboard.analytics.monthlyGrowth)} this month`} icon={IndianRupee} tone="dark" />
          <MetricCard label="Orders Analytics" value={formatNumber(dashboard.analytics.orders)} change="Completed orders" icon={ShoppingBag} />
          <MetricCard label="Weekly Sales" value={formatNumber(dashboard.analytics.weeklySales)} change={formatCurrency(dashboard.analytics.weeklyRevenue)} icon={TrendingUp} />
          <MetricCard label="Products Sold" value={formatNumber(dashboard.analytics.productsSold)} change="Delivered items" icon={PackageCheck} />
        </div>
      )}
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Revenue Line Chart" subtitle="Month over month completed-order revenue">
          <div className="h-96">
            {isLoading ? (
              <Skeleton className="h-full rounded-2xl" />
            ) : hasRevenueData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7f0e3" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="revenue" stroke="#315f2e" strokeWidth={3} fill="#dcedd8" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState>No completed order revenue yet.</EmptyState>
            )}
          </div>
        </Panel>
        <Panel title="Orders Analytics" subtitle="Monthly completed orders and sold quantities">
          <div className="h-96">
            {isLoading ? (
              <Skeleton className="h-full rounded-2xl" />
            ) : hasOrdersData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7f0e3" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="orders" name="Orders" fill="#315f2e" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="productsSold" name="Products sold" fill="#9bc991" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState>No completed order history yet.</EmptyState>
            )}
          </div>
        </Panel>
      </div>
      <div className="mt-6">
        <Panel title="Weekly Sales Filter" subtitle="Last 7 days completed order activity">
          <div className="h-80">
            {isLoading ? (
              <Skeleton className="h-full rounded-2xl" />
            ) : hasWeeklyData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7f0e3" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="orders" name="Orders" fill="#315f2e" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="productsSold" name="Products sold" fill="#9bc991" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState>No sales in the last 7 days.</EmptyState>
            )}
          </div>
        </Panel>
      </div>
    </section>
  );
}
