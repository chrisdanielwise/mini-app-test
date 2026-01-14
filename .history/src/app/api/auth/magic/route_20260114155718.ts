import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";
import { AuditService } from "@/lib/services/audit.service";
import { JWT_CONFIG } from "@/lib/auth/config";

/**
 * 🛰️ MAGIC HANDSHAKE HANDLER (Institutional v16.15.0)
 * Logic: Tiered Session Persistence & Universal Redirect Synchronization.
 * Feature: Optimized for cross-platform TMA and Desktop contexts.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  
  // 🚀 REDIRECT SYNC: Captures the return path from Middleware or Login Node
  const redirectTo = searchParams.get("redirect") || "/home";

  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const publicBaseUrl = `${protocol}://${host}`;

  // 🛡️ SECURITY GATE: Token Presence
  // Redirects to the global login node on failure
  if (!token) {
    return NextResponse.redirect(new URL(`/login?reason=no_token&redirect=${redirectTo}`, publicBaseUrl));
  }

  try {
    // 1. 🔑 IDENTITY VERIFICATION
    const user = await AuthService.verifyMagicToken(token);

    if (!user) {
      return NextResponse.redirect(new URL(`/login?reason=invalid_token&redirect=${redirectTo}`, publicBaseUrl));
    }

    // 2. 📝 TIERED SESSION PROVISIONING
    // Uses dynamic logic: Staff (24h) | Merchants (7d)
    const sessionToken = await AuthService.createSession(user);
    
    // Fetch specific metadata to align Cookie MaxAge with the role-based JWT
    const cookieMetadata = AuthService.getCookieMetadata(host, protocol, user.role);

    // 🛡️ SECURITY AUDIT LOGGING
    await AuditService.log({
      userId: user.id,
      action: "LOGIN",
      ip: request.headers.get("x-forwarded-for")?.split(",")[0] || "0.0.0.0",
      metadata: { 
        method: "TELEGRAM_MAGIC_LINK", 
        gateway: host,
        target: redirectTo,
        role: user.role
      },
    });

    // 3. 🛰️ DYNAMIC ROUTING
    // Handshake redirects to the callback page to trigger the cross-tab UI pulse.
    const callbackUrl = new URL("/auth/callback", publicBaseUrl);
    callbackUrl.searchParams.set("target", redirectTo);

    const response = NextResponse.redirect(callbackUrl);

    // 4. 🍪 ATOMIC COOKIE INJECTION
    const cookieDomain = host?.includes("localhost") ? undefined : host?.split(":")[0];

    response.cookies.set(JWT_CONFIG.cookieName, sessionToken, {
      ...cookieMetadata.options, // 🚀 Uses dynamic 24h or 7d maxAge
      domain: cookieDomain,
      secure: true,
      httpOnly: true,
      sameSite: "none", // 🔒 Required for external app redirects
      partitioned: true, // 🌐 Required for Safari 2026/TMA isolation
    });

    return response;
  } catch (error: any) {
    console.error("🔥 [Magic_Critical]: Handshake sequence failed:", error.message);
    return NextResponse.redirect(new URL(`/login?reason=system_error&redirect=${redirectTo}`, publicBaseUrl));
  }
}