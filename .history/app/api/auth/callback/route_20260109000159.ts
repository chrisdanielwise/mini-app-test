import { NextResponse } from "next/server";
import * as jose from "jose";

// Ensure this matches the secret used in your middleware and getMerchantSession
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

/**
 * 🔑 AUTH CALLBACK BRIDGE
 * This route converts a verified merchantId into a secure HttpOnly cookie.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const merchantId = searchParams.get("merchantId");
    const telegramId = searchParams.get("telegramId");

    // 1. Critical Validation
    if (!merchantId) {
      console.error("❌ Auth Callback: merchantId is missing from query params");
      return NextResponse.redirect(new URL("/dashboard/login?error=missing_id", request.url));
    }

    /**
     * 2. GENERATE STATELESS JWT
     * We store the merchantId (UUID) and telegramId in the payload.
     * This allows the Dashboard to fetch GreysuitFx data without re-validating Telegram.
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
     * We use NextResponse.redirect to ensure the browser moves to the /dashboard
     * immediately after the cookie is set.
     */
    const dashboardUrl = new URL("/dashboard", request.url);
    const response = NextResponse.redirect(dashboardUrl);
    
    response.cookies.set("auth_token", token, {
      path: "/", 
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    console.log(`✅ [Auth] Session successfully established for Merchant: ${merchantId}`);
    return response;

  } catch (error) {
    console.error("❌ Auth Callback Crash:", error instanceof Error ? error.message : error);
    return NextResponse.redirect(new URL("/dashboard/login?error=handshake_failed", request.url));
  }
}