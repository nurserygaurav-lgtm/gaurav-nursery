import Link from 'next/link';
import StorefrontLayout from '../components/StorefrontLayout';

export default function OrderSuccessPage() {
  return (
    <StorefrontLayout>
      <section className="page-shell content-page legal-page">
        <div className="section-title slim-title">
          <div>
            <p className="eyebrow">ORDER PLACED</p>
            <h2>Thank you for your order</h2>
          </div>
        </div>

        <div className="legal-box" style={{ textAlign: 'center' }}>
          <h3 style={{ marginTop: 0 }}>Your plant order has been received.</h3>
          <p>We have confirmed your purchase and your plants are being packed with care for a safe delivery.</p>
          <p><strong>Order ID:</strong> GN-2026-1042</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginTop: '18px' }}>
            <Link href="/orders" style={{ background: '#0b4a26', color: '#fff', borderRadius: '10px', padding: '12px 18px', fontWeight: 700 }}>Track Order</Link>
            <Link href="/shop" style={{ background: '#edf8ef', color: '#0b4a26', borderRadius: '10px', padding: '12px 18px', fontWeight: 700 }}>Continue Shopping</Link>
          </div>
        </div>
      </section>
    </StorefrontLayout>
  );
}
