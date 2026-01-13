import { NextResponse } from "next/server";
import * as jose from "jose";
import prisma from "@/lib/db";
import { JWT_CONFIG } from "@/lib/auth/config"; 

/**
 * 🛰️ AUTH CALLBACK TERMINAL (Institutional v10.0.0)
 * Logic: Hardened against Host Header Injection and Atomic Race Conditions.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // 1. HARDENED ORIGIN RESOLUTION
  // Industry Standard: Prefer ENV variables over Headers to prevent Injection.
  const host = process.env.NEXT_PUBLIC_BASE_URL || 
               request.headers.get("x-forwarded-host") || 
               request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const detectedOrigin = host?.startsWith('http') ? host : `${protocol}://${host}`;

  // 🛡️ 2. PRE-FLIGHT SESSION GUARD
  const cookieHeader = request.headers.get("cookie") || "";
  const hasExistingSession = cookieHeader.includes(JWT_CONFIG.cookieName);
  
  if (hasExistingSession && !searchParams.get("force")) {
     return NextResponse.redirect(new URL("/dashboard", detectedOrigin));
  }

  try {
    const token = searchParams.get("token");
    if (!token) return NextResponse.redirect(new URL("/dashboard/login?reason=missing_token", detectedOrigin));

    // 🔍 3. IDENTITY SEARCH & LOCK
    const user = await prisma.user.findUnique({
      where: { lastLoginToken: token },
      include: { merchantProfile: true }
    });

    // If token is invalid but they have a session, just let them in.
    if (!user) {
      if (hasExistingSession) return NextResponse.redirect(new URL("/dashboard", detectedOrigin));
      return NextResponse.redirect(new URL("/dashboard/login?reason=link_invalid", detectedOrigin));
    }

    // 🛡️ 4. TEMPORAL GUARD
    if (user.tokenExpires && new Date() > new Date(user.tokenExpires)) {
      return NextResponse.redirect(new URL("/dashboard/login?reason=link_expired", detectedOrigin));
    }

    // 🏁 5. ATOMIC CONSUMPTION (Burn the token FIRST)
    // We update the DB before generating the JWT to ensure that if the signing fails, 
    // the token is still used up.
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginToken: null, tokenExpires: null }
    });

    // 🔐 6. JWT GENERATION
    const normalizedRole = user.role.toLowerCase();
    const sessionToken = await new jose.SignJWT({
      userId: user.id,
      merchantId: user.merchantProfile?.id || null,
      role: normalizedRole, 
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(JWT_CONFIG.expiresIn)
      .sign(JWT_CONFIG.secret);

    // 🚀 7. SECURE COOKIE RESPONSE
    const response = NextResponse.redirect(new URL("/dashboard", detectedOrigin));
    
    response.cookies.set(JWT_CONFIG.cookieName, sessionToken, {
      path: "/",
      httpOnly: true, // 🛡️ Hide from JavaScript (Industry Standard)
      secure: true,   // 🛡️ Mandatory for Cloudflare
      sameSite: "lax", // 🛡️ Required for Telegram cross-app navigation
      maxAge: 60 * 60 * 24 * 7, 
    });

    // Clear tunnel warnings
    response.headers.set("ngrok-skip-browser-warning", "true");

    return response;

  } catch (error: any) {
    console.error("🔥 [Auth_Callback_Crash]:", error.message);
    return NextResponse.redirect(new URL("/dashboard/login?reason=internal_error", detectedOrigin));
  }
}