import { CreditCard, Leaf, Mail, MapPin, MessageCircle, Phone, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { brandContact } from '../../data/brandContent.js';

const trustItems = [
  { icon: Truck, label: 'Pan India Delivery' },
  { icon: ShieldCheck, label: 'Live Arrival Guarantee' },
  { icon: CreditCard, label: 'Secure Payments' },
  { icon: Sparkles, label: 'Plant Care Support' },
  { icon: Leaf, label: 'Nursery Fresh Stock' }
];

const footerLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Plant Care', to: '/blog' },
  { label: 'Shipping Policy', to: '/contact' },
  { label: 'Replacement Policy', to: '/contact' },
  { label: 'Terms', to: '/contact' },
  { label: 'Privacy', to: '/contact' },
  { label: 'Track Order', to: '/orders' },
  { label: 'Contact', to: '/contact' },
  { label: 'WhatsApp', to: `https://wa.me/${brandContact.whatsappPhone}` },
  { label: 'Instagram', to: 'https://instagram.com/' },
  { label: 'YouTube', to: 'https://youtube.com/' }
];

export default function Footer() {
  return (
    <footer className="bg-[#0b3d1e] text-white">
      <div className="border-b border-white/10 bg-white/[0.04]">
        <div className="premium-container grid gap-4 py-5 sm:grid-cols-2 lg:grid-cols-5">
          {trustItems.map((item) => (
            <div key={item.label} className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#eaf7e8]">
                <item.icon size={20} />
              </span>
              <span className="text-sm font-black">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="premium-container grid gap-10 py-12 lg:grid-cols-[1.2fr_0.9fr_0.9fr_1fr]">
        <div>
          <Link className="flex items-center gap-3" to="/">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg font-black text-[#0b3d1e]">GN</span>
            <div>
              <h2 className="font-serif text-2xl font-black leading-none">{brandContact.name}</h2>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#eaf7e8]">Trusted Plant Studio</p>
            </div>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-[#eaf7e8]">
            Premium plants, safe packaging, and real support from our nursery in Sultanpur.
          </p>
          <div className="mt-6 flex gap-3">
            {[Leaf, Sparkles, Truck].map((Icon, index) => (
              <span key={index} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
                <Icon size={18} />
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-black">Company</h3>
          <div className="mt-4 grid gap-3 text-sm text-[#eaf7e8]">
            {footerLinks.slice(0, 6).map((item) => (
              <Link key={item.label} className="transition hover:text-white" to={item.to}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-black">Quick Links</h3>
          <div className="mt-4 grid gap-3 text-sm text-[#eaf7e8]">
            {footerLinks.slice(6, 9).map((item) =>
              item.to.startsWith('http') ? (
                <a key={item.label} className="transition hover:text-white" href={item.to} rel="noreferrer" target="_blank">
                  {item.label}
                </a>
              ) : (
                <Link key={item.label} className="transition hover:text-white" to={item.to}>
                  {item.label}
                </Link>
              )
            )}
          </div>
        </div>

        <div>
          <h3 className="font-black">Contact</h3>
          <div className="mt-4 grid gap-3 text-sm text-[#eaf7e8]">
            <span className="flex items-start gap-3">
              <MapPin className="mt-0.5 shrink-0" size={17} />
              {brandContact.address}
            </span>
            <a className="flex items-center gap-3 transition hover:text-white" href={`tel:${brandContact.supportPhone.replace(/\s+/g, '')}`}>
              <Phone size={17} /> Official Support Number
            </a>
            <a className="flex items-center gap-3 transition hover:text-white" href={`mailto:${brandContact.supportEmail}`}>
              <Mail size={17} /> {brandContact.supportEmail}
            </a>
            <a className="flex items-center gap-3 transition hover:text-white" href={`https://wa.me/${brandContact.whatsappPhone}`} rel="noreferrer" target="_blank">
              <MessageCircle size={17} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="premium-container flex flex-col gap-3 py-5 text-sm text-[#eaf7e8] lg:flex-row lg:items-center lg:justify-between">
          <p>Copyright 2026 Gaurav Nursery. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {footerLinks.slice(9).map((item) => (
              <a key={item.label} className="transition hover:text-white" href={item.to} rel="noreferrer" target="_blank">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
