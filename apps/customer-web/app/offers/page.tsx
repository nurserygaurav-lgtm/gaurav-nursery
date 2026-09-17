import StorefrontLayout from '../components/StorefrontLayout';

export default function OffersPage() {
  return (
    <StorefrontLayout>
      <section className="page-shell">
        <div className="section-title slim-title">
          <div>
            <p className="eyebrow">SPECIAL OFFERS</p>
            <h2>Fresh deals for your green home</h2>
          </div>
        </div>

        <div className="offer-grid">
          <article className="offer-card green-card">
            <h3>Weekend Green Sale</h3>
            <p>Flat 20% off on selected indoor plants and planters.</p>
          </article>
          <article className="offer-card">
            <h3>Buy 2, Save 10%</h3>
            <p>Perfect for gifting and multi-plant setups.</p>
          </article>
          <article className="offer-card">
            <h3>Free Delivery</h3>
            <p>On orders above ₹499. Fresh delivery across India.</p>
          </article>
        </div>
      </section>
    </StorefrontLayout>
  );
}
