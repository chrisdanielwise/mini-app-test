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

  // 2. THE LOOP BREAKER (Fixes the flicker/endless requests)
  // If landing on login with a token, we assume it's "stale" 
  // because the Page component kicked us here.
  if (isLoginPage && token) {
    const response = NextResponse.next();
    response.cookies.delete('auth_token');
    return response;
  }

  // 3. PROTECTED ROUTE LOGIC
  if (isDashboardRoute && !isLoginPage && !token) {
    return NextResponse.redirect(new URL('/dashboard/login', request.url))
  }

  // 4. OPTIONAL: SESSIONS PERSISTENCE
  // If they hit the root dashboard and HAVE a token, let them in.
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/auth/:path*'],
}