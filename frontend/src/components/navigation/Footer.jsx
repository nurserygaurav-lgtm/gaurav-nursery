import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, ShieldCheck, Truck, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const whatsappUrl = 'https://wa.me/916352031504';

export default function Footer() {
  return (
    <footer className="bg-leaf-950 text-white">
      <div className="border-b border-white/10 bg-white/[0.03]">
        <div className="premium-container grid gap-4 py-5 sm:grid-cols-3">
          <div className="flex min-w-0 items-center gap-3">
            <Truck className="text-leaf-200" size={22} />
            <span className="text-sm font-black">Free delivery above ₹499</span>
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <ShieldCheck className="text-leaf-200" size={22} />
            <span className="text-sm font-black">Secure checkout</span>
          </div>
          <a className="flex min-w-0 items-center gap-3 text-sm font-black text-white transition hover:text-leaf-100" href={whatsappUrl} rel="noreferrer" target="_blank">
            <MessageCircle className="text-leaf-200" size={22} />
            WhatsApp support
          </a>
        </div>
      </div>

      <div className="premium-container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_0.75fr_1fr]">
        <div className="min-w-0">
          <Link className="flex items-center gap-3" to="/">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg font-black text-leaf-950">GN</span>
            <div>
              <h2 className="text-xl font-black leading-none">Gaurav Nursery</h2>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-leaf-200">Plant Studio</p>
            </div>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-leaf-100">
            Premium plants, planters, seeds, soil, and garden essentials from trusted local sellers.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Twitter].map((Icon, index) => (
              <a key={index} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-leaf-950" href="/" aria-label="Social media">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="font-black">Quick Links</h3>
          <div className="mt-4 grid gap-3 text-sm text-leaf-100">
            <Link className="transition hover:text-white" to="/">Home</Link>
            <Link className="transition hover:text-white" to="/shop">Shop</Link>
            <Link className="transition hover:text-white" to="/categories">Categories</Link>
            <Link className="transition hover:text-white" to="/about">About</Link>
            <Link className="transition hover:text-white" to="/contact">Contact</Link>
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="font-black">Collections</h3>
          <div className="mt-4 grid gap-3 text-sm text-leaf-100">
            <Link className="transition hover:text-white" to="/shop?category=Indoor+Plants">Indoor Plants</Link>
            <Link className="transition hover:text-white" to="/shop?category=Flowering+Plants">Flowering Plants</Link>
            <Link className="transition hover:text-white" to="/shop?category=Seeds">Seeds</Link>
            <Link className="transition hover:text-white" to="/shop?category=Planters">Planters</Link>
            <Link className="transition hover:text-white" to="/seller">Become a Seller</Link>
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="font-black">Contact</h3>
          <div className="mt-4 grid gap-3 text-sm text-leaf-100">
            <span className="flex items-start gap-3"><MapPin className="mt-0.5 shrink-0" size={17} /> Aliganj Bazar, Sultanpur</span>
            <a className="flex items-center gap-3 transition hover:text-white" href="tel:+916352031504"><Phone size={17} /> +91 63520 31504</a>
            <a href="mailto:nurserygaurav@gmail.com" className="flex items-center gap-3 transition hover:text-white"><Mail size={17} /> nurserygaurav@gmail.com</a>
            <a href={whatsappUrl} rel="noreferrer" target="_blank" className="flex items-center gap-3 transition hover:text-white"><MessageCircle size={17} /> Chat on WhatsApp</a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="premium-container flex flex-col gap-2 py-5 text-sm text-leaf-100 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 Gaurav Nursery. All rights reserved.</p>
          <p>Fresh plants. COD available. Razorpay secure payments.</p>
        </div>
      </div>
    </footer>
  );
}
