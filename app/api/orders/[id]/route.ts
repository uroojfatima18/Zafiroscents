import { NextRequest, NextResponse } from 'next/server'
import { getOrderById } from '@backend/services/order.service'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const order = await getOrderById(id)

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  return NextResponse.json({ order })
}
