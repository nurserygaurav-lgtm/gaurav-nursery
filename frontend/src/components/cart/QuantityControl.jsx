export default function QuantityControl({ disabled, max = 99, onChange, value }) {
  return (
    <div className="inline-flex h-10 overflow-hidden rounded-lg border border-leaf-100 bg-white">
      <button
        className="w-10 text-lg font-bold text-leaf-800 hover:bg-leaf-50 disabled:opacity-40"
        disabled={disabled || value <= 1}
        onClick={() => onChange(value - 1)}
        type="button"
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="flex w-12 items-center justify-center text-sm font-bold text-leaf-900">{value}</span>
      <button
        className="w-10 text-lg font-bold text-leaf-800 hover:bg-leaf-50 disabled:opacity-40"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        type="button"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
