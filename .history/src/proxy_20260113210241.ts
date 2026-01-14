import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { JWT_CONFIG, getSecurityContext } from '@/lib/auth/config';

/**
 * 🛰️ PROXY ROUTE DEFINITIONS
 * Added new routes for Telegram Auth, Logout, and Heartbeat.
 */
const PUBLIC_PASS_THROUGH = [
  '/',                
  '/home',            
  '/dashboard/login', 
  '/unauthorized',    
  '/api/auth/magic',        
  '/api/auth/telegram',    // 🚀 NEW: Automatic Telegram Handshake
  '/api/auth/logout',      // 🚀 NEW: Session Termination
  '/api/auth/heartbeat',   // 🚀 NEW: Session Extension
  '/api/telegram/webhook',     
];

const SECURITY_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "X-Frame-Options": "ALLOW-FROM https://t.me/",
  "Content-Security-Policy": "frame-ancestors https://t.me/ https://web.telegram.org/ https://desktop.telegram.org/",
};

/**
 * 🛰️ INSTITUTIONAL GATEKEEPER
 */
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // --- 🛡️ 1. THE INFINITE LOOP SHIELD ---
  const isPublicPath = PUBLIC_PASS_THROUGH.some(path => pathname === path || pathname.startsWith(path + '/'));
  const isStaticFile = pathname.includes('.');
  const isNextInternal = pathname.startsWith('/_next/');
  const hasMagicToken = searchParams.has('token');

  if (isPublicPath || isStaticFile || isNextInternal || hasMagicToken) {
    if (!isStaticFile && !isNextInternal) {
      console.log(`🟢 [Proxy_Bypass]: ${pathname}`);
    }
    
    const response = NextResponse.next();
    response.headers.set("x-invoke-path", pathname); 
    applySecurityHeaders(response); // Apply headers even to public API calls
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
      console.warn(`🚫 [Proxy_Auth]: Unauthorized access to ${pathname}.`);
      const loginUrl = new URL('/dashboard/login', request.url);
      loginUrl.searchParams.set('reason', 'auth_required');
      
      const response = NextResponse.redirect(loginUrl);
      applySecurityHeaders(response);
      return response;
    }

    // B. CRYPTO: TOKEN VALIDATION
    try {
      const { payload } = await jose.jwtVerify(
        activeToken, 
        new TextEncoder().encode(JWT_CONFIG.secret as string)
      );
      
      const host = request.headers.get("host");
      const protocol = request.headers.get("x-forwarded-proto") || "https";
      const security = getSecurityContext(host, protocol);

      const response = NextResponse.next();
      
      // 🚀 IDENTITY SYNC: Pass path and role to the layouts
      response.headers.set("x-invoke-path", pathname);
      response.headers.set("x-user-role", (payload.role as string) || "user");

      // Sync/Refresh Cookie Metadata for Safari 2026/Chrome compatibility
      response.cookies.set(JWT_CONFIG.cookieName, activeToken, {
        ...JWT_CONFIG.cookieOptions,
        secure: security.secure,
        sameSite: security.sameSite as any,
        // @ts-ignore - Support for experimental partitioned flag
        partitioned: security.partitioned, 
      });

      applySecurityHeaders(response);
      return response;

    } catch (err: any) {
      console.error(`🔐 [Proxy_Expired]: JWT Failure: ${err.message}`);
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