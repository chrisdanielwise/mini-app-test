import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose' // Use 'jose' for middleware (lighter than jsonwebtoken)

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-super-secret-key");

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth_token')?.value

  // 1. Bypass static files/API
  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next()
  }

  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isLoginPage = pathname === '/dashboard/login'

  // 2. Verify JWT Signature (Stateless - 0ms delay)
  let isValid = false;
  if (token) {
    try {
      await jose.jwtVerify(token, JWT_SECRET);
      isValid = true;
    } catch (err) {
      isValid = false;
    }
  }

  // 3. Logic
  if (isLoginPage && isValid) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (isDashboardRoute && !isLoginPage && !isValid) {
    const response = NextResponse.redirect(new URL('/dashboard/login', request.url));
    response.cookies.delete('auth_token'); // Wipe bad token
    return response;
  }

  return NextResponse.next()
}

export const config = { matcher: ['/dashboard/:path*'] }