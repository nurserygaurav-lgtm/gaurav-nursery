import React, { useId } from 'react';

export default function BrandLogo({ compact = false, className = '', inverse = false }) {
  const gradientId = useId();
  return (
    <span className={`inline-flex items-center gap-3 ${className}`.trim()}>
      <svg aria-hidden="true" viewBox="0 0 64 64" className="h-11 w-11 shrink-0" role="img">
        <defs>
          <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#6bd36d" />
            <stop offset="100%" stopColor="#0b3d1e" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="31" fill="#f3fbf1" stroke="#dbe8d8" />
        <path
          d="M20 38c0-10 8-18 18-18h6c-1 12-8 24-22 24-2 0-4-.5-6-1.5 2-1.7 4-3.9 4-4.5z"
          fill={`url(#${gradientId})`}
        />
        <path d="M26 40c5-8 11-13 19-18" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="3" />
        <path d="M26 43h12" fill="none" stroke="#0b3d1e" strokeLinecap="round" strokeWidth="4" />
      </svg>
      {!compact && (
        <span className="min-w-0">
          <span className={`block text-[1.05rem] font-black leading-none sm:text-[1.15rem] ${inverse ? 'text-white' : 'text-[#0b3d1e]'}`}>
            Gaurav Nursery
          </span>
          <span className={`mt-1 block text-[0.68rem] font-bold uppercase tracking-[0.24em] ${inverse ? 'text-[#d7f5d1]' : 'text-[#4caf50]'}`}>
            Trusted Plant Studio
          </span>
        </span>
      )}
    </span>
  );
}
