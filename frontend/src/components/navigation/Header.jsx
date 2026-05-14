import { LogOut, Menu, Search, ShoppingCart, UserRound } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { getRoleHome } from '../../utils/auth.js';

const navItems = [
  { label: 'Shop', to: '/shop' },
  { label: 'Categories', to: '/categories' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
];

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    showToast('Logged out successfully');
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-leaf-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-black text-leaf-900">
          Gaurav Nursery
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition ${isActive ? 'text-leaf-700' : 'text-stone-600 hover:text-leaf-700'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button className="rounded-lg p-2 text-leaf-900 hover:bg-leaf-50" aria-label="Search">
            <Search size={20} />
          </button>
          <Link className="rounded-lg p-2 text-leaf-900 hover:bg-leaf-50" to="/cart" aria-label="Cart">
            <ShoppingCart size={20} />
          </Link>
          {isAuthenticated ? (
            <>
              <Link className="rounded-lg p-2 text-leaf-900 hover:bg-leaf-50" to={getRoleHome(user.role)} aria-label="Account">
                <UserRound size={20} />
              </Link>
              <button className="rounded-lg p-2 text-leaf-900 hover:bg-leaf-50" onClick={handleLogout} aria-label="Logout">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link className="rounded-lg p-2 text-leaf-900 hover:bg-leaf-50" to="/login" aria-label="Account">
              <UserRound size={20} />
            </Link>
          )}
          <button className="rounded-lg p-2 text-leaf-900 hover:bg-leaf-50 md:hidden" aria-label="Open menu">
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}
