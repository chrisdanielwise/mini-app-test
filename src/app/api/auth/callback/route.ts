import { NextResponse } from "next/server";
import * as jose from "jose";
import prisma from "@/lib/db";
import { JWT_CONFIG } from "@/lib/auth/config"; // 🛡️ Source of Truth for Secret

/**
 * 🛰️ AUTH CALLBACK TERMINAL (Institutional v9.2.2)
 * Hardened: Uses Universal JWT_CONFIG to prevent decryption mismatches.
 * Cloudflare-Ready: Multi-origin reconstruction & cookie-first guard.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // 1. ORIGIN RECONSTRUCTION
  // Ensures redirects stay within the Cloudflare Tunnel origin
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const detectedOrigin = `${protocol}://${host}`;

  // 🛡️ 2. PRE-FLIGHT SESSION GUARD
  // Prevents "Token Burning" loops if the browser already has an active session.
  const cookieHeader = request.headers.get("cookie") || "";
  const hasExistingSession = cookieHeader.includes(JWT_CONFIG.cookieName);
  
  if (hasExistingSession && !searchParams.get("force")) {
     console.log("🛰️ [Auth_Callback] Active session detected. Bypassing token burn.");
     return NextResponse.redirect(new URL("/dashboard", detectedOrigin));
  }

  try {
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/dashboard/login?reason=missing_token", detectedOrigin));
    }

    // 🔍 3. IDENTITY SEARCH
    // Matches the role-agnostic user lookup from the Bot Start Handler.
    const user = await prisma.user.findUnique({
      where: { lastLoginToken: token },
      include: { merchantProfile: true }
    });

    if (!user) {
      // If token is missing but user is already logged in, let them through.
      if (hasExistingSession) return NextResponse.redirect(new URL("/dashboard", detectedOrigin));
      return NextResponse.redirect(new URL("/dashboard/login?reason=link_invalid", detectedOrigin));
    }

    // 🛡️ 4. TEMPORAL GUARD
    const isExpired = user.tokenExpires && new Date() > new Date(user.tokenExpires);
    if (isExpired) {
      return NextResponse.redirect(new URL("/dashboard/login?reason=link_expired", detectedOrigin));
    }

    // 🏁 5. JWT GENERATION & ROLE NORMALIZATION
    // Forces lowercase roles to match Middleware RBAC requirements.
    const normalizedRole = user.role.toLowerCase();

    const sessionToken = await new jose.SignJWT({
      sub: user.id, 
      userId: user.id,
      merchantId: user.merchantProfile?.id || null,
      role: normalizedRole, 
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(JWT_CONFIG.expiresIn)
      .sign(JWT_CONFIG.secret); // 🔐 Signed with Universal Secret

    // 🚀 6. SECURE COOKIE DEPLOYMENT
    const response = NextResponse.redirect(new URL("/dashboard", detectedOrigin));
    
    response.cookies.set(JWT_CONFIG.cookieName, sessionToken, {
      path: "/",
      httpOnly: true,
      secure: true,   // Mandatory for Cloudflare HTTPS
      sameSite: "lax", // Mandatory for Telegram Webview handshakes
      maxAge: 60 * 60 * 24 * 7, 
    });

    // Bypasses tunnel warning pages for mobile logic
    response.headers.set("ngrok-skip-browser-warning", "true");

    // 🧹 7. ATOMIC CONSUMPTION
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