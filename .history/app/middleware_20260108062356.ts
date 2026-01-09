import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Get the auth_token cookie
  const token = request.cookies.get('auth_token')?.value

  // 2. Define path constants
  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isLoginPage = pathname === '/dashboard/login'

  /**
   * 🚀 THE DATA BYPASS (Loop Protection)
   * We allow all internal Next.js requests, API routes, and static assets 
   * to pass through without being intercepted by the redirect logic.
   */
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.includes('/_vercel')
  ) {
    return NextResponse.next()
  }

  /**
   * 3. LOGIN PAGE LOGIC
   * If they are already logged in (have a token), don't let them see 
   * the login page; send them straight to the command center.
   */
  if (isLoginPage) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  /**
   * 4. PROTECTED DASHBOARD LOGIC
   * If trying to access any /dashboard route without a token,
   * we kick them back to the login page.
   */
  if (isDashboardRoute && !token) {
    const loginUrl = new URL('/dashboard/login', request.url)
    
    // Optional: preserve the intended destination
    // loginUrl.searchParams.set('callbackUrl', pathname)
    
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

/**
 * CONFIGURATION
 * We target the dashboard and auth API to keep performance high.
 */
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/auth/:path*',
  ],
}