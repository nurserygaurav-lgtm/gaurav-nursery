export default function Footer() {
  return (
    <footer className="border-t border-leaf-100 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-lg font-black text-leaf-900">Gaurav Nursery</h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Premium plants, planters, soil, and garden essentials from trusted local sellers.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-leaf-900">Marketplace</h3>
          <p className="mt-3 text-sm text-stone-600">Indoor plants, flowering plants, seeds, tools, and care products.</p>
        </div>
        <div>
          <h3 className="font-bold text-leaf-900">Support</h3>
          <p className="mt-3 text-sm text-stone-600">Orders, seller onboarding, delivery support, and plant-care help.</p>
        </div>
      </div>
    </footer>
  );
}
