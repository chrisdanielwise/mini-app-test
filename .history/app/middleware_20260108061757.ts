import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Get the token from cookies
  const token = request.cookies.get('auth_token')?.value

  // 2. Define path logic
  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isLoginPage = pathname === '/dashboard/login'

  // 🚀 FIX: Bypass internal Next.js requests & static assets
  // This prevents the loop when navigating between Analytics, Payouts, etc.
  if (
    pathname.startsWith('/_next') || 
    pathname.includes('/api/auth') ||
    pathname.includes('.') // matches favicon.ico, images, etc.
  ) {
    return NextResponse.next()
  }

  // 3. LOGIN PAGE LOGIC
  if (isLoginPage) {
    // If they have a token, don't show login; send to dashboard
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    // No token? Let them see the login page
    return NextResponse.next()
  }

  // 4. PROTECTED DASHBOARD LOGIC
  if (isDashboardRoute && !token) {
    // Blocked: Trying to access /dashboard/... without a session
    const loginUrl = new URL('/dashboard/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Run middleware on all dashboard routes
     */
    '/dashboard/:path*',
  ],
}