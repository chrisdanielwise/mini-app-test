import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { JWT_CONFIG, getSecurityContext } from '@/lib/auth/config';

/**
 * 🛰️ GLOBAL PROXY GATEKEEPER (Institutional v12.14.0)
 * Logic: Hardened Bypass for Login & Static Assets.
 * Purpose: Terminates redirect loops caused by asset interception.
 */
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // --- 🛡️ 1. THE INFINITE LOOP SHIELD (Global Bypass) ---
  if (
    pathname === '/' ||                          // Public Landing
    pathname.includes('/login') ||               // 🚀 NEVER redirect if already heading to login
    pathname.includes('.') ||                    // 🚀 IGNORE all static files (css, js, png, ico)
    pathname.startsWith('/api/') ||              // APIs handle their own security context
    pathname.startsWith('/_next/') ||            // Next.js internal build files
    searchParams.has('token')                    // One-Time Tokens (Handshake ingress)
  ) {
    return NextResponse.next();
  }

  // --- 🛡️ 2. PROTECTED ROUTE EVALUATION ---
  const isProtectedRoute = 
    pathname.startsWith('/home') || 
    pathname.startsWith('/dashboard');

  if (isProtectedRoute) {
    const staffCookie = request.cookies.get(JWT_CONFIG.cookieName)?.value;
    const authHeader = request.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const activeToken = staffCookie || bearerToken;

    // A. REDIRECT IF UNAUTHENTICATED
    if (!activeToken) {
      console.log(`🚫 [Proxy] Protected path ${pathname} accessed without token. Redirecting...`);
      const loginUrl = new URL('/dashboard/login', request.url);
      
      // Only set reason if it's not already there to prevent URL bloat
      if (!searchParams.has('reason')) {
        loginUrl.searchParams.set('reason', 'auth_required');
      }
      
      const response = NextResponse.redirect(loginUrl);
      response.headers.set("ngrok-skip-browser-warning", "true");
      return response;
    }

    // B. CRYPTO VALIDATION
    try {
      const secretKey = JWT_CONFIG.secret instanceof Uint8Array 
        ? JWT_CONFIG.secret 
        : new TextEncoder().encode(JWT_CONFIG.secret as string);

      await jose.jwtVerify(activeToken, secretKey);
      
      /**
       * 🛠️ SESSION REPAIR
       * Re-sync partitioned cookies for 2026 TMA compatibility.
       */
      const host = request.headers.get("host");
      const protocol = request.headers.get("x-forwarded-proto");
      const security = getSecurityContext(host, protocol);

      const response = NextResponse.next();
      response.cookies.set(JWT_CONFIG.cookieName, activeToken, {
        ...JWT_CONFIG.cookieOptions,
        secure: security.secure,
        sameSite: security.sameSite,
        // @ts-ignore
        partitioned: security.partitioned, 
      });
      
      return response;

    } catch (err) {
      const loginUrl = new URL('/dashboard/login', request.url);
      loginUrl.searchParams.set('reason', 'session_expired');
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(JWT_CONFIG.cookieName);
      return response;
    }
  }

  return NextResponse.next();
}

/**
 * 🚩 ATOMIC EXCLUSION MATCHER
 * Regex update: Excludes all paths with a dot (static files) and standard internals.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api/
     * - _next/
     * - Static files containing a dot (favicon.ico, styles.css, etc.)
     */
    '/((?!api/|_next/|.*\\..*).*)',
  ],
};