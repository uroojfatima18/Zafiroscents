import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@backend/database/db'

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
    const { featured, variantUpdates } = body

    // 1. Update product properties if provided
    if (typeof featured === 'boolean') {
      await prisma.product.update({
        where: { id },
        data: { featured },
      })
    }

    // 2. Update specific variant stock or price if provided
    // variantUpdates: Array of { id: string, stock?: number, price?: number }
    if (Array.isArray(variantUpdates)) {
      for (const update of variantUpdates) {
        if (update.id) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: Record<string, any> = {}
          if (typeof update.stock === 'number') data.stock = Math.max(0, update.stock)
          if (typeof update.price === 'number') data.price = Math.max(0, update.price)

          if (Object.keys(data).length > 0) {
            await prisma.productVariant.update({
              where: { id: update.id },
              data,
            })
          }
        }
      }
    }

    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: {
          orderBy: { sizeMl: 'asc' },
        },
      },
    })

    return NextResponse.json({
      message: 'Product updated successfully',
      product: updatedProduct,
    })
  } catch (error) {
    console.error('Admin product update error:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}
