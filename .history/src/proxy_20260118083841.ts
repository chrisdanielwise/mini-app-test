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
 */
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const isInternal = pathname.startsWith("/_next/") || pathname.includes(".");
  const isPublicPath = PUBLIC_PASS_THROUGH.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (isInternal || isPublicPath || searchParams.has("token")) {
    return applySecurityHeaders(NextResponse.next());
  }

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/home")) {
    const activeToken = request.cookies.get(JWT_CONFIG.cookieName)?.value;

    if (!activeToken) {
      console.warn(`🛰️ [Proxy_Trace]: 🛑 No token found for ${pathname}. Redirecting to /login.`);
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("reason", "auth_required");
      loginUrl.searchParams.set("redirect", pathname);
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }

    try {
      const secret = new TextEncoder().encode(RAW_SECRET);

      const { payload } = await jose.jwtVerify(activeToken, secret, {
        clockTolerance: 60,
        algorithms: ["HS256"],
      });

      const userPayload = payload.user as any;
      
      // ✅ FORENSIC CONSOLE: Identity Extraction
      const role = (userPayload?.role || "user").toLowerCase();
      const userId = userPayload?.id || "";
      const securityStamp = (payload.securityStamp as string) || (userPayload?.securityStamp as string) || "";

      console.log("🛰️ [Proxy_Handshake]: Identity Node Successfully Resolved", {
        path: pathname,
        id: userId,
        role: role,
        has_stamp: !!securityStamp,
        is_staff: JWT_CONFIG.staffRoles.includes(role)
      });

      // 🛰️ INTERNAL HYDRATION: Injecting headers for downstream Server Components
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-role", role);
      requestHeaders.set("x-user-id", userId);
      requestHeaders.set("x-security-stamp", securityStamp);

      const response = NextResponse.next({
        request: { headers: requestHeaders },
      });

      // 🍪 2026 COOKIE REFRESH (CHIPS Integration)
      const isStaff = JWT_CONFIG.staffRoles.includes(role);
      const currentMaxAge = isStaff ? 86400 : 604800;

      response.cookies.set(JWT_CONFIG.cookieName, activeToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: currentMaxAge,
        partitioned: true,
      });

      return applySecurityHeaders(response);
    } catch (err: any) {
      // ✅ FORENSIC CONSOLE: Fault Detection
      console.error(`🚨 [Proxy_Fault]: Identity Node Compromised at ${pathname}`, {
        error: err.message,
        token_present: !!activeToken
      });

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