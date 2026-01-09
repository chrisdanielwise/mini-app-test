import { NextResponse } from "next/server";
import * as jose from "jose";

// Ensure this matches the secret used in your middleware and getMerchantSession
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

/**
 * 🔑 AUTH CALLBACK BRIDGE
 * Converts a verified merchantId into a secure HttpOnly session cookie.
 * Fixed to prevent ERR_CONNECTION_REFUSED by using absolute URL origin.
 */
export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const merchantId = searchParams.get("merchantId");
    const telegramId = searchParams.get("telegramId");

    // 1. Critical Validation
    if (!merchantId) {
      console.error("❌ Auth Callback: merchantId is missing from query params");
      const errorUrl = new URL("/dashboard/login?error=missing_id", origin);
      return NextResponse.redirect(errorUrl);
    }

    /**
     * 2. GENERATE STATELESS JWT
     * Encodes the GreysuitFx UUID (merchantId) into the payload.
     */
    const token = await new jose.SignJWT({ 
      merchantId, 
      telegramId: telegramId?.toString() 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d') 
      .sign(SECRET);

    /**
     * 3. RESPONSE & COOKIE SETTING
     * 🏁 FIX: We use the 'origin' from the request URL to build the absolute
     * redirect path. This prevents the browser from defaulting to localhost.
     */
    const dashboardUrl = new URL("/dashboard", origin);
    const response = NextResponse.redirect(dashboardUrl);
    
    response.cookies.set("auth_token", token, {
      path: "/", 
      httpOnly: true,
      // Mini Apps require secure cookies in production/Telegram environment
      secure: true, 
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    console.log(`✅ [Auth] Session successfully established for Merchant: ${merchantId}`);
    return response;

  } catch (error) {
    const { origin } = new URL(request.url);
    console.error("❌ Auth Callback Crash:", error instanceof Error ? error.message : error);
    return NextResponse.redirect(new URL("/dashboard/login?error=handshake_failed", origin));
  }
}