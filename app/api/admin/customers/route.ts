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

    const customers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        address: true,
        role: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            total: true,
            status: true,
            createdAt: true,
          },
        },
      },
    })

    const formattedCustomers = customers.map((c) => {
      const totalSpent = c.orders.reduce((acc, o) => acc + o.total, 0)
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        city: c.city,
        address: c.address,
        role: c.role,
        createdAt: c.createdAt,
        totalOrders: c.orders.length,
        totalSpent,
      }
    })

    return NextResponse.json({ customers: formattedCustomers })
  } catch (error) {
    console.error('Admin customers fetch error:', error)
    return NextResponse.json({ error: 'Failed to retrieve customers' }, { status: 500 })
  }
}
