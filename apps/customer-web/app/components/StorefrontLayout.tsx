import Link from 'next/link';
import type { ReactNode } from 'react';

const navItems = [
  { label: 'All Categories', href: '/categories' },
  { label: 'Home', href: '/home' },
  { label: 'Plants', href: '/plants' },
  { label: 'Planters', href: '/plants' },
  { label: 'Seeds', href: '/plants' },
  { label: 'Offers', href: '/shop' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const PHONE = '8160510524';

export default function StorefrontLayout({ children, showHeaderSearch = true }: { children: ReactNode; showHeaderSearch?: boolean }) {
  return (
    <main className="storefront-shell">
      <div className="offerbar">
        Free delivery on orders above ₹499 <span>•</span> Secure payments <span>•</span> Healthy plant guarantee
      </div>

      <header className="top-nav">
        <Link href="/" className="logo">
          <b>✦</b>
          <span>
            Gaurav Nursery
            <small>Trusted Plant Studio</small>
          </span>
        </Link>

        {showHeaderSearch && (
          <div className="search-box">
            <input aria-label="Search products" placeholder="Search plants, pots, seeds and more" />
            <button type="button">Search</button>
          </div>
        )}

        <div className="quick-links">
          <Link href="/wishlist">Wishlist</Link>
          <Link href="/cart">Cart <i>0</i></Link>
          <Link href="/login">Login / Register</Link>
        </div>
      </header>

      <nav className="menu" aria-label="Main menu">
        <Link className="menuall" href="/categories">All Categories</Link>
        {navItems.slice(1).map((item) => (
          <Link href={item.href} key={item.label}>{item.label}</Link>
        ))}
        <a className="whatsapp" href={`https://wa.me/91${PHONE}`} target="_blank" rel="noreferrer">WhatsApp us</a>
      </nav>

      {children}

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <h3>Gaurav Nursery</h3>
            <p>Trusted plant studio for beautiful, healthy greenery across India.</p>
            <div className="footer-contact">
              <span>📞 {PHONE}</span>
              <span>✉️ hello@gauravnursery.in</span>
            </div>
          </div>

          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4>Shop</h4>
            <ul>
              <li><Link href="/plants">Plants</Link></li>
              <li><Link href="/plants">Planters</Link></li>
              <li><Link href="/plants">Seeds</Link></li>
              <li><Link href="/offers">Offers</Link></li>
            </ul>
          </div>

          <div>
            <h4>Customer Support</h4>
            <ul>
              <li><Link href="/shipping">Shipping & Returns</Link></li>
              <li><Link href="/terms">Terms & Conditions</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/contact">Track Order</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Gaurav Nursery. All rights reserved.</span>
          <div className="legal-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms & Conditions</Link>
            <Link href="/shipping">Shipping Policy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
