const pages: Record<string, string> = {
  categories: 'All Categories', shop: 'Shop Plants', wishlist: 'My Wishlist', cart: 'My Cart', checkout: 'Checkout', orders: 'My Orders', tracking: 'Order Tracking', offers: 'Offers', blog: 'Plant Care Tips', about: 'About Gaurav Nursery', contact: 'Contact Us', login: 'Welcome Back', register: 'Create Your Account', faq: 'Frequently Asked Questions'
};

export default async function CustomerPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const section = slug[0] ?? '';
  const title = pages[section] ?? slug.map((value) => value.replaceAll('-', ' ')).join(' ');
  const checkout = section === 'checkout';
  const orders = section === 'orders' || section === 'tracking';
  return <main>
    <div className="offerbar">Free delivery on orders above ₹499 <span>•</span> Secure payments</div>
    <nav><a className="logo" href="/"><b>✦</b><span>Gaurav Nursery<small>Trusted Plant Studio</small></span></a><div className="search">Search plants, pots, seeds and more <button>Search</button></div><div className="quick"><a href="/wishlist">Wishlist</a><a href="/cart">Cart</a><a href="/login">Login</a></div></nav>
    <div className="menu"><a className="menuall" href="/categories">All Categories</a><a href="/shop">Plants</a><a href="/offers">Offers</a><a href="/blog">Blog</a><a className="whatsapp" href="/contact">WhatsApp us</a></div>
    <section className="section-title"><div><p className="eyebrow">GAURAV NURSERY</p><h2>{title}</h2></div><a href="/">← Back to home</a></section>
    {checkout ? <div className="grid"><article className="card"><h3>Shipping Address</h3><p>Enter your delivery address to continue with checkout.</p><a className="button" href="#">Continue to payment</a></article><article className="card"><h3>Order Summary</h3><p>Areca Palm × 1</p><p>Snake Plant × 1</p><h3>₹848</h3></article></div> : orders ? <div className="grid">{['Order #GN10042 — Out for delivery', 'Order #GN10031 — Delivered', 'Order #GN10019 — Delivered'].map((order) => <article className="card" key={order}><h3>{order}</h3><p>Healthy plants, packed with care.</p><b>View details →</b></article>)}</div> : <div className="grid">{['Areca Palm', 'Snake Plant', 'Peace Lily', 'Monstera', 'Jade Plant', 'Money Plant'].map((product, index) => <article className="card" key={product}><span>{['🌴', '🌿', '🪴', '🍃', '🌱', '☘️'][index]}</span><h3>{product}</h3><p>Healthy nursery-grown plant.</p><b>₹{[499,349,599,749,299,249][index]}</b></article>)}</div>}
  </main>;
}
