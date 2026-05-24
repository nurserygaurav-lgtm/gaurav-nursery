import { Grid, Home, Search, ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/categories', icon: Grid, label: 'Categories' },
  { to: '/shop', icon: Search, label: 'Search' },
  { to: '/cart', icon: ShoppingCart, label: 'Cart' },
  { to: '/wishlist', icon: Heart, label: 'Wishlist' }
];

export default function MobileBottomNav() {
  return (
    <nav className="mobile-bottom-nav lg:hidden">
      {navItems.map(({ to, icon: Icon, label }) => (
        <Link key={label} to={to} className="mobile-bottom-nav__link" aria-label={label}>
          <Icon size={18} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
