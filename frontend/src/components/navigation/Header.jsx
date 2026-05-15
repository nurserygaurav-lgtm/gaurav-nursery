import { ChevronDown, Heart, LogOut, Menu, Search, ShoppingCart, UserRound, X } from 'lucide-react';
import { useState } from 'react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  function handleLogout() {
    logout();
    showToast('Logged out successfully');
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-leaf-100/80 bg-white/85 backdrop-blur-xl">
      <div className="premium-container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-leaf-900 text-lg font-black text-white shadow-button">
            GN
          </span>
          <span>
            <span className="block text-lg font-black leading-none text-leaf-950">Gaurav Nursery</span>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-leaf-500">Plant Studio</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-bold transition ${isActive ? 'text-leaf-800' : 'text-stone-600 hover:text-leaf-700'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button className="hidden rounded-full p-3 text-leaf-900 transition hover:bg-leaf-50 sm:inline-flex" aria-label="Search">
            <Search size={20} />
          </button>
          <Link className="relative rounded-full p-3 text-leaf-900 transition hover:bg-leaf-50" to="/wishlist" aria-label="Wishlist">
            <Heart size={20} />
          </Link>
          <Link className="relative rounded-full p-3 text-leaf-900 transition hover:bg-leaf-50" to="/cart" aria-label="Cart">
            <ShoppingCart size={20} />
            <span className="absolute right-1.5 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-leaf-700 px-1 text-[10px] font-black text-white">
              0
            </span>
          </Link>
          {isAuthenticated ? (
            <div className="relative">
              <button
                className="flex items-center gap-2 rounded-full bg-leaf-50 py-2 pl-2 pr-3 text-leaf-950 transition hover:bg-leaf-100"
                onClick={() => setIsProfileOpen((current) => !current)}
                aria-expanded={isProfileOpen}
                aria-label="Account menu"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-soft">
                  <UserRound size={18} />
                </span>
                <ChevronDown size={16} />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-leaf-100 bg-white p-2 shadow-card">
                  <Link
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-leaf-900 hover:bg-leaf-50"
                    to={getRoleHome(user.role)}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <UserRound size={17} />
                    My Account
                  </Link>
                  <button
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold text-leaf-900 hover:bg-leaf-50"
                    onClick={handleLogout}
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link className="hidden items-center gap-2 rounded-full bg-leaf-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-leaf-700 sm:inline-flex" to="/login">
                <UserRound size={20} />
              Login
              </Link>
          )}
          <button
            className="rounded-full p-3 text-leaf-900 transition hover:bg-leaf-50 lg:hidden"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label="Open menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="border-t border-leaf-100 bg-white lg:hidden">
          <nav className="premium-container grid gap-2 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm font-bold transition ${isActive ? 'bg-leaf-100 text-leaf-900' : 'text-stone-600 hover:bg-leaf-50'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {!isAuthenticated && (
              <Link className="rounded-2xl bg-leaf-900 px-4 py-3 text-sm font-bold text-white" to="/login" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
