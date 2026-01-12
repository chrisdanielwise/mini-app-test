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

  try {
    const token = searchParams.get("token");

    // 🛡️ 1. PROTOCOL CHECK
    if (!token) {
      console.error("❌ [Auth_Callback] Missing Token");
      return NextResponse.redirect(new URL("/dashboard/login?reason=missing_token", detectedOrigin));
    }

    // 🔍 2. UNIVERSAL IDENTITY HANDSHAKE
    // We look up the user by the login token committed in the Bot Start Handler
    const user = await prisma.user.findUnique({
      where: { lastLoginToken: token },
      include: { merchantProfile: true }
    });

    if (!user) {
      console.error("❌ [Auth_Callback] User node not found or token already consumed");
      return NextResponse.redirect(new URL("/dashboard/login?reason=link_invalid", detectedOrigin));
    }

    // 🛡️ 3. TEMPORAL VERIFICATION
    const isExpired = user.tokenExpires && new Date() > new Date(user.tokenExpires);

    if (isExpired) {
      console.error("❌ [Auth_Callback] Token Expired");
      return NextResponse.redirect(new URL("/dashboard/login?reason=link_expired", detectedOrigin));
    }

    // 📊 4. ROLE-BASED STEERING
    const isStaff = ["super_admin", "platform_manager", "platform_support"].includes(user.role);
    const merchantId = user.merchantProfile?.id;

    console.log("-----------------------------------------");
    console.log("🔐 [AUTH_HANDSHAKE_SUCCESS]");
    console.log("Identity ID:", user.id);
    console.log("Role Cluster:", user.role);
    console.log("Merchant Link:", merchantId || "NONE (PLATFORM_STAFF)");
    console.log("-----------------------------------------");

    /**
     * 🏁 5. GENERATE JWT
     * We encode the core user UUID and the merchant link (if any).
     */
    const sessionToken = await new jose.SignJWT({
      sub: user.id, 
      merchantId: merchantId || null,
      role: user.role.toLowerCase(),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(SECRET);

    // 🚀 6. INTELLIGENT REDIRECT
    // If staff, go to dashboard home. If merchant, go to their cluster.
    // If the dashboards are unified, /dashboard handles the role internally.
    const redirectPath = "/dashboard";
    const response = NextResponse.redirect(new URL(redirectPath, detectedOrigin));
    
    // NGrok/Tunnel support
    response.headers.set("ngrok-skip-browser-warning", "true");

    response.cookies.set("auth_token", sessionToken, {
      path: "/",
      httpOnly: true,
      secure: true,   
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, 
    });

    // 🧹 7. CONSUME TOKEN
    // Wipe the login token so the link cannot be reused (security best practice)
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