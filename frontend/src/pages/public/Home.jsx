import { ArrowRight, Leaf, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard.jsx';
import Button from '../../components/ui/Button.jsx';
import { featuredProducts } from '../../utils/mockData.js';

export default function Home() {
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1fr_0.9fr] md:items-center lg:px-8 lg:py-16">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-leaf-600">Premium plant marketplace</p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-leaf-900 sm:text-5xl">
              Bring healthier green spaces home.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-stone-600">
              Shop indoor plants, flowering plants, planters, soil, and garden essentials from trusted nursery sellers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop">
                <Button>
                  Shop Plants <ArrowRight className="ml-2" size={18} />
                </Button>
              </Link>
              <Link to="/seller">
                <Button variant="outline">Become a Seller</Button>
              </Link>
            </div>
          </div>
          <img
            className="aspect-[4/3] w-full rounded-lg object-cover shadow-soft"
            src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80"
            alt="Green indoor plants in ceramic pots"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Leaf, title: 'Fresh from sellers', text: 'Local nurseries list plants and garden products directly.' },
            { icon: Truck, title: 'Delivery ready', text: 'Built for cart, checkout, orders, and shipment workflows.' },
            { icon: ShieldCheck, title: 'Secure platform', text: 'Role-based JWT authentication for customers, sellers, and admins.' }
          ].map((item) => (
            <div key={item.title} className="rounded-lg bg-white p-5 shadow-soft">
              <item.icon className="text-leaf-600" size={24} />
              <h2 className="mt-4 font-bold text-leaf-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-leaf-600">Featured</p>
            <h2 className="mt-1 text-2xl font-black text-leaf-900">Popular Plants</h2>
          </div>
          <Link to="/shop" className="text-sm font-bold text-leaf-700">
            View all
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
