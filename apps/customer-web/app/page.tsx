import Hero from './components/Hero';
import StorefrontProducts from './components/StorefrontProducts';

const categories = [
  { name: 'Indoor Plants', text: 'Easy-care greens for every room', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80', icon: '🌿' },
  { name: 'Outdoor Plants', text: 'For balconies, gardens and patios', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80', icon: '☀️' },
  { name: 'Flowering Plants', text: 'Colourful blooms for every season', image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=900&q=80', icon: '🌺' },
  { name: 'Air Purifying', text: 'Fresh, healthier indoor spaces', image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=900&q=80', icon: '💨' },
  { name: 'Herbal Plants', text: 'Fresh kitchen garden favorites', image: 'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=900&q=80', icon: '🌱' },
  { name: 'Pots & Planters', text: 'The right home for every plant', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80', icon: '🪴' },
] as const;

const careHighlights = [
  {
    title: 'Healthy plant delivery',
    description: 'Every order is packed with nursery care and safe transport to keep your plants thriving.',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Plant care guidance',
    description: 'Get watering schedules, sunlight tips, and expert help for a greener, happier garden.',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Gift-ready greenery',
    description: 'Choose meaningful plant gifts for birthdays, housewarmings, and mindful living moments.',
    image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=900&q=80',
  },
] as const;

export default function Home() {
  return (
    <main className="storefront-shell">
      <div className="offerbar">
        Free delivery on orders above ₹499 <span>•</span> Secure payments <span>•</span> Healthy plant guarantee
      </div>

      <nav className="top-nav">
        <a className="logo" href="/">
          <b>✦</b>
          <span>
            Gaurav Nursery
            <small>Trusted Plant Studio</small>
          </span>
        </a>

        <div className="search-box">
          <input aria-label="Search products" placeholder="Search plants, pots, seeds and more" />
          <button type="button">Search</button>
        </div>

        <div className="quick-links">
          <a href="/wishlist">Wishlist</a>
          <a href="/cart">Cart <i>0</i></a>
          <a href="/login">Login / Register</a>
        </div>
      </nav>

      <div className="menu">
        <a className="menuall" href="/categories">All Categories</a>
        {['Home', 'Plants', 'Planters', 'Seeds', 'Offers', 'Blog', 'Contact'].map((item) => (
          <a href={`/${item.toLowerCase()}`} key={item}>{item}</a>
        ))}
        <a className="whatsapp" href="/contact">WhatsApp us</a>
      </div>

      <Hero />

      <div className="promises">
        <span>🚚 <b>Free Delivery<small>On orders over ₹499</small></b></span>
        <span>🔒 <b>Secure Payment<small>100% secure checkout</small></b></span>
        <span>♻ <b>Easy Returns<small>Hassle-free support</small></b></span>
        <span>🌱 <b>Fresh & Healthy<small>Best quality plants</small></b></span>
      </div>

      <section id="categories">
        <div className="section-title">
          <div>
            <p className="eyebrow">SHOP BY NEED</p>
            <h2>Find your next green companion</h2>
          </div>
          <a href="/categories">View all categories →</a>
        </div>
        <div className="grid">
          {categories.map((category) => (
            <a className="card" href={`/categories/${category.name.toLowerCase().replaceAll(' ', '-')}`} key={category.name} style={{ backgroundImage: `linear-gradient(180deg, rgba(19,36,24,0.08), rgba(19,36,24,0.4)), url(${category.image})` }}>
              <span>{category.icon}</span>
              <h3>{category.name}</h3>
              <p>{category.text}</p>
              <b>Explore</b>
            </a>
          ))}
        </div>
      </section>

      <section className="nursery-story" aria-label="Why choose Gaurav Nursery">
        <div className="section-title">
          <div>
            <p className="eyebrow">WHY GARDENERS LOVE US</p>
            <h2>Thoughtful plants, planted with care</h2>
          </div>
        </div>

        <div className="story-grid">
          {careHighlights.map((item) => (
            <article className="story-card" key={item.title}>
              <img src={item.image} alt={item.title} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <StorefrontProducts />
    </main>
  );
}
