export default function StatCard({ label, value }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-soft">
      <p className="text-sm font-semibold text-stone-600">{label}</p>
      <p className="mt-2 text-3xl font-black text-leaf-900">{value}</p>
    </div>
  );
}
