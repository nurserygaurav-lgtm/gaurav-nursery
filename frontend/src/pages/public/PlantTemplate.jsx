import { ArrowRight, BadgeCheck, Eye, LayoutGrid, Leaf, PackageCheck, ShoppingBag, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../../hooks/usePageMeta.js';

const asset = (name) => `/plant/images/${name}`;

const homePreviews = [
  { title: 'Homepage 1', image: asset('Home1.jpg'), href: '/shop?category=Indoor%20Plants' },
  { title: 'Homepage 2', image: asset('Home2.jpg'), href: '/shop?category=Outdoor%20Plants' },
  { title: 'Homepage 3', image: asset('Home3.jpg'), href: '/shop?category=Flowering%20Plants' },
  { title: 'Homepage 4', image: asset('Home4.jpg'), href: '/shop?category=Planters' },
  { title: 'Homepage 5', image: asset('Home5.jpg'), href: '/shop?search=office%20plants' },
  { title: 'Homepage 6', image: asset('Home6.jpg'), href: '/shop?search=corporate%20gifting' },
  { title: 'Homepage 7', image: asset('Home7.jpg'), href: '/shop?category=Seeds' },
  { title: 'Homepage 8', image: asset('Home8.jpg'), href: '/shop?search=balcony' },
  { title: 'Homepage 9', image: asset('Home9.jpg'), href: '/shop?search=bulk%20plants' },
  { title: 'Homepage 10', image: asset('Home10.jpg'), href: '/shop' }
];

const pagePreviews = [
  { title: 'Shop Catalog', text: 'Browse plant collections and nursery supplies.', image: asset('11_Shop_v01.jpg'), href: '/shop', icon: ShoppingBag },
  { title: 'Product Detail', text: 'View plant care, price, quantity, and packaging details.', image: asset('18_ProductDetails_v01.jpg'), href: '/shop', icon: Leaf },
  { title: 'Cart Page', text: 'Review selected plants before checkout.', image: asset('21_CartPage.jpg'), href: '/cart', icon: PackageCheck },
  { title: 'Checkout', text: 'Complete delivery and payment for plant orders.', image: asset('22_CheckOut.jpg'), href: '/checkout', icon: BadgeCheck },
  { title: 'About Us', text: 'Share the nursery story and quality promise.', image: asset('29_AboutUs.jpg'), href: '/about', icon: Sparkles },
  { title: 'Contact Us', text: 'Route customers to support and bulk quote help.', image: asset('30_ContactUs.jpg'), href: '/contact', icon: LayoutGrid }
];

function PreviewCard({ item, index }) {
  return (
    <Link
      className="group overflow-hidden rounded-lg border border-[#dbe8d8] bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-card"
      to={item.href}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#eef4ec]">
        <img
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          src={item.image}
          alt={`${item.title} plant template preview`}
          loading={index < 3 ? 'eager' : 'lazy'}
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07140b]/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-md bg-white/95 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#0b3d1e]">
          <Eye size={14} /> Open
        </span>
      </div>
      <div className="p-4">
        <p className="text-sm font-black text-[#10210f]">{item.title}</p>
        <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#4f7a58]">Plant template file</p>
      </div>
    </Link>
  );
}

export default function PlantTemplate() {
  usePageMeta({
    title: 'Plant Template Files',
    description: 'Preview the imported Plant HTML template files and use them as design references for the Gaurav Nursery ecommerce experience.',
    image: asset('Home1.jpg')
  });

  return (
    <div className="bg-[#f4f7f2] text-[#172315]">
      <section className="relative overflow-hidden bg-[#10210f]">
        <img className="absolute inset-0 h-full w-full object-cover opacity-35" src={asset('Home1.jpg')} alt="Plant template preview collage" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07140b]/96 via-[#10210f]/86 to-[#10210f]/54" />
        <div className="premium-container relative grid min-h-[34rem] items-center gap-8 py-14 lg:grid-cols-[1fr_24rem]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/12 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-white">
              <Leaf size={16} /> Imported Plant Files
            </span>
            <h1 className="mt-6 max-w-4xl font-serif text-[clamp(2.25rem,5vw,5.25rem)] font-black leading-none text-white">
              Plant template previews, wired into Gaurav Nursery.
            </h1>
            <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-white/82 sm:text-lg">
              The static plant files are now available as a usable React page with image previews and links into the live ecommerce routes.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link className="inline-flex min-h-12 items-center justify-center rounded-md bg-white px-7 text-sm font-black text-[#0b3d1e] shadow-button transition hover:-translate-y-1 hover:bg-[#f1f8ef]" to="/shop">
                Browse shop <ArrowRight className="ml-2" size={18} />
              </Link>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/30 bg-white/12 px-7 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-white/20" to="/contact">
                Request customization
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-white/15 bg-white/12 p-5 text-white shadow-card backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#dff7d8]">Included preview set</p>
            <div className="mt-5 grid gap-3">
              {['10 homepage previews', 'Shop and product detail layouts', 'Cart, checkout, about, and contact screens'].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-md bg-white/10 p-3">
                  <BadgeCheck className="text-[#b8dfb2]" size={19} />
                  <span className="text-sm font-bold text-white/86">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="premium-container py-12 sm:py-16">
        <div className="mb-7">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2f6d4c]">Homepage Files</p>
          <h2 className="mt-3 font-serif text-[clamp(1.65rem,2.6vw,2.8rem)] font-black leading-tight text-[#10210f]">Plant homepage directions</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {homePreviews.map((item, index) => <PreviewCard key={item.title} item={item} index={index} />)}
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="premium-container">
          <div className="mb-7">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2f6d4c]">Commerce Pages</p>
            <h2 className="mt-3 font-serif text-[clamp(1.65rem,2.6vw,2.8rem)] font-black leading-tight text-[#10210f]">Mapped to live app routes</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {pagePreviews.map((item) => (
              <Link key={item.title} className="group grid overflow-hidden rounded-lg border border-[#dbe8d8] bg-[#f8fbf6] shadow-soft transition hover:-translate-y-1 hover:shadow-card sm:grid-cols-[12rem_1fr]" to={item.href}>
                <img className="h-full min-h-48 w-full object-cover transition duration-700 group-hover:scale-105" src={item.image} alt={`${item.title} page preview`} loading="lazy" decoding="async" />
                <div className="p-5">
                  <item.icon className="text-[#2f6d4c]" size={24} />
                  <h3 className="mt-4 text-lg font-black text-[#10210f]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#0b3d1e]">
                    Open route <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
