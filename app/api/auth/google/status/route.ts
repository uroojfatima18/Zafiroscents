import { NextResponse } from 'next/server'

export async function GET() {
  const isConfigured = Boolean(
    (process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID) &&
    (process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET)
  )

  return NextResponse.json({ configured: isConfigured })
}
