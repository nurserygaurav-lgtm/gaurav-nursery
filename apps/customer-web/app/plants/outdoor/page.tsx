import Link from 'next/link';
import { CustomerPage } from '../../components/CustomerPage';

const products = [
  { name: 'Bougainvillea', price: 499, oldPrice: 699, image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Jasmine', price: 349, oldPrice: 529, image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Aloe Vera', price: 299, oldPrice: 450, image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Gardenia', price: 599, oldPrice: 799, image: 'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Sunflower', price: 180, oldPrice: 299, image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Rose Bush', price: 599, oldPrice: 850, image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=1000&q=80' },
];

export default function OutdoorPlantsPage() {
  return (
    <CustomerPage eyebrow="OUTDOOR PLANTS" title="Outdoor Plants" subtitle="Brighten balconies, patios and garden corners with resilient outdoor greens." ctaHref="/shop" ctaLabel="Explore outdoors">
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px' }}>
        <aside style={{ background: '#fff', border: '1px solid rgba(17,58,36,0.1)', borderRadius: '18px', padding: '18px' }}>
          <h3 style={{ margin: '0 0 12px' }}>Filters</h3>
          {['Full Sun', 'Partial Shade', 'Fragrant Blooms', 'Low Maintenance', 'Balcony Friendly'].map((item) => (
            <div key={item} style={{ padding: '10px 0', borderBottom: '1px solid #edf0ea' }}>{item}</div>
          ))}
        </aside>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '18px' }}>
          {products.map((product) => (
            <Link href={`/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`} key={product.name} style={{ background: '#fff', border: '1px solid rgba(17,58,36,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
              <div style={{ padding: '16px' }}>
                <div style={{ color: '#0b4a26', fontWeight: 700, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Outdoor</div>
                <h3 style={{ margin: '8px 0', fontSize: '20px' }}>{product.name}</h3>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                  <strong>₹{product.price}</strong>
                  <span style={{ textDecoration: 'line-through', color: '#7a857f' }}>₹{product.oldPrice}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </CustomerPage>
  );
}
