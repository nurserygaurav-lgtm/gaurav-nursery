import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'gaurav-nursery-secret-key-super-secure-2026'
const AUTH_COOKIE_NAME = 'gn_auth_token'

export interface TokenPayload {
  userId: string
  email: string
  name: string
  role: 'SUPER_ADMIN' | 'SELLER' | 'CUSTOMER' | 'DELIVERY_PARTNER'
  sellerId?: string
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

const CANDIDATE_SECRETS = Array.from(
  new Set([
    process.env.NEXTAUTH_SECRET,
    process.env.JWT_SECRET,
    'gaurav-nursery-secret-key-super-secure-2026',
  ].filter(Boolean))
) as string[]

export function verifyToken(token: string): TokenPayload | null {
  for (const secret of CANDIDATE_SECRETS) {
    try {
      const decoded = jwt.verify(token, secret) as any
      if (decoded) {
        const rawRole = (decoded.role || '').toUpperCase()
        if (rawRole === 'ADMIN' || rawRole === 'SUPER_ADMIN') {
          decoded.role = 'SUPER_ADMIN'
        } else if (rawRole === 'SELLER') {
          decoded.role = 'SELLER'
        } else if (rawRole === 'DELIVERY_PARTNER') {
          decoded.role = 'DELIVERY_PARTNER'
        } else {
          decoded.role = 'CUSTOMER'
        }
        return decoded as TokenPayload
      }
    } catch {}
  }
  return null
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function getCurrentUser(): Promise<TokenPayload | null> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
    if (!token) return null
    return verifyToken(token)
  } catch {
    return null
  }
}

export { AUTH_COOKIE_NAME }
