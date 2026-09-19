import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { displayOrder: 'asc' },
    })
    return NextResponse.json({ banners })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      subtitle,
      imageUrl,
      linkUrl = '/shop',
      badgeText,
      displayOrder = 0,
      isActive = true,
    } = body

    if (!title || !imageUrl) {
      return NextResponse.json({ error: 'Title and image URL are required' }, { status: 400 })
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle,
        imageUrl,
        linkUrl,
        badgeText,
        displayOrder: parseInt(displayOrder, 10) || 0,
        isActive: Boolean(isActive),
      },
    })

    const currentUser = await getCurrentUser()
    await prisma.auditLog.create({
      data: {
        actorId: currentUser?.userId || null,
        action: 'BANNER_CREATED',
        entityType: 'BANNER',
        entityId: banner.id,
        metadata: JSON.stringify({ title: banner.title, linkUrl }),
      },
    })

    return NextResponse.json({ success: true, message: 'Banner created successfully!', banner })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, isActive, displayOrder } = body

    if (!id) {
      return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 })
    }

    const updated = await prisma.banner.update({
      where: { id },
      data: {
        isActive: isActive !== undefined ? isActive : undefined,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder, 10) : undefined,
      },
    })

    return NextResponse.json({ success: true, banner: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 })
    }

    await prisma.banner.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Banner deleted' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
