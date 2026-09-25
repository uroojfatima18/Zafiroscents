import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createOrder } from '@backend/services/order.service'
import { createOrderSchema } from '@backend/validations/order'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = createOrderSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 },
    )
  }

  try {
    const session = await auth()
    if (session?.user?.id && !parsed.data.userId) {
      parsed.data.userId = session.user.id
    }

    const order = await createOrder(parsed.data)
    return NextResponse.json({ order }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Order creation failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
