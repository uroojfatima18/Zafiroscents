import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Detect session token for NextAuth / Auth.js v5 across both http and https environments
  const sessionToken =
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('__Secure-authjs.session-token')?.value ||
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isProtectedPage = pathname.startsWith('/profile') || pathname.startsWith('/admin')

  // If user is already authenticated and visits login/register, redirect to profile
  if (isAuthPage && sessionToken) {
    return NextResponse.redirect(new URL('/profile', request.url))
  }

  // If user is unauthenticated and visits protected pages, redirect to login with callback
  if (isProtectedPage && !sessionToken) {
    const callbackUrl = encodeURIComponent(pathname)
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile/:path*', '/admin/:path*', '/login', '/register'],
}
