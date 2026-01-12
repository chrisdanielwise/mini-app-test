import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 🏁 1. Origin & Header Reconstruction
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const actualOrigin = `${protocol}://${host}`;

  // 🛰️ Inject current pathname into headers so DashboardLayout can break loops
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  const isStaffRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/support');
  const isLoginPage = pathname === '/dashboard/login';

  // 2. Performance Exit: Static Assets & Core APIs
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
   * Verifies not just 'presence' of token, but 'Global UserRole'.
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

    // ✅ THE FIX: Explicit Role Verification
    // Only users with MERCHANT or higher roles can pass this gate.
    const isAuthorizedStaff = payload && ["super_admin", "platform_manager", "merchant"].includes(payload.role);

    // 🚩 Logic: If already logged in as staff, don't show the login page
    if (isLoginPage && isAuthorizedStaff) {
      return NextResponse.redirect(new URL('/dashboard', actualOrigin));
    }

    // 🚩 Logic: If trying to access dashboard without proper role, go to login
    // Exception: Allow the login page to load to prevent infinite loops
    if (!isLoginPage && !isAuthorizedStaff) {
      const response = NextResponse.redirect(new URL('/dashboard/login?reason=auth_required', actualOrigin));
      
      // Cleanup unauthorized/stale tokens to prevent loop triggers
      if (staffToken) response.cookies.delete('auth_token'); 
      return response;
    }
  }

  // 3. Final Handshake: Pass the request with the new 'x-pathname' header
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

// 🚀 Matcher Node: Defines the coverage of the security perimeter
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/support/:path*'
  ],
};