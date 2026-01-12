import { NextRequest, NextResponse } from 'next/server'
// import type { NextRequest } from 'next/request'
import * as jose from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const actualOrigin = `${protocol}://${host}`;

  const isStaffRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/support');
  const isLoginPage = pathname === '/dashboard/login';

  if (
    pathname.startsWith('/_next') || 
    pathname.includes('.') ||
    pathname === '/' 
  ) {
    return NextResponse.next();
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
    // Only SUPER_ADMIN, PLATFORM_MANAGER, and MERCHANT can access these routes.
    const isAuthorizedStaff = payload && ["super_admin", "platform_manager", "merchant"].includes(payload.role);

    if (isLoginPage && isAuthorizedStaff) {
      return NextResponse.redirect(new URL('/dashboard', actualOrigin));
    }

    if (!isLoginPage && !isAuthorizedStaff) {
      const response = NextResponse.redirect(new URL('/dashboard/login', actualOrigin));
      if (staffToken) response.cookies.delete('auth_token'); // Clear unauthorized/stale token
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/support/:path*'],
};