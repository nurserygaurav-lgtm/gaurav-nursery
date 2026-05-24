import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  Building2,
  ChevronDown,
  CircleX,
  Flower2,
  Gem,
  Gift,
  Heart,
  Leaf,
  LogOut,
  Menu,
  MessageCircle,
  MapPin,
  Moon,
  Package,
  PackageSearch,
  Search,
  Shovel,
  ShoppingCart,
  Sparkles,
  Sprout,
  Sun,
  Tag,
  TrendingUp,
  Store,
  UserRound,
  Wheat,
  Wrench
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from '../brand/BrandLogo.jsx';
import { brandContact } from '../../data/brandContent.js';
import { megaMenuItems } from '../../data/megaMenuData.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { getCart, readStoredCartCount } from '../../services/cartService.js';
import { getWishlist, readStoredWishlistCount } from '../../services/wishlistService.js';
import { getRoleHome } from '../../utils/auth.js';
import {
  safeLocalStorageGet,
  safeLocalStorageRemove,
  safeLocalStorageSet
} from '../../utils/storage.js';

const iconMap = {
  Building2,
  Flower2,
  Gem,
  Gift,
  Leaf,
  Package,
  Shovel,
  Sprout,
  Wheat,
  Wrench
};

const quickLinks = [
  { label: 'Offers', to: '/shop' },
  { label: 'All Categories', to: '/categories' },
  { label: 'Support', to: '/support' },
  { label: 'Contact', to: '/contact' }
];

const whatsappUrl = 'https://wa.me/916352031504';
const PINCODE_KEY = 'gaurav_nursery_pincode';

function MenuIcon({ name, className = '', size = 18 }) {
  const Icon = iconMap[name] || Leaf;
  return <Icon className={className} size={size} />;
}

function CountBadge({ children }) {
  return (
    <span className="absolute right-1.5 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#4caf50] px-1 text-[10px] font-black text-white">
      {children}
    </span>
  );
}

