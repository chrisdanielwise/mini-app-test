import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth_token')?.value

  // 1. ASSET BYPASS
  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next()
  }

  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isLoginPage = pathname === '/dashboard/login'

  // 2. THE NUCLEAR OPTION: If we land on Login but have a token,
  // it means the DB check failed. WE MUST WIPE IT.
  if (isLoginPage && token) {
    console.log("🧼 [Middleware] Wiping stale/invalid cookie on Login page.");
    const response = NextResponse.next();
    response.cookies.delete('auth_token');
    return response;
  }

  // 3. NO TOKEN ACCESS
  if (isDashboardRoute && !isLoginPage && !token) {
    return NextResponse.redirect(new URL('/dashboard/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}