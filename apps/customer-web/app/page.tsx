const navItems = ['Home', 'All Plants', 'Indoor Plants', 'Outdoor Plants', 'Pots & Planters', 'Seeds & Fertilizers', 'Gardening Tools', 'Blog', 'Contact'];

export default function Home() {
  return (
    <main className="nursery-page">
      <div className="notice-strip">
        <div className="notice-inner">
          <span>🌿 Bring Nature Home – Healthier Life, Happier You!</span>
          <div className="notice-links">
            <a href="/track-order">Track Order</a>
            <span>|</span>
            <a href="/help">Help</a>
            <span>|</span>
            <a href="tel:+919876543210">+91 98765 43210</a>
          </div>
        </div>
      </div>

      <header className="nursery-header">
        <div className="header-top">
          <div className="brand-wrap">
            <div className="brand-mark">🌿</div>
            <div className="brand-copy">
              <strong>Gaurav Nursery</strong>
              <small>Plants for a Better Tomorrow</small>
            </div>
          </div>

          <div className="search-shell">
            <input aria-label="Search products" placeholder="Search for plants, pots, seeds..." />
            <button type="button" aria-label="Search">⌕</button>
          </div>

          <div className="header-actions">
            <a href="/account">👤 Account</a>
            <a href="/cart">🛒 Cart</a>
          </div>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <a href="/" key={item}>{item}</a>
          ))}
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <p className="hero-kicker">GREEN TODAY • BRIGHTER TOMORROW</p>
          <h1>
            <span className="line-one">Bring</span>
            <span className="line-two">Nature</span>
            <span className="line-three">Home</span>
          </h1>
          <p className="hero-text">
            Wide range of indoor &amp; outdoor plants,<br />
            planters, seeds and gardening accessories<br />
            at best prices.
          </p>
        </div>

        <div className="hero-visual" aria-label="Showcase of plants">
          <div className="scene-wrap">
            <div className="floating-quote">Plants<br />Make People<br />Happier</div>
            <img
              src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80&sat=-30"
              alt="Healthy plant seedlings"
            />
          </div>

          <div className="floating-badge badge-left">Good<br />Grow Here</div>
          <div className="floating-badge badge-right">A Greener<br />Tomorrow<br />Together</div>
        </div>
      </section>

      <aside className="floating-rail" aria-label="Quick actions">
        <button type="button" aria-label="Bookmark">☆</button>
        <button type="button" aria-label="Favorites">♡</button>
        <button type="button" aria-label="Cart">🛒</button>
        <button type="button" aria-label="Profile">👤</button>
      </aside>
    </main>
  );
}
