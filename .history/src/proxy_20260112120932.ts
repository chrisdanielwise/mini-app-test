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

import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'

/**
 * 🛰️ GLOBAL GATEKEEPER (Proxy Protocol v9.0.2)
 * Hardened: Atomic Matcher Exclusion & Telemetry Logging.
 * Logic: Terminates recursive redirects by identifying 'Gate State' before execution.
 */
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // 🛰️ 1. ORIGIN & HEADER RECONSTRUCTION
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const actualOrigin = `${protocol}://${host}`;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // 🛡️ 2. EMERGENCY BYPASS (The Terminator)
  // Even if the matcher is bypassed, this ensures the login page is NEVER redirected.
  if (pathname === '/dashboard/login' || searchParams.has('reason')) {
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    response.headers.set("ngrok-skip-browser-warning", "true");
    return response;
  }

  /**
   * 🛡️ RBAC GATEKEEPER
   */
  if (pathname.startsWith('/dashboard')) {
    const staffToken = request.cookies.get('auth_token')?.value;
    
    // 🚩 TELEMETRY LOG: Initial Ingress Check
    console.log(`[Middleware_Ingress] Path: ${pathname} | Token: ${!!staffToken}`);

    let payload: any = null;
    let verificationError = false;

    if (staffToken) {
      try {
        const { payload: decoded } = await jose.jwtVerify(staffToken, SECRET);
        payload = decoded;
        // 🚩 TELEMETRY LOG: Successful Verification
        console.log(` -> [Middleware_Auth] Verified Role: ${payload.role}`);
      } catch (err) {
        verificationError = true;
        console.log(" -> [Middleware_Redirect] JWT Invalid/Expired.");
      }
    }

    // 🚀 ROLE NORMALIZATION
    const userRole = payload?.role?.toLowerCase();
    
    const isAuthorized = !!(payload && [
      "super_admin", 
      "platform_manager", 
      "platform_support", 
      "merchant",
      "agent"
    ].includes(userRole));

    // ✅ Authorized Node -> Proceed
    if (isAuthorized) {
      requestHeaders.set('x-user-role', userRole);
      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    }

    // 🚩 Unauthorized -> SEND TO LOGIN
    const loginUrl = new URL('/dashboard/login', actualOrigin);
    
    if (verificationError || staffToken) {
      loginUrl.searchParams.set('reason', 'session_expired');
    } else {
      loginUrl.searchParams.set('reason', 'auth_required');
    }
    
    console.log(` -> [Middleware_Redirect] Unauthorized access to ${pathname}. Loop Breaker Set.`);
    
    const response = NextResponse.redirect(loginUrl);
    
    if (staffToken) {
      response.cookies.set('auth_token', '', { expires: new Date(0), path: '/' });
    }
    
    response.headers.set("ngrok-skip-browser-warning", "true");
    return response;
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

/**
 * 🛰️ THE ATOMIC MATCHER
 * This regex tells Next.js to ignore the middleware for:
 * 1. The login page (dashboard/login) - preventing the 307 storm.
 * 2. All Auth APIs (api/auth) - allowing handshake completion.
 * 3. Static files and assets.
 */
export const config = {
  matcher: [
    '/((?!api/auth|dashboard/login|_next/static|_next/image|favicon.ico).*)',
  ],
};