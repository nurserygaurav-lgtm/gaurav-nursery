import StorefrontLayout from '../components/StorefrontLayout';

export default function ShippingPage() {
  return (
    <StorefrontLayout>
      <section className="page-shell content-page legal-page">
        <div className="section-title slim-title">
          <div>
            <p className="eyebrow">SUPPORT</p>
            <h2>Shipping & Returns</h2>
          </div>
        </div>

        <div className="legal-box">
          <h3>Shipping</h3>
          <p>We deliver across India with carefully packed nursery plants in protective packaging to reduce transit stress. Typical delivery timelines range from 2 to 7 days depending on your location.</p>
          <h3>Packaging</h3>
          <p>All plants are packed with moisture-safe materials, protective wraps and sturdy boxes to minimize damage during shipping.</p>
          <h3>Damaged or Unhealthy Plants</h3>
          <p>If your plant is damaged or unhealthy on arrival, please share photos within 24 hours and we will arrange a replacement or refund.</p>
          <h3>Returns & Refunds</h3>
          <p>Returns are considered for damaged product or delivery issues. Refunds are processed after review and confirmation of the issue.</p>
        </div>
      </section>
    </StorefrontLayout>
  );
}
