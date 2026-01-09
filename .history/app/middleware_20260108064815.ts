import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

// Standard Secret Key for JWT
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "zipha_secure_secret_2026");

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth_token')?.value

  // 1. EXIT EARLY: Assets, APIs, and Public Files
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api/auth') || 
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isLoginPage = pathname === '/dashboard/login'

  // 2. VERIFY TOKEN (Stateless - No Database call = No Loop)
  let userSession = null;
  if (token) {
    try {
      const { payload } = await jose.jwtVerify(token, SECRET);
      userSession = payload;
    } catch (err) {
      // Token is tampered with or expired
      userSession = null;
    }
  }

  // 3. REDIRECT LOGIC
  // If valid and on login page -> Send to dashboard
  if (isLoginPage && userSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If invalid and on dashboard -> Send to login + WIPE COOKIE
  if (isDashboardRoute && !isLoginPage && !userSession) {
    const response = NextResponse.redirect(new URL('/dashboard/login', request.url))
    if (token) response.cookies.delete('auth_token') // Standard cleanup
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}