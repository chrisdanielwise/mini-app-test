import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

/**
 * 🛰️ GLOBAL GATEKEEPER
 * Optimized for Next.js 15 + Telegram Mini App environment.
 * Resolves: Redirect loops, Role-Based Access Control (RBAC), and Dynamic Origins.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 🏁 1. ORIGIN & HEADER RECONSTRUCTION
  // Ensures ngrok tunnels and production domains are handled correctly
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const actualOrigin = `${protocol}://${host}`;

  // 🛰️ PATHNAME INJECTION
  // Crucial: Allows Server Components (Layouts) to see the current path and break loops
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  const isStaffRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/support');
  const isLoginPage = pathname === '/dashboard/login';

  // 2. PERFORMANCE EXIT
  // Bypass middleware for static assets, public landing, and internal Next.js calls
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
   * Verifies both token presence and the 'role' claim inside the JWT.
   */
  if (isStaffRoute) {
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

    // ✅ ROLE VERIFICATION
    // Only users with these specific roles are permitted beyond the perimeter
    const isAuthorizedStaff = payload && ["super_admin", "platform_manager", "merchant"].includes(payload.role);

    // 🚩 AUTHENTICATED REDIRECT: Prevent logged-in staff from seeing the login page
    if (isLoginPage && isAuthorizedStaff) {
      return NextResponse.redirect(new URL('/dashboard', actualOrigin));
    }

    // 🚩 UNAUTHORIZED REDIRECT: Kick users to login if they lack a session or proper role
    // Exception: Explicitly allow the login page to render to stop the redirect loop
    if (!isLoginPage && !isAuthorizedStaff) {
      const response = NextResponse.redirect(
        new URL('/dashboard/login?reason=auth_required', actualOrigin)
      );
      
      // Cleanup: Delete stale/unauthorized cookies to ensure a clean state
      if (staffToken) {
        response.cookies.delete('auth_token');
      }
      return response;
    }
  }

  // 3. FINAL HANDSHAKE
  // Pass the request forward with the injected headers
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

/**
 * 🚀 PERIMETER CONFIGURATION
 * Defines exactly which routes the middleware monitors.
 */
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/support/:path*'
  ],
};