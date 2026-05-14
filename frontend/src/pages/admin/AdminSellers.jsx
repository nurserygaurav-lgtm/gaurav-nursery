export default function AdminSellers() {
  return <AdminPanel title="Sellers" text="Seller approval and seller controls will appear here." />;
}

function AdminPanel({ title, text }) {
  return (
    <section>
      <h1 className="text-3xl font-black text-leaf-900">{title}</h1>
      <div className="mt-6 rounded-lg bg-white p-6 shadow-soft">
        <p className="text-stone-600">{text}</p>
      </div>
    </section>
  );
}
