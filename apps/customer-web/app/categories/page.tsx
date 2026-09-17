import Link from 'next/link';
import StorefrontLayout from '../components/StorefrontLayout';

const categories = [
  { name: 'Indoor Plants', description: 'Easy-care greens for every room.', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80', href: '/plants' },
  { name: 'Outdoor Plants', description: 'Balcony, garden and patio favorites.', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80', href: '/plants' },
  { name: 'Flowering Plants', description: 'Bright seasonal blooms for every mood.', image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=900&q=80', href: '/plants' },
  { name: 'Air Purifying Plants', description: 'Fresh, clean and calming indoor spaces.', image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=900&q=80', href: '/plants' },
  { name: 'Herbal Plants', description: 'Kitchen garden herbs and wellness greens.', image: 'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=900&q=80', href: '/plants' },
  { name: 'Pots & Planters', description: 'Smart planters for stylish indoor corners.', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80', href: '/plants' },
];

export default function CategoriesPage() {
  return (
    <StorefrontLayout>
      <section className="page-shell">
        <div className="section-title slim-title">
          <div>
            <p className="eyebrow">SHOP BY NEED</p>
            <h2>Find your ideal plant collection</h2>
          </div>
        </div>

        <div className="category-grid page-grid">
          {categories.map((category) => (
            <Link href={category.href} key={category.name} className="category-card large-category-card">
              <img src={category.image} alt={category.name} />
              <div className="category-copy">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <span>Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </StorefrontLayout>
  );
}
