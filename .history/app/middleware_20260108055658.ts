import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Get the token
  const token = request.cookies.get('auth_token')?.value

  // 2. Constants for logic
  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isLoginPage = pathname === '/dashboard/login'

  // 3. THE FIX: Redirect to login ONLY if not on login page and no token
  if (isDashboardRoute && !isLoginPage && !token) {
    // We use a absolute URL to ensure the redirect is clean
    const loginUrl = new URL('/dashboard/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 4. If logged in, don't allow access to login page
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Ensure middleware runs on dashboard routes BUT excludes static files
export const config = {
  matcher: [
    /*
     * Match all /dashboard paths
     * Exclude: _next/static, _next/image, favicon.ico
     */
    '/dashboard/:path*',
  ],
}