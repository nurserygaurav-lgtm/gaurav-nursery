const heroImages = [
  'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1000&q=80',
];

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

      <div className="hero-visual" aria-label="Plant collection showcase">
        <div className="floating-badge top-left">
          <div className="mini-icon">🪴</div>
          <div>
            <p>Top Selling</p>
            <strong>Areca Palm</strong>
          </div>
        </div>

        <div className="hero-photo-grid">
          {heroImages.map((image, index) => (
            <img
              key={image}
              src={image}
              alt={index === 0 ? 'Premium indoor plant lifestyle' : 'Plant collection showcase'}
              className={`photo-card photo-${index + 1}`}
            />
          ))}
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
