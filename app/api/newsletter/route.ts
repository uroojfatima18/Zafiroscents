import { NextRequest, NextResponse } from 'next/server'
import { subscribeNewsletter } from '@backend/services/newsletter.service'
import { newsletterSchema } from '@backend/validations/newsletter'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = newsletterSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? 'Invalid email' },
      { status: 422 },
    )
  }

  const result = await subscribeNewsletter(parsed.data.email)
  if (!result.success) {
    return NextResponse.json({ error: result.message }, { status: result.code })
  }

  return NextResponse.json({ success: true }, { status: result.code })
}
