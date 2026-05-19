import { CreditCard, Leaf, Mail, MapPin, MessageCircle, PackageCheck, Phone, RotateCcw, ShieldCheck, Sparkles, Truck, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';

const whatsappUrl = 'https://wa.me/916352031504';

const trustItems = [
  { icon: PackageCheck, label: 'Secure Packaging' },
  { icon: ShieldCheck, label: 'Live Arrival Guarantee' },
  { icon: CreditCard, label: 'COD Available' },
  { icon: RotateCcw, label: 'Easy Returns' },
  { icon: UserRound, label: 'Expert Guidance' }
];

const policyLinks = [
  'About Us',
  'Privacy Policy',
  'Terms & Conditions',
  'Shipping Policy',
  'Refund Policy',
  'Contact Us'
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
              <h2 className="font-serif text-2xl font-black leading-none">Gaurav Nursery</h2>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#eaf7e8]">Premium Plant Studio</p>
            </div>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-[#eaf7e8]">
            Healthy plants, seeds, planters, fertilizers, and garden tools delivered with care from our nursery to your home.
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
            {policyLinks.map((label) => (
              <Link key={label} className="transition hover:text-white" to={label === 'About Us' ? '/about' : '/contact'}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-black">Shop</h3>
          <div className="mt-4 grid gap-3 text-sm text-[#eaf7e8]">
            <Link className="transition hover:text-white" to="/shop?category=Plants">Plants</Link>
            <Link className="transition hover:text-white" to="/shop?category=Seeds">Seeds</Link>
            <Link className="transition hover:text-white" to="/shop?category=Pots%20%26%20Planters">Pots & Planters</Link>
            <Link className="transition hover:text-white" to="/shop?category=Fertilizers">Fertilizers</Link>
            <Link className="transition hover:text-white" to="/shop?category=Tools%20%26%20Accessories">Tools & Accessories</Link>
            <Link className="transition hover:text-white" to="/orders">Track Order</Link>
          </div>
        </div>

        <div>
          <h3 className="font-black">Contact</h3>
          <div className="mt-4 grid gap-3 text-sm text-[#eaf7e8]">
            <span className="flex items-start gap-3"><MapPin className="mt-0.5 shrink-0" size={17} /> Aliganj Bazar, Sultanpur</span>
            <a className="flex items-center gap-3 transition hover:text-white" href="tel:+916352031504"><Phone size={17} /> +91 63520 31504</a>
            <a className="flex items-center gap-3 transition hover:text-white" href="mailto:nurserygaurav@gmail.com"><Mail size={17} /> nurserygaurav@gmail.com</a>
            <a className="flex items-center gap-3 transition hover:text-white" href={whatsappUrl} rel="noreferrer" target="_blank"><MessageCircle size={17} /> Chat on WhatsApp</a>
          </div>
          <div className="mt-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#eaf7e8]">Payments</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Visa', 'Mastercard', 'UPI', 'RuPay'].map((item) => (
                <span key={item} className="rounded-lg bg-white px-3 py-2 text-xs font-black text-[#0b3d1e]">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="premium-container flex flex-col gap-3 py-5 text-sm text-[#eaf7e8] lg:flex-row lg:items-center lg:justify-between">
          <p>Copyright 2026 Gaurav Nursery. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link className="transition hover:text-white" to="/contact">Privacy Policy</Link>
            <Link className="transition hover:text-white" to="/contact">Terms & Conditions</Link>
            <Link className="transition hover:text-white" to="/contact">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
