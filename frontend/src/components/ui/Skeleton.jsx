export default function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-2xl bg-gradient-to-r from-leaf-100 via-white to-leaf-100 ${className}`} />;
}
