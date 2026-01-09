import { NextResponse } from "next/server";
import * as jose from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // 🏁 THE NGROK ORIGIN FIX
  // We check the "x-forwarded-host" header which Ngrok sends. 
  // If it exists, we use it; otherwise, we fallback to the request origin.
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const detectedOrigin = `${protocol}://${host}`;

  try {
    const merchantId = searchParams.get("merchantId");
    const telegramId = searchParams.get("telegramId");

    if (!merchantId) {
      return NextResponse.redirect(new URL("/profile?error=missing_id", detectedOrigin));
    }

    const token = await new jose.SignJWT({
      merchantId,
      telegramId: telegramId?.toString(),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(SECRET);

    // 🚀 REDIRECT: Use the manually reconstructed origin
    const dashboardUrl = new URL("/dashboard", detectedOrigin);
    const response = NextResponse.redirect(dashboardUrl);

    // Bypasses the Ngrok warning page that breaks mobile redirects
    response.headers.set("ngrok-skip-browser-warning", "true");

    response.cookies.set("auth_token", token, {
      path: "/",
      httpOnly: true,
      secure: true, 
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log(`✅ [Auth] Session established. Target Origin: ${detectedOrigin}`);
    return response;

  } catch (error) {
    console.error("❌ [Auth Callback Crash]:", error);
    return NextResponse.redirect(new URL("/profile?error=server_error", detectedOrigin));
  }
}