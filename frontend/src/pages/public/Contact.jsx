import Button from '../../components/ui/Button.jsx';

export default function Contact() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black text-leaf-900">Contact</h1>
      <form className="mt-8 space-y-4 rounded-lg bg-white p-6 shadow-soft">
        <input className="w-full rounded-lg border border-leaf-100 px-4 py-3" placeholder="Your name" />
        <input className="w-full rounded-lg border border-leaf-100 px-4 py-3" placeholder="Email address" type="email" />
        <textarea className="min-h-32 w-full rounded-lg border border-leaf-100 px-4 py-3" placeholder="Message" />
        <Button type="button">Send Message</Button>
      </form>
    </section>
  );
}
