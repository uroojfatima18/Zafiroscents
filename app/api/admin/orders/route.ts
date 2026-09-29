import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@backend/database/db'
import { OrderStatus } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. Administrator access required.' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const statusParam = searchParams.get('status')
    const searchParam = searchParams.get('search')?.trim().toLowerCase()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}

    if (statusParam && statusParam !== 'all') {
      where.status = statusParam as OrderStatus
    }

    if (searchParam) {
      where.OR = [
        { orderNumber: { contains: searchParam, mode: 'insensitive' } },
        { shippingName: { contains: searchParam, mode: 'insensitive' } },
        { shippingPhone: { contains: searchParam } },
        { shippingCity: { contains: searchParam, mode: 'insensitive' } },
      ]
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true },
        },
        items: {
          include: {
            productVariant: {
              include: {
                product: {
                  select: { name: true, slug: true, images: true },
                },
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Admin orders fetch error:', error)
    return NextResponse.json({ error: 'Failed to retrieve orders' }, { status: 500 })
  }
}
