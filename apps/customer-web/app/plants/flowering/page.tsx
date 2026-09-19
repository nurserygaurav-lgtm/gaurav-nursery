import Link from 'next/link';
import { CustomerPage } from '../../components/CustomerPage';

const products = [
  { name: 'Rose', price: 399, oldPrice: 599, image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Marigold', price: 199, oldPrice: 299, image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Tulip', price: 249, oldPrice: 379, image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Hibiscus', price: 499, oldPrice: 699, image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Lily', price: 349, oldPrice: 499, image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Orchid', price: 799, oldPrice: 1099, image: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&w=1000&q=80' },
];

export default function FloweringPlantsPage() {
  return (
    <CustomerPage eyebrow="FLOWERING PLANTS" title="Flowering Plants" subtitle="Colourful blooms for every season and every corner of your home." ctaHref="/shop" ctaLabel="Shop blooms">
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px' }}>
        <aside style={{ background: '#fff', border: '1px solid rgba(17,58,36,0.1)', borderRadius: '18px', padding: '18px' }}>
          <h3 style={{ margin: '0 0 12px' }}>Plant Type</h3>
          {['Seasonal', 'Fragrant', 'Long Bloom', 'Indoor Blooming', 'Gift Ready'].map((item) => (
            <div key={item} style={{ padding: '10px 0', borderBottom: '1px solid #edf0ea' }}>{item}</div>
          ))}
        </aside>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '18px' }}>
          {products.map((product) => (
            <Link href={`/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`} key={product.name} style={{ background: '#fff', border: '1px solid rgba(17,58,36,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
              <div style={{ padding: '16px' }}>
                <div style={{ color: '#0b4a26', fontWeight: 700, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Blooming</div>
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
