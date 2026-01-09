import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // 1. Define route types early
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isLoginPage = pathname === '/dashboard/login';

  // 2. 🔍 DIAGNOSTIC LOGGING
  // This will show in your terminal exactly when the cookie is missing
  if (isDashboardRoute) {
    console.log(`[Middleware Check] Path: ${pathname} | Token Found: ${!!token}`);
  }

  // 3. EXIT EARLY: Assets, Static Files, and API Handshakes
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api/auth') || 
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  /**
   * 4. VERIFY TOKEN (Stateless)
   */
  let userSession = null;
  if (token) {
    try {
      const { payload } = await jose.jwtVerify(token, SECRET);
      userSession = payload;
    } catch (err) {
      // Token expired or invalid secret
      userSession = null;
    }
  }

  /**
   * 5. NGROK-AWARE REDIRECT LOGIC
   * We use the 'origin' to prevent the browser from reverting to localhost.
   */
  
  // Case A: Authenticated user tries to access Login page
  if (isLoginPage && userSession) {
    return NextResponse.redirect(new URL('/dashboard', origin));
  }

  // Case B: Unauthorized access to Protected Dashboard
  if (isDashboardRoute && !isLoginPage && !userSession) {
    console.warn(`[Middleware] Unauthorized attempt on ${pathname}. Redirecting to Login.`);
    
    // Create redirect response using absolute Ngrok origin
    const loginUrl = new URL('/dashboard/login', origin);
    const response = NextResponse.redirect(loginUrl);
    
    // Wipe the "Zombie" cookie if it exists to stop redirect loops
    if (token) {
      response.cookies.delete('auth_token');
    }
    return response;
  }

  return NextResponse.next();
}

/**
 * Limit middleware execution to only the dashboard path
 */
export const config = {
  matcher: ['/dashboard/:path*'],
};