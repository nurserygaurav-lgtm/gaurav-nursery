import StatCard from '../../components/dashboard/StatCard.jsx';
import SellerProductTable from '../../components/product/SellerProductTable.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useSellerProducts } from '../../hooks/useSellerProducts.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function SellerDashboard() {
  const { products, isLoading, error } = useSellerProducts();
  const activeProducts = products.filter((product) => product.status === 'active');
  const lowStockProducts = products.filter((product) => Number(product.stock) < 5);
  const inventoryValue = products.reduce((total, product) => total + Number(product.price || 0) * Number(product.stock || 0), 0);

  return (
    <section>
      <h1 className="text-3xl font-black text-leaf-900">Seller Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Products" value={String(products.length)} />
        <StatCard label="Active" value={String(activeProducts.length)} />
        <StatCard label="Low Stock" value={String(lowStockProducts.length)} />
        <StatCard label="Inventory" value={formatCurrency(inventoryValue)} />
      </div>
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-black text-leaf-900">Recent Listings</h2>
        {isLoading && (
          <div className="rounded-lg bg-white p-6 text-leaf-700 shadow-soft">
            <Spinner label="Loading products" />
          </div>
        )}
        {error && <p className="rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
        {!isLoading && !error && <SellerProductTable products={products.slice(0, 5)} isDeletingId="" onDelete={() => {}} />}
      </div>
    </section>
  );
}
