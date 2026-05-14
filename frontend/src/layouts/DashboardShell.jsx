import { LogOut } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';

export default function DashboardShell({ title, navItems }) {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    showToast('Logged out successfully');
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-leaf-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-leaf-100 bg-white p-6 md:block">
        <h1 className="text-2xl font-black text-leaf-900">{title}</h1>
        <nav className="mt-8 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 text-sm font-semibold ${isActive ? 'bg-leaf-600 text-white' : 'text-stone-600 hover:bg-leaf-50 hover:text-leaf-900'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          className="mt-8 flex w-full items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-stone-600 hover:bg-leaf-50 hover:text-leaf-900"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>
      <main className="px-4 py-6 md:ml-64 md:px-8">
        <Outlet />
      </main>
    </div>
  );
}
