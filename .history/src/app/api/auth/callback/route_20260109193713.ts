import { NextResponse } from "next/server";
import * as jose from "jose";

// 🔐 Identity Secret: Must match your middleware configuration
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

/**
 * 🔑 AUTH CALLBACK BRIDGE
 * Tier 2 Handshake: Converts verified identity params into a secure session.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  /**
   * 🏁 1. DYNAMIC ORIGIN DETECTION
   * We reconstruct the origin from headers to ensure redirects stay on the 
   * active tunnel (Ngrok) rather than defaulting to localhost:3000.
   */
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const detectedOrigin = `${protocol}://${host}`;

  try {
    const merchantId = searchParams.get("merchantId");
    const telegramId = searchParams.get("telegramId");

    // 🛡️ 2. IDENTITY VALIDATION
    if (!merchantId) {
      console.error("❌ [Auth Callback] Protocol Violation: Missing merchantId");
      return NextResponse.redirect(
        new URL("/dashboard/login?error=invalid_handshake", detectedOrigin)
      );
    }

    /**
     * 🏁 3. GENERATE STATELESS JWT
     * We encode the Merchant UUID. The middleware will use this to 
     * verify access to the /(staff) route group.
     */
    const token = await new jose.SignJWT({
      merchantId,
      telegramId: telegramId?.toString(),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d") // Session lasts 1 week
      .sign(SECRET);

    /**
     * 🏁 4. RESPONSE & COOKIE INJECTION
     */
    const dashboardUrl = new URL("/dashboard", detectedOrigin);
    const response = NextResponse.redirect(dashboardUrl);

    // 🚀 NGROK BYPASS: Prevents the "You are about to visit..." warning page
    response.headers.set("ngrok-skip-browser-warning", "true");

    response.cookies.set("auth_token", token, {
      path: "/",
      httpOnly: true, // Prevents XSS access to the session
      secure: true,   // Required for Telegram Mini App HTTPS env
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // Sync with JWT expiry
    });

    console.log(`✅ [Auth] Session Established. Origin: ${detectedOrigin}`);
    return response;

  } catch (error) {
    console.error("🔥 [Auth Callback] Crash:", error);
    return NextResponse.redirect(
      new URL("/dashboard/login?error=internal_failure", detectedOrigin)
    );
  }
}