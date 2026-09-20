import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'gaurav-nursery-secret-key-super-secure-2026'
const AUTH_COOKIE_NAME = 'gn_auth_token'

interface TokenPayload {
  userId: string
  email: string
  name: string
  role: 'SUPER_ADMIN' | 'SELLER' | 'CUSTOMER' | 'DELIVERY_PARTNER'
  sellerId?: string
  exp?: number
}

const CANDIDATE_SECRETS = Array.from(
  new Set([
    process.env.NEXTAUTH_SECRET,
    process.env.JWT_SECRET,
    'gaurav-nursery-secret-key-super-secure-2026',
  ].filter(Boolean))
) as string[]

async function verifyEdgeToken(token: string): Promise<TokenPayload | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [headerB64, payloadB64, signatureB64] = parts
    const enc = new TextEncoder()

    // Normalize base64url to base64
    const b64 = signatureB64.replace(/-/g, '+').replace(/_/g, '/')
    const padded = b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, '=')
    const binarySig = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0))
    const data = enc.encode(`${headerB64}.${payloadB64}`)

    let isValid = false
    for (const secret of CANDIDATE_SECRETS) {
      try {
        const key = await crypto.subtle.importKey(
          'raw',
          enc.encode(secret),
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['verify']
        )
        isValid = await crypto.subtle.verify('HMAC', key, binarySig, data)
        if (isValid) break
      } catch {}
    }

    if (!isValid) return null

    const payloadPadded = payloadB64.replace(/-/g, '+').replace(/_/g, '/')
    const payloadJson = atob(payloadPadded.padEnd(payloadPadded.length + (4 - (payloadPadded.length % 4)) % 4, '='))
    const payload: TokenPayload = JSON.parse(payloadJson)

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null
    }

    const rawRole = (payload.role || '').toUpperCase()
    if (rawRole === 'ADMIN' || rawRole === 'SUPER_ADMIN') {
      payload.role = 'SUPER_ADMIN'
    } else if (rawRole === 'SELLER') {
      payload.role = 'SELLER'
    } else if (rawRole === 'DELIVERY_PARTNER') {
      payload.role = 'DELIVERY_PARTNER'
    } else {
      payload.role = 'CUSTOMER'
    }

    return payload
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Always allow seller registration (public onboarding form)
  if (pathname === '/seller/register') {
    const response = NextResponse.next()
    response.headers.set('x-pathname', pathname)
    return response
  }

  // 2. Extract token from cookie or Authorization header
  let token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) {
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    }
  }

  const user = token ? await verifyEdgeToken(token) : null

  // 3. API Route Protection
  if (pathname.startsWith('/api/admin/')) {
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 })
    }
    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Super Admin access required' }, { status: 403 })
    }
  }

  if (pathname.startsWith('/api/seller/')) {
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 })
    }
    if (user.role !== 'SELLER' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Seller access required' }, { status: 403 })
    }
  }

  if (pathname.startsWith('/api/delivery')) {
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 })
    }
    if (user.role !== 'DELIVERY_PARTNER' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Delivery Partner access required' }, { status: 403 })
    }
  }

  // 4. Portal Web Page Protection
  // Super Admin Portal: /admin/*
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    if (user.role !== 'SUPER_ADMIN') {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('error', 'forbidden')
      loginUrl.searchParams.set('requiredRole', 'SUPER_ADMIN')
      return NextResponse.redirect(loginUrl)
    }
  }

  // Seller Portal: /seller/* (except /seller/register checked above)
  if (pathname.startsWith('/seller')) {
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    if (user.role !== 'SELLER' && user.role !== 'SUPER_ADMIN') {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('error', 'forbidden')
      loginUrl.searchParams.set('requiredRole', 'SELLER')
      return NextResponse.redirect(loginUrl)
    }
  }

  // Delivery Portal: /delivery/*
  if (pathname.startsWith('/delivery')) {
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    if (user.role !== 'DELIVERY_PARTNER' && user.role !== 'SUPER_ADMIN') {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('error', 'forbidden')
      loginUrl.searchParams.set('requiredRole', 'DELIVERY_PARTNER')
      return NextResponse.redirect(loginUrl)
    }
  }

  // Customer Orders Portal: /orders/*
  if (pathname.startsWith('/orders')) {
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)
  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/seller/:path*',
    '/delivery/:path*',
    '/orders/:path*',
    '/api/admin/:path*',
    '/api/seller/:path*',
    '/api/delivery/:path*',
  ],
}
