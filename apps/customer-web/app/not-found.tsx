import Link from 'next/link';
import StorefrontLayout from './components/StorefrontLayout';

export default function NotFound() {
  return (
    <StorefrontLayout>
      <section className="page-shell content-page legal-page">
        <div className="section-title slim-title">
          <div>
            <p className="eyebrow">404</p>
            <h2>Page not found</h2>
          </div>
        </div>
        <div className="legal-box" style={{ textAlign: 'center' }}>
          <p>The page you are looking for is not available or may have moved.</p>
          <Link href="/" style={{ display: 'inline-block', background: '#0b4a26', color: '#fff', borderRadius: '10px', padding: '12px 18px', fontWeight: 700, marginTop: '8px' }}>Go to homepage</Link>
        </div>
      </section>
    </StorefrontLayout>
  );
}
