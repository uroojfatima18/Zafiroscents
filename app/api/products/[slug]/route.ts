import { NextRequest, NextResponse } from 'next/server'
import { getProductBySlug } from '@backend/services/product.service'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const { product, related } = await getProductBySlug(slug)

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  return NextResponse.json({ product, related })
}
