import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { IndianRupee, PackageCheck, ShoppingBag, TrendingUp } from 'lucide-react';
import { Panel, PageHeader, MetricCard } from '../../components/dashboard/DashboardUI.jsx';
import { chartData } from '../../components/dashboard/dashboardData.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function SellerAnalytics() {
  return (
    <section>
      <PageHeader eyebrow="Seller analytics" title="Sales performance and order intelligence" text="A focused view of revenue trends, weekly sales, order growth, and inventory movement." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Net Revenue" value={formatCurrency(285600)} change="+14.8%" icon={IndianRupee} tone="dark" />
        <MetricCard label="Orders Analytics" value="1,842" change="+11.2%" icon={ShoppingBag} />
        <MetricCard label="Weekly Sales" value="428" change="+19.7%" icon={TrendingUp} />
        <MetricCard label="Products Sold" value="3,210" change="+8.6%" icon={PackageCheck} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Revenue Line Chart" subtitle="Month over month seller revenue">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7f0e3" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#315f2e" strokeWidth={3} fill="#dcedd8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Orders Analytics" subtitle="Orders compared with available inventory">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7f0e3" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="orders" fill="#315f2e" radius={[10, 10, 0, 0]} />
                <Bar dataKey="inventory" fill="#9bc991" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </section>
  );
}
