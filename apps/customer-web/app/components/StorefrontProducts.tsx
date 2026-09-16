'use client';

import { useEffect, useState } from 'react';

type Product = { _id: string; name?: string; title?: string; price?: number; images?: Array<{ url?: string }>; category?: string };
const apiUrl = `${(process.env.NEXT_PUBLIC_LEGACY_API_URL || 'https://gaurav-nursery.onrender.com').replace(/\/$/, '')}/api`;

function getToken() { return window.localStorage.getItem('gaurav_nursery_token') || window.sessionStorage.getItem('gaurav_nursery_token'); }

export default function StorefrontProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch(`${apiUrl}/products?limit=6`).then((r) => r.ok ? r.json() : Promise.reject()).then((data) => setProducts(data.products || [])).catch(() => setMessage('Products are temporarily unavailable. Please refresh in a moment.')).finally(() => setLoading(false)); }, []);
  async function addToCart(productId: string) {
    const token = getToken();
    if (!token) { setMessage('Please log in before adding products to your cart.'); return; }
    try {
      const response = await fetch(`${apiUrl}/cart`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ productId, quantity: 1 }) });
      if (!response.ok) throw new Error('Cart request failed');
      const data = await response.json();
      window.localStorage.setItem('gaurav_nursery_cart_count', String(data?.summary?.itemCount || 0));
      setMessage('Added to cart successfully.');
    } catch { setMessage('Unable to add this product right now. Please try again.'); }
  }
  return <section id="products" className="live-products" aria-live="polite"><div className="section-title"><div><p className="eyebrow">LIVE FROM OUR NURSERY</p><h2>Popular plants</h2></div><a href="/shop">View all plants →</a></div>{message && <p className="store-message">{message}</p>}<div className="grid">{loading && Array.from({ length: 3 }).map((_, index) => <article className="card product-loading" key={index} />)}{!loading && products.map((product) => <article className="card product-card" key={product._id}>{product.images?.[0]?.url ? <img src={product.images[0].url} alt={product.title || product.name || 'Plant'} /> : <span>🌿</span>}<p>{product.category || 'Nursery plant'}</p><h3>{product.title || product.name}</h3><b>₹{Number(product.price || 0).toLocaleString('en-IN')}</b><button className="button" onClick={() => addToCart(product._id)}>Add to cart</button></article>)}</div></section>;
}
