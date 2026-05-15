import { Panel, PageHeader } from '../../components/dashboard/DashboardUI.jsx';

export default function SellerPlaceholder({ title = 'Seller Page', text = 'This workspace is ready for the next seller workflow.' }) {
  return (
    <section>
      <PageHeader eyebrow="Seller workspace" title={title} text={text} />
      <Panel title={`${title} Overview`} subtitle="Premium responsive layout prepared for live API data.">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['New', 24],
            ['Active', 68],
            ['Resolved', 41]
          ].map(([item, value]) => (
            <div key={item} className="rounded-2xl bg-leaf-50 p-5">
              <p className="text-sm font-bold text-stone-500">{item}</p>
              <p className="mt-2 text-3xl font-black text-leaf-950">{value}</p>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}
