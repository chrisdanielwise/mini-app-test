import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { JWT_CONFIG } from '@/lib/auth/config'; 

/**
 * 🛰️ GLOBAL GATEKEEPER (Institutional v9.8.6)
 * Architecture: Turbopack Proxy Node
 * Logic: Atomic Exclusion to prevent 307-Storms.
 * Fix: Rename to 'middleware' and hardened bypass for token exchange.
 */
export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const timestamp = new Date().toLocaleTimeString();

  // 1. EMERGENCY BYPASS (The Terminator)
  // If we reach here for any of these paths, exit immediately without modifying headers.
  if (
    pathname === '/dashboard/login' || 
    pathname.startsWith('/api/auth') ||
    searchParams.has('token') || 
    searchParams.has('reason')
  ) {
    console.log(`[${timestamp}] ✅ TERMINATOR: Bypassing middleware for ${pathname}`);
    return NextResponse.next();
  }

  // 2. DASHBOARD GATEKEEPER
  if (pathname.startsWith('/dashboard')) {
    const staffToken = request.cookies.get(JWT_CONFIG.cookieName)?.value;

    if (!staffToken) {
      console.log(`[${timestamp}] 🚩 REDIRECT: No session. Sending to Login.`);
      
      const loginUrl = new URL('/dashboard/login', request.url);
      
      // Carry over the identity token if it exists
      const token = searchParams.get('token');
      if (token) {
        loginUrl.searchParams.set('token', token);
      } else {
        loginUrl.searchParams.set('reason', 'auth_required');
      }

      return NextResponse.redirect(loginUrl);
    }

    // 3. JWT VERIFICATION
    try {
      const { payload } = await jose.jwtVerify(
        staffToken, 
        new TextEncoder().encode(JWT_CONFIG.secret)
      );
      
      const userRole = (payload.role as string)?.toLowerCase();
      const isAuthorized = ["super_admin", "platform_manager", "platform_support", "merchant", "agent"].includes(userRole);

      if (isAuthorized) {
        // Standard next() call to avoid proxy loops
        return NextResponse.next();
      }
    } catch (err) {
      console.log(`[${timestamp}] ❌ JWT EXPIRED: Clearing session.`);
      const loginUrl = new URL('/dashboard/login', request.url);
      loginUrl.searchParams.set('reason', 'session_expired');
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set(JWT_CONFIG.cookieName, '', { expires: new Date(0), path: '/' });
      return response;
    }
  }

  return NextResponse.next();
}

/**
 * 🚩 ATOMIC EXCLUSION MATCHER
 * Strictly prevents the middleware from running on assets and auth APIs.
 */
export const config = {
  matcher: [
    /*
     * Exclude paths that should never trigger middleware:
     * - api/auth & api/telegram
     * - static assets & next internals
     */
   '/((?!dashboard/login|api/auth|api/telegram|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};