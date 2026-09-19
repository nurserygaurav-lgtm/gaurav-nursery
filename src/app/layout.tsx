import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gaurav Nursery — India’s Specialized Multi-Vendor Plant Marketplace',
  description: 'Order healthy plants, adeniums, bonsai, and gardening supplies directly from verified local nurseries with transparent 10% platform commission.',
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
