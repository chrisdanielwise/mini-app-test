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
 * 🛰️ GLOBAL PROXY GATEKEEPER (v14.26.0)
 * Logic: Triple-Header Injection + Host Header Synchronization.
 * Fix: Synchronizes Cloudflare Tunnel Host with Internal Request Headers.
 */
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 🛰️ DYNAMIC HOST DETECTION (The Tunnel Synchronizer)
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  
  // Overwrite local URL with Public Tunnel URL for Layout logic
  const publicRequestUrl = `${protocol}://${host}${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;

  // --- 🛡️ 1. THE INFINITE LOOP SHIELD ---
  const isPublicPath = PUBLIC_PASS_THROUGH.some(path => pathname === path || pathname.startsWith(path + '/'));
  const isStaticFile = pathname.includes('.');
  const isNextInternal = pathname.startsWith('/_next/');
  const hasMagicToken = searchParams.has('token');

  if (isPublicPath || isStaticFile || isNextInternal || hasMagicToken) {
    const response = NextResponse.next();
    
    // 🚀 Triple-Header Injection (Synchronized with Tunnel Host)
    response.headers.set("x-invoke-path", pathname); 
    response.headers.set("x-url", publicRequestUrl);
    
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
      const loginUrl = new URL('/dashboard/login', publicRequestUrl);
      loginUrl.searchParams.set('reason', 'auth_required');
      
      const response = NextResponse.redirect(loginUrl);
      applySecurityHeaders(response);
      return response;
    }

    // B. CRYPTO & STAMP VALIDATION
    try {
      const { payload } = await jose.jwtVerify(activeToken, JWT_CONFIG.secret);
      const userPayload = payload.user as any;
      
      const security = getSecurityContext(host, protocol);

      // 🛰️ TELEMETRY
      console.log(`📡 [Proxy_Sync]: Verifying Node ${userPayload.id.slice(0,8)} on ${host}`);

      const response = NextResponse.next();
      
      // 🚀 Pass Identity + Sync'd URL to StaffRootLayout
      response.headers.set("x-invoke-path", pathname);
      response.headers.set("x-url", publicRequestUrl);
      response.headers.set("x-user-role", userPayload?.role || "user");
      response.headers.set("x-user-id", userPayload?.id || "");
      response.headers.set("x-security-stamp", userPayload?.securityStamp || "");

      // 🍪 SYNC COOKIE (Tunnel Domain Enforcement)
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
      console.warn(`🔐 [Proxy_Expired]: JWT Fault on ${host}: ${err.message}`);
      const loginUrl = new URL('/dashboard/login', publicRequestUrl);
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