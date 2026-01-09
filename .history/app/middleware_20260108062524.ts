import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth_token')?.value

  // 1. PUBLIC & INTERNAL BYPASS
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isLoginPage = pathname === '/dashboard/login'

  // 2. THE LOOP BREAKER
  // If we are on the login page but a token still exists in the browser,
  // we assume that token is "dead" (otherwise the helper wouldn't have sent us here).
  if (isLoginPage && token) {
    const response = NextResponse.next();
    // ✅ This is allowed in Middleware! We wipe the bad cookie here.
    response.cookies.delete('auth_token');
    return response;
  }

  // 3. PROTECTED ROUTE LOGIC
  if (isDashboardRoute && !isLoginPage && !token) {
    return NextResponse.redirect(new URL('/dashboard/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/auth/:path*'],
}