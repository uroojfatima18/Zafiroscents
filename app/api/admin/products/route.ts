import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@backend/database/db'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. Administrator access required.' },
        { status: 403 }
      )
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        variants: {
          orderBy: { sizeMl: 'asc' },
        },
      },
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Admin products fetch error:', error)
    return NextResponse.json({ error: 'Failed to retrieve products' }, { status: 500 })
  }
}
