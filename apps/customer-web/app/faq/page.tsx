import StorefrontLayout from '../components/StorefrontLayout';

const faqs = [
  { q: 'How long does delivery take?', a: 'Most metro deliveries are completed within 2-4 days, while regional deliveries may take 4-7 days depending on the location.' },
  { q: 'Do you provide plant care support?', a: 'Yes. Our team offers plant care guidance for watering, sunlight, and repotting once your order is placed.' },
  { q: 'What is your return policy?', a: 'Damaged or unhealthy plants can be reported within 24 hours with photos, and we will arrange a replacement or refund.' },
  { q: 'Are plants healthy when delivered?', a: 'All plants are carefully checked, packed with nursery care, and shipped under protective packaging.' },
  { q: 'Do you deliver across India?', a: 'Yes. We deliver across India, including major cities and smaller towns depending on courier availability.' },
  { q: 'Can I order plants in bulk?', a: 'Yes, we support bulk and gifting orders for homes, offices, and event décor. Please contact us directly.' },
  { q: 'How can I track my order?', a: 'Once shipped, we share the tracking details via SMS or email. You can also contact us for an update.' },
];

export default function FaqPage() {
  return (
    <StorefrontLayout>
      <section className="page-shell">
        <div className="section-title slim-title">
          <div>
            <p className="eyebrow">HELP CENTER</p>
            <h2>Frequently asked questions</h2>
          </div>
        </div>

        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.q} className="faq-item" open={faq.q === faqs[0].q}>
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </StorefrontLayout>
  );
}
