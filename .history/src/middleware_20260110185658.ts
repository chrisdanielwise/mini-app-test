import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Session Detection
  const staffToken = request.cookies.get('auth_token')?.value; // Staff Tier
  const userToken = request.cookies.get('user_session')?.value; // User Tier (Mini App)

  // 🏁 Origin Reconstruction (Ngrok Fix)
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const actualOrigin = `${protocol}://${host}`;

  // 2. Path Classification
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isSupportRoute = pathname.startsWith('/support'); // Added for Support Tier
  const isStaffRoute = isDashboardRoute || isSupportRoute;
  const isLoginPage = pathname === '/dashboard/login';
  
  // User App Routes (The folders you just moved)
  const isUserAppRoute = pathname.startsWith('/services') || 
                         pathname.startsWith('/history') || 
                         pathname.startsWith('/profile');

  // 3. EXIT EARLY: Assets, APIs, and Public Landing Page
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('.') ||
    pathname === '/' // Tier 1: Public Landing Page is always open
  ) {
    return NextResponse.next();
  }

  /**
   * 4. STAFF TIER VERIFICATION (Merchant/Support)
   */
  if (isStaffRoute) {
    let isStaffAuth = false;
    if (staffToken) {
      try {
        await jose.jwtVerify(staffToken, SECRET);
        isStaffAuth = true;
      } catch (err) {
        isStaffAuth = false;
      }
    }

    if (isLoginPage && isStaffAuth) {
      return NextResponse.redirect(new URL('/dashboard', actualOrigin));
    }

    if (!isLoginPage && !isStaffAuth) {
      const response = NextResponse.redirect(new URL('/dashboard/login', actualOrigin));
      if (staffToken) response.cookies.delete('auth_token');
      return response;
    }
  }

  /**
   * 5. USER APP TIER VERIFICATION (Telegram Mini App)
   * This handles /services, /history, /profile
   */
  if (isUserAppRoute) {
    // If no user session exists, we usually let the client-side Telegram WebApp SDK 
    // handle the "Handshake," but we can block direct browser access here.
    if (!userToken && !request.headers.get('user-agent')?.includes('Telegram')) {
        // Optional: Redirect browser-users to the landing page
        return NextResponse.redirect(new URL('/', actualOrigin));
    }
  }

  return NextResponse.next();
}

// 🚀 Matcher updated to include Support and User App paths
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/support/:path*', 
    '/services/:path*', 
    '/history/:path*', 
    '/profile/:path*'
  ],
};