import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { JWT_CONFIG, getSecurityContext } from '@/lib/auth/config';

/**
 * 🛰️ PROXY ROUTE DEFINITIONS
 */
const PUBLIC_PASS_THROUGH = [
  '/',                
  '/home',            
  '/dashboard/login', 
  '/unauthorized',    
  '/api/auth/magic',        
  '/api/auth/telegram',    
  '/api/auth/logout',
  '/api/auth/logout-global', 
  '/api/auth/heartbeat',   
  '/api/telegram/webhook',
  '/api/admin/fix-stamps'    
];

const SECURITY_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "X-Frame-Options": "ALLOW-FROM https://t.me/",
  "Content-Security-Policy": "frame-ancestors https://t.me/ https://web.telegram.org/ https://desktop.telegram.org/",
};

/**
 * 🛰️ GLOBAL PROXY GATEKEEPER (v14.40.0)
 * Fix: Renamed to 'middleware' for Next.js 16 root execution.
 * Fix: Resolves Cookie Collision by selecting the latest valid token.
 */
export async function proxy(request: NextRequest) {
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

  // --- 🛡️ 2. PROTECTED ZONE ---
  if (pathname.startsWith('/dashboard')) {
    // 🕵️ ANTI-COLLISION: Handle multiple cookies by taking the most recent
    const allCookies = request.cookies.getAll(JWT_CONFIG.cookieName);
    const activeToken = allCookies.length > 0 ? allCookies[allCookies.length - 1].value : null;

    if (!activeToken) {
      const loginUrl = new URL('/dashboard/login', request.url);
      loginUrl.searchParams.set('reason', 'auth_required');
      const response = NextResponse.redirect(loginUrl);
      applySecurityHeaders(response);
      return response;
    }

    try {
      // 🚀 VERIFICATION: 60s tolerance for slow Turbopack builds
      const { payload } = await jose.jwtVerify(activeToken, JWT_CONFIG.secret, {
        clockTolerance: 60
      });
      
      const userPayload = payload.user as any;
      const security = getSecurityContext(host, protocol);

      const response = NextResponse.next();
      
      // Sync headers for Layout/Guard consumption
      response.headers.set("x-invoke-path", pathname);
      response.headers.set("x-url", publicRequestUrl);
      response.headers.set("x-user-role", userPayload?.role || "user");
      response.headers.set("x-user-id", userPayload?.id || "");
      response.headers.set("x-security-stamp", userPayload?.securityStamp || "");

      // 🍪 DOMAIN UNIFIER: Forces cookie to host-specific domain to kill 'apex' ghosting
      const cookieDomain = host?.includes("localhost") ? undefined : host?.split(":")[0];

      response.cookies.set(JWT_CONFIG.cookieName, activeToken, {
        ...JWT_CONFIG.cookieOptions,
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
      const loginUrl = new URL('/dashboard/login', request.url);
      loginUrl.searchParams.set('reason', 'session_expired');
      const response = NextResponse.redirect(loginUrl);
      // Clean up failed tokens
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