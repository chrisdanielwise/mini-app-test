import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { JWT_CONFIG } from '@/lib/auth/config'; 

/**
 * 🛰️ GLOBAL GATEKEEPER (Institutional v9.8.6)
 * Architecture: Turbopack Proxy Node
 * Logic: Atomic Exclusion to prevent 307-Storms.
 * Fix: Rename to 'middleware' and hardened bypass for token exchange.
 */
export async function middleware(request: NextRequest) {
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
   * 🛡️ 2. THE HANDSHAKE BYPASS (The Terminator)
   * Prevents the middleware from checking sessions if:
   * A. The user is hitting the login page.
   * B. The URL contains a one-time token (OTT).
   * C. A redirect reason is already present.
   */
  if (
    pathname === '/dashboard/login' || 
    pathname.startsWith('/api/auth') ||
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
    
    // 🛡️ CRITICAL: Preserve the token during the redirect so the Login Page can see it
    const currentToken = searchParams.get('token');
    if (currentToken) {
      loginUrl.searchParams.set('token', currentToken);
    } else {
      loginUrl.searchParams.set('reason', verificationError || staffToken ? 'session_expired' : 'auth_required');
    }
    
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
     * Exclude paths that should never trigger middleware:
     * - api/auth & api/telegram
     * - static assets & next internals
     */
    '/((?!api/auth|api/telegram|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};