function MegaMenuPanel({ menu }) {
  return (
    <motion.div
      className="absolute left-1/2 top-full z-50 w-[min(96vw,72rem)] -translate-x-1/2 px-2 pt-3"
      initial={{ opacity: 0, y: 14, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.99 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <div className="overflow-hidden rounded-[1.25rem] border border-white/80 bg-white/95 shadow-[0_28px_80px_rgba(13,31,14,0.18)] backdrop-blur-xl">
        <div className="grid max-h-[74vh] grid-cols-[minmax(0,1fr)_18rem] overflow-y-auto">
          <div className="p-5 lg:p-6">
            <div className="mb-4 flex items-center justify-between gap-4 border-b border-leaf-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-800 shadow-soft">
                  <MenuIcon name={menu.icon} size={23} />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf-600">{menu.badge}</p>
                  <h2 className="text-[clamp(1.25rem,1.8vw,2rem)] font-black text-leaf-950">{menu.label}</h2>
                  <p className="text-[clamp(0.8rem,1vw,0.95rem)] font-semibold text-stone-500">{menu.tagline}</p>
                </div>
              </div>
              <Link
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-leaf-900 px-3.5 py-2 text-sm font-black text-white shadow-button transition hover:-translate-y-0.5 hover:bg-leaf-700"
                to={menu.shopAllTo}
              >
                Shop All
                <Sparkles size={16} />
              </Link>
            </div>

            <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
              {menu.sections.map((section) => (
                <div key={section.title} className="min-w-0">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-black text-leaf-950">
                    <span className="h-2 w-2 rounded-full bg-leaf-500" />
                    {section.title}
                  </h3>
                  <div className="grid gap-1.5">
                    {section.items.map((item, index) => (
                      <Link
                        key={item.label}
                        className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm font-bold text-stone-600 transition hover:bg-leaf-50 hover:text-leaf-900"
                        to={item.to}
                      >
                        <span className="truncate">{item.label}</span>
                        {(index === 0 || item.label.includes('Best Seller') || item.label.includes('Top')) && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-700 opacity-90 transition group-hover:bg-emerald-600 group-hover:text-white">
                            Trending
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="border-l border-leaf-100 bg-gradient-to-b from-leaf-50 via-white to-[#f7fbf0] p-4 lg:p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-leaf-600">Featured Picks</p>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-700">Trending</span>
            </div>
            <Link className="group relative block overflow-hidden rounded-2xl bg-leaf-950" to={menu.to}>
              <img className="h-40 w-full object-cover opacity-80 transition duration-700 group-hover:scale-105 lg:h-44" src={menu.image} alt={menu.label} loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-leaf-950 via-leaf-950/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-[11px] font-black uppercase backdrop-blur">
                  <Tag size={12} />
                  Featured Banner
                </span>
                <h3 className="text-[clamp(1.05rem,1.3vw,1.25rem)] font-black">{menu.label} Collection</h3>
                <p className="mt-1 text-[clamp(0.82rem,1vw,0.95rem)] font-semibold text-white/80">Curated picks from Gaurav Nursery.</p>
              </div>
            </Link>

            <div className="mt-5">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-black text-leaf-950">
                <TrendingUp size={17} />
                Top Selling
              </h3>
              <div className="grid gap-3">
                {menu.featured.map((product) => (
                  <Link key={product.name} className="group flex gap-3 rounded-2xl border border-leaf-100 bg-white p-2 shadow-soft transition hover:-translate-y-0.5 hover:border-leaf-300 hover:shadow-card" to={menu.shopAllTo}>
                    <img className="h-16 w-16 shrink-0 rounded-xl object-cover" src={product.image} alt={product.name} loading="lazy" decoding="async" />
                    <span className="min-w-0 py-1">
                      <span className="block truncate text-sm font-black text-leaf-950 group-hover:text-leaf-700">{product.name}</span>
                      <span className="mt-1 inline-flex rounded-full bg-leaf-100 px-2.5 py-1 text-[11px] font-black text-leaf-800">{product.price}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
}

function MobileAccordion({ menu, isOpen, onToggle, onNavigate }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-leaf-100 bg-white">
      <button className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left" onClick={onToggle} type="button" aria-expanded={isOpen}>
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leaf-100 text-leaf-800">
            <MenuIcon name={menu.icon} size={20} />
          </span>
          <span className="min-w-0">
            <span className="block font-black text-leaf-950">{menu.label}</span>
            <span className="block truncate text-xs font-semibold text-stone-500">{menu.tagline}</span>
          </span>
        </span>
        <ChevronDown className={`shrink-0 text-leaf-700 transition ${isOpen ? 'rotate-180' : ''}`} size={18} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}>
            <div className="grid gap-4 border-t border-leaf-100 p-4">
              <Link className="rounded-full bg-leaf-900 px-4 py-3 text-center text-sm font-black text-white" to={menu.shopAllTo} onClick={onNavigate}>
                Shop All {menu.label}
              </Link>
              {menu.sections.map((section) => (
                <div key={section.title}>
                  <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-leaf-600">{section.title}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {section.items.map((item) => (
                      <Link key={item.label} className="rounded-xl bg-leaf-50 px-3 py-2.5 text-sm font-bold text-stone-700" to={item.to} onClick={onNavigate}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [openMobileMenu, setOpenMobileMenu] = useState(megaMenuItems[1]?.slug || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(() => readStoredCartCount());
  const [wishlistCount, setWishlistCount] = useState(() => readStoredWishlistCount());
  const [isDarkMode, setIsDarkMode] = useState(() => safeLocalStorageGet('theme') === 'dark');
  const [deliveryPincode, setDeliveryPincode] = useState(() => safeLocalStorageGet(PINCODE_KEY) || '');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDarkMode);
    safeLocalStorageSet('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    if (deliveryPincode) {
      safeLocalStorageSet(PINCODE_KEY, deliveryPincode);
    } else {
      safeLocalStorageRemove(PINCODE_KEY);
    }
  }, [deliveryPincode]);

  useEffect(() => {
    async function syncCounts() {
      try {
        await Promise.all([getCart(), getWishlist()]);
      } catch {
        // ignore sync errors
      }
    }

    syncCounts();
  }, [isAuthenticated]);

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
        safeLocalStorageSet('gaurav_nursery_cart_count', '0');
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
    setActiveMenu(null);
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let isMounted = true;

    async function loadWishlistCount() {
      if (!isAuthenticated) {
        safeLocalStorageSet('gaurav_nursery_wishlist_count', '0');
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

  function closeMobileMenu() {
    setIsMenuOpen(false);
  }

  function closeDesktopMenu() {
    setActiveMenu(null);
  }

  function handleThemeToggle() {
    setIsDarkMode((current) => !current);
  }

  function handleLogout() {
    logout();
    showToast('Logged out successfully');
    setIsProfileOpen(false);
    navigate('/');
  }

  function handleSearch(event) {
    event.preventDefault();
    const query = searchTerm.trim();
    navigate(query ? `/shop?search=${encodeURIComponent(query)}` : '/shop');
    setIsMenuOpen(false);
  }

  function handlePinClick() {
    const nextPin = window.prompt('Enter delivery pincode', deliveryPincode);
    if (nextPin === null) return;

    const normalized = nextPin.trim();
    if (normalized && !/^\d{6}$/.test(normalized)) {
      showToast('Please enter a valid 6 digit pincode', 'error');
      return;
    }

    setDeliveryPincode(normalized);
    showToast(normalized ? `Delivery pin set to ${normalized}` : 'Delivery pin cleared');
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 shadow-soft backdrop-blur-xl dark:bg-[#07140b]/90 dark:border-b dark:border-white/10">
      <div className="bg-[#0b3d1e] text-white">
        <div className="premium-container flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-[clamp(0.65rem,0.9vw,0.8rem)] font-black uppercase tracking-[0.2em] text-white/90 sm:gap-3 sm:text-sm">
          <button type="button" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 transition hover:bg-white/15" onClick={handlePinClick}>
            <MapPin size={14} />
            Deliver to {deliveryPincode || 'enter pin'}
          </button>
          <span className="hidden sm:inline-flex">{brandContact.address}</span>
          <span className="hidden sm:inline-flex">Official support: {brandContact.supportPhone}</span>
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/95">Customer support across India</span>
        </div>
      </div>

      <div className="premium-container flex min-h-16 items-center justify-between gap-2 py-2.5 sm:min-h-20 sm:gap-3 sm:py-3">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={closeMobileMenu}>
          <BrandLogo compact className="sm:hidden" />
          <BrandLogo className="hidden sm:inline-flex max-w-[14rem]" />
        </Link>

        <form className="hidden min-w-[16rem] flex-1 items-center lg:flex lg:max-w-2xl" onSubmit={handleSearch}>
          <label className="relative w-full">
            <span className="sr-only">Search products</span>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              className="form-input input-with-leading-icon input-with-search-button h-11 bg-[#f8fff5] text-sm xl:h-12"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search plants, seeds, planters, gifts"
              value={searchTerm}
            />
            <button className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#0b3d1e] text-white transition hover:bg-[#4caf50]" type="submit" aria-label="Search products">
              <Search size={16} />
            </button>
          </label>
        </form>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <button type="button" className="rounded-full border border-[#dbe8d8] bg-white/95 p-2.5 text-[#0b3d1e] transition hover:bg-[#f4fff2] sm:p-3" onClick={handleThemeToggle} aria-label="Toggle theme">
            {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button className="rounded-full border border-[#dbe8d8] bg-white/95 p-2.5 text-[#0b3d1e] transition hover:bg-[#f4fff2] sm:p-3" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <button className="rounded-full p-2.5 text-[#0b3d1e] transition hover:bg-[#eaf7e8] lg:hidden sm:p-3" onClick={() => setIsMenuOpen(true)} aria-label="Open mobile menu">
            <Menu size={20} />
          </button>
          <button
            type="button"
            className="relative rounded-full p-2.5 text-[#0b3d1e] transition hover:bg-[#eaf7e8] sm:p-3"
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
            {isAuthenticated && <CountBadge>{wishlistCount}</CountBadge>}
          </button>
          <Link className="relative rounded-full p-3 text-[#0b3d1e] transition hover:bg-[#eaf7e8]" to="/cart" aria-label="Cart">
            <ShoppingCart size={20} />
            <CountBadge>{cartCount}</CountBadge>
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <button className="flex items-center gap-2 rounded-full bg-[#eaf7e8] py-2 pl-2 pr-3 text-[#0b3d1e] transition hover:bg-[#dbe8d8]" onClick={() => setIsProfileOpen((current) => !current)} aria-expanded={isProfileOpen} aria-label="Account menu">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-soft">
                  <UserRound size={18} />
                </span>
                <ChevronDown size={16} />
              </button>
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    className="absolute right-0 z-50 mt-3 w-56 rounded-2xl border border-[#dbe8d8] bg-white p-2 shadow-card"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                  >
                    <Link className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-[#0b3d1e] hover:bg-[#eaf7e8]" to={getRoleHome(user.role)} onClick={() => setIsProfileOpen(false)}>
                      <UserRound size={17} />
                      My Account
                    </Link>
                    <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold text-[#0b3d1e] hover:bg-[#eaf7e8]" onClick={handleLogout}>
                      <LogOut size={17} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link className="inline-flex items-center gap-2 rounded-full border border-[#dbe8d8] bg-white px-3.5 py-2 text-sm font-black text-[#0b3d1e] transition hover:-translate-y-0.5 hover:bg-[#eaf7e8] lg:px-4" to="/register?role=seller">
                <Store size={18} />
                Sell on Gaurav Nursery
              </Link>
              <Link className="inline-flex items-center gap-2 rounded-full bg-[#0b3d1e] px-3.5 py-2 text-sm font-bold text-white transition hover:bg-[#4caf50] lg:px-4" to="/login">
              <UserRound size={20} />
              Login/Register
              </Link>
            </div>
          )}

          <a className="hidden items-center gap-2 rounded-full bg-[#25d366] px-3.5 py-2 text-sm font-black text-white shadow-button transition hover:-translate-y-0.5 hover:bg-[#1ebe5d] lg:inline-flex lg:px-4" href={whatsappUrl} rel="noreferrer" target="_blank">
            <MessageCircle size={18} />
            WhatsApp
          </a>

          <Link className="hidden items-center gap-2 rounded-full border border-[#dbe8d8] bg-white px-3.5 py-2 text-sm font-black text-[#0b3d1e] transition hover:-translate-y-0.5 hover:bg-[#eaf7e8] 2xl:inline-flex lg:px-4" to="/orders">
            <PackageSearch size={18} />
            Track Order
          </Link>
        </div>
      </div>

      <nav className="relative hidden border-t border-[#dbe8d8] bg-[#f8fff5]/95 xl:block" onMouseLeave={closeDesktopMenu}>
        <div className="premium-container flex min-h-12 items-center justify-center gap-1">
          {megaMenuItems.map((item) => (
            <div key={item.slug} className="py-2" onMouseEnter={() => setActiveMenu(item.slug)}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-full px-2.5 py-2 text-sm font-black transition xl:px-3 ${isActive || activeMenu === item.slug ? 'bg-white text-[#0b3d1e] shadow-soft' : 'text-stone-600 hover:bg-white hover:text-[#4caf50]'}`
                }
                onClick={() => setActiveMenu(item.slug)}
              >
                <MenuIcon name={item.icon} size={16} />
                {item.label}
                <ChevronDown size={14} />
              </NavLink>
            </div>
          ))}
          {quickLinks.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `rounded-full px-2.5 py-2 text-sm font-black transition xl:px-3 ${isActive ? 'bg-white text-[#0b3d1e] shadow-soft' : 'text-stone-600 hover:bg-white hover:text-[#4caf50]'}`}>
              {item.label}
            </NavLink>
          ))}
          {activeMenu && (
            <button type="button" className="ml-2 inline-flex items-center gap-2 rounded-full bg-[#0b3d1e] px-3 py-2 text-sm font-black text-white shadow-soft" onClick={closeDesktopMenu}>
              <CircleX size={16} />
              Close menu
            </button>
          )}
        </div>
        <AnimatePresence>{activeMenu && <MegaMenuPanel key={activeMenu} menu={megaMenuItems.find((item) => item.slug === activeMenu)} />}</AnimatePresence>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div className="absolute inset-x-0 top-full z-50 max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-[#dbe8d8] bg-[#f7faf5] shadow-card xl:hidden" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <nav className="premium-container grid gap-3 py-4">
              <form className="relative" onSubmit={handleSearch}>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input className="form-input input-with-leading-icon input-with-search-button bg-white" onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search plants, seeds, tools" value={searchTerm} />
                <button className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#0b3d1e] text-white transition hover:bg-[#4caf50]" type="submit" aria-label="Search products">
                  <Search size={16} />
                </button>
              </form>

              {megaMenuItems.map((item) => (
                <MobileAccordion
                  key={item.slug}
                  menu={item}
                  isOpen={openMobileMenu === item.slug}
                  onToggle={() => setOpenMobileMenu((current) => (current === item.slug ? '' : item.slug))}
                  onNavigate={closeMobileMenu}
                />
              ))}

              <div className="grid gap-2 rounded-2xl border border-leaf-100 bg-white p-3">
                <button type="button" className="rounded-xl bg-[#f7fff5] px-3.5 py-3 text-left text-sm font-black text-[#0b3d1e]" onClick={handlePinClick}>
                  <span className="block text-[11px] uppercase tracking-[0.18em] text-stone-500">Deliver to</span>
                  {deliveryPincode || 'Enter your pincode'}
                </button>
                <Link className="rounded-xl border border-[#dbe8d8] bg-white px-3.5 py-3 text-sm font-black text-[#0b3d1e]" to="/register?role=seller" onClick={closeMobileMenu}>
                  Sell on Gaurav Nursery
                </Link>
                {quickLinks.map((item) => (
                  <NavLink key={item.to} to={item.to} onClick={closeMobileMenu} className={({ isActive }) => `rounded-xl px-3.5 py-3 text-sm font-bold transition ${isActive ? 'bg-[#eaf7e8] text-[#0b3d1e]' : 'text-stone-600 hover:bg-[#f8fff5]'}`}>
                    {item.label}
                  </NavLink>
                ))}
                {!isAuthenticated && (
                  <Link className="rounded-xl bg-[#0b3d1e] px-3.5 py-3 text-sm font-bold text-white" to="/login" onClick={closeMobileMenu}>
                    Login/Register
                  </Link>
                )}
                <Link className="flex items-center gap-3 rounded-xl border border-[#dbe8d8] px-3.5 py-3 text-sm font-black text-[#0b3d1e]" to="/orders" onClick={closeMobileMenu}>
                  <PackageSearch size={18} />
                  Track Order
                </Link>
                <a className="flex items-center gap-3 rounded-xl bg-[#25d366] px-3.5 py-3 text-sm font-black text-white" href={whatsappUrl} rel="noreferrer" target="_blank">
                  <MessageCircle size={18} />
                  WhatsApp
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
