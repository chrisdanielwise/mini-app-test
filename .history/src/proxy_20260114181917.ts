import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { JWT_CONFIG } from '@/lib/auth/config';

/**
 * 🛰️ PROXY ROUTE DEFINITIONS
 * Logic: Paths allowed to bypass the session gate.
 */
const PUBLIC_PASS_THROUGH = [
  '/', '/login', '/unauthorized', '/auth/callback',
  '/api/auth/magic', '/api/auth/telegram', '/api/auth/logout',
  '/api/auth/logout-global', '/api/auth/heartbeat',
  '/api/telegram/webhook', '/api/admin/fix-stamps', '/maintenance' 
];

const SECURITY_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "X-Frame-Options": "ALLOW-FROM https://t.me/",
  "Content-Security-Policy": "frame-ancestors https://t.me/ https://web.telegram.org/ https://desktop.telegram.org/",
};

/**
 * 🛰️ GLOBAL PROXY GATEKEEPER (v16.16.6)
 * Logic: Internal Request Hydration & Tiered Persistence Enforcement.
 */
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");

  // 1. 🛡️ CIRCUIT BREAKER (SSR & Static Assets)
  const isInternal = pathname.startsWith('/_next/') || pathname.includes('.');
  const isPublicPath = PUBLIC_PASS_THROUGH.some(path => pathname === path || pathname.startsWith(path + '/'));

  if (isInternal || isPublicPath || searchParams.has('token')) {
    const response = NextResponse.next();
    return applySecurityHeaders(response); 
  }

  // 2. 🛡️ PROTECTED ZONE (Unified /home & /dashboard)
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/home')) {
    const activeToken = request.cookies.get(JWT_CONFIG.cookieName)?.value;

    // 🚀 REDIRECT: No token found - Unified redirect to /login
    if (!activeToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('reason', 'auth_required');
      loginUrl.searchParams.set('redirect', pathname); 
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }

    try {
      // 🚀 VERIFICATION: JWT Handshake with clock tolerance
      const { payload } = await jose.jwtVerify(activeToken, JWT_CONFIG.secret, { 
        clockTolerance: 60 
      });
      const userPayload = payload.user as any;

      // 🛰️ INTERNAL HYDRATION: Pass identity directly to Server Components/APIs
      // This bypasses slow DB queries for profile lookups.
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-role", userPayload?.role || "user");
      requestHeaders.set("x-user-id", userPayload?.id || "");
      requestHeaders.set("x-security-stamp", userPayload?.securityStamp || "");

      // Hydrate the request for downstream consumption
      const response = NextResponse.next({
        request: { headers: requestHeaders },
      });

      // 🛡️ TIERED PERSISTENCE SYNC
      // Staff/Amber: 24h | Merchants: 7d
      const role = userPayload?.role?.toUpperCase() || "";
      const isStaff = ["SUPER_ADMIN", "PLATFORM_MANAGER", "PLATFORM_SUPPORT", "AMBER"].includes(role);
      const currentMaxAge = isStaff ? 86400 : 604800; 

      // 🍪 COOKIE REFRESH & DOMAIN UNIFICATION
      const cookieDomain = host?.includes("localhost") ? undefined : host?.split(":")[0];

      response.cookies.set(JWT_CONFIG.cookieName, activeToken, {
        ...JWT_CONFIG.cookieOptions,
        maxAge: currentMaxAge,
        domain: cookieDomain,
        path: "/",
        secure: true,
        sameSite: "none",
        partitioned: true, // 🌐 Critical for Safari 2026 / TMA isolation
      });

      return applySecurityHeaders(response);

    } catch (err: any) {
      console.warn(`🔐 [Proxy_Fault]: ${err.message}`);
      
      // 🚀 REDIRECT: Unified path to global /login upon session failure
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('reason', 'session_expired');
      loginUrl.searchParams.set('redirect', pathname); 
      
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(JWT_CONFIG.cookieName);
      return applySecurityHeaders(response);
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

/**
 * 🛡️ SECURITY HEADER INJECTOR
 * Wraps every response to ensure CSP compliance within Telegram frames.
 */
function applySecurityHeaders(response: NextResponse) {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export const config = {
  matcher: ['/((?!api/auth|api/telegram|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};