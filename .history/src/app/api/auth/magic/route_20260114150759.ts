import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";
import { AuditService } from "@/lib/services/audit.service";
import { JWT_CONFIG } from "@/lib/auth/config";

/**
 * 🛰️ MAGIC HANDSHAKE HANDLER (Institutional v16.11.0)
 * Logic: 30-Day Session Persistence & Soft Auth Return Synchronization.
 * Feature: Optimized for cross-platform TMA and Desktop contexts.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  
  // 🚀 REDIRECT SYNC: Captures the return path from Middleware
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const publicBaseUrl = `${protocol}://${host}`;

  // 🛡️ SECURITY GATE: Token Presence
  if (!token) {
    return NextResponse.redirect(new URL("/dashboard/login?reason=no_token", publicBaseUrl));
  }

  try {
    // 1. 🔑 IDENTITY VERIFICATION
    const user = await AuthService.verifyMagicToken(token);

    if (!user) {
      return NextResponse.redirect(new URL("/dashboard/login?reason=invalid_token", publicBaseUrl));
    }

    // 2. 📝 SESSION PROVISIONING: Uses 30-Day TTL
    const sessionToken = await AuthService.createSession(user);

    // 🛡️ SECURITY AUDIT LOGGING
    await AuditService.log({
      userId: user.id,
      action: "LOGIN",
      ip: request.headers.get("x-forwarded-for")?.split(",")[0] || "0.0.0.0",
      metadata: { 
        method: "TELEGRAM_MAGIC_LINK", 
        gateway: host,
        target: redirectTo
      },
    });

    // 3. 🛰️ DYNAMIC ROUTING
    // Handshake redirects to the callback page to trigger the UI transition pulse.
    const callbackUrl = new URL("/auth/callback", publicBaseUrl);
    callbackUrl.searchParams.set("target", redirectTo);

    const response = NextResponse.redirect(callbackUrl);

    // 4. 🍪 ATOMIC COOKIE INJECTION (Institutional 30-Day Standards)
    const cookieDomain = host?.includes("localhost") ? undefined : host?.split(":")[0];

    response.cookies.set(JWT_CONFIG.cookieName, sessionToken, {
      ...JWT_CONFIG.cookieOptions,
      domain: cookieDomain,
      secure: true,
      httpOnly: true,
      sameSite: "none", // 🔒 Required for external app redirects
      partitioned: true, // 🌐 Required for Safari 2026/TMA isolation
    });

    return response;
  } catch (error: any) {
    console.error("🔥 [Magic_Critical]: Handshake sequence failed:", error.message);
    return NextResponse.redirect(new URL("/dashboard/login?reason=system_error", publicBaseUrl));
  }
}