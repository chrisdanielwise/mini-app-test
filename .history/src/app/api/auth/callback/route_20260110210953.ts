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
    const merchantId = searchParams.get("merchantId");
    const token = searchParams.get("token");

    // 🛡️ 1. PROTOCOL CHECK
    if (!merchantId || !token) {
      console.error("❌ [Auth_Callback] Missing params:", { merchantId, token });
      return NextResponse.redirect(new URL("/dashboard/login?reason=missing_params", detectedOrigin));
    }

    // 🔍 2. DATABASE HANDSHAKE
    // We fetch the Merchant and include the Admin User to check their Global Role
    const merchant = await prisma.merchantProfile.findUnique({
      where: { id: merchantId },
      include: { adminUser: true }
    });

    if (!merchant) {
      console.error("❌ [Auth_Callback] Merchant not found:", merchantId);
      return NextResponse.redirect(new URL("/dashboard/login?reason=node_not_found", detectedOrigin));
    }

    // 🛡️ 3. SECURITY VERIFICATION
    const isTokenValid = merchant.lastLoginToken === token;
    const isExpired = merchant.tokenExpires && new Date() > new Date(merchant.tokenExpires);

    if (!isTokenValid || isExpired) {
      console.error("❌ [Auth_Callback] Token Invalid/Expired");
      return NextResponse.redirect(new URL("/dashboard/login?reason=link_invalid", detectedOrigin));
    }

    // 📊 4. ROLE DIAGNOSTICS
    // Logging this so we can see exactly what Prisma sees
    console.log("-----------------------------------------");
    console.log("🔐 [AUTH_DIAGNOSTICS]");
    console.log("User ID (UUID):", merchant.adminUser.id);
    console.log("User Role (DB):", merchant.adminUser.role);
    console.log("Merchant ID:", merchant.id);
    console.log("-----------------------------------------");

    /**
     * 🏁 5. GENERATE JWT
     * We use the UUID (merchant.adminUser.id) for 'sub' so getMerchantSession works.
     */
    const sessionToken = await new jose.SignJWT({
      sub: merchant.adminUser.id, 
      merchantId: merchant.id,
      role: merchant.adminUser.role.toLowerCase(), // Ensuring "merchant" format
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(SECRET);

    // 🚀 6. SUCCESS REDIRECT
    const response = NextResponse.redirect(new URL("/dashboard", detectedOrigin));
    response.headers.set("ngrok-skip-browser-warning", "true");

    response.cookies.set("auth_token", sessionToken, {
      path: "/",
      httpOnly: true,
      secure: true,   
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, 
    });

    // Cleanup token after use
    await prisma.merchantProfile.update({
      where: { id: merchantId },
      data: { lastLoginToken: null, tokenExpires: null }
    });

    return response;

  } catch (error: any) {
    console.error("🔥 [Auth_Callback_Crash]:", error.message);
    return NextResponse.redirect(new URL("/dashboard/login?reason=internal_error", detectedOrigin));
  }
}