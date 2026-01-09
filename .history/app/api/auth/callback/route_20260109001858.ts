import { NextResponse } from "next/server";
import * as jose from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const merchantId = searchParams.get("merchantId");
    const telegramId = searchParams.get("telegramId");

    if (!merchantId) {
      return NextResponse.redirect(new URL("/profile?error=missing_id", origin));
    }

    const token = await new jose.SignJWT({ 
      merchantId, 
      telegramId: telegramId?.toString() 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d') 
      .sign(SECRET);

    /**
     * 🏁 THE NGROK FIX:
     * Using 'origin' ensures the redirect stays on your Ngrok tunnel.
     */
    const dashboardUrl = new URL("/dashboard", origin);
    const response = NextResponse.redirect(dashboardUrl);
    
    response.cookies.set("auth_token", token, {
      path: "/", 
      httpOnly: true,
      secure: true, // Required for Ngrok/Telegram HTTPS
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch (error) {
    const { origin } = new URL(request.url);
    console.error("❌ Callback Crash:", error);
    return NextResponse.redirect(new URL("/profile?error=server_error", origin));
  }
}