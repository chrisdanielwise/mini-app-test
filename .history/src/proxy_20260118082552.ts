import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import { JWT_CONFIG, RAW_SECRET } from "@/lib/auth/config";

/**
 * 🛰️ PROXY ROUTE DEFINITIONS
 */
const PUBLIC_PASS_THROUGH = [
  "/",
  "/login",
  "/unauthorized",
  "/auth/callback",
  "/api/auth/magic",
  "/api/auth/telegram",
  "/api/auth/logout",
  "/api/auth/logout-global",
  "/api/auth/heartbeat",
  "/api/telegram/webhook",
  "/api/admin/fix-stamps",
  "/maintenance",
];

const SECURITY_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  "X-Frame-Options": "ALLOW-FROM https://t.me/",
  "Content-Security-Policy":
    "frame-ancestors https://t.me/ https://web.telegram.org/ https://desktop.telegram.org/",
};

/**
 * 🛰️ GLOBAL PROXY GATEKEEPER (v2026.1.18)
 * Strategy: Physical Boundary Enforcement & Header Injection.
 * Mission: Sync identity node with Server Components to prevent RBAC failure.
 */
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. 🛡️ CIRCUIT BREAKER: Internal Next.js assets & public routes
  const isInternal = pathname.startsWith("/_next/") || pathname.includes(".");
  const isPublicPath = PUBLIC_PASS_THROUGH.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (isInternal || isPublicPath || searchParams.has("token")) {
    return applySecurityHeaders(NextResponse.next());
  }

  // 2. 🛡️ PROTECTED ZONE: /dashboard or /home
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/home")) {
    const activeToken = request.cookies.get(JWT_CONFIG.cookieName)?.value;

    if (!activeToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("reason", "auth_required");
      loginUrl.searchParams.set("redirect", pathname);
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }

    try {
      // 🚀 VERIFICATION: Synchronized with AuthService
      const secret = new TextEncoder().encode(RAW_SECRET);

      const { payload } = await jose.jwtVerify(activeToken, secret, {
        clockTolerance: 60,
        algorithms: ["HS256"],
      });

      const userPayload = payload.user as any;
      
      // ✅ FIX: Force Role to lowercase for strict Service Layer matching
      const role = (userPayload?.role || "user").toLowerCase();
      
      // ✅ FIX: Extract security stamp from payload root (standard Apex JWT shape)
      const securityStamp = (payload.securityStamp as string) || (userPayload?.securityStamp as string) || "";

      // 🛰️ INTERNAL HYDRATION: Vital for downstream requireStaff() lookups
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-role", role);
      requestHeaders.set("x-user-id", userPayload?.id || "");
      requestHeaders.set("x-security-stamp", securityStamp);

      const response = NextResponse.next({
        request: { headers: requestHeaders },
      });

      // 🍪 2026 COOKIE REFRESH (CHIPS Integration)
      const isStaff = JWT_CONFIG.staffRoles.includes(role);
      const currentMaxAge = isStaff ? 86400 : 604800; // 24h for Staff, 7d for Users

      response.cookies.set(JWT_CONFIG.cookieName, activeToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none", // Required for Telegram Web App (TWA) context
        path: "/",
        maxAge: currentMaxAge,
        partitioned: true, // 2026 Chrome/Safari Privacy Standard
      });

      return applySecurityHeaders(response);
    } catch (err: any) {
      console.warn(`🔐 [Proxy_Fault]: Identity Node Compromised - ${err.message}`);

      // 🚀 EXPULSION: Clear poisoned cookie and force re-auth
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("reason", "session_invalid");
      const response = NextResponse.redirect(loginUrl);

      response.cookies.set(JWT_CONFIG.cookieName, "", { 
        path: "/", 
        maxAge: 0,
        expires: new Date(0)
      });
      
      return applySecurityHeaders(response);
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

/**
 * 🛠️ UTILITIES
 */
function applySecurityHeaders(response: NextResponse) {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export const config = {
  matcher: [
    "/((?!api/auth|api/telegram|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};