import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { AuthService } from "@/lib/services/auth.service";
import { JWT_CONFIG } from "@/lib/auth/config";
import { cookies } from "next/headers";

/**
 * 🛰️ TOKEN EXCHANGE HANDSHAKE (Institutional v13.0.8)
 * Logic: One-Time Token (OTT) Conversion to Stateless Hybrid Session.
 * Fixed: Migrated from User.lastLoginToken to MagicToken Table.
 */
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "token_required" }, { status: 400 });
    }

    // 🕵️ 1. IDENTITY RETRIEVAL (Institutional Table Logic)
    // We look up the token in our dedicated MagicToken table.
    const magicToken = await prisma.magicToken.findUnique({
      where: { token },
      include: {
        user: {
          include: {
            merchantProfile: { select: { id: true } },
            teamMemberships: { take: 1, select: { merchantId: true } }
          }
        }
      },
    });

    // 🛡️ 2. VALIDATION GATE
    if (!magicToken || magicToken.used || new Date() > magicToken.expiresAt) {
      return NextResponse.json({ error: "link_invalid_or_expired" }, { status: 401 });
    }

    const user = magicToken.user;
    const normalizedRole = user.role.toLowerCase();
    const isPlatformStaff = JWT_CONFIG.staffRoles.includes(normalizedRole);

    // 🚀 3. MERCHANT ID RESOLUTION
    const resolvedMerchantId = 
      user.merchantProfile?.id || 
      user.teamMemberships[0]?.merchantId || 
      null;

    // 🔐 4. SESSION GENERATION
    // Centralized via AuthService to ensure identity manifest consistency.
    const sessionToken = await createSession(user);

    // 🏁 5. ATOMIC CONSUMPTION (The "Burn")
    await prisma.magicToken.update({
      where: { id: magicToken.id },
      data: { used: true }
    });

    // 🍪 6. SECURE COOKIE DEPLOYMENT (Async 2026 Standard)
    const cookieStore = await cookies();
    const host = request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const cookieMetadata = getCookieMetadata(host, protocol);

    cookieStore.set({
      name: cookieMetadata.name,
      value: sessionToken,
      ...cookieMetadata.options,
    });

    // 🚀 7. HYBRID PAYLOAD EGRESS
    console.log(`✅ [Token_Exchange_Success] UID: ${user.id} | Mode: ${cookieMetadata.options.partitioned ? 'Partitioned' : 'Lax'}`);
    
    return NextResponse.json({ 
      success: true,
      data: {
        token: sessionToken, // For SecureStorage fallback
        user: {
          id: user.id,
          telegramId: user.telegramId.toString(),
          role: normalizedRole,
          merchantId: resolvedMerchantId,
        }
      }
    });

  } catch (error: any) {
    console.error("🔥 [Token_Exchange_Crash]:", error.message);
    return NextResponse.json({ error: "handshake_denied" }, { status: 500 });
  }
}