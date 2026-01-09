import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

// Standard Secret Key for JWT - Must match your Auth Callback secret
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "zipha_secure_secret_2026");

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth_token')?.value

  /**
   * 1. EXIT EARLY: Assets, APIs, and Public Files
   * This prevents the middleware from running on images, scripts, or auth routes,
   * which significantly improves overall app performance.
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
   * 2. VERIFY TOKEN (Stateless - No Database call = No Loop)
   * We verify the signature of the JWT. If it's valid, we know the merchantId
   * is legitimate without asking Neon DB for verification.
   */
  let userSession = null;
  if (token) {
    try {
      const { payload } = await jose.jwtVerify(token, SECRET);
      userSession = payload;
    } catch (err) {
      // Token is tampered with, expired, or invalid
      userSession = null;
    }
  }

  /**
   * 3. REDIRECT LOGIC
   * This handles the "Bridge" between your Mini App and the Dashboard.
   */
  
  // Case A: Valid session tries to access login -> Send straight to Dashboard
  if (isLoginPage && userSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Case B: Protected route access without valid session -> Force Login + Wipe Stale Cookie
  if (isDashboardRoute && !isLoginPage && !userSession) {
    console.log(`[Middleware] Unauthorized access to ${pathname}. Redirecting to login.`);
    const response = NextResponse.redirect(new URL('/dashboard/login', request.url))
    
    // Explicitly delete the token to stop "Zombie Session" loops
    if (token) {
      response.cookies.delete('auth_token')
    }
    return response
  }

  // Case C: Standard authorized flow
  return NextResponse.next()
}

/**
 * Matcher configuration ensures this ONLY runs on dashboard routes
 * to keep the Mini-App side of the project as fast as possible.
 */
export const config = {
  matcher: ['/dashboard/:path*'],
}