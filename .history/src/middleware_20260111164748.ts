import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'

/**
 * 🛰️ GLOBAL GATEKEEPER
 * Logic: Hardened RBAC for Platform Oversight (Super Admin -> Support).
 * Note: File renamed to proxy.ts per Next.js 2026 security protocols.
 */
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 🛰️ 1. ORIGIN & HEADER RECONSTRUCTION
  // Extracts the specific protocol and host to ensure redirect integrity.
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const actualOrigin = `${protocol}://${host}`;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // 🏁 ROUTE CLASSIFICATION
  const isStaffRoute = pathname.startsWith('/dashboard');
  const isLoginPage = pathname === '/dashboard/login';

  // 2. STATIC & PUBLIC PERFORMANCE EXIT
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
   * Handles RBAC validation for the entire /dashboard cluster.
   */
  if (isStaffRoute) {
    const staffToken = request.cookies.get('auth_token')?.value;
    let payload: any = null;

    if (staffToken) {
      try {
        // High-velocity JWT verification via Jose
        const { payload: decoded } = await jose.jwtVerify(staffToken, SECRET);
        payload = decoded;
      } catch (err) {
        payload = null;
      }
    }

    // ✅ CENTRALIZED ROLE VERIFICATION
    // Cluster: Root -> Management -> Support -> Merchant Node
    const isAuthorized = payload && [
      "super_admin", 
      "platform_manager", 
      "platform_support", 
      "merchant"
    ].includes(payload.role);

    // 🚩 AUTHENTICATED REDIRECT: Prevents logged-in users from hitting login page.
    if (isLoginPage && isAuthorized) {
      return NextResponse.redirect(new URL('/dashboard', actualOrigin));
    }

    // 🚩 UNAUTHORIZED REDIRECT: Evicts invalid or expired identity tokens.
    if (!isLoginPage && !isAuthorized) {
      const response = NextResponse.redirect(
        new URL('/dashboard/login?reason=identity_denied', actualOrigin)
      );
      
      // Cleanup ghost tokens to prevent loop errors
      if (staffToken) {
        response.cookies.delete('auth_token');
      }
      return response;
    }
    
    // 🏷️ IDENTITY INJECTION: Passing the role to the internal header for Layout Flavors
    if (payload?.role) {
      requestHeaders.set('x-user-role', payload.role);
    }
  }

  // 3. FINAL HANDSHAKE
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

/**
 * 🚀 PERIMETER CONFIGURATION
 * Monitoring only the /dashboard tree to minimize overhead.
 */
export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};