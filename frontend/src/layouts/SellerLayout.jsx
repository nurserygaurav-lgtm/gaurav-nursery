import { BarChart3, Boxes, Gauge, IndianRupee, MessageSquareText, PackagePlus, PackageSearch, Settings, ShoppingBag, Star, Users } from 'lucide-react';
import DashboardShell from './DashboardShell.jsx';

const navItems = [
  { label: 'Dashboard', to: '/seller', end: true, icon: Gauge },
  { label: 'Products', to: '/seller/products', icon: PackageSearch },
  { label: 'Add Product', to: '/seller/products/new', icon: PackagePlus },
  { label: 'Orders', to: '/seller/orders', icon: ShoppingBag },
  { label: 'Customers', to: '/seller/customers', icon: Users },
  { label: 'Analytics', to: '/seller/analytics', icon: BarChart3 },
  { label: 'Inventory', to: '/seller/inventory', icon: Boxes },
  { label: 'Earnings', to: '/seller/earnings', icon: IndianRupee },
  { label: 'Reviews', to: '/seller/reviews', icon: Star },
  { label: 'Settings', to: '/seller/settings', icon: Settings },
  { label: 'Messages', to: '/seller/messages', icon: MessageSquareText }
];

export default function SellerLayout() {
  return <DashboardShell title="Seller Panel" navItems={navItems} />;
}
