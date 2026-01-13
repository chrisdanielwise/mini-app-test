import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { JWT_CONFIG } from '@/lib/auth/config'; 

/**
 * 🛰️ GLOBAL PROXY GATEKEEPER (Institutional v9.9.8)
 * Architecture: Next.js 16 Proxy Convention
 * Fix: Explicitly kills the 307 storm by identifying the 'reason' hop.
 */
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const timestamp = new Date().toLocaleTimeString();

  // --- 🛡️ 1. THE TERMINATOR (Absolute Bypass) ---
  // If the request is for the login page, or already has a 'reason', 
  // or is an auth API, we MUST return next() immediately.
  if (
    pathname === '/dashboard/login' || 
    pathname.startsWith('/api/auth') ||
    searchParams.has('token') || 
    searchParams.has('reason')
  ) {
    // console.log(`[${timestamp}] ✅ PROXY BYPASS: ${pathname}`);
    return NextResponse.next();
  }

  // --- 🛡️ 2. DASHBOARD GATEKEEPER ---
  if (pathname.startsWith('/dashboard')) {
    const staffToken = request.cookies.get(JWT_CONFIG.cookieName)?.value;

    if (!staffToken) {
      // console.log(`[${timestamp}] 🚩 REDIRECT: No cookie. Sending to Login.`);
      const loginUrl = new URL('/dashboard/login', request.url);
      
      // Transfer token if present
      const token = searchParams.get('token');
      if (token) {
        loginUrl.searchParams.set('token', token);
      } else {
        // Adding 'reason' here ensures the NEXT hop is caught by the terminator above
        loginUrl.searchParams.set('reason', 'auth_required');
      }

      const response = NextResponse.redirect(loginUrl);
      // Force skip for Cloudflare/Ngrok browser warnings
      response.headers.set("ngrok-skip-browser-warning", "true");
      return response;
    }

    // --- 🛡️ 3. CRYPTO VALIDATION ---
    try {
      /**
       * 🛠️ FIX TS(2345): Standardize Key Ingress
       * If secret is Uint8Array (from config), use it directly.
       */
      const secretKey = JWT_CONFIG.secret instanceof Uint8Array 
        ? JWT_CONFIG.secret 
        : new TextEncoder().encode(JWT_CONFIG.secret as string);

      const { payload } = await jose.jwtVerify(staffToken, secretKey);
      
      const userRole = (payload.role as string)?.toLowerCase();
      const isAuthorized = ["super_admin", "merchant", "platform_manager", "agent"].includes(userRole);

      if (isAuthorized) return NextResponse.next();
      
      throw new Error("UNAUTHORIZED_ROLE");
    } catch (err) {
      const loginUrl = new URL('/dashboard/login', request.url);
      loginUrl.searchParams.set('reason', 'session_expired');
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set(JWT_CONFIG.cookieName, '', { expires: new Date(0), path: '/' });
      return response;
    }
  }

  return NextResponse.next();
}

/**
 * 🚩 ATOMIC EXCLUSION MATCHER
 * Essential: Add dashboard/login here to prevent the proxy from even triggering.
 */
export const config = {
  matcher: [
    '/((?!dashboard/login|api/auth|api/telegram|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};