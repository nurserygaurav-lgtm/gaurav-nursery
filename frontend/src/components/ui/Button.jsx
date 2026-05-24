import clsx from 'clsx';

const variants = {
  primary: 'bg-leaf-700 text-white shadow-button hover:-translate-y-0.5 hover:bg-leaf-800 hover:shadow-lg',
  secondary: 'bg-leaf-100 text-leaf-900 shadow-soft hover:-translate-y-0.5 hover:bg-white',
  outline: 'border border-leaf-200 bg-white/90 text-leaf-900 hover:-translate-y-0.5 hover:border-leaf-400 hover:bg-leaf-50',
  dark: 'bg-leaf-950 text-white hover:-translate-y-0.5 hover:bg-leaf-800',
  glass: 'bg-white/20 text-white border border-white/25 shadow-soft backdrop-blur-lg hover:bg-white/30'
};

export default function Button({ children, className = '', variant = 'primary', ...props }) {
  return (
    <button
      className={clsx(
        'inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-bold transition duration-300 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
