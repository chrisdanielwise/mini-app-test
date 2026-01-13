import { NextResponse } from "next/server";
import * as jose from "jose";
import prisma from "@/lib/db";
import { JWT_CONFIG, getSecurityContext } from "@/lib/auth/config"; 

/**
 * 🛰️ AUTH CALLBACK TERMINAL (Institutional v12.10.0)
 * Architecture: Deep-Link to Session Bridge.
 * Hardened: Environment-aware CHIPS Partitioning & Atomic Consumption.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // 1. DYNAMIC ORIGIN RESOLUTION
  const host = request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const detectedOrigin = `${protocol}://${host}`;

  // 🛡️ 2. PRE-FLIGHT SESSION GUARD
  // If they already have a valid cookie, bypass the token exchange and go to Dashboard.
  const cookieHeader = request.headers.get("cookie") || "";
  const hasExistingSession = cookieHeader.includes(JWT_CONFIG.cookieName);
  
  if (hasExistingSession && !searchParams.get("force")) {
     return NextResponse.redirect(new URL("/dashboard", detectedOrigin));
  }

  try {
    const token = searchParams.get("token");
    if (!token) {
      return NextResponse.redirect(new URL("/dashboard/login?reason=missing_token", detectedOrigin));
    }

    // 🔍 3. IDENTITY SEARCH & LOCK
    const user = await prisma.user.findUnique({
      where: { lastLoginToken: token },
      include: { merchantProfile: true }
    });

    if (!user) {
      if (hasExistingSession) return NextResponse.redirect(new URL("/dashboard", detectedOrigin));
      return NextResponse.redirect(new URL("/dashboard/login?reason=link_invalid", detectedOrigin));
    }

    // 🛡️ 4. TEMPORAL GUARD (Check Expiry)
    if (user.tokenExpires && new Date() > new Date(user.tokenExpires)) {
      return NextResponse.json({ error: "link_expired" }, { status: 401 });
    }

    // 🏁 5. ATOMIC CONSUMPTION
    // Burn the one-time token immediately to prevent replay attacks.
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginToken: null, tokenExpires: null }
    });

    // 🔐 6. JWT GENERATION
    const normalizedRole = user.role.toLowerCase();
    const isStaff = JWT_CONFIG.staffRoles.includes(normalizedRole);

    const sessionToken = await new jose.SignJWT({
      userId: user.id,
      merchantId: user.merchantProfile?.id || null,
      role: normalizedRole,
      isStaff: isStaff, // 🚀 Essential for Proxy/Middleware speed
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(JWT_CONFIG.expiresIn)
      .sign(JWT_CONFIG.secret);

    // 🚀 7. SECURE COOKIE RESPONSE
    const response = NextResponse.redirect(new URL("/dashboard", detectedOrigin));
    
    // Resolve security flags (Secure, SameSite, Partitioned) using central utility
    const security = getSecurityContext(host, protocol);

    response.cookies.set(JWT_CONFIG.cookieName, sessionToken, {
      ...JWT_CONFIG.cookieOptions,
      secure: security.secure,
      sameSite: security.sameSite,
      // @ts-ignore - Required for 2026 CHIPS / Iframe session persistence
      partitioned: security.partitioned, 
    });

    // Bypasses Cloudflare/Ngrok browser warning pages
    response.headers.set("ngrok-skip-browser-warning", "true");

    console.log(`✅ [Auth_Callback] Token consumed for user: ${user.id}`);
    return response;

  } catch (error: any) {
    console.error("🔥 [Auth_Callback_Crash]:", error.message);
    return NextResponse.redirect(new URL("/dashboard/login?reason=internal_error", detectedOrigin));
  }
}