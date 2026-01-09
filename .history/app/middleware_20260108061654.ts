import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Get the token from cookies
  const token = request.cookies.get('auth_token')?.value

  // 2. Define path logic
  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isLoginPage = pathname === '/dashboard/login'
  const isPublicAsset = pathname.includes('.') // Skips favicon, images, etc.

  // 3. EXIT EARLY: If it's a public asset, let it through
  if (isPublicAsset) {
    return NextResponse.next()
  }

  // 4. LOGIN PAGE LOGIC
  if (isLoginPage) {
    // If they have a token, they shouldn't be here; send to dashboard
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    // If no token, let them see the login page (CRITICAL TO STOP THE LOOP)
    return NextResponse.next()
  }

  // 5. PROTECTED DASHBOARD LOGIC
  if (isDashboardRoute && !token) {
    // No token and trying to access a protected dashboard route
    const loginUrl = new URL('/dashboard/login', request.url)
    
    // Optional: Add the current path as a "from" parameter to redirect back after login
    // loginUrl.searchParams.set('from', pathname)
    
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all /dashboard paths
     */
    '/dashboard/:path*',
  ],
}