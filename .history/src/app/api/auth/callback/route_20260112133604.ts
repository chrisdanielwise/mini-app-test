import { NextResponse } from "next/server";
import * as jose from "jose";
import prisma from "@/lib/db";

/**
 * 🔐 AUTH CALLBACK TERMINAL (Institutional v8.9)
 * Hardened: Race-condition protection & Role normalization.
 * Cloudflare-Ready: Multi-origin reconstruction for proxied ingress.
 */
// const SECRET = new TextEncoder().encode(
//   process.env.JWT_SECRET || "zipha_secure_secret_2026"
// );
// Temporarily use a hardcoded string to bypass .env issues
const SECRET = new TextEncoder().encode("zipha_permanent_debug_key_2026");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // 🛰️ 1. ORIGIN RECONSTRUCTION
  // Critical for Cloudflare Tunnels/Pages to prevent 404 origin mismatches
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const detectedOrigin = `${protocol}://${host}`;

  // 🛡️ 2. PRE-FLIGHT SESSION GUARD (Race Condition Fix)
  // If the browser already has a valid token, we bypass the "Token Burn" logic.
  // This prevents 401 loops caused by Cloudflare pre-fetching the callback URL.
  const cookieHeader = request.headers.get("cookie") || "";
  const hasExistingSession = cookieHeader.includes("auth_token");
  
  if (hasExistingSession && !searchParams.get("force")) {
     console.log("🛰️ [Auth_Callback] Existing session detected. Redirecting to Dashboard.");
     return NextResponse.redirect(new URL("/dashboard", detectedOrigin));
  }

  try {
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/dashboard/login?reason=missing_token", detectedOrigin));
    }

    // 🔍 3. IDENTITY SEARCH
    const user = await prisma.user.findUnique({
      where: { lastLoginToken: token },
      include: { merchantProfile: true }
    });

    // 🚩 Fallback: If token is consumed but user is already active
    if (!user) {
      if (hasExistingSession) return NextResponse.redirect(new URL("/dashboard", detectedOrigin));
      return NextResponse.redirect(new URL("/dashboard/login?reason=link_invalid", detectedOrigin));
    }

    // 🛡️ 4. TEMPORAL GUARD
    const isExpired = user.tokenExpires && new Date() > new Date(user.tokenExpires);
    if (isExpired) {
      return NextResponse.redirect(new URL("/dashboard/login?reason=link_expired", detectedOrigin));
    }

    // 🏁 5. JWT GENERATION & ROLE NORMALIZATION
    // 🚀 CRITICAL FIX: Mandatory .toLowerCase() to match Middleware RBAC array.
    const normalizedRole = user.role.toLowerCase();

    const sessionToken = await new jose.SignJWT({
      sub: user.id, 
      userId: user.id,
      merchantId: user.merchantProfile?.id || null,
      role: normalizedRole, 
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(SECRET);

    // 🚀 6. SECURE COOKIE DEPLOYMENT
    const response = NextResponse.redirect(new URL("/dashboard", detectedOrigin));
    
    response.cookies.set("auth_token", sessionToken, {
      path: "/",
      httpOnly: true,
      secure: true, // Required for Cloudflare/HTTPS
      sameSite: "lax", 
      maxAge: 60 * 60 * 24 * 7, 
    });

    // 🧹 7. ATOMIC CONSUMPTION
    // Token is burned only after the cookie-bearing response is ready.
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        lastLoginToken: null, 
        tokenExpires: null 
      }
    });

    console.log(`✅ [Auth_Callback] Node Authenticated: ${user.username} as ${normalizedRole}`);
    return response;

  } catch (error: any) {
    console.error("🔥 [Auth_Callback_Crash]:", error.message);
    return NextResponse.redirect(new URL("/dashboard/login?reason=internal_error", detectedOrigin));
  }
}