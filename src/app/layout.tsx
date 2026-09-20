import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gaurav Nursery — India’s Specialized Multi-Vendor Plant Marketplace',
  description: 'Order healthy plants, adeniums, bonsai, and gardening supplies online with specialized live plant packaging and Pan-India doorstep delivery.',
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
      </body>
    </html>
  )
}
