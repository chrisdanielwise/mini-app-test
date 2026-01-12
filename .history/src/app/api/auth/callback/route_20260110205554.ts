import { NextResponse } from "next/server";
import * as jose from "jose";

// 🔐 Identity Secret: Must match your middleware configuration
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

/**
 * 🔑 AUTH CALLBACK BRIDGE (Fixed)
 * Tier 2 Handshake: Generates a JWT compatible with Middleware Role-Checks.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // 🏁 1. DYNAMIC ORIGIN DETECTION (Critical for Ngrok)
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const detectedOrigin = `${protocol}://${host}`;

  try {
    const merchantId = searchParams.get("merchantId");
    const userId = searchParams.get("userId"); // 👈 Changed from telegramId to match 'sub'

    // 🛡️ 2. IDENTITY VALIDATION
    if (!merchantId || !userId) {
      console.error("❌ [Auth Callback] Protocol Violation: Missing Credentials");
      return NextResponse.redirect(
        new URL("/dashboard/login?reason=invalid_handshake", detectedOrigin)
      );
    }

    /**
     * 🏁 3. GENERATE INSTITUTIONAL JWT
     * Fixed: Added 'role' and 'sub' claims required by Middleware/Session utilities.
     */
    const token = await new jose.SignJWT({
      sub: userId,         // 🔑 Maps to user.id in prisma
      merchantId: merchantId,
      role: "merchant",    // 🛡️ CRITICAL: Allows middleware to grant access
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(SECRET);

    /**
     * 🏁 4. RESPONSE & COOKIE INJECTION
     */
    const dashboardUrl = new URL("/dashboard", detectedOrigin);
    const response = NextResponse.redirect(dashboardUrl);

    // 🚀 NGROK BYPASS: Prevents the landing warning page
    response.headers.set("ngrok-skip-browser-warning", "true");

    // ✅ THE FIX: Setting the cookie directly on the redirect response
    response.cookies.set("auth_token", token, {
      path: "/",
      httpOnly: true,
      secure: true,   
      sameSite: "lax", // 'lax' is best for redirects from external apps like Telegram
      maxAge: 60 * 60 * 24 * 7, 
    });

    console.log(`✅ [Auth] Session Established for Merchant: ${merchantId}`);
    return response;

  } catch (error) {
    console.error("🔥 [Auth Callback] Handshake Crash:", error);
    return NextResponse.redirect(
      new URL("/dashboard/login?reason=server_error", detectedOrigin)
    );
  }
}