import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { JWT_CONFIG, getSecurityContext } from '@/lib/auth/config';

/**
 * 🛰️ PROXY ROUTE DEFINITIONS
 * Logic: Includes Global Wipe, Telemetry, and DB fix routes in the passthrough.
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
 * 🛰️ INSTITUTIONAL GATEKEEPER (v14.15.0)
 * Logic: Validates JWT Signatures + Security Stamp Integrity.
 * Fix: Explicitly kills 307 redirect loops by shielding /dashboard/login.
 */
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // --- 🛡️ 1. THE CIRCUIT BREAKER (CRITICAL FIX) ---
  // We must return immediately if the path is the login page or an auth API.
  // This prevents the 'startsWith(/dashboard)' logic from catching the login page.
  if (pathname === '/dashboard/login' || pathname.startsWith('/api/auth')) {
    const response = NextResponse.next();
    applySecurityHeaders(response);
    return response;
  }

  // --- 🛡️ 2. THE INFINITE LOOP SHIELD ---
  const isPublicPath = PUBLIC_PASS_THROUGH.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
  const isStaticFile = pathname.includes('.');
  const isNextInternal = pathname.startsWith('/_next/');
  const hasMagicToken = searchParams.has('token');

  if (isPublicPath || isStaticFile || isNextInternal || hasMagicToken) {
    const response = NextResponse.next();
    response.headers.set("x-invoke-path", pathname); 
    applySecurityHeaders(response); 
    return response;
  }

  // --- 🛡️ 3. HARD PROTECTED ZONE (Dashboard / Admin) ---
  if (pathname.startsWith('/dashboard')) {
    const sessionCookie = request.cookies.get(JWT_CONFIG.cookieName)?.value;
    const authHeader = request.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const activeToken = sessionCookie || bearerToken;

    // A. ABSENCE CHECK: No Token -> Expel to Login
    if (!activeToken) {
      console.log(`🚫 [Proxy_Gate]: Access Denied to ${pathname}. Redirecting to Login.`);
      const loginUrl = new URL('/dashboard/login', request.url);
      loginUrl.searchParams.set('reason', 'auth_required');
      
      const response = NextResponse.redirect(loginUrl);
      applySecurityHeaders(response);
      return response;
    }

    // B. CRYPTO & STAMP VALIDATION
    try {
      const { payload } = await jose.jwtVerify(
        activeToken, 
        JWT_CONFIG.secret 
      );
      
      const userPayload = payload.user as any;
      const host = request.headers.get("host");
      const protocol = request.headers.get("x-forwarded-proto") || "https";
      const security = getSecurityContext(host, protocol);

      const response = NextResponse.next();
      
      // Inject Identity Metadata into request headers for downstream consumption
      response.headers.set("x-invoke-path", pathname);
      response.headers.set("x-user-role", userPayload?.role || "user");
      response.headers.set("x-user-id", userPayload?.id || "");
      response.headers.set("x-security-stamp", userPayload?.securityStamp || "");

      // 🍪 Sync Cookie with 2026 Partitioning Standards (CHIPS)
      response.cookies.set(JWT_CONFIG.cookieName, activeToken, {
        ...JWT_CONFIG.cookieOptions,
        secure: security.secure,
        sameSite: security.sameSite as any,
        // @ts-ignore - Support for CHIPS (Cookies Having Independent Partitioned State)
        partitioned: security.partitioned, 
      });

      applySecurityHeaders(response);
      return response;

    } catch (err: any) {
      console.error(`🔐 [Proxy_Intercept]: Identity Revoked or Expired: ${err.message}`);
      
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
 * 🏛️ SECURITY HEADER INJECTOR
 */
function applySecurityHeaders(response: NextResponse) {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
}

/**
 * ⚙️ PROXY MATCHER
 */
export const config = {
  matcher: ['/((?!api/|_next/|.*\\..*).*)'],
};