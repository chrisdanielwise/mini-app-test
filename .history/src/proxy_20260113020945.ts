import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { JWT_CONFIG } from '@/lib/auth/config';

/**
 * 🛰️ GLOBAL PROXY GATEKEEPER (Institutional v12.2.0)
 * Architecture: Next.js 16 Proxy Protocol
 * Purpose: Support Hybrid Bearer + Cookie sessions and bypass Safari restrictions.
 */
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // --- 🛡️ 1. THE TERMINATOR (Bypass Logic) ---
  // We exclude /api/ and other internal paths to let them handle their own auth.
  if (
    pathname === '/dashboard/login' || 
    pathname.startsWith('/api/') || 
    pathname.startsWith('/_next/') ||
    searchParams.has('token') || 
    searchParams.has('reason')
  ) {
    return NextResponse.next();
  }

  // --- 🛡️ 2. IDENTITY RESOLUTION ---
  if (pathname.startsWith('/dashboard')) {
    // 🔍 Extract standard Staff Cookie
    const staffToken = request.cookies.get(JWT_CONFIG.cookieName)?.value;
    
    // 🔍 Extract Bearer Token (Recovered from Telegram SecureStorage)
    const authHeader = request.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    // Use whichever identity node is active
    const activeToken = staffToken || bearerToken;

    // A. NO SESSION: Redirect to Gate
    if (!activeToken) {
      const loginUrl = new URL('/dashboard/login', request.url);
      
      const ott = searchParams.get('token');
      if (ott) {
        loginUrl.searchParams.set('token', ott);
      } else {
        loginUrl.searchParams.set('reason', 'auth_required');
      }

      const response = NextResponse.redirect(loginUrl);
      response.headers.set("ngrok-skip-browser-warning", "true");
      return response;
    }

    // B. CRYPTO VALIDATION & STAFF-AWARE AUTHORIZATION
    try {
      const secretKey = JWT_CONFIG.secret instanceof Uint8Array 
        ? JWT_CONFIG.secret 
        : new TextEncoder().encode(JWT_CONFIG.secret as string);

      // Verify the active token
      const { payload } = await jose.jwtVerify(activeToken, secretKey);
      
      const userRole = (payload.role as string)?.toLowerCase();

      // Check clearance
      const isPlatformStaff = 
        payload.isStaff === true || 
        ["super_admin", "platform_manager", "platform_support"].includes(userRole);

      const isMerchantOperator = 
        ["merchant", "owner", "admin", "agent"].includes(userRole);

      if (!isPlatformStaff && !isMerchantOperator) {
        console.warn(`🚫 [Proxy_Gate] Unauthorized Role Attempt: ${userRole}`);
        throw new Error("UNAUTHORIZED_ROLE");
      }

      /**
       * 🛠️ SESSION REPAIR (Cookie Sync)
       * Even if we used a Bearer token to get in, we attempt to repair the 
       * Partitioned Cookie for the browser to reduce future header overhead.
       */
      const response = NextResponse.next();
      response.cookies.set(JWT_CONFIG.cookieName, activeToken, {
        httpOnly: true,
        secure: true, 
        sameSite: "none", 
        path: "/",
        // @ts-ignore - Required for 2026 TMA persistence
        partitioned: true, 
        maxAge: 60 * 60 * 24 * 7,
      });
      
      return response;

    } catch (err) {
      // C. INVALID SESSION
      const loginUrl = new URL('/dashboard/login', request.url);
      loginUrl.searchParams.set('reason', 'session_expired');
      
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(JWT_CONFIG.cookieName);
      return response;
    }
  }

  return NextResponse.next();
}

/**
 * 🚩 ATOMIC EXCLUSION MATCHER
 * UPDATED: Corrected exclusion group to allow ALL /api/ paths to pass through.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - dashboard/login
     * - api/ (All API routes now bypass proxy)
     * - _next/
     * - Static assets
     */
    '/((?!dashboard/login|api/auth|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};