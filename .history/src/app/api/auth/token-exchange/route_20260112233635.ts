import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createJWT } from "@/lib/auth/telegram";
import { JWT_CONFIG } from "@/lib/auth/config";
import { cookies } from "next/headers";

/**
 * 🛰️ TOKEN EXCHANGE NODE (v11.0.1)
 * Architecture: Protocol-Aware Identity Sync
 * Industry Standard: Implements CHIPS (Partitioned Cookies) for Telegram WebViews.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = body.token;

    if (!token) {
      return NextResponse.json({ error: "link_invalid" }, { status: 400 });
    }

    // 1. IDENTITY RETRIEVAL (One-Time Token Validation)
    const user = await prisma.user.findFirst({
      where: {
        lastLoginToken: token,
        tokenExpires: { gt: new Date() },
      },
    });

    if (!user) {
      console.warn(`🔐 [Auth_Handshake] Invalid/Expired OTT: ${token.substring(0, 8)}`);
      return NextResponse.json({ error: "link_invalid" }, { status: 401 });
    }

    // 2. SESSION GENERATION
    const jwt = await createJWT({
      userId: user.id,
      telegramId: user.telegramId.toString(),
      role: user.role,
      merchantId: user?.merchantId || null,
    });

    // 3. ATOMIC CONSUMPTION
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginToken: null,
        tokenExpires: null,
        lastLoginAt: new Date(),
      },
    });

    // 4. PROTOCOL-AWARE COOKIE COMMITMENT
    const cookieStore = await cookies();
    
    // 🛡️ PRODUCTION LOGIC: Detect if we are running over an SSL Tunnel
    const isProd = process.env.NODE_ENV === "production";
    const isTunnel = request.headers.get("x-forwarded-proto") === "https" || 
                     request.headers.get("host")?.includes("trycloudflare.com");

    /**
     * 🚀 THE INDUSTRY FIX FOR 401 LOOPS:
     * We use 'None' and 'Partitioned' for Tunnel/Production (Telegram Iframe).
     * We fallback to 'Lax' ONLY if on local non-secure dev to allow testing.
     */
    const cookieOptions = {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      // If we are on a tunnel or prod, we MUST use secure/none/partitioned
      ...(isProd || isTunnel ? {
        secure: true,
        sameSite: "none" as const,
        // @ts-ignore - CHIPS/Partitioned is essential for 2026 TMA
        partitioned: true,
      } : {
        secure: false,
        sameSite: "lax" as const,
      })
    };

    cookieStore.set(JWT_CONFIG.cookieName, jwt, cookieOptions);

    console.log(`✅ [Auth_Handshake] Identity Synchronized: ${user.id} (Secure: ${isProd || isTunnel})`);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("🔥 [Auth_Handshake_Critical]:", error.message);
    return NextResponse.json({ error: "identity_denied" }, { status: 500 });
  }
}