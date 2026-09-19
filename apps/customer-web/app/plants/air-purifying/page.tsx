import Link from 'next/link';
import { CustomerPage } from '../../components/CustomerPage';

const products = [
  { name: 'Snake Plant', price: 349, oldPrice: 499, image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bac?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Areca Palm', price: 499, oldPrice: 699, image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Peace Lily', price: 399, oldPrice: 599, image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Spider Plant', price: 299, oldPrice: 449, image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Bamboo Palm', price: 599, oldPrice: 799, image: 'https://images.unsplash.com/photo-1425421669292-0c3da3b8f529?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Rubber Plant', price: 699, oldPrice: 999, image: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&w=1000&q=80' },
];

export default function AirPurifyingPlantsPage() {
  return (
    <CustomerPage eyebrow="AIR PURIFYING" title="Air Purifying Plants" subtitle="Breathe cleaner, calmer spaces with healthy green companions." ctaHref="/shop" ctaLabel="Shop air-friendly plants">
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px' }}>
        <aside style={{ background: '#fff', border: '1px solid rgba(17,58,36,0.1)', borderRadius: '18px', padding: '18px' }}>
          <h3 style={{ margin: '0 0 12px' }}>Best for</h3>
          {['Bedrooms', 'Living Rooms', 'Workspaces', 'Homes with pets', 'Low maintenance'].map((item) => (
            <div key={item} style={{ padding: '10px 0', borderBottom: '1px solid #edf0ea' }}>{item}</div>
          ))}
        </aside>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '18px' }}>
          {products.map((product) => (
            <Link href={`/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`} key={product.name} style={{ background: '#fff', border: '1px solid rgba(17,58,36,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
              <div style={{ padding: '16px' }}>
                <div style={{ color: '#0b4a26', fontWeight: 700, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Air care</div>
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
