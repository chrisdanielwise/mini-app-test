import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { 
  createSession, 
  getCookieMetadata 
} from "@/lib/services/auth.service";
import { JWT_CONFIG } from "@/lib/auth/config";
import { cookies } from "next/headers";

/**
 * 🛰️ TOKEN EXCHANGE HANDSHAKE (Institutional v16.16.14)
 * Logic: One-Time Token (OTT) Conversion to Stateless Hybrid Session.
 * Fix: Uses Atomic Ingress Functions to resolve Turbopack Export Errors.
 */
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "token_required" }, { status: 400 });
    }

    // 🕵️ 1. IDENTITY RETRIEVAL (Institutional Table Logic)
    // Selection-limited lookup to prevent DB contention.
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
      return NextResponse.json({ 
        error: "link_invalid_or_expired",
        reason: "OTT_VOID_OR_STALE" 
      }, { status: 401 });
    }

    const user = magicToken.user;
    const normalizedRole = user.role.toLowerCase();

    // 🚀 3. MERCHANT ID RESOLUTION
    const resolvedMerchantId = 
      user.merchantProfile?.id || 
      user.teamMemberships[0]?.merchantId || 
      null;

    // 🔐 4. SESSION GENERATION (Atomic Call)
    // Centralized via standalone function to ensure identity manifest consistency.
    const sessionToken = await createSession(user);

    // 🏁 5. ATOMIC CONSUMPTION (The "Burn")
    // Prevents replay attacks by marking the token used before cookie deployment.
    await prisma.magicToken.update({
      where: { id: magicToken.id },
      data: { used: true }
    });

    // 🍪 6. SECURE COOKIE DEPLOYMENT (2026 CHIPS Standard)
    const cookieStore = await cookies();
    
    // Simplified Metadata: Removed host/proto params to avoid Proxy_Fault.
    const cookieMetadata = getCookieMetadata(normalizedRole);

    cookieStore.set({
      name: cookieMetadata.name,
      value: sessionToken,
      ...cookieMetadata.options,
    });

    // 🚀 7. HYBRID PAYLOAD EGRESS
    console.log(`✅ [Token_Exchange_Success] UID: ${user.id} | Mode: TMA_Partitioned`);
    
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
    return NextResponse.json({ 
      error: "handshake_denied",
      reason: "INTERNAL_CORE_FAULT" 
    }, { status: 500 });
  }
}