import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { JWT_CONFIG, getSecurityContext } from '@/lib/auth/config';

/**
 * 🛰️ PROXY ROUTE DEFINITIONS
 * Logic: We include /dashboard/login here so the Middleware doesn't gate the login page itself.
 */
const PUBLIC_PASS_THROUGH = [
  '/',                // Landing Page
  '/home',            // Mini App Entry (Soft Session)
  '/dashboard/login', // 🚀 CRITICAL: Allows the login page to load without a token
  '/api/auth',        // Auth Endpoints
  '/api/webhook',     // Telegram Webhooks
];

/**
 * 🛡️ INSTITUTIONAL SECURITY HEADERS
 */
const SECURITY_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "X-Frame-Options": "ALLOW-FROM https://t.me/",
  "Content-Security-Policy": "frame-ancestors https://t.me/ https://web.telegram.org/ https://desktop.telegram.org/",
};

/**
 * 🛰️ GLOBAL PROXY GATEKEEPER (Institutional v13.9.10)
 * Architecture: Optimized Path-Array Validation & Redirect Recovery.
 */
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // --- 🛡️ 1. THE INFINITE LOOP SHIELD ---
  const isPublicPath = PUBLIC_PASS_THROUGH.some(path => pathname === path || pathname.startsWith(path + '/'));
  const isStaticFile = pathname.includes('.');
  const isNextInternal = pathname.startsWith('/_next/');
  const hasMagicToken = searchParams.has('token');

  if (isPublicPath || isStaticFile || isNextInternal || hasMagicToken) {
    return NextResponse.next();
  }

  // --- 🛡️ 2. HARD PROTECTED ZONE (Dashboard / Admin) ---
  if (pathname.startsWith('/dashboard')) {
    const sessionCookie = request.cookies.get(JWT_CONFIG.cookieName)?.value;
    const authHeader = request.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const activeToken = sessionCookie || bearerToken;

    // A. GATE: NO TOKEN DETECTED
    if (!activeToken) {
      // 🚀 REDIRECT: Pointing specifically to your nested (staff) login route
      const loginUrl = new URL('/dashboard/login', request.url);
      loginUrl.searchParams.set('reason', 'auth_required');
      
      const response = NextResponse.redirect(loginUrl);
      applySecurityHeaders(response);
      return response;
    }

    // B. CRYPTO: TOKEN VALIDATION
    try {
      // Verify against institutional secret (Uint8Array)
      await jose.jwtVerify(activeToken, JWT_CONFIG.secret);
      
      /**
       * 🛠️ SESSION REPAIR & CONTINUOUS HANDSHAKE
       * Re-injects the cookie with 2026 Partitioning for Safari/TMA stability.
       */
      await jose.jwtVerify(activeToken, JWT_CONFIG.secret);
      
      const host = request.headers.get("host");
      const protocol = request.headers.get("x-forwarded-proto") || "https";
      const security = getSecurityContext(host, protocol);

      // 🚀 CREATE THE RESPONSE
      const response = NextResponse.next();
      
      // 🚀 ADD THIS LINE: This allows the Layout to break the redirect loop
      response.headers.set("x-invoke-path", pathname);

      response.cookies.set(JWT_CONFIG.cookieName, activeToken, {
        ...JWT_CONFIG.cookieOptions,
        secure: security.secure,
        sameSite: security.sameSite,
        // @ts-ignore
        partitioned: security.partitioned, 
      });

      applySecurityHeaders(response);
      return response;

      applySecurityHeaders(response);
      return response;

    } catch (err) {
      // Token is expired or signature is invalid
      console.warn("🔐 [Proxy] Session Invalid. Purging credentials...");
      const loginUrl = new URL('/dashboard/login', request.url);
      loginUrl.searchParams.set('reason', 'session_expired');
      
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(JWT_CONFIG.cookieName);
      applySecurityHeaders(response);
      return response;
    }
  }

  return NextResponse.next();
}

/**
 * 🛠️ UTILITY: Security Header Injection
 */
function applySecurityHeaders(response: NextResponse) {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
}

/**
 * 🚩 ATOMIC EXCLUSION MATCHER
 */
export const config = {
  matcher: [
    '/((?!api/|_next/|.*\\..*).*)',
  ],
};