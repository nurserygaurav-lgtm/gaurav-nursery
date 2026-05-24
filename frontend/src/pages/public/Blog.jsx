import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogCategories, blogPosts } from '../../data/brandContent.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';

export default function Blog() {
  usePageMeta({
    title: 'Plant Care Blog',
    description: 'Simple plant care articles for indoor care, summer care, balcony gardening, fertilizer tips, fruit plants, and monsoon tips.'
  });

  return (
    <section className="premium-container py-12">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#4caf50]">Plant Care Blog</p>
        <h1 className="mt-3 font-serif text-4xl font-black text-[#0b3d1e]">Useful, SEO-friendly care guides</h1>
        <p className="mt-4 text-sm leading-7 text-stone-600">Simple articles for common plant care questions and seasonal upkeep.</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {blogCategories.map((category) => (
          <span key={category} className="rounded-full border border-[#dbe8d8] bg-white px-4 py-2 text-sm font-black text-[#0b3d1e] shadow-soft">
            {category}
          </span>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {blogPosts.map((post) => (
          <article key={post.slug} className="overflow-hidden rounded-[1.75rem] border border-[#dbe8d8] bg-white shadow-soft">
            <img className="h-52 w-full object-cover" src={post.image} alt={post.title} />
            <div className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4caf50]">{post.category}</p>
              <h2 className="mt-2 text-xl font-black text-[#0b3d1e]">{post.title}</h2>
              <p className="mt-3 text-sm leading-7 text-stone-600">{post.excerpt}</p>
              <Link className="mt-4 inline-flex items-center text-sm font-black text-[#4caf50]" to={`/blog/${post.slug}`}>
                Read article <ArrowRight className="ml-2" size={15} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
