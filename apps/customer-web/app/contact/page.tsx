import StorefrontLayout from '../components/StorefrontLayout';

export default function ContactPage() {
  return (
    <StorefrontLayout>
      <section className="page-shell contact-page">
        <div className="section-title slim-title">
          <div>
            <p className="eyebrow">CONTACT US</p>
            <h2>We’d love to help with your green space</h2>
          </div>
        </div>

        <div className="contact-grid">
          <form className="contact-form panel-box">
            <label>
              Name
              <input type="text" placeholder="Your name" />
            </label>
            <label>
              Email
              <input type="email" placeholder="you@example.com" />
            </label>
            <label>
              Phone
              <input type="tel" placeholder="8160510524" defaultValue="8160510524" />
            </label>
            <label>
              Message
              <textarea rows={5} placeholder="Tell us about your plant requirements" />
            </label>
            <button type="button" className="primary-btn wide-btn">Send Message</button>
          </form>

          <aside className="panel-box contact-info">
            <h3>Reach us</h3>
            <ul>
              <li>📞 8160510524</li>
              <li>✉️ hello@gauravnursery.in</li>
              <li>💬 WhatsApp support</li>
              <li>🕒 Mon-Sat: 9:00 AM - 7:00 PM</li>
            </ul>
            <div className="map-box">Google Maps placeholder</div>
          </aside>
        </div>
      </section>
    </StorefrontLayout>
  );
}
