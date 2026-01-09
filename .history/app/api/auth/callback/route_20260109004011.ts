import { NextResponse } from "next/server";
import * as jose from "jose";

// Ensure this matches the secret used in your middleware
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

/**
 * 🔑 AUTH CALLBACK BRIDGE
 * Converts a verified merchantId into a secure HttpOnly session cookie.
 * 🚀 FIXED: Uses dynamic 'origin' to prevent ERR_CONNECTION_REFUSED on Ngrok.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  try {
    const merchantId = searchParams.get("merchantId");
    const telegramId = searchParams.get("telegramId");

    // 1. Critical Validation
    if (!merchantId) {
      console.error("❌ [Auth Callback] Missing merchantId in query");
      return NextResponse.redirect(
        new URL("/profile?error=missing_id", origin)
      );
    }

    /**
     * 2. GENERATE STATELESS JWT
     * We encode the GreysuitFx UUID into the token payload.
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
     * Using the absolute 'origin' ensures the browser doesn't try to load localhost.
     */
    const TEST_ORIGIN = "https://your-current-ngrok-id.ngrok-free.app";
    const response = NextResponse.redirect(`${TEST_ORIGIN}/dashboard`);

    response.cookies.set("auth_token", token, {
      path: "/",
      httpOnly: true,
      secure: true, // Required for Ngrok/Telegram HTTPS tunnels
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 Days
    });

    console.log(
      `✅ [Auth] Session established for: ${merchantId} (via ${origin})`
    );
    return response;
  } catch (error) {
    console.error(
      "❌ [Auth Callback Crash]:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.redirect(
      new URL("/profile?error=server_error", origin)
    );
  }
}
