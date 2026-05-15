import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-leaf-950 text-white">
      <div className="premium-container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_0.75fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg font-black text-leaf-950">GN</span>
            <div>
              <h2 className="text-lg font-black leading-none">Gaurav Nursery</h2>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-leaf-200">Plant Studio</p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-6 text-leaf-100">
            Premium plants, planters, soil, and garden essentials from trusted local sellers.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Twitter].map((Icon, index) => (
              <a key={index} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-leaf-950" href="/" aria-label="Social media">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-black">Quick Links</h3>
          <div className="mt-4 grid gap-3 text-sm text-leaf-100">
            <Link className="transition hover:text-white" to="/shop">Shop Plants</Link>
            <Link className="transition hover:text-white" to="/categories">Categories</Link>
            <Link className="transition hover:text-white" to="/about">About</Link>
            <Link className="transition hover:text-white" to="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <h3 className="font-black">Marketplace</h3>
          <div className="mt-4 grid gap-3 text-sm text-leaf-100">
            <Link className="transition hover:text-white" to="/shop?category=Indoor+Plants">Indoor Plants</Link>
            <Link className="transition hover:text-white" to="/shop?category=Flowering+Plants">Flowering Plants</Link>
            <Link className="transition hover:text-white" to="/shop?category=Seeds">Seeds</Link>
            <Link className="transition hover:text-white" to="/seller">Become a Seller</Link>
          </div>
        </div>
        <div>
          <h3 className="font-black">Contact</h3>
          <div className="mt-4 grid gap-3 text-sm text-leaf-100">
            <span className="flex items-start gap-3"><MapPin className="mt-0.5 shrink-0" size={17} /> Local nursery marketplace, India</span>
            <span className="flex items-center gap-3"><Phone size={17} /> +91 98765 43210</span>
            <span className="flex items-center gap-3"><Mail size={17} /> support@gauravnursery.com</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="premium-container flex flex-col gap-2 py-5 text-sm text-leaf-100 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 Gaurav Nursery. All rights reserved.</p>
          <p>Fresh plants. Secure checkout. Premium delivery.</p>
        </div>
      </div>
    </footer>
  );
}
