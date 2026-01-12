import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'

/**
 * 🛰️ GLOBAL GATEKEEPER (Proxy Protocol v8.4)
 * Hardened: Absolute bypass for login gate to terminate redirect storms.
 * Logic: One-way valve for RBAC enforcement.
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

  // 🛡️ THE KILL SWITCH: If already on login, exit immediately.
  // This prevents hydration mismatches and server-side redirect loops.
  if (isLoginPage) {
    const staffToken = request.cookies.get('auth_token')?.value;
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    // If they land on login with a token that might be dead, we clear it just in case.
    // But we NEVER redirect from here.
    if (staffToken && pathname.includes('reason=')) {
      response.cookies.set('auth_token', '', { expires: new Date(0), path: '/' });
    }
    return response;
  }

  // 2. STATIC & PUBLIC PERFORMANCE EXIT
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
   * 🛡️ RBAC GATEKEEPER (Protected Tier)
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

    // Role verification logic
    const userRole = payload?.role?.toLowerCase();
    const isAuthorized = !!(payload && [
      "super_admin", 
      "platform_manager", 
      "platform_support", 
      "merchant",
      "staff"
    ].includes(userRole));

    // 🚩 Authorized user hitting protected area -> Proceed
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
    
    // Scrape search params to avoid passing loop-triggering reasons twice
    if (verificationError || staffToken) {
      loginUrl.searchParams.set('reason', 'session_expired');
    } else {
      loginUrl.searchParams.set('reason', 'auth_required');
    }
    
    const response = NextResponse.redirect(loginUrl);
    
    // Ensure the token is wiped if it caused a failure
    if (staffToken) {
      response.cookies.set('auth_token', '', { expires: new Date(0), path: '/' });
    }
    return response;
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/user/:path*'
  ],
};