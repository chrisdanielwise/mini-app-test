import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { JWT_CONFIG } from '@/lib/auth/config';

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
 * 🛰️ GLOBAL PROXY GATEKEEPER (v16.16.5)
 * Fix: Uses internal request hydration for Next.js 16 consistency.
 */
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");

  // 1. 🛡️ CIRCUIT BREAKER
  const isInternal = pathname.startsWith('/_next/') || pathname.includes('.');
  const isPublicPath = PUBLIC_PASS_THROUGH.some(path => pathname === path || pathname.startsWith(path + '/'));

  if (isInternal || isPublicPath || searchParams.has('token')) {
    const response = NextResponse.next();
    applySecurityHeaders(response); 
    return response;
  }

  // 2. 🛡️ PROTECTED ZONE
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/home')) {
    const activeToken = request.cookies.get(JWT_CONFIG.cookieName)?.value;

    if (!activeToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('reason', 'auth_required');
      loginUrl.searchParams.set('redirect', pathname); 
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jose.jwtVerify(activeToken, JWT_CONFIG.secret, { clockTolerance: 60 });
      const userPayload = payload.user as any;

      // 🚀 CRITICAL FIX: Pass headers to the INTERNAL REQUEST
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-role", userPayload?.role || "user");
      requestHeaders.set("x-user-id", userPayload?.id || "");
      requestHeaders.set("x-security-stamp", userPayload?.securityStamp || "");

      // Hydrate response with the modified internal request
      const response = NextResponse.next({
        request: { headers: requestHeaders },
      });

      // 🛡️ TIERED PERSISTENCE SYNC
      const role = userPayload?.role?.toUpperCase() || "";
      const isStaff = ["SUPER_ADMIN", "PLATFORM_MANAGER", "PLATFORM_SUPPORT", "AMBER"].includes(role);
      const currentMaxAge = isStaff ? 86400 : 604800;

      // 🍪 COOKIE REFRESH
      const cookieDomain = host?.includes("localhost") ? undefined : host?.split(":")[0];

      response.cookies.set(JWT_CONFIG.cookieName, activeToken, {
        ...JWT_CONFIG.cookieOptions,
        maxAge: currentMaxAge,
        domain: cookieDomain,
        path: "/",
        secure: true,
        sameSite: "none",
        partitioned: true,
      });

      applySecurityHeaders(response);
      return response;

    } catch (err: any) {
      console.warn(`🔐 [Proxy_Fault]: ${err.message}`);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('reason', 'session_expired');
      loginUrl.searchParams.set('redirect', pathname); 
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(JWT_CONFIG.cookieName);
      return response;
    }
  }

  return NextResponse.next();
}

function applySecurityHeaders(response: NextResponse) {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
}

export const config = {
  matcher: ['/((?!api/auth|api/telegram|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};