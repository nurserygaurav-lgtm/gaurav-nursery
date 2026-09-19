import Link from 'next/link';
import { CustomerPage } from '../components/CustomerPage';

const products = [
  { name: 'Tulip Seeds', price: 199, oldPrice: 299, image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Sunflower Seeds', price: 149, oldPrice: 249, image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Marigold Seeds', price: 149, oldPrice: 249, image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Vegetable Seeds', price: 249, oldPrice: 399, image: 'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Herb Seed Mix', price: 219, oldPrice: 329, image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Flower Seed Kit', price: 399, oldPrice: 549, image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=1000&q=80' },
];

export default function SeedsPage() {
  return (
    <CustomerPage eyebrow="SEEDS" title="Seeds for a Greener Tomorrow" subtitle="Grow something beautiful, from your balcony to your backyard." ctaHref="/shop" ctaLabel="Shop seeds">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '18px' }}>
        {products.map((product) => (
          <Link href={`/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`} key={product.name} style={{ background: '#fff', border: '1px solid rgba(17,58,36,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
            <div style={{ padding: '16px' }}>
              <div style={{ color: '#0b4a26', fontWeight: 700, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Seeds</div>
              <h3 style={{ margin: '8px 0', fontSize: '20px' }}>{product.name}</h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                <strong>₹{product.price}</strong>
                <span style={{ textDecoration: 'line-through', color: '#7a857f' }}>₹{product.oldPrice}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </CustomerPage>
  );
}
