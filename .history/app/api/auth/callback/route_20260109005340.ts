import { NextResponse } from "next/server";
import * as jose from "jose";

// Ensure this matches the secret used in your middleware
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

/**
 * 🔑 AUTH CALLBACK BRIDGE
 * Converts a verified merchantId into a secure HttpOnly session cookie.
 * 🚀 FIXED: Bypasses Ngrok interstitials and uses dynamic origin redirects.
 */
export async function GET(request: Request) {
  // 🏁 Dynamically extract the origin (e.g., https://xxxx.ngrok-free.app)
  const { searchParams, origin } = new URL(request.url);

  try {
    const merchantId = searchParams.get("merchantId");
    const telegramId = searchParams.get("telegramId");

    // 1. Critical Validation
    if (!merchantId) {
      console.error("❌ [Auth Callback] Missing merchantId in query");
      return NextResponse.redirect(new URL("/profile?error=missing_id", origin));
    }

    /**
     * 2. GENERATE STATELESS JWT
     * Encodes the GreysuitFx UUID and Telegram ID into the token.
     */
    const token = await new jose.SignJWT({
      merchantId,
      telegramId: telegramId?.toString(),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(SECRET);

    /**
     * 3. RESPONSE & COOKIE SETTING
     * We use the detected 'origin' to build an absolute redirect URL.
     * This prevents ERR_CONNECTION_REFUSED by avoiding 'localhost' redirects.
     */
    const dashboardUrl = new URL("/dashboard", origin);
    const response = NextResponse.redirect(dashboardUrl);

    // 🚀 NGROK FIX: Bypass the "You are about to visit..." warning page
    // This warning page often breaks programmatic redirects in mobile WebViews.
    response.headers.set("ngrok-skip-browser-warning", "true");

    response.cookies.set("auth_token", token, {
      path: "/",
      httpOnly: true,
      secure: true, // Required for HTTPS (Ngrok & Telegram Mini Apps)
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 Days
    });

    console.log(`✅ [Auth] Session established for: ${merchantId} (Origin: ${origin})`);
    return response;

  } catch (error) {
    console.error(
      "❌ [Auth Callback Crash]:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.redirect(new URL("/profile?error=server_error", origin));
  }
}