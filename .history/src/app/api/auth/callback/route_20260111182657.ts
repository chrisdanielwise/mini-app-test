import { NextResponse } from "next/server";
import * as jose from "jose";
import prisma from "@/lib/db";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const detectedOrigin = `${protocol}://${host}`;

  // 🛡️ 0. PRE-FLIGHT CHECK
  // If the user already has a valid cookie, don't burn the token, just redirect.
  const existingToken = request.headers.get("cookie")?.includes("auth_token");
  if (existingToken && !searchParams.get("force")) {
     return NextResponse.redirect(new URL("/dashboard", detectedOrigin));
  }

  try {
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/dashboard/login?reason=missing_token", detectedOrigin));
    }

    // 🔍 2. SEARCH & VALIDATE
    const user = await prisma.user.findUnique({
      where: { lastLoginToken: token },
      include: { merchantProfile: true }
    });

    // 🚩 If no user found, check if they are ALREADY logged in before failing
    if (!user) {
      if (existingToken) return NextResponse.redirect(new URL("/dashboard", detectedOrigin));
      return NextResponse.redirect(new URL("/dashboard/login?reason=link_invalid", detectedOrigin));
    }

    // 🛡️ 3. EXPIRATION CHECK
    const isExpired = user.tokenExpires && new Date() > new Date(user.tokenExpires);
    if (isExpired) {
      return NextResponse.redirect(new URL("/dashboard/login?reason=link_expired", detectedOrigin));
    }

    // 🏁 4. GENERATE JWT
    const sessionToken = await new jose.SignJWT({
      sub: user.id, 
      merchantId: user.merchantProfile?.id || null,
      role: user.role.toLowerCase(),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(SECRET);

    // 🚀 5. RESPONSE CONSTRUCTION
    const response = NextResponse.redirect(new URL("/dashboard", detectedOrigin));
    
    // Safety for Tunnel/Dev environments
    response.headers.set("ngrok-skip-browser-warning", "true");

    response.cookies.set("auth_token", sessionToken, {
      path: "/",
      httpOnly: true,
      secure: true,   
      sameSite: "lax", // 'lax' is safer for redirects than 'strict'
      maxAge: 60 * 60 * 24 * 7, 
    });

    // 🧹 6. DEFERRED CONSUMPTION
    // We use a non-blocking update to clear the token
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginToken: null, tokenExpires: null }
    });

    return response;

  } catch (error: any) {
    console.error("🔥 [Auth_Callback_Crash]:", error.message);
    return NextResponse.redirect(new URL("/dashboard/login?reason=internal_error", detectedOrigin));
  }
}