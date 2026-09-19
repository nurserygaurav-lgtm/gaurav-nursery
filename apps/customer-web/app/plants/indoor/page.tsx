import Link from 'next/link';
import { CustomerPage } from '../../components/CustomerPage';

const products = [
  { name: 'Monstera Deliciosa', price: 599, oldPrice: 899, image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Areca Palm', price: 499, oldPrice: 699, image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Snake Plant', price: 349, oldPrice: 499, image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bac?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Peace Lily', price: 399, oldPrice: 599, image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Pothos', price: 279, oldPrice: 399, image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Rubber Plant', price: 699, oldPrice: 999, image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=1000&q=80' },
];

export default function IndoorPlantsPage() {
  return (
    <CustomerPage
      eyebrow="INDOOR PLANTS"
      title="Indoor Plants"
      subtitle="Bring nature inside your home with lush, low-maintenance favorites."
      ctaHref="/shop"
      ctaLabel="Browse collection"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', alignItems: 'start' }}>
        <aside style={{ background: '#fff', border: '1px solid rgba(17,58,36,0.1)', borderRadius: '18px', padding: '18px', position: 'sticky', top: '18px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '18px' }}>Filters</h3>
          {['Low Light', 'Indirect Sun', 'Pet Friendly', 'Air Purifying', 'Easy Care'].map((filter) => (
            <div key={filter} style={{ padding: '10px 0', borderBottom: '1px solid #edf0ea', color: '#334738', fontWeight: 600 }}>{filter}</div>
          ))}
        </aside>

        <div>
          <div style={{ background: 'linear-gradient(135deg, rgba(24,94,60,0.12), rgba(255,255,255,0.8))', border: '1px solid rgba(17,58,36,0.1)', borderRadius: '22px', display: 'grid', gridTemplateColumns: '1.5fr 0.8fr', overflow: 'hidden', marginBottom: '22px' }}>
            <div style={{ padding: '30px 28px' }}>
              <p style={{ margin: '0 0 8px', color: '#0f6d48', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>Fresh indoor greens</p>
              <h2 style={{ margin: '0 0 8px', fontSize: 'clamp(26px, 2vw, 36px)', color: '#102619' }}>Bring calm, color and cleaner air indoors</h2>
              <p style={{ margin: 0, color: '#4d5f54', lineHeight: 1.6 }}>Handpicked room-friendly plants for homes, apartments and modern workspaces.</p>
            </div>
            <img src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80" alt="Indoor plant display" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '18px' }}>
            {products.map((product) => (
              <Link href={`/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`} key={product.name} style={{ display: 'block', background: '#fff', border: '1px solid rgba(17,58,36,0.1)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(17,58,36,0.06)' }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '230px', objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: '16px' }}>
                  <div style={{ color: '#0b4a26', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>Indoor</div>
                  <h3 style={{ margin: '8px 0', fontSize: '20px', color: '#102619' }}>{product.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <strong style={{ fontSize: '20px', color: '#102619' }}>₹{product.price}</strong>
                    <span style={{ textDecoration: 'line-through', color: '#7a857f' }}>₹{product.oldPrice}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </CustomerPage>
  );
}
