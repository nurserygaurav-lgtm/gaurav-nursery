const styles = {
  pending: 'bg-yellow-50 text-yellow-700',
  paid: 'bg-leaf-50 text-leaf-700',
  processing: 'bg-blue-50 text-blue-700',
  shipped: 'bg-indigo-50 text-indigo-700',
  delivered: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-700'
};

export default function OrderStatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
}
