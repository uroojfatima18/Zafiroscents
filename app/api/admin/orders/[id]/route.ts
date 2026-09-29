import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@backend/database/db'
import { OrderStatus } from '@prisma/client'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. Administrator access required.' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await req.json()
    const { status } = body

    if (!status || !['pending', 'confirmed', 'shipped', 'delivered'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid order status provided.' },
        { status: 400 }
      )
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: status as OrderStatus },
      include: {
        items: {
          include: {
            productVariant: {
              include: { product: true },
            },
          },
        },
      },
    })

    return NextResponse.json({
      message: `Order status updated to ${status}`,
      order: updatedOrder,
    })
  } catch (error) {
    console.error('Admin order status update error:', error)
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
  }
}
