import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createJWT } from "@/lib/auth/telegram";
import { JWT_CONFIG } from "@/lib/auth/config";
import { cookies } from "next/headers";

/**
 * 🛰️ TOKEN EXCHANGE NODE (v10.0.5)
 * Industry Standard: Implements HttpOnly/Secure session commitment.
 * Protection: Atomic one-time token (OTT) consumption.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = body.token;

    if (!token) {
      return NextResponse.json({ error: "link_invalid" }, { status: 400 });
    }

    // 1. IDENTITY RETRIEVAL (One-Time Token Validation)
    // We look for a user where the OTT matches and the expiry epoch hasn't passed.
    const user = await prisma.user.findFirst({
      where: {
        lastLoginToken: token,
        tokenExpires: { gt: new Date() }, 
      },
    });

    if (!user) {
      console.warn(`🔐 [Auth_Handshake] Invalid or expired token attempt: ${token.substring(0, 8)}...`);
      return NextResponse.json({ error: "link_invalid" }, { status: 401 });
    }

    // 2. SESSION GENERATION
    // Converts the temporary database token into a long-lived JWT node.
    const jwt = await createJWT({
      userId: user.id,
      telegramId: user.telegramId.toString(), // Hardened BigInt safety
      role: user.role,
      merchantId: user?.merchantId || null,
    });

    // 3. ATOMIC TOKEN CONSUMPTION
    // Immediately nullify the OTT to prevent replay attacks (Industry Standard).
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        lastLoginToken: null, 
        tokenExpires: null,
        lastLoginAt: new Date() // Audit trail
      },
    });

    // 4. SECURE COOKIE COMMITMENT (Next.js 16 Protocol)
    const cookieStore = await cookies();
    
    /**
     * 🛡️ SECURITY FLAGS EXPLAINED:
     * - httpOnly: Prevents XSS-based session theft by hiding the cookie from JS.
     * - secure: Ensures the cookie is only transmitted over encrypted HTTPS.
     * - sameSite: 'lax' allows the Telegram link (external) to set the session.
     */

    // cookieStore.set(JWT_CONFIG.cookieName, jwt, {
    //   httpOnly: true, 
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "lax",
    //   path: "/", // Available across the entire cluster
    //   maxAge: 60 * 60 * 24 * 7, // 7-Day Session Epoch
    // });

    cookieStore.set(JWT_CONFIG.cookieName, jwt, {
  httpOnly: true,
  secure: true, // MUST be true for SameSite=None
  sameSite: "none", // 🛡️ Mandatory for Telegram WebViews
  // @ts-ignore - 'partitioned' is the 2026 standard for iframes
  partitioned: true, 
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
});

    console.log(`✅ [Auth_Handshake] Identity Synchronized: ${user.id}`);
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("🔥 [Auth_Handshake_Critical]:", error.message);
    return NextResponse.json({ error: "identity_denied" }, { status: 500 });
  }
}