import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { JWT_CONFIG, getSecurityContext } from '@/lib/auth/config';

/**
 * 🛰️ GLOBAL PROXY GATEKEEPER (Institutional v12.15.0)
 * Logic: Soft Session Handling for /home. Hard Protection for /dashboard.
 * Purpose: Allows Mini App (/home) to load without forced redirects.
 */
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // --- 🛡️ 1. THE INFINITE LOOP SHIELD (Global Bypass) ---
  if (
    pathname === '/' ||                          // Public Landing
    pathname.includes('/home') ||                // 🚀 SOFT SESSION: Allow /home to pass through
    pathname.includes('/login') ||               // Never redirect if heading to login
    pathname.includes('.') ||                    // Ignore all static files
    pathname.startsWith('/api/') ||              // APIs handle their own context
    pathname.startsWith('/_next/') ||            // Next.js internal files
    searchParams.has('token')                    // One-Time Tokens
  ) {
    return NextResponse.next();
  }

  // --- 🛡️ 2. HARD PROTECTED ROUTES (Admin / Merchant) ---
  // Only these paths will force a redirect to login if no token exists.
  const isHardProtected = pathname.startsWith('/dashboard');

  if (isHardProtected) {
    const staffCookie = request.cookies.get(JWT_CONFIG.cookieName)?.value;
    const authHeader = request.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const activeToken = staffCookie || bearerToken;

    // A. REDIRECT IF UNAUTHENTICATED (Hard Gate)
    if (!activeToken) {
      const loginUrl = new URL('/dashboard/login', request.url);
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
       * Syncs cookies even for hard-protected routes.
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
 */
export const config = {
  matcher: [
    '/((?!api/|_next/|.*\\..*).*)',
  ],
};