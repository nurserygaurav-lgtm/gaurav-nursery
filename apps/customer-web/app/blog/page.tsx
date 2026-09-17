import Link from 'next/link';
import StorefrontLayout from '../components/StorefrontLayout';

const posts = [
  { title: 'How to keep indoor plants happy in winter', category: 'Plant Care', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80', date: '12 Feb 2026' },
  { title: 'Best plants for apartment balconies', category: 'Indoor Plants', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80', date: '18 Mar 2026' },
  { title: 'Beginner guide to herb gardening', category: 'Beginners Guide', image: 'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=900&q=80', date: '09 Apr 2026' },
  { title: 'Seasonal flowering plants for your home', category: 'Seasonal Plants', image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=900&q=80', date: '21 May 2026' },
];

export default function BlogPage() {
  return (
    <StorefrontLayout>
      <section className="page-shell">
        <div className="section-title slim-title">
          <div>
            <p className="eyebrow">PLANT JOURNAL</p>
            <h2>Green living inspiration</h2>
          </div>
        </div>

        <div className="blog-grid">
          {posts.map((post) => (
            <article key={post.title} className="blog-card">
              <img src={post.image} alt={post.title} />
              <div className="blog-copy">
                <span>{post.category}</span>
                <h3>{post.title}</h3>
                <p>Smart watering, sunlight and styling tips to help your plant collection thrive beautifully.</p>
                <div className="blog-meta">
                  <small>{post.date}</small>
                  <Link href="/blog">Read More</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </StorefrontLayout>
  );
}
