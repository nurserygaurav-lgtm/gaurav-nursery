import StorefrontLayout from '../components/StorefrontLayout';

export default function PrivacyPage() {
  return (
    <StorefrontLayout>
      <section className="page-shell content-page legal-page">
        <div className="section-title slim-title">
          <div>
            <p className="eyebrow">LEGAL</p>
            <h2>Privacy Policy</h2>
          </div>
        </div>

        <div className="legal-box">
          <h3>1. Information We Collect</h3>
          <p>We collect contact details, order information, billing and delivery address, and basic browsing data required to provide our services.</p>
          <h3>2. How We Use Information</h3>
          <p>We use this information to process orders, improve customer support, manage authentication, communicate promotions, and maintain a secure shopping experience.</p>
          <h3>3. Sharing Information</h3>
          <p>We do not sell personal information. Limited data may be shared with trusted delivery partners or payment facilitators to fulfil orders.</p>
          <h3>4. Security</h3>
          <p>We take reasonable measures to safeguard personal data and keep our systems secure.</p>
          <h3>5. Contact</h3>
          <p>If you have any questions regarding personal data, please contact us at hello@gauravnursery.in or 8160510524.</p>
        </div>
      </section>
    </StorefrontLayout>
  );
}
