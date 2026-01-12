import { NextResponse } from "next/server";
import * as jose from "jose";
import prisma from "@/lib/db";

/**
 * 🔐 AUTH CALLBACK TERMINAL (v8.5)
 * Hardened: Force-normalization of roles to terminate casing-based redirect loops.
 * Scalability: Deferred token consumption and multi-origin reconstruction.
 */
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // 🛰️ 1. ORIGIN RECONSTRUCTION
  // Ensures compatibility with Ngrok tunnels and Cloudflare Proxies
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const detectedOrigin = `${protocol}://${host}`;

  // 🛡️ 0. PRE-FLIGHT SESSION CHECK
  // Prevent "Token Burning" if the user clicks the link but already has a valid session.
  const cookieHeader = request.headers.get("cookie") || "";
  const hasExistingSession = cookieHeader.includes("auth_token");
  
  if (hasExistingSession && !searchParams.get("force")) {
     return NextResponse.redirect(new URL("/dashboard", detectedOrigin));
  }

  try {
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/dashboard/login?reason=missing_token", detectedOrigin));
    }

    // 🔍 2. IDENTITY SEARCH & CLUSTER VALIDATION
    const user = await prisma.user.findUnique({
      where: { lastLoginToken: token },
      include: { merchantProfile: true }
    });

    // 🚩 Fallback: If token is consumed but user is active, allow ingress
    if (!user) {
      if (hasExistingSession) return NextResponse.redirect(new URL("/dashboard", detectedOrigin));
      return NextResponse.redirect(new URL("/dashboard/login?reason=link_invalid", detectedOrigin));
    }

    // 🛡️ 3. TEMPORAL GUARD (5-minute window)
    const isExpired = user.tokenExpires && new Date() > new Date(user.tokenExpires);
    if (isExpired) {
      return NextResponse.redirect(new URL("/dashboard/login?reason=link_expired", detectedOrigin));
    }

    // 🏁 4. JWT GENERATION & ROLE NORMALIZATION
    // 🚀 CRITICAL FIX: .toLowerCase() on the role ensures the Middleware 
    // RBAC array check (which is lowercase) does not fail and trigger a reload loop.
    const sessionToken = await new jose.SignJWT({
      sub: user.id, 
      userId: user.id,
      merchantId: user.merchantProfile?.id || null,
      role: user.role.toLowerCase(), // 🛡️ Normalization for Middleware parity
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(SECRET);

    // 🚀 5. RESPONSE CONSTRUCTION
    const response = NextResponse.redirect(new URL("/dashboard", detectedOrigin));
    
    // Ngrok safety header
    response.headers.set("ngrok-skip-browser-warning", "true");

    // Secure Cookie Deployment
    response.cookies.set("auth_token", sessionToken, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",   
      sameSite: "lax", 
      maxAge: 60 * 60 * 24 * 7, // 7 Day TTL
    });

    // 🧹 6. ATOMIC CONSUMPTION
    // Burn the one-time token immediately after successful JWT issuance.
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        lastLoginToken: null, 
        tokenExpires: null 
      }
    });

    return response;

  } catch (error: any) {
    console.error("🔥 [Auth_Callback_Crash]:", error.message);
    return NextResponse.redirect(new URL("/dashboard/login?reason=internal_error", detectedOrigin));
  }
}