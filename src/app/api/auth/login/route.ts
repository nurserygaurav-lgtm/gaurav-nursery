import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, signToken, AUTH_COOKIE_NAME } from '@/lib/auth'
import { callBackendApi } from '@/lib/backendClient'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const cleanEmail = email.toLowerCase().trim()

    // 1. Try Render Backend (MongoDB) first
    try {
      const backendRes = await callBackendApi('/auth/login', {
        method: 'POST',
        body: { email: cleanEmail, password },
      })

      if (backendRes.ok && backendRes.data?.user) {
        const u = backendRes.data.user
        const token = backendRes.data.token || signToken({
          userId: u.id || u.userId,
          email: u.email,
          name: u.name,
          role: u.role as any,
          sellerId: u.sellerProfile?.id || u.sellerProfile?._id,
        })

        const response = NextResponse.json({
          success: true,
          user: u,
          token,
        })

        response.cookies.set(AUTH_COOKIE_NAME, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        })

        return response
      }
    } catch (backendErr) {
      console.warn('Backend login warning:', backendErr)
    }

    // 2. Fallback to local DB
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: {
        sellerProfile: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const isValid = await comparePassword(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
      sellerId: user.sellerProfile?.id,
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        sellerProfile: user.sellerProfile,
      },
    })

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 500 }
    )
  }
}
