import { ChevronDown, Heart, LogOut, Menu, MessageCircle, Search, ShoppingCart, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { getRoleHome } from '../../utils/auth.js';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Categories', to: '/categories' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
];

const whatsappUrl = 'https://wa.me/916352031504';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  function handleLogout() {
    logout();
    showToast('Logged out successfully');
    navigate('/');
  }

  function handleSearch(event) {
    event.preventDefault();
    const query = searchTerm.trim();
    navigate(query ? `/shop?search=${encodeURIComponent(query)}` : '/shop');
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-leaf-100/80 bg-white/90 backdrop-blur-xl">
      <div className="bg-leaf-900 text-white">
        <div className="premium-container flex min-h-9 items-center justify-center px-2 py-2 text-center text-xs font-black uppercase tracking-[0.16em] sm:text-sm">
          FREE DELIVERY on orders above ₹499 | COD Available
        </div>
      </div>

      <div className="premium-container flex min-h-20 items-center justify-between gap-3 py-3">
        <Link to="/" className="flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-leaf-900 text-lg font-black text-white shadow-button">
            GN
          </span>
          <span className="hidden sm:block">
            <span className="block text-lg font-black leading-none text-leaf-950">Gaurav Nursery</span>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-leaf-500">Plant Studio</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 xl:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `text-sm font-bold transition ${isActive ? 'text-leaf-800' : 'text-stone-600 hover:text-leaf-700'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <form className="hidden min-w-0 flex-1 items-center xl:flex xl:max-w-sm" onSubmit={handleSearch}>
          <label className="relative w-full">
            <span className="sr-only">Search products</span>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              className="form-input h-11 pl-11 pr-4 text-sm"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search plants, seeds, tools"
              value={searchTerm}
            />
          </label>
        </form>

        <div className="flex items-center gap-1 sm:gap-2">
          <button className="rounded-full p-3 text-leaf-900 transition hover:bg-leaf-50 xl:hidden" onClick={() => setIsMenuOpen(true)} aria-label="Search">
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
              Login/Register
            </Link>
          )}

          <a
            className="hidden items-center gap-2 rounded-full bg-[#25d366] px-4 py-2 text-sm font-black text-white shadow-button transition hover:-translate-y-0.5 hover:bg-[#1ebe5d] lg:inline-flex"
            href={whatsappUrl}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle size={18} />
            WhatsApp
          </a>

          <button
            className="rounded-full p-3 text-leaf-900 transition hover:bg-leaf-50 xl:hidden"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label="Open menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-leaf-100 bg-white xl:hidden">
          <nav className="premium-container grid gap-2 py-4">
            <form className="relative mb-2" onSubmit={handleSearch}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input
                className="form-input pl-11"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search plants, seeds, tools"
                value={searchTerm}
              />
            </form>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
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
                Login/Register
              </Link>
            )}
            <a
              className="flex items-center gap-3 rounded-2xl bg-[#25d366] px-4 py-3 text-sm font-black text-white"
              href={whatsappUrl}
              rel="noreferrer"
              target="_blank"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
