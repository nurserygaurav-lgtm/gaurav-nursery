/**
 * Gaurav Nursery — Data Masking & Privacy Utility
 * Ensures sensitive financial/identity data is never leaked in plain text.
 */

export function maskAccountNumber(accountNo?: string | null): string {
  if (!accountNo || accountNo.length < 4) return '••••••••'
  const visible = accountNo.slice(-4)
  return '••••••••' + visible
}

export function maskPanNumber(pan?: string | null): string {
  if (!pan || pan.length < 5) return '•••••'
  const visible = pan.slice(-5)
  return '•••••' + visible
}

export function maskGstNumber(gst?: string | null): string {
  if (!gst || gst.length < 5) return '•••••••••••••••'
  const prefix = gst.slice(0, 2)
  const suffix = gst.slice(-3)
  return `${prefix}••••••••••${suffix}`
}

export function maskPhone(phone?: string | null): string {
  if (!phone || phone.length < 4) return '••••••••••'
  const visible = phone.slice(-4)
  return '••••••' + visible
}
