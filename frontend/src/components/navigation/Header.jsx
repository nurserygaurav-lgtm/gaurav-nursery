import { ChevronDown, Heart, LogOut, Menu, MessageCircle, PackageSearch, Search, ShoppingCart, UserRound, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { getCart, readStoredCartCount } from '../../services/cartService.js';
import { getWishlist, readStoredWishlistCount } from '../../services/wishlistService.js';
import { getRoleHome } from '../../utils/auth.js';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Plants', to: '/shop?category=Plants' },
  { label: 'Seeds', to: '/shop?category=Seeds' },
  { label: 'Pots & Planters', to: '/shop?category=Pots%20%26%20Planters' },
  { label: 'Fertilizers', to: '/shop?category=Fertilizers' },
  { label: 'Tools & Accessories', to: '/shop?category=Tools%20%26%20Accessories' },
  { label: 'Offers', to: '/shop' },
  { label: 'Blog', to: '/about' },
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
  const [cartCount, setCartCount] = useState(() => readStoredCartCount());
  const [wishlistCount, setWishlistCount] = useState(() => readStoredWishlistCount());

  useEffect(() => {
    function handleCartCountUpdate(event) {
      setCartCount(Number(event.detail?.count || 0));
    }

    function handleStorage(event) {
      if (event.key === 'gaurav_nursery_cart_count') setCartCount(readStoredCartCount());
    }

    window.addEventListener('cart-count-updated', handleCartCountUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('cart-count-updated', handleCartCountUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    function handleWishlistCountUpdate(event) {
      setWishlistCount(Number(event.detail?.count || 0));
    }

    function handleStorage(event) {
      if (event.key === 'gaurav_nursery_wishlist_count') setWishlistCount(readStoredWishlistCount());
    }

    window.addEventListener('wishlist-count-updated', handleWishlistCountUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('wishlist-count-updated', handleWishlistCountUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadCartCount() {
      if (!isAuthenticated) {
        localStorage.setItem('gaurav_nursery_cart_count', '0');
        if (isMounted) setCartCount(0);
        return;
      }

      try {
        const data = await getCart();
        if (isMounted) setCartCount(Number(data.summary?.itemCount || 0));
      } catch {
        if (isMounted) setCartCount(readStoredCartCount());
      }
    }

    loadCartCount();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    let isMounted = true;

    async function loadWishlistCount() {
      if (!isAuthenticated) {
        localStorage.setItem('gaurav_nursery_wishlist_count', '0');
        if (isMounted) setWishlistCount(0);
        return;
      }

      try {
        const data = await getWishlist();
        if (isMounted) setWishlistCount(Number(data.summary?.itemCount || data.summary?.count || data.wishlist?.products?.length || 0));
      } catch {
        if (isMounted) setWishlistCount(readStoredWishlistCount());
      }
    }

    loadWishlistCount();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

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
    <header className="sticky top-0 z-40 border-b border-[#dbe8d8] bg-white/95 backdrop-blur-xl">
      <div className="bg-[#0b3d1e] text-white">
        <div className="premium-container flex min-h-10 flex-wrap items-center justify-center gap-x-6 gap-y-1 px-2 py-2 text-center text-xs font-black sm:text-sm">
          <span>Welcome to Gaurav Nursery - Your Partner in Green Living</span>
          <span>Free Delivery on Orders Above Rs.499</span>
          <span>COD Available</span>
          <span>7 Days Easy Returns</span>
        </div>
      </div>

      <div className="premium-container flex min-h-24 items-center justify-between gap-2 py-4 sm:gap-3">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setIsMenuOpen(false)}>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0b3d1e] text-lg font-black text-white shadow-button">
            GN
          </span>
          <span className="hidden sm:block">
            <span className="block font-serif text-2xl font-black leading-none text-[#0b3d1e]">Gaurav Nursery</span>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#4caf50]">Premium Plant Studio</span>
          </span>
        </Link>

        <form className="hidden min-w-[18rem] flex-1 items-center lg:flex lg:max-w-2xl" onSubmit={handleSearch}>
          <label className="relative w-full">
            <span className="sr-only">Search products</span>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              className="form-input input-with-leading-icon input-with-search-button h-12 bg-[#f8fff5] text-sm"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search plants, seeds, tools"
              value={searchTerm}
            />
            <button className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#0b3d1e] text-white transition hover:bg-[#4caf50]" type="submit" aria-label="Search products">
              <Search size={16} />
            </button>
          </label>
        </form>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button className="rounded-full p-3 text-[#0b3d1e] transition hover:bg-[#eaf7e8] lg:hidden" onClick={() => setIsMenuOpen(true)} aria-label="Search">
            <Search size={20} />
          </button>
          <button
            type="button"
            className="relative rounded-full p-3 text-[#0b3d1e] transition hover:bg-[#eaf7e8]"
            aria-label="Wishlist"
            onClick={() => {
              if (!isAuthenticated) {
                navigate('/login');
                return;
              }
              navigate('/wishlist');
            }}
          >
            <Heart size={20} />
            {isAuthenticated && (
              <span className="absolute right-1.5 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#4caf50] px-1 text-[10px] font-black text-white">
                {wishlistCount}
              </span>
            )}
          </button>
          <Link className="relative rounded-full p-3 text-[#0b3d1e] transition hover:bg-[#eaf7e8]" to="/cart" aria-label="Cart">
            <ShoppingCart size={20} />
            <span className="absolute right-1.5 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#4caf50] px-1 text-[10px] font-black text-white">
              {cartCount}
            </span>
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <button className="flex items-center gap-2 rounded-full bg-[#eaf7e8] py-2 pl-2 pr-3 text-[#0b3d1e] transition hover:bg-[#dbe8d8]" onClick={() => setIsProfileOpen((current) => !current)} aria-expanded={isProfileOpen} aria-label="Account menu">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-soft">
                  <UserRound size={18} />
                </span>
                <ChevronDown size={16} />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-[#dbe8d8] bg-white p-2 shadow-card">
                  <Link className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-[#0b3d1e] hover:bg-[#eaf7e8]" to={getRoleHome(user.role)} onClick={() => setIsProfileOpen(false)}>
                    <UserRound size={17} />
                    My Account
                  </Link>
                  <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold text-[#0b3d1e] hover:bg-[#eaf7e8]" onClick={handleLogout}>
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link className="hidden items-center gap-2 rounded-full bg-[#0b3d1e] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#4caf50] sm:inline-flex" to="/login">
              <UserRound size={20} />
              Login/Register
            </Link>
          )}

          <a className="hidden items-center gap-2 rounded-full bg-[#25d366] px-4 py-2 text-sm font-black text-white shadow-button transition hover:-translate-y-0.5 hover:bg-[#1ebe5d] lg:inline-flex" href={whatsappUrl} rel="noreferrer" target="_blank">
            <MessageCircle size={18} />
            WhatsApp
          </a>

          <Link className="hidden items-center gap-2 rounded-full border border-[#dbe8d8] bg-white px-4 py-2 text-sm font-black text-[#0b3d1e] transition hover:-translate-y-0.5 hover:bg-[#eaf7e8] xl:inline-flex" to="/orders">
            <PackageSearch size={18} />
            Track Order
          </Link>

          <button className="rounded-full p-3 text-[#0b3d1e] transition hover:bg-[#eaf7e8] xl:hidden" onClick={() => setIsMenuOpen((current) => !current)} aria-label="Open menu">
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <nav className="hidden border-t border-[#dbe8d8] bg-[#f8fff5] xl:block">
        <div className="premium-container flex min-h-12 items-center justify-center gap-7">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `text-sm font-black transition ${isActive ? 'text-[#0b3d1e]' : 'text-stone-600 hover:text-[#4caf50]'}`}>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-[#dbe8d8] bg-white xl:hidden">
          <nav className="premium-container grid gap-2 py-4">
            <form className="relative mb-2" onSubmit={handleSearch}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input className="form-input input-with-leading-icon input-with-search-button" onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search plants, seeds, tools" value={searchTerm} />
              <button className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#0b3d1e] text-white transition hover:bg-[#4caf50]" type="submit" aria-label="Search products">
                <Search size={16} />
              </button>
            </form>
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `rounded-2xl px-4 py-3 text-sm font-bold transition ${isActive ? 'bg-[#eaf7e8] text-[#0b3d1e]' : 'text-stone-600 hover:bg-[#f8fff5]'}`}>
                {item.label}
              </NavLink>
            ))}
            {!isAuthenticated && (
              <Link className="rounded-2xl bg-[#0b3d1e] px-4 py-3 text-sm font-bold text-white" to="/login" onClick={() => setIsMenuOpen(false)}>
                Login/Register
              </Link>
            )}
            <Link className="flex items-center gap-3 rounded-2xl border border-[#dbe8d8] px-4 py-3 text-sm font-black text-[#0b3d1e]" to="/orders" onClick={() => setIsMenuOpen(false)}>
              <PackageSearch size={18} />
              Track Order
            </Link>
            <a className="flex items-center gap-3 rounded-2xl bg-[#25d366] px-4 py-3 text-sm font-black text-white" href={whatsappUrl} rel="noreferrer" target="_blank">
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
