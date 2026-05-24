import Header from '../../components/navigation/Header.jsx';
import Footer from '../../components/navigation/Footer.jsx';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7faf5]">
      <Header />

      <main>
        <section className="premium-container py-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div>
              <h1 className="font-serif text-[clamp(2rem,3.2vw,3rem)] font-black leading-[1.05] text-[#0b3d1e]">
                Premium Plants. Trusted Nursery Support.
              </h1>
              <p className="mt-4 max-w-xl text-[clamp(0.95rem,1.25vw,1.1rem)] font-semibold leading-7 text-stone-700">
                Fresh stock, careful packaging, and real help—so your plants thrive.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  className="inline-flex items-center justify-center rounded-full bg-[#0b3d1e] px-6 py-3 text-sm font-black text-white shadow-button transition hover:-translate-y-0.5 hover:bg-[#4caf50]"
                  href="/shop"
                >
                  Shop Plants
                </a>
                <a
                  className="inline-flex items-center justify-center rounded-full border border-[#dbe8d8] bg-white px-6 py-3 text-sm font-black text-[#0b3d1e] transition hover:bg-[#eaf7e8] hover:-translate-y-0.5"
                  href="/categories"
                >
                  Explore Categories
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-leaf-100 bg-white/70 p-5 shadow-soft">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-leaf-600">Delivery</p>
                  <p className="mt-2 text-base font-black text-leaf-950">Pan India Shipping</p>
                </div>
                <div className="rounded-2xl border border-leaf-100 bg-white/70 p-5 shadow-soft">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-leaf-600">Guarantee</p>
                  <p className="mt-2 text-base font-black text-leaf-950">Live Arrival</p>
                </div>
                <div className="rounded-2xl border border-leaf-100 bg-white/70 p-5 shadow-soft">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-leaf-600">Support</p>
                  <p className="mt-2 text-base font-black text-leaf-950">Care Guidance</p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.25rem] border border-leaf-100 bg-white/70 p-6 shadow-soft">
              <h2 className="font-black text-leaf-950">Why customers trust us</h2>
              <ul className="mt-4 grid gap-3">
                <li className="flex gap-3 rounded-xl bg-white p-4">
                  <span className="mt-0.5 h-8 w-8 flex items-center justify-center rounded-full bg-leaf-100 text-leaf-800 font-black">
                    ✓
                  </span>
                  <div>
                    <p className="font-black text-[#0b3d1e]">Nursery fresh stock</p>
                    <p className="text-sm font-semibold text-stone-600">Curated plants picked for healthy growth.</p>
                  </div>
                </li>
                <li className="flex gap-3 rounded-xl bg-white p-4">
                  <span className="mt-0.5 h-8 w-8 flex items-center justify-center rounded-full bg-leaf-100 text-leaf-800 font-black">
                    ✓
                  </span>
                  <div>
                    <p className="font-black text-[#0b3d1e]">Safe, careful packaging</p>
                    <p className="text-sm font-semibold text-stone-600">Protective packing with plant-safe handling.</p>
                  </div>
                </li>
                <li className="flex gap-3 rounded-xl bg-white p-4">
                  <span className="mt-0.5 h-8 w-8 flex items-center justify-center rounded-full bg-leaf-100 text-leaf-800 font-black">
                    ✓
                  </span>
                  <div>
                    <p className="font-black text-[#0b3d1e]">Support after delivery</p>
                    <p className="text-sm font-semibold text-stone-600">Guidance for watering, placement & care.</p>
                  </div>
                </li>
              </ul>

              <div className="mt-6 rounded-2xl bg-[#0b3d1e] p-5 text-white">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/80">Need help selecting?</p>
                <p className="mt-2 text-lg font-black">Chat with our support team</p>
                <a
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-[#25d366] px-5 py-3 text-sm font-black text-white shadow-button transition hover:-translate-y-0.5 hover:bg-[#1ebe5d]"
                  href="/support"
                >
                  Support Center
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}



