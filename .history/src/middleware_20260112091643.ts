import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'

/**
 * 🛰️ GLOBAL GATEKEEPER (Proxy Protocol v8.9)
 * Hardened: Absolute bypass for login gate and passive reason-handling.
 * Logic: Terminates Next.js 15 hydration loops by yielding to client-side state.
 */
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // 🛰️ 1. ORIGIN & HEADER RECONSTRUCTION
  // Critical for Cloudflare Tunnels to prevent 404 origin mismatches
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const actualOrigin = `${protocol}://${host}`;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // 🏁 ROUTE CLASSIFICATION
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isLoginPage = pathname === '/dashboard/login';

  /**
   * 🛡️ THE KILL SWITCH (Hydration Loop Terminator)
   * If the user is at the login gate OR the URL has a 'reason' param, 
   * we stop all middleware logic. This prevents the "302 Redirect Storm".
   */
  if (isLoginPage || searchParams.has('reason')) {
    const staffToken = request.cookies.get('auth_token')?.value;
    
    // Create response with current headers
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    // If session expired, clear the cookie to allow a clean Telegram handshake
    if (staffToken && searchParams.get('reason') === 'session_expired') {
      response.cookies.set('auth_token', '', { expires: new Date(0), path: '/' });
    }
    
    return response;
  }

  // 2. PERFORMANCE FAST-EXIT: Static & Public Ingress
  if (
    pathname.startsWith('/_next') || 
    pathname.includes('.') ||
    pathname === '/' ||
    pathname.startsWith('/api/auth') || 
    pathname.startsWith('/api/webhook')
  ) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  /**
   * 🛡️ RBAC GATEKEEPER (Institutional Tier)
   */
  if (isDashboardRoute) {
    const staffToken = request.cookies.get('auth_token')?.value;
    let payload: any = null;
    let verificationError = false;

    if (staffToken) {
      try {
        const { payload: decoded } = await jose.jwtVerify(staffToken, SECRET);
        payload = decoded;
      } catch (err) {
        verificationError = true;
        payload = null;
      }
    }

    // 🚀 ROLE NORMALIZATION PROTOCOL
    // Ensures "SUPER_ADMIN" (DB) maps to "super_admin" (RBAC) to fix casing-loops
    const userRole = payload?.role?.toLowerCase();
    
    const isAuthorized = !!(payload && [
      "super_admin", 
      "platform_manager", 
      "platform_support", 
      "merchant",
      "staff"
    ].includes(userRole));

    // ✅ Authorized Node -> Proceed
    if (isAuthorized) {
      if (payload?.role) {
        requestHeaders.set('x-user-role', payload.role);
      }
      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    }

    // 🚩 Unauthorized/Expired -> SEND TO LOGIN
    const loginUrl = new URL('/dashboard/login', actualOrigin);
    
    // Set explicit reason to prevent the 'reason' bypass loop
    if (verificationError || staffToken) {
      loginUrl.searchParams.set('reason', 'session_expired');
    } else {
      loginUrl.searchParams.set('reason', 'auth_required');
    }
    
    const response = NextResponse.redirect(loginUrl);
    
    // Purge the token to ensure the hardware handshake is fresh
    if (staffToken) {
      response.cookies.set('auth_token', '', { expires: new Date(0), path: '/' });
    }
    return response;
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

/**
 * 🛰️ MATCHER CONFIGURATION
 * Optimized for 1M users: Excludes static assets from the middleware runtime.
 */
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/user/:path*'
  ],
};