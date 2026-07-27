import type { Metadata } from 'next';
import './styles.css';
export const metadata: Metadata = { title: 'Gaurav Nursery | Plants Delivered with Care', description: 'Shop healthy plants, pots, seeds and garden essentials online.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
