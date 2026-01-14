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
 * 🛰️ GLOBAL PROXY GATEKEEPER (v14.34.0)
 * Fix: Resolves "Cookie Collision" by unifying domain handling.
 * Added: Multi-cookie detection and newer-token selection.
 */
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 🛰️ DYNAMIC HOST DETECTION
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const publicRequestUrl = `${protocol}://${host}${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;

  // --- 🛡️ 1. PUBLIC & INTERNAL BYPASS ---
  const isPublicPath = PUBLIC_PASS_THROUGH.some(path => pathname === path || pathname.startsWith(path + '/'));
  const isStaticFile = pathname.includes('.');
  const isNextInternal = pathname.startsWith('/_next/');
  const hasMagicToken = searchParams.has('token');

  if (isPublicPath || isStaticFile || isNextInternal || hasMagicToken) {
    const response = NextResponse.next();
    response.headers.set("x-invoke-path", pathname); 
    response.headers.set("x-url", publicRequestUrl);
    applySecurityHeaders(response); 
    return response;
  }

  // --- 🛡️ 2. HARD PROTECTED ZONE (Dashboard / Admin) ---
  if (pathname.startsWith('/dashboard')) {
    // 🕵️ DETECTION: Handling "Cookie Collision" (Multiple auth_tokens)
    const allCookies = request.cookies.getAll(JWT_CONFIG.cookieName);
    
    // Logic: If multiple exist, we select the last one (usually the most recently set)
    const activeToken = allCookies.length > 0 ? allCookies[allCookies.length - 1].value : null;

    if (!activeToken) {
      console.log(`🚫 [Proxy_Auth]: No active token. Redirecting to Login.`);
      const loginUrl = new URL('/dashboard/login', publicRequestUrl);
      loginUrl.searchParams.set('reason', 'auth_required');
      
      const response = NextResponse.redirect(loginUrl);
      applySecurityHeaders(response);
      return response;
    }

    try {
      // 🚀 VERIFICATION: With Clock Tolerance for slow compile times
      const { payload } = await jose.jwtVerify(activeToken, JWT_CONFIG.secret, {
        clockTolerance: 60
      });
      
      const userPayload = payload.user as any;
      const security = getSecurityContext(host, protocol);

      const response = NextResponse.next();
      
      // Sync headers for Layout consumption
      response.headers.set("x-invoke-path", pathname);
      response.headers.set("x-url", publicRequestUrl);
      response.headers.set("x-user-role", userPayload?.role || "user");
      response.headers.set("x-user-id", userPayload?.id || "");
      response.headers.set("x-security-stamp", userPayload?.securityStamp || "");

      // 🍪 THE UNIFIER: Overwrite with a strict host-only domain to kill the collision
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
      console.warn(`🔐 [Proxy_Fault]: Verification error on ${host}: ${err.message}`);
      
      const loginUrl = new URL('/dashboard/login', publicRequestUrl);
      loginUrl.searchParams.set('reason', 'session_expired');
      
      const response = NextResponse.redirect(loginUrl);
      // 🧹 PURGE: Wipes out the conflicting cookies on failure
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
  matcher: ['/((?!api/|_next/|.*\\..*).*)'],
};