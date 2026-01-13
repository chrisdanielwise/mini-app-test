import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createJWT } from "@/lib/auth/telegram";
import { JWT_CONFIG } from "@/lib/auth/config";
import { cookies } from "next/headers";

/**
 * 🛰️ TOKEN EXCHANGE NODE (v11.0.5)
 * Architecture: Relational Identity Resolution
 * Industry Standard: Implements CHIPS (Partitioned Cookies) for 2026 TMA.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = body.token;

    if (!token) {
      return NextResponse.json({ error: "link_invalid" }, { status: 400 });
    }

    // 1. IDENTITY RETRIEVAL (Relational Lookup)
    // In Schema v2, merchantId is derived from relations, not a flat field.
    const user = await prisma.user.findFirst({
      where: {
        lastLoginToken: token,
        tokenExpires: { gt: new Date() },
      },
      include: {
        merchantProfile: { select: { id: true } }, // Check if Owner
        teamMemberships: { take: 1, select: { merchantId: true } } // Check if Staff/Agent
      }
    });

    if (!user) {
      console.warn(`🔐 [Auth_Handshake] Invalid/Expired OTT: ${token.substring(0, 8)}`);
      return NextResponse.json({ error: "link_invalid" }, { status: 401 });
    }

    // 2. RESOLVE MERCHANT IDENTITY
    // Logic: Owner ID takes priority, followed by Staff/Team membership ID.
    const resolvedMerchantId = 
      user.merchantProfile?.id || 
      user.teamMemberships[0]?.merchantId || 
      null;

    // 3. SESSION GENERATION
    const jwt = await createJWT({
      userId: user.id,
      telegramId: user.telegramId.toString(),
      role: user.role,
      merchantId: resolvedMerchantId, // 🚀 Corrected: No longer using user.merchantId
    });

    // 4. ATOMIC CONSUMPTION & AUDIT
    // Removed 'lastLoginAt' to match your schema's current fields.
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginToken: null,
        tokenExpires: null,
        // lastLoginAt: new Date() // Add this to your schema if needed later
      },
    });

    // 5. PROTOCOL-AWARE COOKIE COMMITMENT
    const cookieStore = await cookies();
    
    const isProd = process.env.NODE_ENV === "production";
    const isTunnel = request.headers.get("x-forwarded-proto") === "https" || 
                     request.headers.get("host")?.includes("trycloudflare.com");

    const cookieOptions = {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7-Day Session Epoch
      ...(isProd || isTunnel ? {
        secure: true,
        sameSite: "none" as const,
        // @ts-ignore - Required for 2026 Chrome/Safari iframe persistence
        partitioned: true,
      } : {
        secure: false,
        sameSite: "lax" as const,
      })
    };

    cookieStore.set(JWT_CONFIG.cookieName, jwt, cookieOptions);

    console.log(`✅ [Auth_Sync] Node: ${user.id} | Merchant: ${resolvedMerchantId} | Tunnel: ${isTunnel}`);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("🔥 [Auth_Handshake_Critical]:", error.message);
    return NextResponse.json({ error: "identity_denied" }, { status: 500 });
  }
}