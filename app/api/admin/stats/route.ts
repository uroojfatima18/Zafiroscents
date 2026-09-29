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

    // Parallel fetch key dashboard statistics
    const [
      totalOrders,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
      totalCustomers,
      productsCount,
      lowStockVariants,
      recentOrders,
      ordersForRevenue,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.order.count({ where: { status: 'shipped' } }),
      prisma.order.count({ where: { status: 'delivered' } }),
      prisma.user.count({ where: { role: 'customer' } }),
      prisma.product.count(),
      prisma.productVariant.findMany({
        where: { stock: { lte: 10 } },
        include: {
          product: {
            select: { name: true, slug: true, images: true },
          },
        },
        take: 8,
      }),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              productVariant: {
                include: { product: true },
              },
            },
          },
        },
      }),
      prisma.order.findMany({
        select: { total: true },
      }),
    ])

    const totalRevenue = ordersForRevenue.reduce((acc, order) => acc + order.total, 0)

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        shippedOrders,
        deliveredOrders,
        totalCustomers,
        productsCount,
        lowStockCount: lowStockVariants.length,
      },
      lowStockVariants,
      recentOrders,
    })
  } catch (error) {
    console.error('Admin stats fetch error:', error)
    return NextResponse.json({ error: 'Failed to retrieve dashboard metrics' }, { status: 500 })
  }
}
