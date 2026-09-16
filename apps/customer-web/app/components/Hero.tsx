export default function Hero() {
  return (
    <section className="hero-modern" aria-label="Gaurav Nursery hero section">
      <div className="hero-copy">
        <div className="hero-badge">
          <span className="badge-icon">✦</span>
          <span>Premium Plant Studio</span>
        </div>

        <h1>
          Bring home plants
          <span>that thrive with you.</span>
        </h1>

        <p>
          Handpicked indoor plants, premium planters, seeds, and organic garden essentials—
          delivered with care to your doorstep.
        </p>

        <div className="hero-actions">
          <a href="#products" className="primary-btn">
            Shop Plants
            <span aria-hidden="true">→</span>
          </a>
          <a href="#categories" className="secondary-btn">
            Explore Collection
          </a>
        </div>

        <div className="trust-list">
          <div>
            <span className="trust-icon">🚚</span>
            <span>Free Shipping &gt; ₹499</span>
          </div>
          <div>
            <span className="trust-icon">🛡️</span>
            <span>Healthy Plant Guarantee</span>
          </div>
        </div>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <div className="floating-badge top-left">
          <div className="mini-icon">🪴</div>
          <div>
            <p>Top Selling</p>
            <strong>Areca Palm</strong>
          </div>
        </div>

        <div className="plant-showcase">
          <div className="leaf leaf-one" />
          <div className="leaf leaf-two" />
          <div className="leaf leaf-three" />
          <div className="stem" />
          <div className="pot" />
        </div>

        <div className="floating-badge bottom-right">
          <div className="mini-score">★ 4.9</div>
          <div>
            <p>Customer Rating</p>
            <strong>1,200+ Happy Gardeners</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
