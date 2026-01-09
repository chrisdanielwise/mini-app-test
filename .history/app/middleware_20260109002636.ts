import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "zipha_secure_secret_2026");

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl // 🏁 Extract origin for Ngrok stability
  const token = request.cookies.get('auth_token')?.value

  /**
   * 1. PERFORMANCE GUARD
   * Skip middleware for static assets and public API routes.
   */
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api/auth') || 
    pathname.startsWith('/api/public') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isLoginPage = pathname === '/dashboard/login'

  /**
   * 2. STATELESS VERIFICATION
   * Jose verifies the signature directly. This is much faster than 
   * a database lookup and prevents Neon DB connection exhaustion.
   */
  let userSession = null;
  if (token) {
    try {
      const { payload } = await jose.jwtVerify(token, SECRET);
      userSession = payload;
    } catch (err) {
      userSession = null;
    }
  }

  /**
   * 3. NGROK-AWARE REDIRECT LOGIC
   * We use the dynamic 'origin' to ensure redirects stay on the 
   * xxxx.ngrok-free.app tunnel instead of falling back to localhost.
   */
  
  // Case A: User is logged in but hits the login page
  if (isLoginPage && userSession) {
    return NextResponse.redirect(new URL('/dashboard', origin))
  }

  // Case B: User tries to access Dashboard without a valid session
  if (isDashboardRoute && !isLoginPage && !userSession) {
    console.warn(`[Middleware] Unauthorized Dashboard access: ${pathname}`);
    
    // 🚀 REDIRECT FIX: Always use the absolute origin from the request
    const response = NextResponse.redirect(new URL('/dashboard/login', origin))
    
    // Clean up invalid cookies immediately to break redirect loops
    if (token) {
      response.cookies.delete('auth_token')
    }
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}