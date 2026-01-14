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
 * 🛰️ GLOBAL PROXY GATEKEEPER (v14.25.0)
 * Added: Deep Telemetry to track Cookie Handshake failures.
 * Fix: Explicit Domain & Triple-Header injection for Layout stability.
 */
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // --- 🛡️ 1. THE INFINITE LOOP SHIELD ---
  const isPublicPath = PUBLIC_PASS_THROUGH.some(path => pathname === path || pathname.startsWith(path + '/'));
  const isStaticFile = pathname.includes('.');
  const isNextInternal = pathname.startsWith('/_next/');
  const hasMagicToken = searchParams.has('token');

  if (isPublicPath || isStaticFile || isNextInternal || hasMagicToken) {
    const response = NextResponse.next();
    // 🚀 Triple-Header Injection for StaffRootLayout
    response.headers.set("x-invoke-path", pathname); 
    response.headers.set("x-url", request.url);
    applySecurityHeaders(response); 
    return response;
  }

  // --- 🛡️ 2. HARD PROTECTED ZONE (Dashboard / Admin) ---
  if (pathname.startsWith('/dashboard')) {
    const sessionCookie = request.cookies.get(JWT_CONFIG.cookieName)?.value;
    const authHeader = request.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const activeToken = sessionCookie || bearerToken;

    // A. GATE: NO TOKEN DETECTED
    if (!activeToken) {
      console.log(`🚫 [Proxy_Auth]: No token found for ${pathname}. REDIRECTING TO LOGIN.`);
      const loginUrl = new URL('/dashboard/login', request.url);
      loginUrl.searchParams.set('reason', 'auth_required');
      
      const response = NextResponse.redirect(loginUrl);
      applySecurityHeaders(response);
      return response;
    }

    // B. CRYPTO & STAMP VALIDATION
    try {
      const { payload } = await jose.jwtVerify(activeToken, JWT_CONFIG.secret);
      const userPayload = payload.user as any;
      
      const host = request.headers.get("host");
      const protocol = request.headers.get("x-forwarded-proto") || "https";
      const security = getSecurityContext(host, protocol);

      // 🛰️ TELEMETRY: Trace the Cookie Handshake
      console.log(`📡 [Proxy_Telemetry]: Verifying Node ${userPayload.id.slice(0,8)}`);
      console.log(`🔍 [Cookie_Context]: Secure=${security.secure} | SameSite=${security.sameSite} | Host=${host}`);

      const response = NextResponse.next();
      
      // 🚀 Pass Identity to StaffRootLayout
      response.headers.set("x-invoke-path", pathname);
      response.headers.set("x-url", request.url);
      response.headers.set("x-user-role", userPayload?.role || "user");
      response.headers.set("x-user-id", userPayload?.id || "");
      response.headers.set("x-security-stamp", userPayload?.securityStamp || "");

      // 🍪 SYNC COOKIE (The Sliding Window)
      // We explicitly set the domain to match the tunnel to prevent browser rejection.
      response.cookies.set(JWT_CONFIG.cookieName, activeToken, {
        ...JWT_CONFIG.cookieOptions,
        secure: security.secure,
        sameSite: security.sameSite as any,
        // @ts-ignore
        partitioned: security.partitioned, 
        domain: host?.includes("localhost") ? undefined : host?.split(":")[0],
      });

      applySecurityHeaders(response);
      return response;

    } catch (err: any) {
      console.warn(`🔐 [Proxy_Expired]: JWT Error: ${err.message}. Purging Cookie.`);
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

function applySecurityHeaders(response: NextResponse) {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
}

export const config = {
  matcher: ['/((?!api/|_next/|.*\\..*).*)'],
};