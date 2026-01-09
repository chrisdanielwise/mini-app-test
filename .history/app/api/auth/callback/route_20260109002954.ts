import { NextResponse } from "next/server";
import * as jose from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

export async function GET(request: Request) {
  try {
    // 🏁 Extract 'origin' to ensure we stay on the Ngrok tunnel
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

    // 🚀 REDIRECT FIX: Force the absolute Ngrok URL
    const dashboardUrl = new URL("/dashboard", origin);
    const response = NextResponse.redirect(dashboardUrl);
    
    response.cookies.set("auth_token", token, {
      path: "/", 
      httpOnly: true,
      secure: true, // Must be true for Ngrok HTTPS
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    const { origin } = new URL(request.url);
    return NextResponse.redirect(new URL("/profile?error=server_error", origin));
  }
}