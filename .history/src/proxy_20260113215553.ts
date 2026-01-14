import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { JWT_CONFIG, getSecurityContext } from '@/lib/auth/config';

/**
 * 🛰️ PROXY ROUTE DEFINITIONS
 */
const PUBLIC_PASS_THROUGH = [
  '/',                
  '/home',            
  '/dashboard/login', 
  '/unauthorized',    
  '/api/auth/magic',        
  '/api/auth/telegram',    
  '/api/auth/logout',      
  '/api/auth/heartbeat',   
  '/api/telegram/webhook',     
];

const SECURITY_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "X-Frame-Options": "ALLOW-FROM https://t.me/",
  "Content-Security-Policy": "frame-ancestors https://t.me/ https://web.telegram.org/ https://desktop.telegram.org/",
};

/**
 * 🛰️ INSTITUTIONAL GATEKEEPER (v13.2.10)
 */
export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // --- 🛡️ 1. THE INFINITE LOOP SHIELD ---
  const isPublicPath = PUBLIC_PASS_THROUGH.some(path => pathname === path || pathname.startsWith(path + '/'));
  const isStaticFile = pathname.includes('.');
  const isNextInternal = pathname.startsWith('/_next/');
  const hasMagicToken = searchParams.has('token');

  if (isPublicPath || isStaticFile || isNextInternal || hasMagicToken) {
    const response = NextResponse.next();
    response.headers.set("x-invoke-path", pathname); 
    applySecurityHeaders(response); 
    return response;
  }

  // --- 🛡️ 2. HARD PROTECTED ZONE (Dashboard / Admin) ---
  if (pathname.startsWith('/dashboard')) {
    const sessionCookie = request.cookies.get(JWT_CONFIG.cookieName)?.value;
    const authHeader = request.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const activeToken = sessionCookie || bearerToken;

    if (!activeToken) {
      const loginUrl = new URL('/dashboard/login', request.url);
      loginUrl.searchParams.set('reason', 'auth_required');
      const response = NextResponse.redirect(loginUrl);
      applySecurityHeaders(response);
      return response;
    }

    // B. CRYPTO: TOKEN VALIDATION
    try {
      // ✅ FIX: Use JWT_CONFIG.secret directly (already a Uint8Array)
      // This solves the "Argument of type 'Uint8Array' is not assignable to type 'string'" error.
      const { payload } = await jose.jwtVerify(
        activeToken, 
        JWT_CONFIG.secret 
      );
      
      const host = request.headers.get("host");
      const protocol = request.headers.get("x-forwarded-proto") || "https";
      const security = getSecurityContext(host, protocol);

      const response = NextResponse.next();
      
      // Pass metadata to Server Components
      response.headers.set("x-invoke-path", pathname);
      
      // Ensure role is cast correctly for headers
      const userPayload = payload.user as any;
      response.headers.set("x-user-role", userPayload?.role || "user");

      // 🍪 Sync Cookie with 2026 Partitioning Standards
      response.cookies.set(JWT_CONFIG.cookieName, activeToken, {
        ...JWT_CONFIG.cookieOptions,
        secure: security.secure,
        sameSite: security.sameSite as any,
        // @ts-ignore - Support for CHIPS (Cookies Having Independent Partitioned State)
        partitioned: security.partitioned, 
      });

      applySecurityHeaders(response);
      return response;

    } catch (err: any) {
      console.error(`🔐 [Proxy_Expired]: JWT Failure: ${err.message}`);
      const loginUrl = new URL('/dashboard/login', request.url);
      loginUrl.searchParams.set('reason', 'session_expired');
      
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(JWT_CONFIG.cookieName);
      applySecurityHeaders(response);
      return response;
    }
  }

  return NextResponse.next();
}

function applySecurityHeaders(response: NextResponse) {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
}

export const config = {
  matcher: ['/((?!api/|_next/|.*\\..*).*)'],
};