import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { JWT_CONFIG } from '@/lib/auth/config';

/**
 * 🛰️ GLOBAL PROXY GATEKEEPER (Institutional v10.5.0)
 * Architecture: Next.js 16 Proxy Protocol
 * Runtime: Node.js (High-Concurrency Optimized)
 */
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // --- 🛡️ 1. THE TERMINATOR (Bypass Logic) ---
  // Absolute exclusion for system paths and auth-intent routes.
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
    const staffToken = request.cookies.get(JWT_CONFIG.cookieName)?.value;

    // A. NO SESSION: Redirect to Gate with Handshake Preservation
    if (!staffToken) {
      const loginUrl = new URL('/dashboard/login', request.url);
      
      // Preservation: Carry over OTT (One-Time Tokens) if present
      const ott = searchParams.get('token');
      if (ott) {
        loginUrl.searchParams.set('token', ott);
      } else {
        loginUrl.searchParams.set('reason', 'auth_required');
      }

      const response = NextResponse.redirect(loginUrl);
      
      // 🚀 INDUSTRY STANDARD: Force Tunnel Transparency
      // Prevents Cloudflare/Ngrok from showing "Browser Warning" pages to the app.
      response.headers.set("ngrok-skip-browser-warning", "true");
      return response;
    }

    // B. CRYPTO VERIFICATION
    try {
      const secretKey = JWT_CONFIG.secret instanceof Uint8Array 
        ? JWT_CONFIG.secret 
        : new TextEncoder().encode(JWT_CONFIG.secret as string);

      // Verify JWT against the Institutional Secret
      const { payload } = await jose.jwtVerify(staffToken, secretKey);
      
      // Role Normalization (Case-Insensitive Guard)
      const userRole = (payload.role as string)?.toLowerCase();
      const isAuthorized = ["super_admin", "merchant", "platform_manager", "agent"].includes(userRole);

      if (!isAuthorized) throw new Error("UNAUTHORIZED_ROLE");

      /**
       * 🛠️ THE FIX: Cookie Refresh & Partitioning
       * Re-setting the cookie on the way out ensures that if the browser 
       * recently updated its partitioning rules (Chrome 130+), the session is repaired.
       */
      const response = NextResponse.next();
      response.cookies.set(JWT_CONFIG.cookieName, staffToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none", // 🛡️ Mandatory for Telegram WebViews
        path: "/",
        // @ts-ignore - 'partitioned' is the 2026 standard for iframe persistence
        partitioned: true, 
        maxAge: 60 * 60 * 24 * 7,
      });
      
      return response;

    } catch (err) {
      // C. INVALID SESSION: Clean Wipe
      const loginUrl = new URL('/dashboard/login', request.url);
      loginUrl.searchParams.set('reason', 'session_expired');
      
      const response = NextResponse.redirect(loginUrl);
      
      // Immediate cleanup of corrupted/expired cookie
      response.cookies.delete(JWT_CONFIG.cookieName);
      return response;
    }
  }

  return NextResponse.next();
}

/**
 * 🚩 ATOMIC EXCLUSION MATCHER
 * Strictly defined to prevent the proxy from executing on static assets.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - dashboard/login
     * - api/ (handled by route handlers)
     * - _next/static, _next/image (assets)
     * - favicon.ico, assets/
     */
    '/((?!dashboard/login|api/|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};