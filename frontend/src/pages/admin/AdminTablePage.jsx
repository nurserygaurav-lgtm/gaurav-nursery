import { Edit, Eye, ShieldCheck, Trash2 } from 'lucide-react';
import { Panel, PageHeader, StatusPill, TableToolbar } from '../../components/dashboard/DashboardUI.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';

const data = {
  Sellers: [
    ['Green Roots Nursery', 'seller@greenroots.in', '248 products', formatCurrency(842500), 'active'],
    ['Urban Leaf Seller', 'urban@leaf.in', '186 products', formatCurrency(684200), 'pending'],
    ['Bloom House', 'hello@bloom.in', '92 products', formatCurrency(423900), 'active']
  ],
  Users: [
    ['Ananya Sharma', 'ananya@example.com', '18 orders', formatCurrency(42800), 'active'],
    ['Rohan Mehta', 'rohan@example.com', '7 orders', formatCurrency(18400), 'active'],
    ['Isha Kapoor', 'isha@example.com', '3 orders', formatCurrency(7200), 'pending']
  ],
  Products: [
    ['Monstera Deliciosa', 'Indoor Plants', 'GN-MON1', formatCurrency(1299), 'active'],
    ['Ceramic Planter', 'Planters', 'GN-PLN4', formatCurrency(499), 'pending'],
    ['Areca Palm', 'Indoor Plants', 'GN-ARC8', formatCurrency(799), 'active']
  ],
  Orders: [
    ['#GN-9021', 'Mira Shah', 'Razorpay', formatCurrency(2299), 'paid'],
    ['#GN-9020', 'Aarav Patel', 'COD', formatCurrency(899), 'processing'],
    ['#GN-9019', 'Kabir Rao', 'Razorpay', formatCurrency(1499), 'pending']
  ]
};

export default function AdminTablePage({ title = 'Products', text = 'Manage marketplace records, approvals, moderation, and operational state.' }) {
  const rows = data[title] || data.Products;

  return (
    <section>
      <PageHeader eyebrow="Admin management" title={title} text={text} />
      <Panel title={`${title} Management`} subtitle="Search, approve, inspect, edit, or moderate marketplace data.">
        <TableToolbar placeholder={`Search ${title.toLowerCase()}`} />
        <div className="overflow-hidden rounded-3xl border border-leaf-100 bg-white">
          <div className="hidden grid-cols-[1.1fr_1fr_0.75fr_0.75fr_0.65fr_0.55fr] gap-4 border-b border-leaf-100 bg-leaf-50/70 px-5 py-4 text-xs font-black uppercase tracking-[0.16em] text-leaf-800 xl:grid">
            <span>Name</span>
            <span>Detail</span>
            <span>Metric</span>
            <span>Value</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>
          <div className="divide-y divide-leaf-100">
            {rows.map((row) => (
              <article key={row[0]} className="grid gap-4 px-5 py-4 xl:grid-cols-[1.1fr_1fr_0.75fr_0.75fr_0.65fr_0.55fr] xl:items-center">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-leaf-100 font-black text-leaf-800">{row[0][0]}</span>
                  <p className="font-black text-leaf-950">{row[0]}</p>
                </div>
                <p className="text-sm font-bold text-stone-600">{row[1]}</p>
                <p className="text-sm font-bold text-stone-600">{row[2]}</p>
                <p className="text-sm font-black text-leaf-950">{row[3]}</p>
                <StatusPill status={row[4]} />
                <div className="flex justify-end gap-1">
                  {[Eye, ShieldCheck, Edit, Trash2].map((Icon, index) => (
                    <button key={index} className="rounded-full p-2 text-leaf-900 transition hover:bg-leaf-50" aria-label="Action">
                      <Icon size={17} />
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </Panel>
    </section>
  );
}
