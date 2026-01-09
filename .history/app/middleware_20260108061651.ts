import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Get the token
  const token = request.cookies.get('auth_token')?.value

  // 2. Define path logic
  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isLoginPage = pathname === '/dashboard/login'
  
  // 🚀 THE FIX: Allow Next.js internal data requests to pass
  // This prevents the loop when clicking sub-pages like /analytics
  if (pathname.startsWith('/_next') || pathname.includes('/api/')) {
    return NextResponse.next()
  }

  // 3. LOGED IN: If user has token and hits login page, send to dashboard
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 4. PROTECTED: If hitting dashboard without token, send to login
  if (isDashboardRoute && !isLoginPage && !token) {
    return NextResponse.redirect(new URL('/dashboard/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}