import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'

/**
 * 🛰️ GLOBAL GATEKEEPER (Proxy Protocol v8.2)
 * Hardened: Force-evicts invalid sessions to stop 200/302 refresh storms.
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
    pathname === '/' ||
    pathname.startsWith('/api/') // Let API routes handle their own auth
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
        // 🚩 SESSION POISONING DETECTED: Token exists but is invalid
        verificationError = true;
        payload = null;
      }
    }

    const isAuthorized = !!(payload && [
      "super_admin", 
      "platform_manager", 
      "platform_support", 
      "merchant"
    ].includes(payload.role));

    // 🚩 SCENARIO A: Authorized user hitting login -> SEND TO DASHBOARD
    if (isAuthorized && isLoginPage) {
      return NextResponse.redirect(new URL('/dashboard', actualOrigin));
    }

    // 🚩 SCENARIO B: Unauthorized user or Broken Token -> SEND TO LOGIN + KILL COOKIE
    if (!isAuthorized && !isLoginPage) {
      const loginUrl = new URL('/dashboard/login', actualOrigin);
      
      // If they had a token but it failed, tell them session expired
      if (verificationError || staffToken) {
        loginUrl.searchParams.set('reason', 'session_expired');
      } else {
        loginUrl.searchParams.set('reason', 'auth_required');
      }
      
      const response = NextResponse.redirect(loginUrl);
      
      // 🛡️ THE KILL SWITCH: Force-delete the cookie to stop the loop
      if (staffToken) {
        response.cookies.set('auth_token', '', { expires: new Date(0), path: '/' });
      }
      return response;
    }

    // 🚩 SCENARIO C: Already on login page but has a "zombie" token -> KILL COOKIE
    if (isLoginPage && verificationError && staffToken) {
      const response = NextResponse.next();
      response.cookies.set('auth_token', '', { expires: new Date(0), path: '/' });
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