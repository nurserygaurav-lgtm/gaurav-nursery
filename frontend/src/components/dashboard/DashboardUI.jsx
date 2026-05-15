import { motion } from 'framer-motion';
import { ArrowUpRight, MoreHorizontal, Search } from 'lucide-react';
import clsx from 'clsx';

export function PageHeader({ eyebrow, title, text, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow && <p className="text-xs font-black uppercase tracking-[0.22em] text-leaf-600">{eyebrow}</p>}
        <h1 className="mt-2 text-3xl font-black tracking-tight text-leaf-950 sm:text-4xl">{title}</h1>
        {text && <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">{text}</p>}
      </div>
      {action}
    </div>
  );
}

export function MetricCard({ label, value, change, icon: Icon, tone = 'light' }) {
  const isDark = tone === 'dark';

  return (
    <motion.article
      className={clsx(
        'rounded-3xl border p-5 shadow-soft transition hover:shadow-card',
        isDark ? 'border-leaf-800 bg-leaf-950 text-white' : 'border-white/80 bg-white/85 text-leaf-950 backdrop-blur'
      )}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={clsx('text-sm font-bold', isDark ? 'text-leaf-100' : 'text-stone-500')}>{label}</p>
          <p className="mt-3 text-2xl font-black sm:text-3xl">{value}</p>
        </div>
        {Icon && (
          <span className={clsx('flex h-12 w-12 items-center justify-center rounded-2xl', isDark ? 'bg-white/10' : 'bg-leaf-100 text-leaf-800')}>
            <Icon size={22} />
          </span>
        )}
      </div>
      {change && (
        <p className={clsx('mt-4 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black', isDark ? 'bg-white/10 text-leaf-100' : 'bg-leaf-50 text-leaf-700')}>
          <ArrowUpRight size={14} />
          {change}
        </p>
      )}
    </motion.article>
  );
}

export function Panel({ title, subtitle, children, action, className = '' }) {
  return (
    <section className={clsx('rounded-3xl border border-white/80 bg-white/85 p-5 shadow-soft backdrop-blur', className)}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-leaf-950">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-stone-500">{subtitle}</p>}
        </div>
        {action || (
          <button className="rounded-full p-2 text-stone-400 transition hover:bg-leaf-50 hover:text-leaf-900" aria-label="More options">
            <MoreHorizontal size={20} />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

export function StatusPill({ status = 'active' }) {
  const normalized = String(status).toLowerCase();
  const tone =
    normalized.includes('delivered') || normalized.includes('active') || normalized.includes('paid')
      ? 'bg-emerald-50 text-emerald-700'
      : normalized.includes('pending') || normalized.includes('low')
        ? 'bg-amber-50 text-amber-700'
        : normalized.includes('cancel') || normalized.includes('inactive')
          ? 'bg-red-50 text-red-700'
          : 'bg-leaf-50 text-leaf-700';

  return <span className={clsx('rounded-full px-3 py-1 text-xs font-black capitalize', tone)}>{status}</span>;
}

export function TableToolbar({ placeholder = 'Search', right }) {
  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-4 top-3.5 text-stone-400" size={17} />
        <input className="form-input pl-11" placeholder={placeholder} />
      </div>
      {right}
    </div>
  );
}

export function ActivityFeed({ items }) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={`${item.title}-${index}`} className="flex gap-3">
          <span className="mt-1 h-2.5 w-2.5 rounded-full bg-leaf-600 ring-4 ring-leaf-100" />
          <div>
            <p className="text-sm font-black text-leaf-950">{item.title}</p>
            <p className="mt-1 text-sm leading-6 text-stone-500">{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
