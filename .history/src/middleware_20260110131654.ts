import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 🏁 Origin Reconstruction: Essential for Ngrok and Load Balancers
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const actualOrigin = `${protocol}://${host}`;

  // 1. Route Classification
  const isStaffRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/support');
  const isUserAppRoute = ['/services', '/history', '/profile', '/home'].some(path => pathname.startsWith(path));
  const isLoginPage = pathname === '/dashboard/login';

  // 2. Performance Exit: Static Assets & Core APIs
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api/public') || // Allow public APIs
    pathname.includes('.') ||
    pathname === '/' 
  ) {
    return NextResponse.next();
  }

  /**
   * 🛡️ STAFF TIER PROTOCOL (Merchant / Support)
   * High-security JWT verification for administrative access.
   */
  if (isStaffRoute) {
    const staffToken = request.cookies.get('auth_token')?.value;
    let isStaffAuth = false;

    if (staffToken) {
      try {
        await jose.jwtVerify(staffToken, SECRET);
        isStaffAuth = true;
      } catch (err) {
        // Token corrupted or expired
        isStaffAuth = false;
      }
    }

    if (isLoginPage && isStaffAuth) {
      return NextResponse.redirect(new URL('/dashboard', actualOrigin));
    }

    if (!isLoginPage && !isStaffAuth) {
      const response = NextResponse.redirect(new URL('/dashboard/login', actualOrigin));
      // Cleanup stale tokens to prevent loop
      if (staffToken) response.cookies.delete('auth_token');
      return response;
    }
  }

  /**
   * 🛰️ USER APP TIER PROTOCOL (Telegram Mini App)
   * Prevents standard web browsers from probing internal app routes.
   */
  if (isUserAppRoute) {
    const userToken = request.cookies.get('user_session')?.value;
    const ua = request.headers.get('user-agent') || "";
    const isTelegram = ua.includes('Telegram') || ua.includes('TGWebview');

    // 🚩 BLOCK: Browser users trying to access internal Mini App routes without a session
    if (!userToken && !isTelegram) {
      console.warn(`[Security] Unauthorized Browser Access to ${pathname} blocked.`);
      return NextResponse.redirect(new URL('/', actualOrigin));
    }
  }

  return NextResponse.next();
}

// 🚀 Matcher Node: Defines the coverage of the security perimeter
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/support/:path*', 
    '/services/:path*', 
    '/history/:path*', 
    '/profile/:path*',
    '/home/:path*'
  ],
};