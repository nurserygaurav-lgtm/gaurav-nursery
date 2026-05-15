import { Panel, PageHeader } from '../../components/dashboard/DashboardUI.jsx';

export default function AdminPlaceholder({ title = 'Admin Page', text = 'This admin workspace is ready for marketplace operations.' }) {
  return (
    <section>
      <PageHeader eyebrow="Admin workspace" title={title} text={text} />
      <Panel title={`${title} Overview`} subtitle="Modern SaaS dashboard surface prepared for live backend integration.">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ['Pending', 18],
            ['Approved', 126],
            ['Flagged', 7],
            ['Resolved', 84]
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-leaf-50 p-5">
              <p className="text-sm font-bold text-stone-500">{label}</p>
              <p className="mt-2 text-3xl font-black text-leaf-950">{value}</p>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}
