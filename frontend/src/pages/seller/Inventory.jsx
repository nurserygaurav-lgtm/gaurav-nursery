import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertTriangle, Boxes, PackageCheck, PackagePlus } from 'lucide-react';
import SellerProductTable from '../../components/product/SellerProductTable.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { Panel, PageHeader, MetricCard } from '../../components/dashboard/DashboardUI.jsx';
import { chartData } from '../../components/dashboard/dashboardData.js';
import { useSellerProducts } from '../../hooks/useSellerProducts.js';

export default function Inventory() {
  const { products, isLoading, error } = useSellerProducts();
  const totalStock = products.reduce((total, product) => total + Number(product.stock || 0), 0);
  const lowStock = products.filter((product) => Number(product.stock || 0) < 5);

  return (
    <section>
      <PageHeader eyebrow="Inventory management" title="Stock tracking and replenishment" text="Monitor product stock, incoming inventory, sold units, and low-stock alerts from a modern inventory command view." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Current Stock" value={String(totalStock)} change="+7.2%" icon={Boxes} tone="dark" />
        <MetricCard label="Incoming Stock" value="460" change="This week" icon={PackagePlus} />
        <MetricCard label="Sold Stock" value="1,284" change="+16.5%" icon={PackageCheck} />
        <MetricCard label="Low Stock Alerts" value={String(lowStock.length)} change="Review now" icon={AlertTriangle} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Inventory Graph" subtitle="Stock levels across the last six months">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7f0e3" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="inventory" stroke="#315f2e" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Incoming vs Sold Stock" subtitle="Fulfillment and replenishment trend">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7f0e3" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="inventory" fill="#9bc991" radius={[10, 10, 0, 0]} />
                <Bar dataKey="orders" fill="#315f2e" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
      <div className="mt-6">
        <Panel title="Product Stock Tracking" subtitle="Search, sort, filter, and update stock health">
          {isLoading && <Spinner label="Loading inventory" />}
          {error && <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
          {!isLoading && !error && <SellerProductTable products={products} isDeletingId="" onDelete={() => {}} showToolbar />}
        </Panel>
      </div>
    </section>
  );
}
