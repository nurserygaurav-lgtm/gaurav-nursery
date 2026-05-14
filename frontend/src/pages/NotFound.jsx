import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-4xl font-black text-leaf-900">Page not found</h1>
      <p className="mt-4 text-stone-600">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-8 inline-block">
        <Button>Go Home</Button>
      </Link>
    </section>
  );
}
