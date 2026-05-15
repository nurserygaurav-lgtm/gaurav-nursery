import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { IndianRupee, PackageSearch, ShoppingBag, Store, TrendingUp, Users } from 'lucide-react';
import { ActivityFeed, Panel, PageHeader, MetricCard, StatusPill } from '../../components/dashboard/DashboardUI.jsx';
import { categoryData, chartData } from '../../components/dashboard/dashboardData.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

const topSellers = [
  { name: 'Green Roots Nursery', revenue: 82500, rating: 4.9 },
  { name: 'Urban Leaf Seller', revenue: 68400, rating: 4.8 },
  { name: 'Bloom House', revenue: 54100, rating: 4.7 }
];

const transactions = [
  { id: 'TXN-8842', seller: 'Green Roots', amount: 12400, status: 'paid' },
  { id: 'TXN-8841', seller: 'Pot Studio', amount: 8200, status: 'pending' },
  { id: 'TXN-8840', seller: 'Bloom House', amount: 15800, status: 'paid' }
];

export default function AdminDashboard() {
  return (
    <section>
      <PageHeader eyebrow="Admin dashboard" title="Platform operations overview" text="Monitor marketplace revenue, seller performance, orders, approvals, and product moderation in one polished admin command center." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <MetricCard label="Platform Revenue" value={formatCurrency(1486400)} change="+18.9%" icon={IndianRupee} tone="dark" />
        <MetricCard label="Total Users" value="12,482" change="+9.8%" icon={Users} />
        <MetricCard label="Total Sellers" value="348" change="+4.2%" icon={Store} />
        <MetricCard label="Orders Growth" value="27%" change="+6.4%" icon={TrendingUp} />
        <MetricCard label="Monthly Earnings" value={formatCurrency(224800)} change="+12.1%" icon={ShoppingBag} />
        <MetricCard label="Commissions" value={formatCurrency(74500)} change="+8.7%" icon={PackageSearch} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Panel title="Revenue Chart" subtitle="Monthly platform revenue and commissions">
          <div className="h-80">
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
        <Panel title="Category Analytics" subtitle="GMV by marketplace category">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={100} paddingAngle={4}>
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

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel title="User Growth" subtitle="New users and sellers">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7f0e3" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="users" fill="#315f2e" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Top Sellers" subtitle="Best performing nurseries">
          <div className="space-y-3">
            {topSellers.map((seller) => (
              <div key={seller.name} className="rounded-2xl bg-leaf-50 p-4">
                <p className="font-black text-leaf-950">{seller.name}</p>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="font-bold text-stone-500">Rating {seller.rating}</span>
                  <span className="font-black text-leaf-800">{formatCurrency(seller.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Latest Transactions" subtitle="Recent payouts and payments">
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-soft">
                <div>
                  <p className="font-black text-leaf-950">{transaction.id}</p>
                  <p className="text-sm text-stone-500">{transaction.seller}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-leaf-950">{formatCurrency(transaction.amount)}</p>
                  <StatusPill status={transaction.status} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.7fr_0.3fr]">
        <Panel title="Pending Approvals" subtitle="Seller, product, and order moderation queue">
          <div className="grid gap-3 md:grid-cols-3">
            {['Seller verification', 'Product moderation', 'Order approval'].map((item, index) => (
              <div key={item} className="rounded-2xl border border-leaf-100 bg-white p-5">
                <p className="text-sm font-bold text-stone-500">{item}</p>
                <p className="mt-2 text-3xl font-black text-leaf-950">{[14, 28, 9][index]}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Recent Activities" subtitle="Platform alerts">
          <ActivityFeed
            items={[
              { title: 'New seller applied', text: 'Green Corner submitted documents for approval.' },
              { title: 'Product flagged', text: 'One listing needs image moderation review.' },
              { title: 'High-value order', text: 'A cart above Rs. 10,000 was successfully paid.' }
            ]}
          />
        </Panel>
      </div>
    </section>
  );
}
