import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'

/**
 * 🛰️ GLOBAL GATEKEEPER (Proxy Protocol)
 * Fixed: Infinite redirect loop protection via Idempotency Checks.
 * Logic: Hardened RBAC for Platform Oversight (Super Admin -> Merchant).
 */
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 🛰️ 1. ORIGIN & HEADER RECONSTRUCTION
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const actualOrigin = `${protocol}://${host}`;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // 🏁 ROUTE CLASSIFICATION
  const isDashboardRoute = pathname.startsWith('/dashboard');
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
   * 🛡️ RBAC GATEKEEPER
   */
  if (isDashboardRoute) {
    const staffToken = request.cookies.get('auth_token')?.value;
    let payload: any = null;

    if (staffToken) {
      try {
        const { payload: decoded } = await jose.jwtVerify(staffToken, SECRET);
        payload = decoded;
      } catch (err) {
        // Token is invalid or expired
        payload = null;
      }
    }

    const isAuthorized = !!(payload && [
      "super_admin", 
      "platform_manager", 
      "platform_support", 
      "merchant"
    ].includes(payload.role));

    // 🚩 LOOP PROTECTION: AUTHENTICATED
    // If authorized and trying to go to login, send to dashboard
    if (isAuthorized && isLoginPage) {
      return NextResponse.redirect(new URL('/dashboard', actualOrigin));
    }

    // 🚩 LOOP PROTECTION: UNAUTHORIZED
    // If NOT authorized and NOT already on login page, send to login
    if (!isAuthorized && !isLoginPage) {
      const loginUrl = new URL('/dashboard/login', actualOrigin);
      loginUrl.searchParams.set('reason', 'identity_denied');
      
      const response = NextResponse.redirect(loginUrl);
      
      // Cleanup ghost tokens to prevent "Session Poisoning" loops
      if (staffToken) {
        response.cookies.delete('auth_token');
      }
      return response;
    }
    
    // 🏷️ IDENTITY INJECTION
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
 */
export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};