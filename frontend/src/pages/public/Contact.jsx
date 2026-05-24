import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import { brandContact } from '../../data/brandContent.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';

export default function Contact() {
  usePageMeta({
    title: 'Contact Gaurav Nursery',
    description: 'Get in touch with Gaurav Nursery for plant help, order support, and delivery questions.'
  });

  return (
    <section className="premium-container py-12">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-[#dbe8d8] bg-[#0b3d1e] p-8 text-white shadow-card">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#9debb3]">Contact</p>
          <h1 className="mt-3 font-serif text-4xl font-black">Trusted support for every order</h1>
          <div className="mt-8 grid gap-4 text-sm leading-7 text-emerald-50/90">
            <p className="flex items-start gap-3">
              <MapPin className="mt-0.5 shrink-0" size={18} />
              {brandContact.address}
            </p>
            <p className="flex items-start gap-3">
              <Phone className="mt-0.5 shrink-0" size={18} />
              Official Support Number: {brandContact.supportPhone}
            </p>
            <p className="flex items-start gap-3">
              <Mail className="mt-0.5 shrink-0" size={18} />
              {brandContact.supportEmail}
            </p>
            <p className="flex items-start gap-3">
              <MessageCircle className="mt-0.5 shrink-0" size={18} />
              Customer support available across India
            </p>
          </div>
          <a className="mt-8 inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-black text-[#0b3d1e]" href={`https://wa.me/${brandContact.whatsappPhone}?text=${encodeURIComponent(brandContact.whatsappMessage)}`} rel="noreferrer" target="_blank">
            <MessageCircle className="mr-2" size={18} />
            WhatsApp support
          </a>
        </div>

        <form className="rounded-[2rem] border border-[#dbe8d8] bg-white p-8 shadow-soft">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#4caf50]">Send a message</p>
          <h2 className="mt-3 font-serif text-3xl font-black text-[#0b3d1e]">Tell us what you need</h2>
          <div className="mt-6 grid gap-4">
            <input className="form-input" placeholder="Your name" />
            <input className="form-input" placeholder="Email address" type="email" />
            <textarea className="form-input min-h-40 rounded-[1.5rem]" placeholder="Plant, order, or delivery question" />
            <Button type="button" className="h-12">Send Message</Button>
          </div>
        </form>
      </div>
    </section>
  );
}
