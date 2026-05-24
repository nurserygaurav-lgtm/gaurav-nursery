import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { blogPosts } from '../../data/brandContent.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';

export default function BlogPost() {
  const { slug } = useParams();
  const post = useMemo(() => blogPosts.find((item) => item.slug === slug) || blogPosts[0], [slug]);

  usePageMeta({
    title: post.title,
    description: post.excerpt
  });

  return (
    <article className="premium-container py-12">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#4caf50]">{post.category}</p>
        <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,4rem)] font-black text-[#0b3d1e]">{post.title}</h1>
        <p className="mt-4 text-lg leading-8 text-stone-600">{post.excerpt}</p>
        <img className="mt-8 h-[22rem] w-full rounded-[2rem] object-cover shadow-soft" src={post.image} alt={post.title} />

        <div className="mt-8 space-y-5 rounded-[2rem] border border-[#dbe8d8] bg-white p-6 shadow-soft">
          <p className="leading-8 text-stone-700">
            This article can be expanded into a full CMS-backed blog later. For now, it gives the site a real SEO-friendly
            content layer instead of a placeholder marketing block.
          </p>
          <p className="leading-8 text-stone-700">
            Use this page to publish care advice, seasonal guides, and product education with clean URLs like
            <span className="rounded bg-[#f7fff5] px-2 py-1 font-bold text-[#0b3d1e]"> /blog/how-to-save-tulsi-in-summer</span>.
          </p>
          <Link className="inline-flex items-center rounded-full bg-[#0b3d1e] px-5 py-3 text-sm font-black text-white" to="/blog">
            Back to blog
          </Link>
        </div>
      </div>
    </article>
  );
}
