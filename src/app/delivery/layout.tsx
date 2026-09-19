import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function DeliveryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user || (user.role !== 'DELIVERY_PARTNER' && user.role !== 'SUPER_ADMIN')) {
    redirect('/login?redirect=/delivery')
  }

  return <>{children}</>
}
