import DashboardShell from './DashboardShell.jsx';

const navItems = [
  { label: 'Dashboard', to: '/seller', end: true },
  { label: 'Add Product', to: '/seller/products/new' },
  { label: 'Manage Products', to: '/seller/products' },
  { label: 'Orders', to: '/seller/orders' },
  { label: 'Earnings', to: '/seller/earnings' }
];

export default function SellerLayout() {
  return <DashboardShell title="Seller Panel" navItems={navItems} />;
}
