const categories = ['Indoor Plants', 'Flowering Plants', 'Fruit Plants', 'Seeds', 'Planters', 'Garden Tools'];

export default function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black text-leaf-900">Categories</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div key={category} className="rounded-lg bg-white p-6 shadow-soft">
            <h2 className="text-xl font-bold text-leaf-900">{category}</h2>
            <p className="mt-2 text-sm text-stone-600">Curated products for healthy garden growth.</p>
          </div>
        ))}
      </div>
    </section>
  );
}
