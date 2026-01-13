import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { JWT_CONFIG, getSecurityContext } from '@/lib/auth/config';

/**
 * 🛰️ GLOBAL PROXY GATEKEEPER (Institutional v12.8.0)
 * Architecture: Next.js 16 Proxy Protocol.
 * Purpose: Secure ingress, Role-Based Access Control (RBAC), and Session Repair.
 * Logic: Environment-aware CHIPS support for Safari 2026 / TMA Iframes.
 */
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // --- 🛡️ 1. THE TERMINATOR (Bypass Logic) ---
  // We exclude internal Next.js paths, auth pages, and ALL /api routes.
  // This prevents the "404 on valid API path" issue by letting APIs handle themselves.
  if (
    pathname === '/' ||
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
    
    // 🔍 Extract Bearer Token (Recovered from Telegram Native SecureStorage)
    const authHeader = request.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    // Unified Identity Node
    const activeToken = staffToken || bearerToken;

    // A. NO IDENTITY NODE FOUND: Redirect to Login Gate
    if (!activeToken) {
      const loginUrl = new URL('/dashboard/login', request.url);
      
      const ott = searchParams.get('token');
      if (ott) {
        loginUrl.searchParams.set('token', ott);
      } else {
        loginUrl.searchParams.set('reason', 'auth_required');
      }

      const response = NextResponse.redirect(loginUrl);
      // Skip tunnel warning pages (Cloudflare/Ngrok)
      response.headers.set("ngrok-skip-browser-warning", "true");
      return response;
    }

    // B. CRYPTO VALIDATION & ACCESS CLEARANCE
    try {
      // Standardize secret format for jose
      const secretKey = JWT_CONFIG.secret instanceof Uint8Array 
        ? JWT_CONFIG.secret 
        : new TextEncoder().encode(JWT_CONFIG.secret as string);

      // Verify signature
      const { payload } = await jose.jwtVerify(activeToken, secretKey);
      
      const userRole = (payload.role as string)?.toLowerCase() || "";

      // 🚀 RBAC: Validate against centralized staff roles in JWT_CONFIG
      const isPlatformStaff = 
        payload.isStaff === true || 
        JWT_CONFIG.staffRoles.includes(userRole);

      const isMerchantOperator = 
        ["merchant", "owner", "admin", "agent"].includes(userRole);

      if (!isPlatformStaff && !isMerchantOperator) {
        console.warn(`🚫 [Proxy_Gate] High-clearance violation by role: ${userRole}`);
        throw new Error("UNAUTHORIZED_ROLE");
      }

      /**
       * 🛠️ SESSION REPAIR (Dynamic Sync)
       * We use the getSecurityContext helper to ensure that if a user entered 
       * via Bearer (due to cookie blocking), we attempt to re-establish the 
       * Partitioned Cookie for future browser-native requests.
       */
      const host = request.headers.get("host");
      const protocol = request.headers.get("x-forwarded-proto");
      const security = getSecurityContext(host, protocol);

      const response = NextResponse.next();
      response.cookies.set(JWT_CONFIG.cookieName, activeToken, {
        ...JWT_CONFIG.cookieOptions,
        secure: security.secure,
        sameSite: security.sameSite,
        // @ts-ignore - Required for 2026 CHIPS / Iframe session persistence
        partitioned: security.partitioned, 
      });
      
      return response;

    } catch (err) {
      // C. CORRUPTED OR EXPIRED SESSION: Purge and Redirect
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
 * Strictly prevents the proxy from intercepting API calls and static assets.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - dashboard/login
     * - api/ (Essential for bypass)
     * - _next/ (Next.js internals)
     * - favicon.ico, assets/
     */
    '/((?!dashboard/login|api/|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};