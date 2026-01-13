import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { JWT_CONFIG } from '@/lib/auth/config'; 

/**
 * 🛰️ GLOBAL GATEKEEPER (Institutional v9.9.2)
 * Architecture: Turbopack Proxy Node
 * Logic: Atomic Exclusion to prevent 307-Storms.
 * * 🛠️ FIX LOG:
 * 1. Resolved TS(2345): Check if secret is already Uint8Array before encoding.
 * 2. Handled Loop: Absolute bypass for login/token paths.
 * 3. Pathing: Ensure redirect preservation for Telegram Handshake.
 */
export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const timestamp = new Date().toLocaleTimeString();

  // --- 🛡️ 1. THE TERMINATOR (Bypass Logic) ---
  // We MUST exit immediately for these paths to prevent recursive 307 redirects.
  // If the user is on login, exchanging an API token, or has a 'reason' param, we stand down.
  if (
    pathname === '/dashboard/login' || 
    pathname.startsWith('/api/auth') ||
    searchParams.has('token') || 
    searchParams.has('reason')
  ) {
    // console.log(`[${timestamp}] ✅ TERMINATOR: Bypassing middleware for ${pathname}`);
    return NextResponse.next();
  }

  // --- 🛡️ 2. DASHBOARD GATEKEEPER ---
  if (pathname.startsWith('/dashboard')) {
    const staffToken = request.cookies.get(JWT_CONFIG.cookieName)?.value;

    // A. NO SESSION DETECTED
    if (!staffToken) {
      const loginUrl = new URL('/dashboard/login', request.url);
      
      // Carry over the identity token from Telegram if it exists
      const token = searchParams.get('token');
      if (token) {
        loginUrl.searchParams.set('token', token);
      } else {
        loginUrl.searchParams.set('reason', 'auth_required');
      }

      return NextResponse.redirect(loginUrl);
    }

    // B. JWT VERIFICATION (RBAC)
    try {
      /**
       * 🛠️ FIX TS(2345): Standardize Key Ingress
       * We check if the secret is already a Uint8Array. 
       * TextEncoder.encode() only accepts strings; passing a Uint8Array causes the TS error.
       */
      const secretKey = JWT_CONFIG.secret instanceof Uint8Array 
        ? JWT_CONFIG.secret 
        : new TextEncoder().encode(JWT_CONFIG.secret as string);

      const { payload } = await jose.jwtVerify(staffToken, secretKey);
      
      const userRole = (payload.role as string)?.toLowerCase();
      const isAuthorized = [
        "super_admin", 
        "platform_manager", 
        "platform_support", 
        "merchant", 
        "agent"
      ].includes(userRole);

      if (isAuthorized) {
        return NextResponse.next();
      }
      
      // If role is not in authorized list, treat as expired/unauthorized
      throw new Error("Unauthorized_Role");

    } catch (err) {
      // console.log(`[${timestamp}] ❌ AUTH_FAILURE: Clearing session and redirecting.`);
      const loginUrl = new URL('/dashboard/login', request.url);
      loginUrl.searchParams.set('reason', 'session_expired');
      const response = NextResponse.redirect(loginUrl);
      
      // Wipe the cookie to prevent browser-side stale state
      response.cookies.set(JWT_CONFIG.cookieName, '', { expires: new Date(0), path: '/' });
      return response;
    }
  }

  return NextResponse.next();
}

/**
 * 🚩 ATOMIC EXCLUSION MATCHER
 * Strictly prevents the middleware from running on assets and login routes.
 * This is the primary defense against "307 storms".
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - dashboard/login (The Gate)
     * - api/auth (Authentication APIs)
     * - api/telegram (Webhook Handlers)
     * - _next/static, _next/image, favicon.ico (Assets)
     */
    '/((?!dashboard/login|api/auth|api/telegram|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};