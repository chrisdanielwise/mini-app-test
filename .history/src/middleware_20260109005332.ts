import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  /**
   * 🏁 1. NGROK ORIGIN RECONSTRUCTION
   * We prioritize x-forwarded headers to ensure redirects stay on the tunnel.
   */
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const actualOrigin = `${protocol}://${host}`;

  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isLoginPage = pathname === '/dashboard/login';

  // 🔍 DIAGNOSTIC LOGGING
  if (isDashboardRoute) {
    console.log(`[Middleware Check] Path: ${pathname} | Token Found: ${!!token} | Origin: ${actualOrigin}`);
  }

  // 2. EXIT EARLY: Assets, Static Files, and API Handshakes
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api/auth') || 
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  /**
   * 3. VERIFY TOKEN (Stateless)
   */
  let userSession = null;
  if (token) {
    try {
      const { payload } = await jose.jwtVerify(token, SECRET);
      userSession = payload;
    } catch (err) {
      userSession = null;
    }
  }

  /**
   * 4. REDIRECT LOGIC
   * 🚀 Uses 'actualOrigin' to prevent ERR_CONNECTION_REFUSED.
   */
  
  // Case A: Authenticated user tries to access Login page -> Redirect to Dashboard
  if (isLoginPage && userSession) {
    return NextResponse.redirect(new URL('/dashboard', actualOrigin));
  }

  // Case B: Unauthorized access to Protected Dashboard -> Redirect to Login
  if (isDashboardRoute && !isLoginPage && !userSession) {
    console.warn(`[Middleware] Unauthorized attempt on ${pathname}. Redirecting to Login.`);
    
    const loginUrl = new URL('/dashboard/login', actualOrigin);
    const response = NextResponse.redirect(loginUrl);
    
    // Wipe "Zombie" cookies to prevent infinite redirect loops
    if (token) {
      response.cookies.delete('auth_token');
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};