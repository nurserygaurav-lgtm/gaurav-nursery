import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Boxes, IndianRupee, PackageCheck, ShoppingBag, TrendingUp, Truck } from 'lucide-react';
import SellerProductTable from '../../components/product/SellerProductTable.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { ActivityFeed, Panel, PageHeader, MetricCard, StatusPill } from '../../components/dashboard/DashboardUI.jsx';
import { categoryData, chartData } from '../../components/dashboard/dashboardData.js';
import { useSellerProducts } from '../../hooks/useSellerProducts.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

const recentOrders = [
  { id: '#GN-2048', customer: 'Aarav Patel', amount: 1499, status: 'processing', delivery: 'Packed' },
  { id: '#GN-2047', customer: 'Mira Shah', amount: 899, status: 'paid', delivery: 'Out for delivery' },
  { id: '#GN-2046', customer: 'Kabir Rao', amount: 2299, status: 'pending', delivery: 'Awaiting pickup' }
];

const activity = [
  { title: 'New order received', text: 'A customer ordered 3 indoor plants and a ceramic planter.' },
  { title: 'Low stock alert', text: 'Snake Plant and Areca Palm are below the preferred inventory level.' },
  { title: 'Review added', text: 'A buyer rated your Monstera Deliciosa listing 5 stars.' },
  { title: 'Payment settled', text: 'Razorpay settlement for yesterday was marked complete.' }
];

export default function SellerDashboard() {
  const { products, isLoading, error } = useSellerProducts();
  const activeProducts = products.filter((product) => product.status === 'active');
  const lowStockProducts = products.filter((product) => Number(product.stock) < 5);
  const inventoryValue = products.reduce((total, product) => total + Number(product.price || 0) * Number(product.stock || 0), 0);
  const productsSold = Math.max(58, products.reduce((total, product) => total + Math.max(0, 12 - Number(product.stock || 0)), 0));

  return (
    <section>
      <PageHeader
        eyebrow="Seller dashboard"
        title="Nursery sales command center"
        text="Track revenue, orders, inventory health, and recent storefront activity from one premium seller workspace."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <MetricCard label="Total Sales" value="1,248" change="+18.2%" icon={TrendingUp} tone="dark" />
        <MetricCard label="Revenue" value={formatCurrency(Math.max(inventoryValue * 0.18, 96540))} change="+12.6%" icon={IndianRupee} />
        <MetricCard label="Orders" value="342" change="+9.4%" icon={ShoppingBag} />
        <MetricCard label="Pending Orders" value="18" change="Needs action" icon={Truck} />
        <MetricCard label="Products Sold" value={String(productsSold)} change="+22.1%" icon={PackageCheck} />
        <MetricCard label="Monthly Growth" value="31%" change="+6.8%" icon={Boxes} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Panel title="Revenue Analytics" subtitle="Monthly sales performance">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
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
          </div>
        </Panel>

        <Panel title="Category Mix" subtitle="Sales by plant collection">
          <div className="h-80">
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
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Weekly Sales Graph" subtitle="Orders and inventory movement">
          <div className="h-72">
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

        <Panel title="Recent Orders" subtitle="Latest marketplace activity">
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="grid gap-3 rounded-2xl border border-leaf-100 bg-white p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-leaf-100 font-black text-leaf-800">{order.customer[0]}</span>
                  <div>
                    <p className="font-black text-leaf-950">{order.customer}</p>
                    <p className="text-sm text-stone-500">{order.id}</p>
                  </div>
                </div>
                <p className="font-black text-leaf-950">{formatCurrency(order.amount)}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill status={order.status} />
                  <span className="text-xs font-bold text-stone-500">{order.delivery}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Panel title="Products Management" subtitle="Stock, SKU, category, price, and product actions">
          {isLoading && <Spinner label="Loading products" />}
          {error && <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
          {!isLoading && !error && <SellerProductTable products={products.slice(0, 6)} isDeletingId="" onDelete={() => {}} />}
        </Panel>
        <Panel title="Recent Activity" subtitle="Orders, reviews, payments, and alerts">
          <ActivityFeed items={activity} />
          {!!lowStockProducts.length && (
            <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-800">
              {lowStockProducts.length} products need replenishment.
            </div>
          )}
          <div className="mt-4 text-sm font-bold text-leaf-700">{activeProducts.length} active listings currently live.</div>
        </Panel>
      </div>
    </section>
  );
}
