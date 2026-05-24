import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { findMegaMenuBySlug, megaMenuItems } from '../../data/megaMenuData.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';

export default function CategoryLanding() {
  const { slug } = useParams();
  const menu = findMegaMenuBySlug(slug) || megaMenuItems[0];

  usePageMeta({
    title: menu.label,
    description: `Shop ${menu.label} at Gaurav Nursery with curated collections, top selling products, and premium garden essentials.`
  });

  return (
    <section>
      <div className="relative overflow-hidden bg-leaf-950">
        <img className="absolute inset-0 h-full w-full object-cover opacity-40" src={menu.image} alt={menu.label} loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-r from-leaf-950 via-leaf-950/85 to-leaf-900/40" />
        <div className="premium-container relative grid min-h-[18rem] items-end py-8 text-white sm:min-h-[20rem] lg:min-h-[22rem] lg:py-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] backdrop-blur">
              <Sparkles size={15} />
              {menu.badge}
            </span>
            <h1 className="mt-4 text-[clamp(2rem,5vw,4.5rem)] font-black tracking-tight">{menu.label}</h1>
            <p className="mt-4 max-w-2xl text-[clamp(0.95rem,1.2vw,1.15rem)] font-semibold text-white/80">{menu.tagline}</p>
            <Link className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-leaf-950 shadow-button transition hover:-translate-y-0.5 hover:bg-leaf-50" to={menu.shopAllTo}>
              Shop All {menu.label}
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>

      <div className="premium-container py-10">
        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-leaf-600">Collections</p>
            <h2 className="mt-2 text-[clamp(1.6rem,3vw,3rem)] font-black text-leaf-950">Explore {menu.label}</h2>
          </div>
          <Link className="inline-flex items-center gap-2 rounded-full border border-leaf-200 bg-white px-4 py-2 text-sm font-black text-leaf-900 shadow-soft transition hover:bg-leaf-50" to="/categories">
            View All Categories
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {menu.sections.map((section) => (
              <article key={section.title} className="rounded-2xl border border-leaf-100 bg-white p-4 shadow-soft sm:p-5">
                <h3 className="text-lg font-black text-leaf-950">{section.title}</h3>
                <div className="mt-4 grid gap-2">
                  {section.items.map((item, index) => (
                    <Link key={item.label} className="group flex items-center justify-between gap-3 rounded-xl bg-leaf-50 px-3 py-2.5 text-sm font-bold text-stone-700 transition hover:bg-leaf-900 hover:text-white" to={item.to}>
                      <span>{item.label}</span>
                      {index < 2 ? <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black uppercase text-leaf-700 group-hover:text-leaf-900">Trending</span> : <ArrowRight className="opacity-0 transition group-hover:opacity-100" size={15} />}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-leaf-100 bg-white p-4 shadow-card">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-leaf-950">
              <TrendingUp size={19} />
              Top Selling
            </h3>
            <div className="grid gap-3">
              {menu.featured.map((product) => (
              <Link key={product.name} className="group overflow-hidden rounded-2xl border border-leaf-100 bg-leaf-50 transition hover:-translate-y-0.5 hover:shadow-soft" to={menu.shopAllTo}>
                  <img className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" src={product.image} alt={product.name} loading="lazy" decoding="async" />
                  <div className="p-3">
                    <p className="font-black text-leaf-950">{product.name}</p>
                    <span className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-xs font-black text-leaf-800">{product.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
