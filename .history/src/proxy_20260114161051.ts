import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { JWT_CONFIG, getSecurityContext } from '@/lib/auth/config';

/**
 * 🛰️ PROXY ROUTE DEFINITIONS
 * Logic: Updated to reflect the Universal Login Node strategy.
 */
const PUBLIC_PASS_THROUGH = [
  '/',                
  '/login',             // 🚀 UPDATED: Global Entry Point
  '/unauthorized',    
  '/auth/callback',         
  '/api/auth/magic',        
  '/api/auth/telegram',    
  '/api/auth/logout',
  '/api/auth/logout-global', 
  '/api/auth/heartbeat',   
  '/api/telegram/webhook',
  '/api/admin/fix-stamps',
  '/maintenance' 
];

const SECURITY_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "X-Frame-Options": "ALLOW-FROM https://t.me/",
  "Content-Security-Policy": "frame-ancestors https://t.me/ https://web.telegram.org/ https://desktop.telegram.org/",
};

/**
 * 🛰️ GLOBAL PROXY GATEKEEPER (v16.15.0)
 * Logic: Tiered Persistence Enforcement & Unified Redirection.
 */
export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 🛰️ DYNAMIC HOST DETECTION
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const publicRequestUrl = `${protocol}://${host}${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;

  // --- 🛡️ 1. EMERGENCY CIRCUIT BREAKER ---
  const isInternal = pathname.startsWith('/_next/') || pathname.includes('.');
  const isPublicPath = PUBLIC_PASS_THROUGH.some(path => pathname === path || pathname.startsWith(path + '/'));
  const hasMagicToken = searchParams.has('token');

  if (isInternal || isPublicPath || hasMagicToken) {
    const response = NextResponse.next();
    response.headers.set("x-invoke-path", pathname); 
    response.headers.set("x-url", publicRequestUrl);
    applySecurityHeaders(response); 
    return response;
  }

  // --- 🛡️ 2. PROTECTED ZONE (Unified /home & /dashboard) ---
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/home')) {
    const allCookies = request.cookies.getAll(JWT_CONFIG.cookieName);
    const activeToken = allCookies.length > 0 ? allCookies[allCookies.length - 1].value : null;

    if (!activeToken) {
      // 🚀 REDIRECT: To Universal Login Node
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('reason', 'auth_required');
      loginUrl.searchParams.set('redirect', pathname); 
      const response = NextResponse.redirect(loginUrl);
      applySecurityHeaders(response);
      return response;
    }

    try {
      // 🚀 VERIFICATION: JWT Handshake
      const { payload } = await jose.jwtVerify(activeToken, JWT_CONFIG.secret, {
        clockTolerance: 60
      });
      
      const userPayload = payload.user as any;
      const response = NextResponse.next();
      
      // 🛡️ TIERED PERSISTENCE SYNC
      // Logic: Staff (24h) | Merchants (7d)
      const role = userPayload?.role?.toUpperCase() || "";
      const isStaff = ["SUPER_ADMIN", "PLATFORM_MANAGER", "PLATFORM_SUPPORT", "AMBER"].includes(role);
      const currentMaxAge = isStaff ? 86400 : 604800;

      // 🛰️ HEADER HYDRATION
      response.headers.set("x-invoke-path", pathname);
      response.headers.set("x-url", publicRequestUrl);
      response.headers.set("x-user-role", userPayload?.role || "user");
      response.headers.set("x-user-id", userPayload?.id || "");
      response.headers.set("x-security-stamp", userPayload?.securityStamp || "");

      // 🍪 DOMAIN UNIFIER: Prevents cookie ghosting
      const cookieDomain = host?.includes("localhost") ? undefined : host?.split(":")[0];

      response.cookies.set(JWT_CONFIG.cookieName, activeToken, {
        ...JWT_CONFIG.cookieOptions,
        maxAge: currentMaxAge, // 🚀 Refreshes based on role
        path: "/",
        secure: true,
        sameSite: "none",
        partitioned: true,
        domain: cookieDomain,
      });

      applySecurityHeaders(response);
      return response;

    } catch (err: any) {
      console.warn(`🔐 [Proxy_Fault]: Verification error: ${err.message}`);
      // 🚀 REDIRECT: Clear session and return to Universal Login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('reason', 'session_expired');
      loginUrl.searchParams.set('redirect', pathname); 
      const response = NextResponse.redirect(loginUrl);
      
      response.cookies.delete(JWT_CONFIG.cookieName);
      applySecurityHeaders(response);
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
  matcher: [
    '/((?!api/auth|api/telegram|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};