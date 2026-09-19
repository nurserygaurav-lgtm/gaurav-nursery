import type { ReactNode } from 'react';
import Link from 'next/link';
import StorefrontLayout from './StorefrontLayout';

type CustomerPageProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  ctaHref?: string;
  ctaLabel?: string;
  children: ReactNode;
};

export function CustomerPage({
  eyebrow,
  title,
  subtitle,
  ctaHref = '/shop',
  ctaLabel = 'Shop now',
  children,
}: CustomerPageProps) {
  return (
    <StorefrontLayout>
      <section style={{ padding: '28px 18px 0' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '22px',
            paddingBottom: '14px',
            borderBottom: '1px solid rgba(17, 58, 36, 0.1)',
          }}
        >
          <div>
            <p style={{ margin: '0 0 8px', color: '#1f6b40', fontWeight: 700, letterSpacing: '0.12em', fontSize: '11px', textTransform: 'uppercase' }}>
              {eyebrow}
            </p>
            <h1 style={{ margin: 0, fontSize: 'clamp(28px, 2vw, 42px)', color: '#102619' }}>{title}</h1>
            {subtitle ? <p style={{ margin: '8px 0 0', color: '#4d5f54', fontSize: '15px' }}>{subtitle}</p> : null}
          </div>
          <Link href={ctaHref} style={{
            background: '#0b4a26',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {ctaLabel}
          </Link>
        </div>
        {children}
      </section>
    </StorefrontLayout>
  );
}
