import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, signToken, AUTH_COOKIE_NAME } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      email,
      password,
      name,
      phone,
      role = 'CUSTOMER',
      // Seller specific fields
      businessName,
      nurseryAddress,
      city,
      state,
      pincode,
      panNumber,
      gstNumber,
      bankName,
      accountNumber,
      ifscCode,
      upiId,
    } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    // 1. Mirror registration to Render Backend (MongoDB)
    try {
      const { callBackendApi } = await import('@/lib/backendClient')
      await callBackendApi('/auth/register', {
        method: 'POST',
        body: {
          name,
          email: email.toLowerCase().trim(),
          password,
          role: role.toLowerCase(),
          phone,
          shopName: businessName,
          businessAddress: nurseryAddress,
        },
      })
    } catch (backendErr) {
      console.warn('Backend registration mirror warning:', backendErr)
    }

    const passwordHash = await hashPassword(password)

    if (role === 'SELLER') {
      if (!businessName || !nurseryAddress || !city || !state || !pincode) {
        return NextResponse.json(
          { error: 'Nursery business name, address, city, state, and pincode are required for seller registration' },
          { status: 400 }
        )
      }

      // Create User with role SELLER and SellerProfile in KYC_PENDING status
      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase().trim(),
          name,
          phone,
          passwordHash,
          role: 'SELLER',
          sellerProfile: {
            create: {
              businessName,
              nurseryAddress,
              city,
              state,
              pincode,
              panNumber: panNumber || null,
              gstNumber: gstNumber || null,
              bankName: bankName || null,
              accountNumber: accountNumber || null,
              ifscCode: ifscCode || null,
              upiId: upiId || null,
              status: 'KYC_PENDING', // Approval workflow state
              commissionRate: 0.10, // 10% platform commission
              nurseryPhotos: JSON.stringify([
                'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80'
              ]),
            },
          },
        },
        include: {
          sellerProfile: true,
        },
      })

      // Log Audit event
      await prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: 'SELLER_REGISTERED_KYC_SUBMITTED',
          entityType: 'SELLER',
          entityId: user.sellerProfile?.id,
          metadata: JSON.stringify({ businessName, city, status: 'KYC_PENDING' }),
        },
      })

      const token = signToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: 'SELLER',
        sellerId: user.sellerProfile?.id,
      })

      const response = NextResponse.json({
        success: true,
        message: 'Nursery registered successfully! Your account is submitted for Admin review.',
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
    }

    // Default: Customer registration
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name,
        phone,
        passwordHash,
        role: 'CUSTOMER',
      },
    })

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: 'CUSTOMER',
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
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
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    )
  }
}
