import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
// ✅ Aligned imports with v16.16.18 Config
import { JWT_CONFIG, RAW_SECRET } from '@/lib/auth/config';

/**
 * 🛰️ PROXY ROUTE DEFINITIONS
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
 * 🛰️ GLOBAL PROXY GATEKEEPER (v16.16.18)
 * Fix: Synchronized Secret Encoding & Host-Only Cookie Logic.
 */
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. 🛡️ CIRCUIT BREAKER
  const isInternal = pathname.startsWith('/_next/') || pathname.includes('.');
  const isPublicPath = PUBLIC_PASS_THROUGH.some(path => pathname === path || pathname.startsWith(path + '/'));

  if (isInternal || isPublicPath || searchParams.has('token')) {
    return applySecurityHeaders(NextResponse.next()); 
  }

  // 2. 🛡️ PROTECTED ZONE
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/home')) {
    const activeToken = request.cookies.get(JWT_CONFIG.cookieName)?.value;

    if (!activeToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('reason', 'auth_required');
      loginUrl.searchParams.set('redirect', pathname); 
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }

    try {
      // 🚀 VERIFICATION: Aligned with AuthService encoding
      // We encode the RAW_SECRET string directly to avoid double-encoding issues
      const secret = new TextEncoder().encode(RAW_SECRET);
      
      const { payload } = await jose.jwtVerify(activeToken, secret, { 
        clockTolerance: 60,
        algorithms: ['HS256']
      });

      const userPayload = payload.user as any;

      // 🛰️ INTERNAL HYDRATION: Pass identity to downstream Server Components
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-role", userPayload?.role || "user");
      requestHeaders.set("x-user-id", userPayload?.id || "");
      requestHeaders.set("x-security-stamp", userPayload?.securityStamp || "");

      const response = NextResponse.next({
        request: { headers: requestHeaders },
      });

      // 🍪 2026 COOKIE REFRESH (CHIPS)
      // Fix: Removed explicit 'domain' to allow Cloudflare Tunnel to resolve correctly
      const role = userPayload?.role?.toUpperCase() || "";
      const isStaff = ["SUPER_ADMIN", "AMBER"].includes(role);
      const currentMaxAge = isStaff ? 86400 : 604800;

      response.cookies.set(JWT_CONFIG.cookieName, activeToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: currentMaxAge,
        partitioned: true, 
      });

      return applySecurityHeaders(response);

    } catch (err: any) {
      console.warn(`🔐 [Proxy_Fault]: ${err.message}`);
      
      // 🚀 EXPULSION: Clear the poisoned cookie and redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('reason', 'session_expired');
      loginUrl.searchParams.set('redirect', pathname); 
      
      const response = NextResponse.redirect(loginUrl);
      
      // Kill the cookie manually on redirect
      response.cookies.set(JWT_CONFIG.cookieName, "", { 
        path: "/", 
        maxAge: 0,
        expires: new Date(0) 
      });
      
      return applySecurityHeaders(response);
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

function applySecurityHeaders(response: NextResponse) {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export const config = {
  matcher: ['/((?!api/auth|api/telegram|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};