import StorefrontLayout from '../components/StorefrontLayout';

export default function TermsPage() {
  return (
    <StorefrontLayout>
      <section className="page-shell content-page legal-page">
        <div className="section-title slim-title">
          <div>
            <p className="eyebrow">LEGAL</p>
            <h2>Terms & Conditions</h2>
          </div>
        </div>

        <div className="legal-box">
          <h3>1. General</h3>
          <p>By using Gaurav Nursery, you agree to follow the applicable rules and regulations while shopping and placing orders on our website.</p>
          <h3>2. Product Information</h3>
          <p>We strive to keep product descriptions, prices and availability accurate. However, minor variations in plant size, appearance, or packaging can occur naturally.</p>
          <h3>3. Orders and Payments</h3>
          <p>All orders are subject to availability and confirmation. Payment must be completed before dispatch.</p>
          <h3>4. Shipping</h3>
          <p>Shipping timelines depend on location, courier conditions and availability. We aim to deliver healthy plants with care.</p>
          <h3>5. Liability</h3>
          <p>We are not liable for delays caused by force majeure, courier disruptions, or customer-provided incorrect address details.</p>
        </div>
      </section>
    </StorefrontLayout>
  );
}
