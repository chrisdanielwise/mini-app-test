import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validateTelegramInitData, createJWT } from "@/lib/auth/telegram";
import { findOrCreateFromTelegram } from "@/lib/services/user.service";
import {
  successResponse,
  errorResponse,
  validationError,
} from "@/lib/utils/api-response";
import { JWT_CONFIG } from "@/lib/auth/config";

/**
 * 🔐 TELEGRAM AUTH GATE (v11.2.0)
 * Architecture: Relational Context Hydration + CHIPS Partitioning.
 * Optimization: Cloudflare Tunnel & Safari 2026 Persistence.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { initData, merchantId: requestedMerchantId } = body;

    if (!initData) return validationError("INIT_DATA_MISSING");

    // 🛡️ 1. DYNAMIC BOT TOKEN DISCOVERY
    let botTokenOverride: string | undefined;
    if (requestedMerchantId) {
      const node = await prisma.merchantProfile.findUnique({
        where: { id: requestedMerchantId },
        select: { botToken: true },
      });
      botTokenOverride = node?.botToken ?? undefined;
    }

    // 🛡️ 2. CRYPTOGRAPHIC HANDSHAKE
    const validated = validateTelegramInitData(initData, botTokenOverride);
    if (!validated || !validated.user) {
      console.error(`❌ [Auth_Gate] Signature Mismatch`);
      return errorResponse("INVALID_SIGNATURE", 401);
    }

    // 🕵️ 3. IDENTITY RESOLUTION (Prisma Relational Fetch)
    const baseUser = await findOrCreateFromTelegram(validated.user);
    
    // We MUST include relations to find the merchantId (since it's not on the User model)
    const user = await prisma.user.findUnique({
      where: { id: baseUser.id },
      include: {
        merchantProfile: { select: { id: true } },
        teamMemberships: { take: 1, select: { merchantId: true } }
      }
    });

    if (!user) return errorResponse("USER_PROVISION_FAILED", 500);

    // 🚀 4. ROLE & MERCHANT RESOLUTION
    const normalizedRole = user.role.toLowerCase();
    const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(normalizedRole);

    const resolvedMerchantId = 
      requestedMerchantId || 
      user.merchantProfile?.id || 
      user.teamMemberships[0]?.merchantId || 
      null;

    // 🔐 5. SECURE JWT GENERATION (Staff-Aware)
    const token = await createJWT({
      telegramId: user.telegramId.toString(),
      userId: user.id,
      role: normalizedRole,
      merchantId: resolvedMerchantId,
      isStaff: isPlatformStaff, // 🛡️ Essential for Proxy/Middleware speed
    });

    // 🏗️ 6. PAYLOAD PREPARATION (Next.js 16 Serialized)
    const responseData = {
      user: {
        id: user.id,
        telegramId: user.telegramId.toString(),
        fullName: user.fullName,
        role: normalizedRole,
        merchantId: resolvedMerchantId,
      },
    };

    // 🏁 7. SESSION ANCHOR: Set Partitioned Cookie
    const response = successResponse(responseData);
    
    /**
     * 🛡️ CLOUDFLARE + SAFARI PERSISTENCE (2026 Standard)
     * - secure: true (Required for https tunnels)
     * - sameSite: "none" (Allows iframe session persistence)
     * - partitioned: true (CHIPS standard to prevent 401 loops in Safari)
     */
    response.cookies.set(JWT_CONFIG.cookieName, token, {
      path: "/",
      httpOnly: true,
      secure: true, 
      sameSite: "none", 
      // @ts-ignore - CHIPS support for modern WebView isolation
      partitioned: true, 
      maxAge: 60 * 60 * 24 * 7, 
    });

    // Bypasses Cloudflare/Ngrok browser warning pages
    response.headers.set("ngrok-skip-browser-warning", "true");

    console.log(`✅ [Auth_Gate] Handshake: ${user.id} | Merchant: ${resolvedMerchantId}`);
    return response;

  } catch (error: any) {
    console.error(`🔥 [Auth_Gate_Crash]:`, error.message);
    return errorResponse("INTERNAL_HANDSHAKE_FAILURE", 500);
  }
}