import { NextResponse } from "next/server";
import * as jose from "jose";

// Ensure this matches the secret used in your middleware
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

/**
 * 🔑 AUTH CALLBACK BRIDGE
 * Converts a verified merchantId into a secure HttpOnly session cookie.
 * 🚀 FIXED: Reconstructs Ngrok origin from headers to prevent localhost redirects.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  /**
   * 🏁 1. NGROK ORIGIN RECONSTRUCTION
   * We prioritize x-forwarded headers to ensure redirects stay on the tunnel.
   */
  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const detectedOrigin = `${protocol}://${host}`;

  try {
    const merchantId = searchParams.get("merchantId");
    const telegramId = searchParams.get("telegramId");

    // 2. Critical Validation
    if (!merchantId) {
      console.error("❌ [Auth Callback] Missing merchantId in query");
      return NextResponse.redirect(
        new URL("/profile?error=missing_id", detectedOrigin)
      );
    }

    /**
     * 3. GENERATE STATELESS JWT
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
     * 4. RESPONSE & COOKIE SETTING
     * 🚀 Uses 'detectedOrigin' to build the absolute redirect path.
     */
    const dashboardUrl = new URL("/dashboard", detectedOrigin);
    const response = NextResponse.redirect(dashboardUrl);

    // Bypasses the Ngrok warning page that breaks redirects in mobile WebViews.
    response.headers.set("ngrok-skip-browser-warning", "true");

    response.cookies.set("auth_token", token, {
      path: "/",
      httpOnly: true,
      secure: true, // Required for HTTPS (Ngrok & Telegram Mini Apps)
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 Days
    });

    console.log(
      `✅ [Auth] Session established. Target Origin: ${detectedOrigin}`
    );
    return response;
  } catch (error) {
    console.error(
      "❌ [Auth Callback Crash]:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.redirect(
      new URL("/profile?error=server_error", detectedOrigin)
    );
  }
}
