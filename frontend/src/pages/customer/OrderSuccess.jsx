import { CheckCircle2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';

export default function OrderSuccess() {
  const { id } = useParams();

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <CheckCircle2 className="mx-auto text-leaf-600" size={56} />
      <h1 className="mt-5 text-3xl font-black text-leaf-900">Order placed successfully</h1>
      <p className="mt-3 text-stone-600">Your Gaurav Nursery order has been created and is ready for processing.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to={`/orders/${id}`}>
          <Button>View Order</Button>
        </Link>
        <Link to="/shop">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
      </div>
    </section>
  );
}
