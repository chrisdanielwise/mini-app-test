import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Get the token from cookies (Standard for Server Actions/Middleware)
  const session = request.cookies.get('auth_token')?.value

  // 2. Define your paths
  const isDashboardPage = pathname.startsWith('/dashboard')
  const isLoginPage = pathname === '/dashboard/login'

  // 3. Logic: If trying to access dashboard without session, redirect to login
  if (isDashboardPage && !isLoginPage && !session) {
    return NextResponse.redirect(new URL('/dashboard/login', request.url))
  }

  // 4. Logic: If already logged in and trying to go to login page, go to dashboard
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Ensure middleware only runs on dashboard routes to save performance
export const config = {
  matcher: ['/dashboard/:path*'],
}