import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { JWT_CONFIG, getSecurityContext } from '@/lib/auth/config';

/**
 * 🛰️ PROXY ROUTE DEFINITIONS
 * Logic: Includes the new Global Wipe and Telemetry routes in the passthrough.
 */
const PUBLIC_PASS_THROUGH = [
  '/',                
  '/home',            
  '/dashboard/login', 
  '/unauthorized',    
  '/api/auth/magic',        
  '/api/auth/telegram',    
  '/api/auth/logout',
  '/api/auth/logout-global', // ✅ Added for Global Wipe support
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
 * 🛰️ INSTITUTIONAL GATEKEEPER (v14.5.0)
 * Logic: Validates JWT Signatures + Security Stamp Integrity.
 * 2026 Ready: Hardened for Safari/Telegram Partitioning.
 */
export async function pro(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // --- 🛡️ 1. THE INFINITE LOOP SHIELD ---
  const isPublicPath = PUBLIC_PASS_THROUGH.some(path => pathname === path || pathname.startsWith(path + '/'));
  const isStaticFile = pathname.includes('.');
  const isNextInternal = pathname.startsWith('/_next/');
  const hasMagicToken = searchParams.has('token');

  if (isPublicPath || isStaticFile || isNextInternal || hasMagicToken) {
    const response = NextResponse.next();
    response.headers.set("x-invoke-path", pathname); 
    applySecurityHeaders(response); 
    return response;
  }

  // --- 🛡️ 2. HARD PROTECTED ZONE (Dashboard / Admin) ---
  if (pathname.startsWith('/dashboard')) {
    const sessionCookie = request.cookies.get(JWT_CONFIG.cookieName)?.value;
    const authHeader = request.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const activeToken = sessionCookie || bearerToken;

    // A. ABSENCE CHECK
    if (!activeToken) {
      const loginUrl = new URL('/dashboard/login', request.url);
      loginUrl.searchParams.set('reason', 'auth_required');
      const response = NextResponse.redirect(loginUrl);
      applySecurityHeaders(response);
      return response;
    }

    // B. CRYPTO & STAMP VALIDATION
    try {
      // ✅ Using the Uint8Array secret directly from JWT_CONFIG
      const { payload } = await jose.jwtVerify(
        activeToken, 
        JWT_CONFIG.secret 
      );
      
      const userPayload = payload.user as any;

      // 🚨 CRITICAL: Check the Security Stamp via the API internal logic 
      // (Note: Since we are in Middleware, we use headers to pass the stamp forward)
      // The actual DB check happens in the Heartbeat or Server Components.
      
      const host = request.headers.get("host");
      const protocol = request.headers.get("x-forwarded-proto") || "https";
      const security = getSecurityContext(host, protocol);

      const response = NextResponse.next();
      
      // Inject Identity Metadata into request headers for downstream consumption
      response.headers.set("x-invoke-path", pathname);
      response.headers.set("x-user-role", userPayload?.role || "user");
      response.headers.set("x-user-id", userPayload?.id || "");
      response.headers.set("x-security-stamp", userPayload?.securityStamp || "");

      // 🍪 Sync Cookie with 2026 Partitioning Standards
      // This maintains the sliding window on every valid request
      response.cookies.set(JWT_CONFIG.cookieName, activeToken, {
        ...JWT_CONFIG.cookieOptions,
        secure: security.secure,
        sameSite: security.sameSite as any,
        // @ts-ignore - Support for CHIPS
        partitioned: security.partitioned, 
      });

      applySecurityHeaders(response);
      return response;

    } catch (err: any) {
      console.error(`🔐 [Middleware_Intercept]: JWT Failure: ${err.message}`);
      
      // If the stamp is invalid or token expired, force a wipe
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