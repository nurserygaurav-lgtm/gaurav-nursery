import clsx from 'clsx';

const variants = {
  primary: 'bg-gradient-to-br from-[#0f5132] via-[#167a46] to-[#198754] text-white shadow-[0_20px_45px_rgba(24,81,50,0.32)] hover:shadow-[0_24px_60px_rgba(24,81,50,0.32)] hover:-translate-y-0.5',
  secondary: 'bg-[#f4fff2] text-[#0b3d1e] shadow-soft hover:bg-[#eaf7e8]',
  outline: 'border border-[#d6f0db] bg-white/95 text-[#0b3d1e] hover:bg-[#f4fbf5]',
  dark: 'bg-[#0b3d1e] text-white shadow-soft hover:bg-[#166534]',
  glass: 'bg-white/10 text-white border border-white/20 shadow-soft backdrop-blur-lg hover:bg-white/20'
};

export default function Button({ children, className = '', variant = 'primary', ...props }) {
  return (
    <button
      className={clsx(
        'inline-flex min-h-[3rem] items-center justify-center rounded-[18px] px-6 text-sm font-black transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8cd89d] disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
