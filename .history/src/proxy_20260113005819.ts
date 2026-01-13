// import { NextRequest, NextResponse } from 'next/server';
// import * as jose from 'jose';
// import { JWT_CONFIG } from '@/lib/auth/config';

// /**
//  * 🛰️ GLOBAL PROXY GATEKEEPER (Institutional v10.5.1)
//  * Architecture: Next.js 16 Proxy Protocol
//  * Purpose: Secure ingress, session repair, and redirect loop termination.
//  */
// export async function proxy(request: NextRequest) {
//   const { pathname, searchParams } = request.nextUrl;
  
//   // --- 🛡️ 1. THE TERMINATOR (Bypass Logic) ---
//   // Ensure we never intercept static assets, internal API calls, or auth entry points.
//   if (
//     pathname === '/dashboard/login' || 
//     pathname.startsWith('/api/') || 
//     pathname.startsWith('/_next/') ||
//     searchParams.has('token') || 
//     searchParams.has('reason')
//   ) {
//     return NextResponse.next();
//   }

//   // --- 🛡️ 2. IDENTITY RESOLUTION ---
//   if (pathname.startsWith('/dashboard')) {
//     const staffToken = request.cookies.get(JWT_CONFIG.cookieName)?.value;

//     // A. NO SESSION: Redirect to Gate with Handshake Preservation
//     if (!staffToken) {
//       const loginUrl = new URL('/dashboard/login', request.url);
      
//       // Preservation: Carry over OTT (One-Time Tokens) for automatic login sync
//       const ott = searchParams.get('token');
//       if (ott) {
//         loginUrl.searchParams.set('token', ott);
//       } else {
//         loginUrl.searchParams.set('reason', 'auth_required');
//       }

//       const response = NextResponse.redirect(loginUrl);
      
//       // 🚀 TUNNEL TRANSPARENCY: Force skip for Cloudflare/Ngrok browser warnings
//       response.headers.set("ngrok-skip-browser-warning", "true");
//       return response;
//     }

//     // B. CRYPTO VALIDATION & STAFF-AWARE AUTHORIZATION
//     try {
//       const secretKey = JWT_CONFIG.secret instanceof Uint8Array 
//         ? JWT_CONFIG.secret 
//         : new TextEncoder().encode(JWT_CONFIG.secret as string);

//       // Verify signature against the institutional secret
//       const { payload } = await jose.jwtVerify(staffToken, secretKey);
      
//       // 🚀 CENTRALIZED ROLE AUTHORIZATION
//       const userRole = (payload.role as string)?.toLowerCase();

//       // Check for Platform Staff OR Merchant Node Operators
//       const isPlatformStaff = 
//         payload.isStaff === true || 
//         ["super_admin", "platform_manager", "platform_support"].includes(userRole);

//       const isMerchantOperator = 
//         ["merchant", "owner", "admin", "agent"].includes(userRole);

//       if (!isPlatformStaff && !isMerchantOperator) {
//         console.warn(`🚫 [Proxy_Gate] Unauthorized Role Attempt: ${userRole}`);
//         throw new Error("UNAUTHORIZED_ROLE");
//       }

//       /**
//        * 🛠️ SESSION REPAIR: Partitioning Update
//        * Re-setting the cookie ensures the browser maintains the 2026 CHIPS 
//        * (Cookies Having Independent Partitioned State) requirement for iframes.
//        */
//       const response = NextResponse.next();
//       response.cookies.set(JWT_CONFIG.cookieName, staffToken, {
//         httpOnly: true,
//         secure: true, // Required for sameSite: "none"
//         sameSite: "none", 
//         path: "/",
//         // @ts-ignore - Required for 2026 Chrome/Safari iframe persistence
//         partitioned: true, 
//         maxAge: 60 * 60 * 24 * 7,
//       });
      
//       return response;

//     } catch (err) {
//       // C. INVALID SESSION: Clean Wipe & Return to Gate
//       const loginUrl = new URL('/dashboard/login', request.url);
//       loginUrl.searchParams.set('reason', 'session_expired');
      
//       const response = NextResponse.redirect(loginUrl);
      
//       // Wipe corrupted/expired cookie to prevent repeated failures
//       response.cookies.delete(JWT_CONFIG.cookieName);
//       return response;
//     }
//   }

//   return NextResponse.next();
// }

// /**
//  * 🚩 ATOMIC EXCLUSION MATCHER
//  */
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for:
//      * - dashboard/login
//      * - api/ (handled by route-level auth wrappers)
//      * - _next/ (Next.js internals)
//      * - Static assets (favicon, assets folder)
//      */
//     '/((?!dashboard/login|api/|_next/static|_next/image|favicon.ico|assets).*)',
//   ],
// };