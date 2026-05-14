export default function Earnings() {
  return <SellerPanel title="Earnings" text="Seller payouts, commissions, and earnings analytics will appear here." />;
}

function SellerPanel({ title, text }) {
  return (
    <section>
      <h1 className="text-3xl font-black text-leaf-900">{title}</h1>
      <div className="mt-6 rounded-lg bg-white p-6 shadow-soft">
        <p className="text-stone-600">{text}</p>
      </div>
    </section>
  );
}
