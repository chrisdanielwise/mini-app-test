import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { JWT_CONFIG } from '@/lib/auth/config'; 

/**
 * 🛰️ GLOBAL GATEKEEPER (Institutional v9.8.5)
 * Architecture: Turbopack Proxy Node
 * Logic: Atomic Exclusion to prevent 307-Storms.
 * Fix: Explicitly allows the 'token' param to bypass the auth-gate for login.
 */
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // 1. ORIGIN RECONSTRUCTION
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const actualOrigin = `${protocol}://${host}`;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);
  
  // 🚀 Trust Proxy Headers for Safari/Telegram Mini App
  requestHeaders.set('x-forwarded-proto', protocol);

  /**
   * 🛡️ 2. THE HANDSHAKE BYPASS (Critical Fix)
   * Allows requests to hit the login page if they are:
   * A. Explicitly the login page.
   * B. Carrying an identity 'token' from Telegram.
   * C. Displaying a 'reason' for a redirect.
   */
  if (
    pathname === '/dashboard/login' || 
    searchParams.has('token') || 
    searchParams.has('reason')
  ) {
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set("ngrok-skip-browser-warning", "true");
    return response;
  }

  // 3. RBAC GATEKEEPER
  if (pathname.startsWith('/dashboard')) {
    const staffToken = request.cookies.get(JWT_CONFIG.cookieName)?.value;

    let payload: any = null;
    let verificationError = false;

    if (staffToken) {
      try {
        // 🔐 Uses the centralized secret to guarantee a match
        const { payload: decoded } = await jose.jwtVerify(
          staffToken, 
          new TextEncoder().encode(JWT_CONFIG.secret)
        );
        payload = decoded;
      } catch (err) {
        verificationError = true;
      }
    }

    // Role Normalization
    const userRole = payload?.role?.toLowerCase();
    const isAuthorized = !!(payload && [
      "super_admin", "platform_manager", "platform_support", "merchant", "agent"
    ].includes(userRole));

    // ✅ Authorized -> Proceed to Terminal
    if (isAuthorized) {
      requestHeaders.set('x-user-role', userRole);
      return NextResponse.next({ request: { headers: requestHeaders } });
    }

    // 🚩 Unauthorized -> Redirect to Handshake
    const loginUrl = new URL('/dashboard/login', actualOrigin);
    
    // Attach the original token if it exists so we don't lose it during redirect
    const currentToken = searchParams.get('token');
    if (currentToken) loginUrl.searchParams.set('token', currentToken);

    loginUrl.searchParams.set('reason', verificationError || staffToken ? 'session_expired' : 'auth_required');
    
    const response = NextResponse.redirect(loginUrl);
    
    // Clear dead tokens on auth failure
    if (staffToken) {
      response.cookies.set(JWT_CONFIG.cookieName, '', { expires: new Date(0), path: '/' });
    }
    
    response.headers.set("ngrok-skip-browser-warning", "true");
    return response;
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

/**
 * 🚩 ATOMIC EXCLUSION MATCHER
 * Strictly prevents the middleware from running on assets and auth APIs.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (Auth APIs)
     * - api/telegram (Webhook APIs)
     * - _next/static (Static files)
     * - _next/image (Image optimization files)
     * - favicon.ico (Favicon file)
     */
    '/((?!api/auth|api/telegram|_next/static|_next/image|favicon.ico).*)',
  ],
};