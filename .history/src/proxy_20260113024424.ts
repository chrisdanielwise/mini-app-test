import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { JWT_CONFIG, getSecurityContext } from '@/lib/auth/config';

/**
 * 🛰️ GLOBAL PROXY GATEKEEPER (Institutional v12.13.0)
 * Logic: Explicit Path Isolation.
 * Public: / (Landing), /dashboard/login, /api/*
 * Protected: /home, /dashboard (Internal Clusters)
 */
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // --- 🛡️ 1. THE TERMINATOR (Global Bypass Logic) ---
  // We allow root (/), auth pages, and all APIs to pass through without interception.
  if (
    pathname === '/' || 
    pathname === '/dashboard/login' || 
    pathname.startsWith('/api/') || 
    pathname.startsWith('/_next/') ||
    searchParams.has('token') || 
    searchParams.has('reason')
  ) {
    return NextResponse.next();
  }

  // --- 🛡️ 2. PROTECTED ROUTE EVALUATION ---
  // Define exactly which path segments require a valid identity node.
  const isProtectedRoute = 
    pathname.startsWith('/home') || 
    pathname.startsWith('/dashboard');

  if (isProtectedRoute) {
    const staffCookie = request.cookies.get(JWT_CONFIG.cookieName)?.value;
    const authHeader = request.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const activeToken = staffCookie || bearerToken;

    // A. NO IDENTITY: Force redirect to Login Gate
    if (!activeToken) {
      const loginUrl = new URL('/dashboard/login', request.url);
      loginUrl.searchParams.set('reason', 'auth_required');
      
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
       * Regenerates the partitioned cookie to maintain CHIPS compliance for 2026 iframes.
       */
      const host = request.headers.get("host");
      const protocol = request.headers.get("x-forwarded-proto");
      const security = getSecurityContext(host, protocol);

      const response = NextResponse.next();
      response.cookies.set(JWT_CONFIG.cookieName, activeToken, {
        ...JWT_CONFIG.cookieOptions,
        secure: security.secure,
        sameSite: security.sameSite,
        // @ts-ignore - Required for modern cross-site iframe sessions
        partitioned: security.partitioned, 
      });
      
      return response;

    } catch (err) {
      // INVALID TOKEN: Purge session and return to Login
      const loginUrl = new URL('/dashboard/login', request.url);
      loginUrl.searchParams.set('reason', 'session_expired');
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(JWT_CONFIG.cookieName);
      return response;
    }
  }

  // 3. DEFAULT PASS-THROUGH
  return NextResponse.next();
}

/**
 * 🚩 ATOMIC EXCLUSION MATCHER
 * Strictly prevents the proxy from running on static assets or API nodes.
 */
export const config = {
  matcher: [
    /*
     * Exclude specific paths from middleware logic entirely to optimize performance.
     */
    '/((?!api/|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};