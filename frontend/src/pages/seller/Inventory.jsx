import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertTriangle, Boxes, PackageCheck, PackagePlus } from 'lucide-react';
import SellerProductTable from '../../components/product/SellerProductTable.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { Panel, PageHeader, MetricCard } from '../../components/dashboard/DashboardUI.jsx';
import { useSellerDashboard } from '../../hooks/useSellerDashboard.js';
import { useSellerProducts } from '../../hooks/useSellerProducts.js';

function formatNumber(value) {
  return new Intl.NumberFormat('en-IN').format(Number(value || 0));
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

export default function Inventory() {
  const { products, isLoading: productsLoading, error: productsError } = useSellerProducts();
  const { dashboard, isLoading: dashboardLoading, error: dashboardError } = useSellerDashboard();
  const inventoryTrend = dashboard.charts.inventoryTrend;
  const stockMovement = dashboard.charts.stockMovement;
  const hasInventoryTrend = hasChartValue(inventoryTrend, ['currentStock', 'incomingStock', 'soldStock']);
  const hasStockMovement = hasChartValue(stockMovement, ['incomingStock', 'soldStock']);

  return (
    <section>
      <PageHeader eyebrow="Inventory management" title="Stock tracking and replenishment" text="Current stock, incoming restocks, sold units, and low-stock alerts connected to products, orders, and restock records." />
      {dashboardError && <p className="mb-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{dashboardError}</p>}
      {dashboardLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-36 rounded-3xl" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Current Stock" value={formatNumber(dashboard.inventory.currentStock)} change={`${formatNumber(dashboard.inventory.activeProducts)} active listings`} icon={Boxes} tone="dark" />
          <MetricCard label="Incoming Stock" value={formatNumber(dashboard.inventory.incomingStock)} change={`${formatNumber(dashboard.inventory.pendingRestocks)} pending restocks`} icon={PackagePlus} />
          <MetricCard label="Sold Stock" value={formatNumber(dashboard.inventory.soldStock)} change="From completed orders" icon={PackageCheck} />
          <MetricCard label="Low Stock Alerts" value={formatNumber(dashboard.inventory.lowStockAlerts)} change="Below threshold" icon={AlertTriangle} />
        </div>
      )}
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Inventory Graph" subtitle="Live stock snapshot with monthly sold movement">
          <div className="h-80">
            {dashboardLoading ? (
              <Skeleton className="h-full rounded-2xl" />
            ) : hasInventoryTrend ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={inventoryTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7f0e3" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="currentStock" name="Current stock" stroke="#315f2e" strokeWidth={3} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="soldStock" name="Sold stock" stroke="#9bc991" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState>No inventory movement recorded yet.</EmptyState>
            )}
          </div>
        </Panel>
        <Panel title="Incoming vs Sold Stock" subtitle="Pending restocks against completed-order movement">
          <div className="h-80">
            {dashboardLoading ? (
              <Skeleton className="h-full rounded-2xl" />
            ) : hasStockMovement ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockMovement}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7f0e3" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="incomingStock" name="Incoming stock" fill="#9bc991" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="soldStock" name="Sold stock" fill="#315f2e" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState>No restock or sold-stock movement yet.</EmptyState>
            )}
          </div>
        </Panel>
      </div>
      <div className="mt-6">
        <Panel title="Product Stock Tracking" subtitle="Search, sort, filter, and update stock health">
          {productsLoading && <Spinner label="Loading inventory" />}
          {productsError && <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{productsError}</p>}
          {!productsLoading && !productsError && <SellerProductTable products={products} isDeletingId="" onDelete={() => {}} showToolbar />}
        </Panel>
      </div>
    </section>
  );
}
