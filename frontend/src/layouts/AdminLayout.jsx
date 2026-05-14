import DashboardShell from './DashboardShell.jsx';

const navItems = [
  { label: 'Users', to: '/admin/users' },
  { label: 'Sellers', to: '/admin/sellers' },
  { label: 'Products', to: '/admin/products' },
  { label: 'Orders', to: '/admin/orders' },
  { label: 'Analytics', to: '/admin/analytics' }
];

export default function AdminLayout() {
  return <DashboardShell title="Admin Panel" navItems={navItems} />;
}
