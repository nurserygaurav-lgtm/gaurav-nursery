import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, Truck, CreditCard, PackageSearch, CircleDollarSign, UploadCloud, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

const categories = [
  { label: 'Orders Issues', icon: Truck },
  { label: 'Payment Issues', icon: CreditCard },
  { label: 'Delivery Issues', icon: PackageSearch },
  { label: 'Seller Support', icon: Sparkles },
  { label: 'Product Upload Help', icon: UploadCloud },
  { label: 'Refund & Return', icon: CircleDollarSign },
  { label: 'Technical Problems', icon: Zap }
];

const featuredArticles = [
  {
    title: 'How to track your order status',
    category: 'Orders Issues',
    summary: 'Learn how to check delivery updates, shipment tracking, and expected arrival for your nursery order.'
  },
  {
    title: 'Payment settlement delays',
    category: 'Payment Issues',
    summary: 'Common reasons why payment settlement may take longer and how to keep your transaction secure.'
  },
  {
    title: 'Update product inventory and stock',
    category: 'Product Upload Help',
    summary: 'Best practices for sellers to keep inventory accurate and avoid overselling during peak season.'
  },
  {
    title: 'Resolve delivery exceptions quickly',
    category: 'Delivery Issues',
    summary: 'Find the steps to resolve shipping problems, address issues, and reschedule delivery.'
  },
  {
    title: 'Create a support ticket for technical bugs',
    category: 'Technical Problems',
    summary: 'Submit a support request for website errors, broken uploads, or account access issues.'
  },
  {
    title: 'Refund and return policy',
    category: 'Refund & Return',
    summary: 'Understand refund eligibility, return handling, and seller payout adjustments.'
  }
];

export default function SupportHome() {
  const [query, setQuery] = useState('');
  const { user } = useAuth();
  const destination = user?.role === 'seller' ? '/seller/support' : '/login';

  const filteredArticles = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();
    if (!lowerQuery) return featuredArticles;
    return featuredArticles.filter((article) =>
      [article.title, article.category, article.summary].some((value) => value.toLowerCase().includes(lowerQuery))
    );
  }, [query]);

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-leaf-100 bg-white p-8 shadow-soft">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-leaf-600">Customer support</p>
            <h1 className="mt-4 text-4xl font-black text-leaf-950 sm:text-5xl">Find answers or submit a ticket</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600">Search support guides, browse help topics, and create a seller ticket when you need real help from the Gaurav Nursery support team.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={destination} className="inline-flex items-center justify-center rounded-full bg-leaf-700 px-6 py-3 text-sm font-black text-white transition hover:bg-leaf-800">
                Submit Ticket
              </Link>
              <Link to="/contact" className="inline-flex items-center justify-center rounded-full border border-leaf-100 bg-white px-6 py-3 text-sm font-black text-leaf-950 transition hover:border-leaf-300 hover:bg-leaf-50">
                Contact support
              </Link>
            </div>
          </div>
          <div className="rounded-[2rem] border border-leaf-100 bg-leaf-50 p-5">
            <div className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-soft">
              <Search className="text-leaf-600" size={20} />
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-leaf-600">Support search</p>
                <p className="font-black text-leaf-950">Search articles instantly</p>
              </div>
            </div>
            <div className="mt-5 space-y-3 text-sm text-stone-600">
              <p>Browse the most common support topics, including order issues, payments, delivery, seller help, and troubleshooting.</p>
              <p>Need fast help? Open a support ticket and attach screenshots for faster resolution.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <article key={category.label} className="rounded-3xl border border-leaf-100 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-50 text-leaf-700">
                <Icon size={20} />
              </div>
              <h2 className="mt-4 text-lg font-black text-leaf-950">{category.label}</h2>
              <p className="mt-2 text-sm text-stone-600">Helpful guidance and steps for {category.label.toLowerCase()}.</p>
            </article>
          );
        })}
      </div>

      <div className="rounded-[2rem] border border-leaf-100 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-leaf-950">Browse support articles</h2>
            <p className="mt-1 text-sm text-stone-600">Search helpful guides and FAQs for faster resolution.</p>
          </div>
          <div className="relative max-w-xl flex-1">
            <Search className="absolute left-4 top-3 text-stone-400" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="form-input w-full rounded-full border-leaf-100 bg-leaf-50 px-12 py-3"
              placeholder="Search articles, keywords, or ticket types"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredArticles.map((article) => (
            <article key={article.title} className="rounded-3xl border border-leaf-100 bg-leaf-50 p-5 transition hover:-translate-y-1 hover:border-leaf-200">
              <div className="text-xs font-black uppercase tracking-[0.24em] text-leaf-600">{article.category}</div>
              <h3 className="mt-3 text-lg font-black text-leaf-950">{article.title}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">{article.summary}</p>
              <Link className="mt-4 inline-flex items-center text-sm font-black text-leaf-700 transition hover:text-leaf-900" to={destination}>
                Submit a ticket
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
