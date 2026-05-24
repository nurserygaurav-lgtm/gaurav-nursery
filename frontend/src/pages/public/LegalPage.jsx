import React from 'react';
import { Link } from 'react-router-dom';

export default function LegalPage({ title, intro, sections }) {
  return (
    <section className="premium-container py-12">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#dbe8d8] bg-white p-6 shadow-soft sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#4caf50]">Gaurav Nursery</p>
        <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3.4rem)] font-black text-[#0b3d1e]">{title}</h1>
        <p className="mt-4 text-base leading-8 text-stone-600">{intro}</p>

        <div className="mt-8 grid gap-4">
          {sections.map((section) => (
            <article key={section.title} className="rounded-[1.5rem] border border-[#e6efe2] bg-[#f8fff5] p-5">
              <h2 className="text-xl font-black text-[#0b3d1e]">{section.title}</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-600">{section.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#0b3d1e] px-5 text-sm font-black text-white" to="/">
            Back to Home
          </Link>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#dbe8d8] bg-white px-5 text-sm font-black text-[#0b3d1e]" to="/contact">
            Contact Support
          </Link>
        </div>
      </div>
    </section>
  );
}
