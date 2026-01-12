// import { NextRequest, NextResponse } from 'next/server'
// import * as jose from 'jose'

// /**
//  * 🛰️ GLOBAL GATEKEEPER (Proxy Protocol v9.0.0)
//  * Hardened: Loop Breaker for Next.js 15 307-storm termination.
//  * Logic: Terminates recursive redirects by identifying 'Gate State'.
//  */
// const SECRET = new TextEncoder().encode(
//   process.env.JWT_SECRET || "zipha_secure_secret_2026"
// );

// export async function middleware(request: NextRequest) {
//   const { pathname, searchParams } = request.nextUrl;
  
//   // 🛰️ 1. ORIGIN & HEADER RECONSTRUCTION
//   const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
//   const protocol = request.headers.get("x-forwarded-proto") || "https";
//   const actualOrigin = `${protocol}://${host}`;

//   const requestHeaders = new Headers(request.headers);
//   requestHeaders.set('x-pathname', pathname);

//   // 🏁 ROUTE CLASSIFICATION
//   const isDashboardRoute = pathname.startsWith('/dashboard');
//   const isLoginPage = pathname === '/dashboard/login';

//   /**
//    * 🛡️ THE LOOP BREAKER (Crucial Fix)
//    * If the user is ALREADY at the login page OR has a 'reason' param, 
//    * we MUST return NextResponse.next() immediately. 
//    * This prevents the middleware from redirecting a redirect.
//    */
//   if (isLoginPage || searchParams.has('reason')) {
//     const staffToken = request.cookies.get('auth_token')?.value;
//     const response = NextResponse.next({
//       request: { headers: requestHeaders },
//     });

//     // Clear dead tokens to prevent identity-flicker on the login screen
//     if (staffToken && searchParams.get('reason') === 'session_expired') {
//       response.cookies.set('auth_token', '', { expires: new Date(0), path: '/' });
//     }
    
//     // Bypass tunnel warning pages
//     response.headers.set("ngrok-skip-browser-warning", "true");
//     return response;
//   }

//   // 2. PERFORMANCE FAST-EXIT
//   if (
//     pathname.startsWith('/_next') || 
//     pathname.includes('.') ||
//     pathname === '/' ||
//     pathname.startsWith('/api/auth') || 
//     pathname.startsWith('/api/webhook')
//   ) {
//     return NextResponse.next({
//       request: { headers: requestHeaders },
//     });
//   }

//   /**
//    * 🛡️ RBAC GATEKEEPER
//    */
//   if (isDashboardRoute) {
//     const staffToken = request.cookies.get('auth_token')?.value;
//     let payload: any = null;
//     let verificationError = false;

//     if (staffToken) {
//       try {
//         const { payload: decoded } = await jose.jwtVerify(staffToken, SECRET);
//         payload = decoded;
//       } catch (err) {
//         verificationError = true;
//         payload = null;
//       }
//     }

//     // 🚀 ROLE NORMALIZATION
//     const userRole = payload?.role?.toLowerCase();
    
//     const isAuthorized = !!(payload && [
//       "super_admin", 
//       "platform_manager", 
//       "platform_support", 
//       "merchant",
//       "agent"
//     ].includes(userRole));

//     // ✅ Authorized -> Proceed
//     if (isAuthorized) {
//       if (payload?.role) {
//         requestHeaders.set('x-user-role', payload.role);
//       }
//       return NextResponse.next({
//         request: { headers: requestHeaders },
//       });
//     }

//     // 🚩 Unauthorized -> SEND TO LOGIN
//     // Adding the 'reason' param here ensures the Loop Breaker above catches it on the next hop.
//     const loginUrl = new URL('/dashboard/login', actualOrigin);
    
//     if (verificationError || staffToken) {
//       loginUrl.searchParams.set('reason', 'session_expired');
//     } else {
//       loginUrl.searchParams.set('reason', 'auth_required');
//     }
    
//     const response = NextResponse.redirect(loginUrl);
    
//     if (staffToken) {
//       response.cookies.set('auth_token', '', { expires: new Date(0), path: '/' });
//     }
    
//     response.headers.set("ngrok-skip-browser-warning", "true");
//     return response;
//   }

//   return NextResponse.next({
//     request: { headers: requestHeaders },
//   });
// }

// export const config = {
//   matcher: [
//     '/dashboard/:path*',
//     '/api/user/:path*'
//   ],
// };

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