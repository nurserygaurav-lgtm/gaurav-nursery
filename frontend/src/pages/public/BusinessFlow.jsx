import {
  BadgeIndianRupee,
  Boxes,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Gauge,
  Heart,
  Home,
  ListFilter,
  PackageCheck,
  PackageOpen,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  Store,
  Truck,
  UserRound,
  UsersRound,
  Warehouse
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../../hooks/usePageMeta.js';

const entryPoints = [
  { icon: Home, label: 'Landing / Home Page' },
  { icon: Store, label: 'Categories' },
  { icon: Search, label: 'Search' },
  { icon: BadgeIndianRupee, label: "Today's Deals" },
  { icon: ListFilter, label: 'Product Listing Page' },
  { icon: SlidersHorizontal, label: 'Filter, Sort, Price, Brand' },
  { icon: ShoppingBag, label: 'Product Detail Page' }
];

const purchaseActions = [
  { icon: ShoppingCart, label: 'Add to Cart', to: '/cart' },
  { icon: CreditCard, label: 'Buy Now', to: '/checkout' },
  { icon: Heart, label: 'Wishlist', to: '/wishlist' }
];

const checkoutSteps = [
  'Cart',
  'Login',
  'Address Selection',
  'Delivery Option',
  'Checkout / Order Summary',
  'Payment Selection',
  'Place Order',
  'Payment Success',
  'Order Confirmation'
];

const orderSteps = [
  'Order Processing',
  'Packed',
  'Shipped',
  'Reached City',
  'Out for Delivery',
  'Delivered',
  'Return / Replacement / Review'
];

const homeSections = [
  'Logo',
  'Search bar',
  'Login',
  'Cart',
  'Categories',
  'Banner slider',
  'Best sellers',
  'Deals of the day',
  'Recommended products',
  'Footer'
];

const plpFeatures = ['Filters', 'Sort by Price', 'Brand', 'Rating', 'Size', 'Availability', 'Pagination'];

const pdpFeatures = [
  'Product images',
  'Zoom',
  'Videos',
  'Description',
  'Specifications',
  'Seller',
  'Delivery pincode',
  'Reviews',
  'Related products'
];

const paymentOptions = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet', 'EMI', 'Cash on Delivery'];

const cartFeatures = ['Product list', 'Quantity update', 'Remove item', 'Coupon', 'Price breakup', 'Total amount'];

const adminFlow = [
  { icon: ShieldCheck, label: 'Admin Login' },
  { icon: Gauge, label: 'Dashboard' },
  { icon: ShoppingBag, label: 'Products' },
  { icon: PackageCheck, label: 'Orders' },
  { icon: UsersRound, label: 'Customers' },
  { icon: Boxes, label: 'Inventory' },
  { icon: ClipboardCheck, label: 'Reports' },
  { icon: Settings, label: 'Settings' }
];

const businessFlow = [
  { icon: UserRound, label: 'Customer' },
  { icon: Home, label: 'Visit Website' },
  { icon: Search, label: 'Search Product' },
  { icon: ShoppingBag, label: 'View Product' },
  { icon: ShoppingCart, label: 'Add to Cart' },
  { icon: CreditCard, label: 'Checkout & Payment' },
  { icon: CheckCircle2, label: 'Order Created' },
  { icon: Warehouse, label: 'Warehouse Picks Product' },
  { icon: PackageOpen, label: 'Packing' },
  { icon: Truck, label: 'Courier Pickup & Delivery' },
  { icon: Star, label: 'Customer Review' }
];

function FlowRail({ items, numbered = false }) {
  return (
    <div className="grid gap-3">
      {items.map((item, index) => {
        const Icon = item.icon;
        const content = typeof item === 'string' ? item : item.label;

        return (
          <div key={content} className="grid grid-cols-[2.75rem_1fr] gap-3">
            <div className="relative flex justify-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#0b3d1e] text-white shadow-soft">
                {Icon ? <Icon size={18} /> : <span className="text-sm font-black">{numbered ? index + 1 : '>'}</span>}
              </span>
              {index < items.length - 1 && <span className="absolute top-12 h-full w-px bg-[#cfe0ca]" />}
            </div>
            <div className="rounded-lg border border-[#dbe8d8] bg-white px-4 py-3 shadow-soft">
              <p className="font-black text-[#10210f]">{content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FeatureCard({ title, items }) {
  return (
    <article className="rounded-lg border border-[#dbe8d8] bg-white p-5 shadow-soft">
      <h3 className="font-serif text-xl font-black text-[#10210f]">{title}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-md border border-[#dbe8d8] bg-[#f7fbf4] px-3 py-2 text-sm font-bold text-slate-700">
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}

export default function BusinessFlow() {
  usePageMeta({
    title: 'Gaurav Nursery Website Flow',
    description: 'Complete customer, checkout, order tracking, admin, and business flow for Gaurav Nursery ecommerce.'
  });

  return (
    <div className="bg-[#f4f7f2] text-[#172315]">
      <section className="bg-[#10210f] py-14 text-white sm:py-16">
        <div className="premium-container grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#b8dfb2]">Website Flow</p>
            <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,4.75rem)] font-black leading-tight">
              Complete ecommerce flow for customers, orders, and admin.
            </h1>
            <p className="mt-4 max-w-3xl leading-8 text-white/78">
              A clear operating map from home page discovery to product selection, checkout, delivery, support, and admin management.
            </p>
          </div>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-md bg-white px-6 text-sm font-black text-[#0b3d1e] shadow-button transition hover:-translate-y-1 hover:bg-[#f1f8ef]" to="/shop">
            Start Shopping
          </Link>
        </div>
      </section>

      <section className="premium-container grid gap-6 py-12 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-lg border border-[#dbe8d8] bg-white p-5 shadow-soft sm:p-6">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2f6d4c]">Overall Flow</p>
          <h2 className="mt-3 font-serif text-3xl font-black text-[#10210f]">From internet visit to product action</h2>
          <div className="mt-6">
            <FlowRail items={entryPoints} />
          </div>
        </article>

        <div className="grid gap-6">
          <article className="rounded-lg border border-[#dbe8d8] bg-white p-5 shadow-soft sm:p-6">
            <h2 className="font-serif text-2xl font-black text-[#10210f]">PDP Actions</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {purchaseActions.map((action) => (
                <Link key={action.label} className="rounded-lg border border-[#dbe8d8] bg-[#f7fbf4] p-4 text-[#0b3d1e] transition hover:-translate-y-1 hover:bg-white hover:shadow-soft" to={action.to}>
                  <action.icon size={22} />
                  <p className="mt-3 font-black">{action.label}</p>
                </Link>
              ))}
            </div>
          </article>

          <article className="rounded-lg border border-[#dbe8d8] bg-white p-5 shadow-soft sm:p-6">
            <h2 className="font-serif text-2xl font-black text-[#10210f]">Checkout Journey</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {checkoutSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-md bg-[#f7fbf4] px-4 py-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#0b3d1e] text-sm font-black text-white">{index + 1}</span>
                  <span className="font-bold text-slate-700">{step}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="premium-container">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2f6d4c]">Main Website Sections</p>
          <h2 className="mt-3 font-serif text-3xl font-black text-[#10210f]">Page-by-page feature map</h2>
          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <FeatureCard title="Home Page" items={homeSections} />
            <FeatureCard title="Product Listing Page" items={plpFeatures} />
            <FeatureCard title="Product Detail Page" items={pdpFeatures} />
            <FeatureCard title="Cart" items={cartFeatures} />
            <FeatureCard title="Payment Options" items={paymentOptions} />
            <FeatureCard title="Checkout Steps" items={checkoutSteps.slice(1, 6)} />
          </div>
        </div>
      </section>

      <section className="premium-container grid gap-6 py-12 lg:grid-cols-2">
        <article className="rounded-lg border border-[#dbe8d8] bg-white p-5 shadow-soft sm:p-6">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2f6d4c]">Order Tracking</p>
          <h2 className="mt-3 font-serif text-3xl font-black text-[#10210f]">Placed to delivered</h2>
          <div className="mt-6">
            <FlowRail items={orderSteps} numbered />
          </div>
        </article>

        <article className="rounded-lg border border-[#dbe8d8] bg-white p-5 shadow-soft sm:p-6">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2f6d4c]">Admin Flow</p>
          <h2 className="mt-3 font-serif text-3xl font-black text-[#10210f]">Manage products, orders, users, and settings</h2>
          <div className="mt-6">
            <FlowRail items={adminFlow} />
          </div>
        </article>
      </section>

      <section className="bg-[#10210f] py-12 text-white">
        <div className="premium-container">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#b8dfb2]">Complete Business Flow</p>
          <h2 className="mt-3 font-serif text-3xl font-black">Customer order to warehouse and review</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            {businessFlow.map((step, index) => (
              <div key={step.label} className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                  <step.icon className="text-[#b8dfb2]" size={22} />
                  <span className="text-sm font-black text-white/40">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <p className="mt-4 font-black leading-snug">{step.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-container py-12">
        <div className="rounded-lg border border-[#dbe8d8] bg-white p-6 shadow-soft sm:p-8">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2f6d4c]">Next Steps</p>
              <h2 className="mt-3 font-serif text-3xl font-black text-[#10210f]">Flows are now mapped for the live website experience.</h2>
              <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                Customers can discover products, complete checkout, track orders, and return to review. Admins can monitor the business side from dashboard to reports.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#0b3d1e] px-6 text-sm font-black text-white shadow-button transition hover:-translate-y-1 hover:bg-[#3d7d36]" to="/shop">
                Shop Catalog
              </Link>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#dbe8d8] bg-white px-6 text-sm font-black text-[#0b3d1e] transition hover:-translate-y-1 hover:bg-[#f7fbf4]" to="/admin">
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
