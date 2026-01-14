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
 * 🛰️ GLOBAL PROXY GATEKEEPER (v14.18.0)
 * Fixed: Re-integrated x-invoke-path header to prevent Layout-level loops.
 * Added: Security Stamp extraction for downstream Server Components.
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
    // 🚀 Essential for Layout stability
    response.headers.set("x-invoke-path", pathname); 
    applySecurityHeaders(response); 
    return response;
  }

  // --- 🛡️ 2. HARD PROTECTED ZONE (Dashboard / Admin) ---
  if (pathname.startsWith('/dashboard')) {
    console.log(`🛡️ [Proxy_Gate]: Intercepting request for ${pathname}`);

    const sessionCookie = request.cookies.get(JWT_CONFIG.cookieName)?.value;
    const authHeader = request.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const activeToken = sessionCookie || bearerToken;

    // A. GATE: NO TOKEN DETECTED
    if (!activeToken) {
      console.log(`🚫 [Proxy_Auth]: No token found for ${pathname}. Redirecting to Login...`);
      const loginUrl = new URL('/dashboard/login', request.url);
      loginUrl.searchParams.set('reason', 'auth_required');
      
      const response = NextResponse.redirect(loginUrl);
      applySecurityHeaders(response);
      return response;
    }

    // B. CRYPTO & STAMP VALIDATION
    try {
      // ✅ Using jose with the secret Uint8Array
      const { payload } = await jose.jwtVerify(activeToken, JWT_CONFIG.secret);
      const userPayload = payload.user as any;
      
      const host = request.headers.get("host");
      const protocol = request.headers.get("x-forwarded-proto") || "https";
      const security = getSecurityContext(host, protocol);

      const response = NextResponse.next();
      
      // 🚀 CRITICAL: This header breaks the loop in StaffRootLayout/NavGuard
      response.headers.set("x-invoke-path", pathname);
      
      // Inject Identity Metadata for Server Components (No DB hit required)
      response.headers.set("x-user-role", userPayload?.role || "user");
      response.headers.set("x-user-id", userPayload?.id || "");
      response.headers.set("x-security-stamp", userPayload?.securityStamp || "");

      console.log(`✅ [Proxy_Verified]: Node ${userPayload.id.slice(0,8)} authorized for ${pathname}`);

      // Sync/Refresh Cookie with 2026 Partitioning Standards
      response.cookies.set(JWT_CONFIG.cookieName, activeToken, {
        ...JWT_CONFIG.cookieOptions,
        secure: security.secure,
        sameSite: security.sameSite as any,
        // @ts-ignore
        partitioned: security.partitioned, 
      });

      applySecurityHeaders(response);
      return response;

    } catch (err: any) {
      console.warn(`🔐 [Proxy_Expired]: JWT Error: ${err.message}. Purging...`);
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