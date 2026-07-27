const categories = [
  ['Indoor Plants', 'Easy-care greens for every room'],
  ['Outdoor Plants', 'For balconies, gardens and patios'],
  ['Flowering Plants', 'Colourful blooms for every season'],
  ['Air Purifying', 'Fresh, healthier indoor spaces'],
  ['Seeds & Bulbs', 'Grow your garden from the start'],
  ['Pots & Planters', 'The right home for every plant']
] as const;

export default function Home() {
  return <main>
    <div className="offerbar">Free delivery on orders above ₹499 <span>•</span> Secure payments <span>•</span> Healthy plant guarantee</div>
    <nav>
      <a className="logo" href="/"><b>✦</b><span>Gaurav Nursery<small>Trusted Plant Studio</small></span></a>
      <div className="search">Search plants, pots, seeds and more <button>Search</button></div>
      <div className="quick"><a href="/wishlist">Wishlist</a><a href="/cart">Cart <i>0</i></a><a href="/login">Login / Register</a></div>
    </nav>
    <div className="menu"><a className="menuall" href="/categories">All Categories</a>{['Home', 'Plants', 'Planters', 'Seeds', 'Offers', 'Blog', 'Contact'].map((item) => <a href={`/${item.toLowerCase()}`} key={item}>{item}</a>)}<a className="whatsapp" href="/contact">WhatsApp us</a></div>
    <section className="hero">
      <div><p className="eyebrow">NATURE MEETS STYLE</p><h1>Bring home plants that thrive with you.</h1><p>Handpicked indoor plants, planters, seeds and garden essentials—delivered with care.</p><div className="actions"><a className="button" href="/shop">Shop Plants →</a><a className="outline" href="/categories">Explore Collection</a></div></div>
      <div className="heroart"><span className="pot one">🌿</span><span className="pot two">🌱</span><span className="pot three">🌴</span></div>
    </section>
    <div className="promises"><span>🚚 <b>Free Delivery<small>On orders over ₹499</small></b></span><span>🔒 <b>Secure Payment<small>100% secure checkout</small></b></span><span>♻ <b>Easy Returns<small>Hassle-free support</small></b></span><span>🌱 <b>Fresh & Healthy<small>Best quality plants</small></b></span></div>
    <section><div className="section-title"><div><p className="eyebrow">SHOP BY NEED</p><h2>Find your next green companion</h2></div><a href="/categories">View all categories →</a></div><div className="grid">{categories.map(([name, text], index) => <a className="card" href={`/categories/${name.toLowerCase().replaceAll(' ', '-')}`} key={name}><span>{['🌿', '☀️', '🌺', '💨', '🌱', '🪴'][index]}</span><h3>{name}</h3><p>{text}</p><b>Explore →</b></a>)}</div></section>
  </main>;
}
