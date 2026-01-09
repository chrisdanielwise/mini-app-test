import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";

// Use a secret from env, fallback to default for local dev
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "zipha_secure_secret_2026");

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const merchantId = searchParams.get("merchantId");
    const telegramId = searchParams.get("telegramId");

    // 1. Validation check
    if (!merchantId) {
      console.error("Auth Callback: Missing merchantId");
      return NextResponse.redirect(new URL("/dashboard/login?error=invalid_params", request.url));
    }

    /**
     * 2. GENERATE STATELESS JWT
     * We encode the merchantId into the token. 
     * The Middleware can verify this signature without touching Neon DB.
     */
    const token = await new jose.SignJWT({ 
      merchantId, 
      telegramId: telegramId?.toString() 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d') // Valid for 1 week
      .sign(SECRET);

    // 3. SECURE COOKIE STORAGE
    // We use the response object to set the cookie to ensure it's attached 
    // to the redirect header properly in all environments.
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    
    response.cookies.set("auth_token", token, {
      path: "/", // Critical: Must be root for middleware to see it
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log(`[Auth Callback] Session issued for Merchant: ${merchantId}`);
    return response;

  } catch (error) {
    console.error("Auth Callback Error:", error);
    return NextResponse.redirect(new URL("/dashboard/login?error=server_error", request.url));
  }
}