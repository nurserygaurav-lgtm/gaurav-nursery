import Link from 'next/link';
import { CustomerPage } from '../components/CustomerPage';

const orders = [
  { id: 'GN10241', date: '19 Aug 2026', amount: '₹1,299', status: 'Processing' },
  { id: 'GN10212', date: '15 Aug 2026', amount: '₹899', status: 'Shipped' },
  { id: 'GN10188', date: '09 Aug 2026', amount: '₹499', status: 'Delivered' },
];

export default function AccountPage() {
  return (
    <CustomerPage eyebrow="MY ACCOUNT" title="Account" subtitle="Manage your plant orders, wishlist and address details." ctaHref="/shop" ctaLabel="Continue shopping">
      <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr', gap: '24px' }}>
        <aside style={{ background: '#fff', border: '1px solid rgba(17,58,36,0.1)', borderRadius: '18px', padding: '18px' }}>
          <h3 style={{ margin: '0 0 12px' }}>Profile</h3>
          {['My Account', 'My Orders', 'My Wishlist', 'My Addresses', 'Account Settings', 'Logout'].map((item) => (
            <div key={item} style={{ padding: '10px 0', borderBottom: '1px solid #edf0ea', fontWeight: 600 }}>{item}</div>
          ))}
        </aside>

        <div style={{ background: '#fff', border: '1px solid rgba(17,58,36,0.1)', borderRadius: '18px', padding: '20px' }}>
          <h2 style={{ margin: '0 0 18px' }}>My Orders</h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {orders.map((order) => (
              <div key={order.id} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.9fr 0.8fr 0.8fr', gap: '12px', padding: '14px', border: '1px solid #edf0ea', borderRadius: '12px', alignItems: 'center' }}>
                <div>
                  <strong>{order.id}</strong>
                  <div style={{ color: '#667767' }}>{order.date}</div>
                </div>
                <div>{order.amount}</div>
                <span style={{ background: '#edf8ef', color: '#0b4a26', padding: '6px 10px', borderRadius: '999px', textAlign: 'center', fontWeight: 700 }}>{order.status}</span>
                <Link href="/orders" style={{ textAlign: 'right', color: '#0b4a26', fontWeight: 700 }}>Track Order</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CustomerPage>
  );
}
