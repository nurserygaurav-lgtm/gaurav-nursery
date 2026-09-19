import Link from 'next/link';
import { CustomerPage } from '../components/CustomerPage';

const products = [
  { name: 'Ceramic Pot', price: 549, oldPrice: 799, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Terracotta Set', price: 699, oldPrice: 999, image: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Self Watering Pot', price: 899, oldPrice: 1299, image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Hanging Planter', price: 599, oldPrice: 799, image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Handmade Pot', price: 750, oldPrice: 1025, image: 'https://images.unsplash.com/photo-1425421669292-0c3da3b8f529?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Grow Pot Kit', price: 349, oldPrice: 499, image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1000&q=80' },
];

export default function PlantersPage() {
  return (
    <CustomerPage eyebrow="POTS & PLANTERS" title="Pots & Planters" subtitle="Beautiful homes for every plant, from statement pots to everyday essentials." ctaHref="/shop" ctaLabel="Shop planters">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '18px' }}>
        {products.map((product) => (
          <Link href={`/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`} key={product.name} style={{ background: '#fff', border: '1px solid rgba(17,58,36,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
            <div style={{ padding: '16px' }}>
              <div style={{ color: '#0b4a26', fontWeight: 700, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Planters</div>
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
