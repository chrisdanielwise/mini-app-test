import { NextRequest, NextResponse } from "next/server";
import {
  createSession,
  getCookieMetadata,
  verifyMagicToken,
} from "@/lib/services/auth.service";
import { logAuthEvent } from "@/lib/services/audit.service";
import { JWT_CONFIG } from "@/lib/auth/config";

/**
 * 🛰️ MAGIC HANDSHAKE HANDLER (Institutional v16.16.14)
 * Logic: Tiered Session Persistence & Universal Redirect Synchronization.
 * Fix: Migrated to Named Exports to resolve Turbopack Handshake Crashes.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  // 🚀 REDIRECT SYNC: Captures the return path from Middleware or Login Node
  const redirectTo = searchParams.get("redirect") || "/home";

  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const publicBaseUrl = `${protocol}://${host}`;

  // 🛡️ SECURITY GATE: Token Presence
  if (!token) {
    return NextResponse.redirect(
      new URL(`/login?reason=no_token&redirect=${redirectTo}`, publicBaseUrl)
    );
  }

  try {
    // 1. 🔑 IDENTITY VERIFICATION (Atomic Call)
    const user = await verifyMagicToken(token);

    if (!user) {
      return NextResponse.redirect(
        new URL(
          `/login?reason=invalid_token&redirect=${redirectTo}`,
          publicBaseUrl
        )
      );
    }

    // 2. 📝 TIERED SESSION PROVISIONING
    // Logic: Staff (24h) | Merchants (7d)
    const sessionToken = await createSession(user);

    // Fetch specific metadata to align Cookie MaxAge with the role-based JWT
    // Simplified: Removed host/protocol params to prevent Proxy_Fault errors
    const cookieMetadata = getCookieMetadata(user.role);

    // 🛡️ SECURITY AUDIT LOGGING (Atomic Call)
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "0.0.0.0";
    await logAuthEvent(user.id, ip, "MAGIC_LINK_LOGIN");

    // 3. 🛰️ DYNAMIC ROUTING
    // Handshake redirects to the callback page to trigger the cross-tab UI pulse.
    const callbackUrl = new URL("/auth/callback", publicBaseUrl);
    callbackUrl.searchParams.set("target", redirectTo);

    const response = NextResponse.redirect(callbackUrl);

    // 4. 🍪 ATOMIC COOKIE INJECTION (2026 Standard)
    // We omit manual domain parsing to increase resilience across TMA proxies.
    response.cookies.set(JWT_CONFIG.cookieName, sessionToken, {
      ...cookieMetadata.options, 
      httpOnly: true,
      secure: true,
      sameSite: "none", // 🔒 Required for Telegram/Iframe contexts
      partitioned: true, // 🌐 Required for 2026 TMA Isolation (CHIPS)
    });

    return response;
  } catch (error: any) {
    console.error(
      "🔥 [Magic_Critical]: Handshake sequence failed:",
      error.message
    );
    return NextResponse.redirect(
      new URL(
        `/login?reason=system_error&redirect=${redirectTo}`,
        publicBaseUrl
      )
    );
  }
}