import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@backend/services/product.service'
import { productQuerySchema } from '@backend/validations/product'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const parsed = productQuerySchema.safeParse(
    Object.fromEntries(searchParams.entries()),
  )

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid query parameters', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const result = await getProducts(parsed.data)
  return NextResponse.json(result)
}
