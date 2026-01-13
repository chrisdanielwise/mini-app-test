import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validateTelegramInitData } from "@/lib/auth/telegram"; 
import { findOrCreateFromTelegram } from "@/lib/services/user.service";
import { AuthService } from "@/lib/services/auth.service";
import {
  successResponse,
  errorResponse,
  validationError,
} from "@/lib/utils/api-response";
import { JWT_CONFIG } from "@/lib/auth/config";

/**
 * 🚀 GLOBAL BIGINT PATCH
 * Essential for Next.js 16 / Prisma BigInt compatibility.
 */
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

/**
 * 🔐 TELEGRAM AUTH GATE (Institutional v13.9.55)
 * Logic: Signature Verification + BigInt-Safe Relational Sync.
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
      console.error(`❌ [Auth_Gate] Signature Verification Failed`);
      return errorResponse("INVALID_SIGNATURE", 401);
    }

    // 🕵️ 3. IDENTITY RESOLUTION
    // findOrCreateFromTelegram returns the user after upserting BigInt telegramId
    const baseUser = await findOrCreateFromTelegram(validated.user);
    
    if (!baseUser?.id) {
      console.error("❌ [Auth_Gate] User resolution failed to return a UUID.");
      return errorResponse("USER_PROVISION_FAILED", 500);
    }

    // Fetch full relations using the UUID returned from the service
    const user = await prisma.user.findUnique({
      where: { id: baseUser.id },
      include: {
        merchantProfile: { select: { id: true } },
        teamMemberships: { take: 1, select: { merchantId: true } }
      }
    }) as any;

    if (!user) return errorResponse("USER_NOT_FOUND", 404);

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
     */
    const sessionToken = await AuthService.createSession(user);

    // 🏗️ 6. PAYLOAD PREPARATION
    // ✅ FIX: Ensure field names match exactly what 'useAuth' hook expects
    const responseData = {
      token: sessionToken,
      user: {
        id: user.id,
        telegramId: user.telegramId.toString(),
        firstName: user.firstName, // Prisma maps 'first_name' to 'firstName'
        username: user.username,
        role: normalizedRole,
        merchantId: resolvedMerchantId,
        isStaff: isPlatformStaff
      },
    };

    // 🏁 7. SESSION ANCHOR
    const host = request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const cookieMetadata = AuthService.getCookieMetadata(host, protocol);

    const response = successResponse(responseData);
    
    response.cookies.set({
      name: cookieMetadata.name,
      value: sessionToken,
      ...cookieMetadata.options,
    });

    response.headers.set("ngrok-skip-browser-warning", "true");

    console.log(`✅ [Auth_Gate] Handshake Success: ${user.id} | Merchant: ${resolvedMerchantId}`);
    return response;

  } catch (error: any) {
    console.error(`🔥 [Auth_Gate_Crash]:`, error.message);
    return errorResponse("INTERNAL_HANDSHAKE_FAILURE", 500);
  }
}