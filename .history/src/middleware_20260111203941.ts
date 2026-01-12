import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'

/**
 * 🛰️ GLOBAL GATEKEEPER (Proxy Protocol v8.3)
 * Optimized: Prevents 200/302 storms by explicitly handling the Login Gate.
 * Logic: Hardened RBAC + Session Eviction.
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
  // Skip middleware for internal Next.js assets and public files
  if (
    pathname.startsWith('/_next') || 
    pathname.includes('.') ||
    pathname === '/' ||
    pathname.startsWith('/api/auth') || // Allow auth APIs to process
    pathname.startsWith('/api/webhook')  // Allow webhooks
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
    let verificationError = false;

    if (staffToken) {
      try {
        const { payload: decoded } = await jose.jwtVerify(staffToken, SECRET);
        payload = decoded;
      } catch (err) {
        // 🚩 SESSION POISONING: Token exists but is invalid/expired
        verificationError = true;
        payload = null;
      }
    }

    const isAuthorized = !!(payload && [
      "super_admin", 
      "platform_manager", 
      "platform_support", 
      "merchant",
      "STAFF" // Added for case-sensitivity insurance
    ].includes(payload.role?.toLowerCase()));

    // 🚩 SCENARIO A: Authorized user hitting login -> SEND TO DASHBOARD
    if (isAuthorized && isLoginPage) {
      return NextResponse.redirect(new URL('/dashboard', actualOrigin));
    }

    // 🚩 SCENARIO B: On Login Page with a Broken Token -> KILL COOKIE & STAY
    // This stops the loop: if we are already at the gate, don't redirect again.
    if (isLoginPage) {
      if (verificationError && staffToken) {
        const response = NextResponse.next();
        response.cookies.set('auth_token', '', { expires: new Date(0), path: '/' });
        return response;
      }
      return NextResponse.next();
    }

    // 🚩 SCENARIO C: Unauthorized Access to Protected Route -> SEND TO LOGIN
    if (!isAuthorized) {
      const loginUrl = new URL('/dashboard/login', actualOrigin);
      
      // Determine error messaging
      if (verificationError || staffToken) {
        loginUrl.searchParams.set('reason', 'session_expired');
      } else {
        loginUrl.searchParams.set('reason', 'auth_required');
      }
      
      const response = NextResponse.redirect(loginUrl);
      
      // 🛡️ THE KILL SWITCH: Purge the zombie cookie
      if (staffToken) {
        response.cookies.set('auth_token', '', { expires: new Date(0), path: '/' });
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
 * Limit middleware execution to only the dashboard and user-sensitive APIs.
 */
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/user/:path*'
  ],
};