import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'

/**
 * 🛰️ GLOBAL GATEKEEPER (Proxy Protocol v8.5)
 * Hardened: Absolute bypass for login gate to terminate redirect storms.
 * Adaptive: Role normalization for institutional RBAC parity.
 */
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // 🛰️ 1. ORIGIN & HEADER RECONSTRUCTION
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const actualOrigin = `${protocol}://${host}`;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // 🏁 ROUTE CLASSIFICATION
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isLoginPage = pathname === '/dashboard/login';

  // 🛡️ THE KILL SWITCH: Absolute Bypass for Login Gate
  // This prevents the server from ever issuing a redirect if you are already at the gate.
  if (isLoginPage) {
    const staffToken = request.cookies.get('auth_token')?.value;
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    // If they land on login with a reason but have a token, purge the token to prevent state mismatch
    if (staffToken && searchParams.has('reason')) {
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
    // Converts "SUPER_ADMIN" (DB) to "super_admin" (RBAC) to fix the redirect loop.
    const userRole = payload?.role?.toLowerCase();
    
    const isAuthorized = !!(payload && [
      "super_admin", 
      "platform_manager", 
      "platform_support", 
      "merchant",
      "staff"
    ].includes(userRole));

    // ✅ Authorized Node -> Proceed to Dashboard
    if (isAuthorized) {
      if (payload?.role) {
        requestHeaders.set('x-user-role', payload.role);
      }
      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    }

    // 🚩 Unauthorized/Expired -> Redirect to Login Gate
    const loginUrl = new URL('/dashboard/login', actualOrigin);
    
    // Set explicit reason for the UI terminal
    if (verificationError || staffToken) {
      loginUrl.searchParams.set('reason', 'session_expired');
    } else {
      loginUrl.searchParams.set('reason', 'auth_required');
    }
    
    const response = NextResponse.redirect(loginUrl);
    
    // 🧹 PURGE ZOMBIE COOKIE: Ensures a clean hardware handshake on next attempt
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
 * Optimized to exclude internal Next.js assets for 1M user scalability.
 */
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/user/:path*'
  ],
};