import { cookies } from 'next/headers'

const BACKEND_BASE_URL = process.env.BACKEND_API_URL || 'https://gaurav-nursery.onrender.com'

export async function callBackendApi(
  endpoint: string,
  options: {
    method?: string
    body?: any
    headers?: Record<string, string>
    params?: Record<string, string | undefined>
  } = {}
) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const url = new URL(`/api${cleanEndpoint}`, BACKEND_BASE_URL)

  if (options.params) {
    Object.entries(options.params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        url.searchParams.set(key, String(val))
      }
    })
  }

  // Extract cookies from Next.js server context if available
  let cookieHeader = ''
  try {
    const cookieStore = cookies()
    cookieHeader = cookieStore.toString()
  } catch {
    // Client-side or outside request context
  }

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    ...(options.headers || {}),
  }

  try {
    const res = await fetch(url.toString(), {
      method: options.method || 'GET',
      headers: reqHeaders,
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: 'no-store',
    })

    const data = await res.json().catch(() => ({}))
    return {
      status: res.status,
      ok: res.ok,
      data,
      headers: res.headers,
    }
  } catch (error: any) {
    console.error(`Backend call failed for ${url.toString()}:`, error.message)
    return {
      status: 502,
      ok: false,
      data: { error: `Backend service communication error: ${error.message}` },
      headers: new Headers(),
    }
  }
}
