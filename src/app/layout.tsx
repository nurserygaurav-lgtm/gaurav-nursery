import './globals.css'
import type { Metadata } from 'next'
import WhatsAppButton from '@/components/WhatsAppButton'

export const metadata: Metadata = {
  metadataBase: new URL('https://gauravnursery.online'),
  title: 'Gaurav Nursery — India’s Specialized Multi-Vendor Plant Marketplace',
  description: 'Order healthy plants, adeniums, bonsai, and gardening supplies online with specialized live plant packaging and Pan-India doorstep delivery.',
  alternates: {
    canonical: 'https://gauravnursery.online',
  },
  openGraph: {
    title: 'Gaurav Nursery — Fresh Plants Delivered Across India',
    description: 'Order healthy live plants directly from certified greenhouses with specialized transit packaging.',
    url: 'https://gauravnursery.online',
    siteName: 'Gaurav Nursery',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f8faf8] antialiased text-slate-900">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  )
}
