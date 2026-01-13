import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { JWT_CONFIG, getSecurityContext } from '@/lib/auth/config';

/**
 * 🛰️ PROXY ROUTE DEFINITIONS
 */
const PUBLIC_PASS_THROUGH = [
  '/',                // Landing Page
  '/home',            // Mini App (Soft Session)
  '/login',           // Login Ingress
  '/api/auth',        // Authentication Endpoints
  '/api/webhook',     // Telegram Webhooks
];

const SECURITY_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "X-Frame-Options": "ALLOW-FROM https://t.me/",
  "Content-Security-Policy": "frame-ancestors https://t.me/ https://web.telegram.org/ https://desktop.telegram.org/",
};

/**
 * 🛰️ GLOBAL PROXY GATEKEEPER (Institutional v13.9.9)
 * Architecture: Optimized Path-Array Validation.
 */
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // --- 🛡️ 1. THE INFINITE LOOP SHIELD (Array-Based) ---
  const isPublicPath = PUBLIC_PASS_THROUGH.some(path => pathname.startsWith(path));
  const isStaticFile = pathname.includes('.');
  const isNextInternal = pathname.startsWith('/_next/');
  const hasMagicToken = searchParams.has('token');

  if (isPublicPath || isStaticFile || isNextInternal || hasMagicToken) {
    return NextResponse.next();
  }

  // --- 🛡️ 2. HARD PROTECTED ZONE (Dashboard / Merchant) ---
  if (pathname.startsWith('/dashboard')) {
    const sessionCookie = request.cookies.get(JWT_CONFIG.cookieName)?.value;
    const authHeader = request.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const activeToken = sessionCookie || bearerToken;

    // A. GATE: NO TOKEN DETECTED
    if (!activeToken) {
      const loginUrl = new URL(, request.url);
      loginUrl.searchParams.set('reason', 'auth_required');
      
      const response = NextResponse.redirect(loginUrl);
      applySecurityHeaders(response);
      return response;
    }

    // B. CRYPTO: TOKEN VALIDATION
    try {
      // Verify against institutional secret
      await jose.jwtVerify(activeToken, JWT_CONFIG.secret);
      
      /**
       * 🛠️ SESSION REPAIR & CONTINUOUS HANDSHAKE
       */
      const host = request.headers.get("host");
      const protocol = request.headers.get("x-forwarded-proto") || "https";
      const security = getSecurityContext(host, protocol);

      const response = NextResponse.next();
      
      // Inject/Refresh the HttpOnly Cookie
      response.cookies.set(JWT_CONFIG.cookieName, activeToken, {
        ...JWT_CONFIG.cookieOptions,
        secure: security.secure,
        sameSite: security.sameSite,
        // @ts-ignore: CHIPS standard for 2026 iframe persistence
        partitioned: security.partitioned, 
      });

      applySecurityHeaders(response);
      return response;

    } catch (err) {
      // Token expired or invalid signature
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('reason', 'session_expired');
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(JWT_CONFIG.cookieName);
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
 * Essential for Next.js middleware performance.
 */
export const config = {
  matcher: [
    '/((?!api/|_next/|.*\\..*).*)',
  ],
};