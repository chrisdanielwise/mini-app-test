import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validateTelegramInitData } from "@/lib/auth/telegram"; // Keep signature verification
import { findOrCreateFromTelegram } from "@/lib/services/user.service";
import { AuthService } from "@/lib/services/auth.service";
import {
  successResponse,
  errorResponse,
  validationError,
} from "@/lib/utils/api-response";
import { JWT_CONFIG } from "@/lib/auth/config";

/**
 * 🔐 TELEGRAM AUTH GATE (Institutional v13.0.7)
 * Architecture: Relational Context Hydration + Multi-Tenant Signature Verification.
 * Optimization: Uses AuthService for Unified Cookie & Session issuance.
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

    // 🛡️ 2. CRYPTOGRAPHIC HANDSHAKE (Signature Check)
    const validated = validateTelegramInitData(initData, botTokenOverride);
    if (!validated || !validated.user) {
      console.error(`❌ [Auth_Gate] Signature Verification Failed`);
      return errorResponse("INVALID_SIGNATURE", 401);
    }

    // 🕵️ 3. IDENTITY RESOLUTION
    const baseUser = await findOrCreateFromTelegram(validated.user);
    
    // Fetch full relations for role and merchant resolution
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
    const isPlatformStaff = JWT_CONFIG.staffRoles.includes(normalizedRole);

    const resolvedMerchantId = 
      requestedMerchantId || 
      user.merchantProfile?.id || 
      user.teamMemberships[0]?.merchantId || 
      null;

    /**
     * 🔐 5. UNIFIED SESSION GENERATION
     * We transition to AuthService.createSession to match Magic Links and Sync routes.
     */
    const sessionToken = await AuthService.createSession(user);

    // 🏗️ 6. PAYLOAD PREPARATION
    const responseData = {
      token: sessionToken, // Returned for SecureStorage fallback
      user: {
        id: user.id,
        telegramId: user.telegramId.toString(),
        fullName: user.firstName, // Mapping to your sync logic naming
        role: normalizedRole,
        merchantId: resolvedMerchantId,
        isStaff: isPlatformStaff
      },
    };

    // 🏁 7. SESSION ANCHOR: Protocol-Aware Cookies
    const host = request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const cookieMetadata = AuthService.getCookieMetadata(host, protocol);

    const response = successResponse(responseData);
    
    // Set the Hardened HttpOnly Cookie
    response.cookies.set({
      name: cookieMetadata.name,
      value: sessionToken,
      ...cookieMetadata.options,
    });

    // Bypass Cloudflare/Ngrok browser warning
    response.headers.set("ngrok-skip-browser-warning", "true");

    console.log(`✅ [Auth_Gate] Handshake Verified: ${user.id} | Session_Issued: true`);
    return response;

  } catch (error: any) {
    console.error(`🔥 [Auth_Gate_Crash]:`, error.message);
    return errorResponse("INTERNAL_HANDSHAKE_FAILURE", 500);
  }
}