import { BarChart3, BadgePercent, ClipboardCheck, Gauge, Layers3, PackageSearch, ReceiptText, Settings, ShoppingBag, Star, Tags, Users } from 'lucide-react';
import DashboardShell from './DashboardShell.jsx';

const navItems = [
  { label: 'Dashboard', to: '/admin', end: true, icon: Gauge },
  { label: 'Sellers', to: '/admin/sellers', icon: ClipboardCheck },
  { label: 'Products', to: '/admin/products', icon: PackageSearch },
  { label: 'Categories', to: '/admin/categories', icon: Tags },
  { label: 'Orders', to: '/admin/orders', icon: ShoppingBag },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Transactions', to: '/admin/transactions', icon: ReceiptText },
  { label: 'Reports', to: '/admin/reports', icon: Layers3 },
  { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
  { label: 'Coupons', to: '/admin/coupons', icon: BadgePercent },
  { label: 'Reviews', to: '/admin/reviews', icon: Star },
  { label: 'Settings', to: '/admin/settings', icon: Settings }
];

export default function AdminLayout() {
  return <DashboardShell title="Admin Panel" navItems={navItems} />;
}
