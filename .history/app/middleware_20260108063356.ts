import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth_token')?.value

  // 1. BYPASS: Let internal Next.js and static files through instantly
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api/auth') || 
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isLoginPage = pathname === '/dashboard/login'

  // 2. THE KILL SWITCH: If user is on Login but still has a token,
  // it means the session check failed. WIPE THE COOKIE NOW.
  if (isLoginPage && token) {
    const response = NextResponse.next()
    response.cookies.delete('auth_token')
    return response
  }

  // 3. PROTECTION: No token? No dashboard.
  if (isDashboardRoute && !isLoginPage && !token) {
    return NextResponse.redirect(new URL('/dashboard/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/auth/:path*'],
}