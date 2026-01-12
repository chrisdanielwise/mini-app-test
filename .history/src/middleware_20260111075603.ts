import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

/**
 * 🛰️ GLOBAL GATEKEEPER (Centralized Support Mode)
 * Path: middleware.ts
 * Optimized: Routes all intervention traffic through /dashboard/support
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 🛰️ 1. ORIGIN & HEADER RECONSTRUCTION
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const actualOrigin = `${protocol}://${host}`;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // 🏁 ROUTE CLASSIFICATION
  // Consolidating all staff traffic under /dashboard
  const isStaffRoute = pathname.startsWith('/dashboard');
  const isLoginPage = pathname === '/dashboard/login';

  // 2. PERFORMANCE EXIT
  if (
    pathname.startsWith('/_next') || 
    pathname.includes('.') ||
    pathname === '/' 
  ) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  /**
   * 🛡️ STAFF TIER GATEKEEPER
   */
  if (isStaffRoute) {
    const staffToken = request.cookies.get('auth_token')?.value;
    let payload: any = null;

    if (staffToken) {
      try {
        const { payload: decoded } = await jose.jwtVerify(staffToken, SECRET);
        payload = decoded;
      } catch (err) {
        payload = null;
      }
    }

    // ✅ CENTRALIZED ROLE VERIFICATION
    // Added 'platform_support' to the authorized cluster
    const isAuthorizedStaff = payload && [
      "super_admin", 
      "platform_manager", 
      "platform_support", 
      "merchant"
    ].includes(payload.role);

    // 🚩 AUTHENTICATED REDIRECT
    if (isLoginPage && isAuthorizedStaff) {
      return NextResponse.redirect(new URL('/dashboard', actualOrigin));
    }

    // 🚩 UNAUTHORIZED REDIRECT
    if (!isLoginPage && !isAuthorizedStaff) {
      const response = NextResponse.redirect(
        new URL('/dashboard/login?reason=identity_denied', actualOrigin)
      );
      
      if (staffToken) {
        response.cookies.delete('auth_token');
      }
      return response;
    }
  }

  // 3. FINAL HANDSHAKE
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

/**
 * 🚀 PERIMETER CONFIGURATION
 * Simplified: Monitoring only the /dashboard tree for centralized support.
 */
export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};