import clsx from 'clsx';

const variants = {
  primary: 'bg-leaf-600 text-white hover:bg-leaf-700',
  secondary: 'bg-leaf-100 text-leaf-900 hover:bg-leaf-50',
  outline: 'border border-leaf-200 text-leaf-900 hover:bg-leaf-50'
};

export default function Button({ children, className = '', variant = 'primary', ...props }) {
  return (
    <button
      className={clsx(
        'inline-flex min-h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
