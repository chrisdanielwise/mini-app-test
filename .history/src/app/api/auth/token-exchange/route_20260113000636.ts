import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createJWT } from "@/lib/auth/telegram";
import { JWT_CONFIG } from "@/lib/auth/config";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) return NextResponse.json({ error: "link_invalid" }, { status: 400 });

    // 1. IDENTITY RETRIEVAL (Full Relationship Ingress)
    const user = await prisma.user.findFirst({
      where: {
        lastLoginToken: token,
        tokenExpires: { gt: new Date() },
      },
      include: {
        merchantProfile: { select: { id: true } }, // Owner Check
        teamMemberships: { take: 1, select: { merchantId: true } } // Agent Check
      },
    });

    if (!user) return NextResponse.json({ error: "link_invalid" }, { status: 401 });

    // 🛡️ 2. STAFF & ROLE EVALUATION
    // Normalizing role for consistent RBAC checks
    const normalizedRole = user.role.toLowerCase();
    
    // Check for Platform-Level Staff (Admins/Support)
    const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(normalizedRole);

    // 🚀 3. MERCHANT ID RESOLUTION (Staff-Aware Logic)
    // - If they are a Merchant Owner: Use their Profile ID.
    // - If they are Merchant Staff (Agent): Use their Team Membership ID.
    // - If they are Platform Staff: Usually null (Global access), unless they are testing a specific node.
    const resolvedMerchantId = 
      user.merchantProfile?.id || 
      user.teamMemberships[0]?.merchantId || 
      null;

    // 🔐 4. SESSION GENERATION
    const jwt = await createJWT({
      userId: user.id,
      telegramId: user.telegramId.toString(),
      role: normalizedRole,
      merchantId: resolvedMerchantId,
      // We explicitly add isStaff to the payload for the Middleware/Proxy
      isStaff: isPlatformStaff 
    });

    // 5. ATOMIC CONSUMPTION
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginToken: null, tokenExpires: null }
    });

    // 6. SECURE COOKIE DEPLOYMENT (Protocol Aware)
    const cookieStore = await cookies();
    const isTunnel = request.headers.get("x-forwarded-proto") === "https" || 
                     request.headers.get("host")?.includes("trycloudflare.com");

    cookieStore.set(JWT_CONFIG.cookieName, jwt, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      ...(isTunnel || process.env.NODE_ENV === "production" ? {
        secure: true,
        sameSite: "none" as const,
        // @ts-ignore - CHIPS 2026 Partitioning
        partitioned: true,
      } : {
        secure: false,
        sameSite: "lax" as const,
      })
    });

    console.log(`✅ [Auth_Sync] ${user.id} | Role: ${normalizedRole} | Staff: ${isPlatformStaff}`);
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("🔥 [Auth_Handshake_Critical]:", error.message);
    return NextResponse.json({ error: "identity_denied" }, { status: 500 });
  }
}