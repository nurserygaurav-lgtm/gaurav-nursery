const sellerStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
const adminStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrderStatusSelect({ disabled, isAdmin = false, onChange, value }) {
  const statuses = isAdmin ? adminStatuses : sellerStatuses;

  return (
    <select className="form-input max-w-44" disabled={disabled} onChange={(event) => onChange(event.target.value)} value={value}>
      {statuses.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}
