import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Search,
  Sun,
  X
} from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';

export default function DashboardShell({ title, navItems }) {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  function handleLogout() {
    logout();
    showToast('Logged out successfully');
    navigate('/');
  }

  const sidebar = (
    <aside className="flex h-full flex-col bg-leaf-950 text-white">
      <div className="border-b border-white/10 p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-lg font-black text-leaf-950">GN</span>
          <div>
            <h1 className="text-lg font-black leading-none">{title}</h1>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-leaf-200">Nursery OS</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition',
                isActive ? 'bg-white text-leaf-950 shadow-soft' : 'text-leaf-100 hover:bg-white/10 hover:text-white'
              )
            }
          >
            {item.icon && <item.icon size={18} />}
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <button
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-leaf-100 transition hover:bg-white/10 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className={clsx('min-h-screen', isDark ? 'bg-leaf-950' : 'bg-[#f3f7ef]')}>
      <div className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">{sidebar}</div>
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-leaf-950/60" onClick={() => setIsMenuOpen(false)} aria-label="Close menu" />
          <div className="relative h-full w-80 max-w-[86vw]">{sidebar}</div>
        </div>
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/70 bg-white/75 backdrop-blur-xl">
          <div className="flex min-h-20 items-center gap-4 px-4 sm:px-6 xl:px-8">
            <button className="rounded-full p-3 text-leaf-900 hover:bg-leaf-50 lg:hidden" onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="relative hidden max-w-xl flex-1 md:block">
              <Search className="absolute left-4 top-3.5 text-stone-400" size={18} />
              <input className="form-input pl-11" placeholder="Search orders, products, customers" />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className="rounded-full p-3 text-leaf-900 transition hover:bg-leaf-50" aria-label="Notifications">
                <Bell size={20} />
              </button>
              <button className="rounded-full p-3 text-leaf-900 transition hover:bg-leaf-50" aria-label="Messages">
                <MessageSquare size={20} />
              </button>
              <button className="rounded-full p-3 text-leaf-900 transition hover:bg-leaf-50" onClick={() => setIsDark((current) => !current)} aria-label="Toggle theme">
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button className="flex items-center gap-3 rounded-full bg-white py-2 pl-2 pr-3 shadow-soft">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-leaf-900 text-sm font-black text-white">
                  {user?.name?.slice(0, 1) || 'G'}
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-sm font-black text-leaf-950">{user?.name || 'Gaurav Nursery'}</span>
                  <span className="text-xs font-bold capitalize text-stone-500">{user?.role || 'seller'}</span>
                </span>
                <ChevronDown className="hidden text-stone-400 sm:block" size={16} />
              </button>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 xl:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
