import Link from 'next/link';
import { CustomerPage } from '../../components/CustomerPage';

const article = {
  title: 'How to Care for Indoor Plants',
  author: 'Gaurav Nursery',
  date: '12 Feb 2026',
  image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80',
  summary: 'A simple care guide for healthy indoor plants.',
};

export default function BlogSlugPage() {
  return (
    <CustomerPage eyebrow="PLANT CARE BLOG" title={article.title} subtitle={article.summary} ctaHref="/blog" ctaLabel="Back to blog">
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '26px' }}>
        <article style={{ background: '#fff', border: '1px solid rgba(17,58,36,0.1)', borderRadius: '18px', padding: '22px' }}>
          <img src={article.image} alt={article.title} style={{ width: '100%', height: '360px', objectFit: 'cover', borderRadius: '16px' }} />
          <div style={{ marginTop: '20px', color: '#667767', fontSize: '14px' }}>By {article.author} • {article.date}</div>
          <div style={{ marginTop: '18px', color: '#334738', lineHeight: 1.8 }}>
            <p>Light is the most important factor when growing healthy indoor plants. Place foliage plants near windows with bright but indirect sun.</p>
            <p>Water only when the top layer feels slightly dry. Overwatering is the most common reason indoor plants feel stressed.</p>
            <p>Use well-draining soil, keep humidity moderate, and rotate pots so growth remains balanced.</p>
            <h3 style={{ margin: '20px 0 8px' }}>1. Light</h3>
            <p>Most tropical plants prefer soft morning light and bright indirect daylight for several hours daily.</p>
            <h3 style={{ margin: '20px 0 8px' }}>2. Watering</h3>
            <p>Check soil before watering. If the top 2 inches feel dry, it is a good time to water thoroughly.</p>
            <h3 style={{ margin: '20px 0 8px' }}>3. Soil</h3>
            <p>Loose, aerated potting mix helps roots stay healthy and reduces the risk of root rot.</p>
          </div>
        </article>

        <aside style={{ background: '#fff', border: '1px solid rgba(17,58,36,0.1)', borderRadius: '18px', padding: '20px' }}>
          <h3 style={{ marginTop: 0 }}>Related posts</h3>
          {['Best plants for beginners', 'Monsoon plant care', 'Balcony gardening tips'].map((item) => (
            <Link key={item} href="/blog" style={{ display: 'block', padding: '12px 0', borderBottom: '1px solid #edf0ea', color: '#102619', fontWeight: 600 }}>{item}</Link>
          ))}
        </aside>
      </div>
    </CustomerPage>
  );
}
