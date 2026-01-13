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
  const timestamp = new Date().toLocaleTimeString();
  
  // 1. TELEMETRY: Ingress Audit
  console.log(`[${timestamp}] 📡 Ingress: ${pathname} | Token: ${searchParams.has('token')} | Reason: ${searchParams.get('reason') || 'none'}`);

  // 2. ORIGIN RECONSTRUCTION
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const actualOrigin = `${protocol}://${host}`;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  /**
   * 🛡️ 3. THE TERMINATOR (Bypass Logic)
   * This MUST be the first thing that runs.
   * If any of these conditions are true, we EXIT the middleware immediately.
   */
  if (
    pathname === '/dashboard/login' || 
    pathname.startsWith('/api/auth') ||
    searchParams.has('token') || 
    searchParams.has('reason')
  ) {
    console.log(`[${timestamp}] ✅ Bypass Triggered: Handing off to Render Engine.`);
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set("ngrok-skip-browser-warning", "true");
    return response;
  }

  // 4. RBAC GATEKEEPER
  if (pathname.startsWith('/dashboard')) {
    const staffToken = request.cookies.get(JWT_CONFIG.cookieName)?.value;

    if (!staffToken) {
      console.log(`[${timestamp}] 🚩 Auth Required: No cookie found. Redirecting to Login.`);
      
      const loginUrl = new URL('/dashboard/login', actualOrigin);
      
      // PRESERVE the token if it was in the request
      const currentToken = searchParams.get('token');
      if (currentToken) {
        console.log(`[${timestamp}] 🛰️ Token Detected: Carrying into Login Handshake.`);
        loginUrl.searchParams.set('token', currentToken);
      } else {
        loginUrl.searchParams.set('reason', 'auth_required');
      }

      const response = NextResponse.redirect(loginUrl);
      response.headers.set("ngrok-skip-browser-warning", "true");
      return response;
    }

    // 🔐 JWT Verification Logic
    try {
      const { payload } = await jose.jwtVerify(
        staffToken, 
        new TextEncoder().encode(JWT_CONFIG.secret)
      );
      
      const userRole = (payload.role as string)?.toLowerCase();
      const isAuthorized = ["super_admin", "platform_manager", "platform_support", "merchant", "agent"].includes(userRole);

      if (isAuthorized) {
        console.log(`[${timestamp}] 🟢 Authorized: Role [${userRole}] verified.`);
        requestHeaders.set('x-user-role', userRole);
        return NextResponse.next({ request: { headers: requestHeaders } });
      }
    } catch (err) {
      console.log(`[${timestamp}] ❌ JWT Error: Session invalid.`);
      const loginUrl = new URL('/dashboard/login', actualOrigin);
      loginUrl.searchParams.set('reason', 'session_expired');
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set(JWT_CONFIG.cookieName, '', { expires: new Date(0), path: '/' });
      return response;
    }
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
    '/((?!api/auth|api/telegram|_next/static|_next/image|favicon.ico|assets|dashboard/login).*)',
  ],
};