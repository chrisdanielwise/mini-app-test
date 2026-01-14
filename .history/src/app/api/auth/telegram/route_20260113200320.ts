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
    const { initData, merchantId: requestedMerchantId } = await request.json();
    if (!initData) return validationError("INIT_DATA_MISSING");

    // 🛡️ 1. LEAN SIGNATURE CHECK
    // Only fetch bot token if specifically requested, otherwise use default ENV
    let botToken: string | undefined;
    if (requestedMerchantId) {
      const node = await prisma.merchantProfile.findUnique({
        where: { id: requestedMerchantId },
        select: { botToken: true },
      });
      botToken = node?.botToken ?? undefined;
    }

    const validated = validateTelegramInitData(initData, botToken);
    if (!validated?.user) return errorResponse("INVALID_SIGNATURE", 401);

    // 🕵️ 2. CONSOLIDATED IDENTITY SYNC
    // Use a single 'upsert' with 'include' to do everything in ONE DB trip
    const user = await prisma.user.upsert({
      where: { telegramId: BigInt(validated.user.id) },
      update: { 
        firstName: validated.user.first_name, 
        username: validated.user.username,
        lastLoginAt: new Date() 
      },
      create: { 
        telegramId: BigInt(validated.user.id), 
        firstName: validated.user.first_name, 
        username: validated.user.username,
        role: 'USER' 
      },
      include: {
        merchantProfile: { select: { id: true } },
        teamMemberships: { take: 1, select: { merchantId: true } }
      }
    }) as any;

    // 🔐 3. IMMEDIATE SESSION ISSUANCE
    const sessionToken = await AuthService.createSession(user);
    const normalizedRole = user.role.toLowerCase();
    
    const responseData = {
      token: sessionToken,
      user: {
        id: user.id,
        telegramId: user.telegramId.toString(),
        firstName: user.firstName,
        role: normalizedRole,
        merchantId: requestedMerchantId || user.merchantProfile?.id || user.teamMemberships[0]?.merchantId || null,
        isStaff: JWT_CONFIG.staffRoles.includes(normalizedRole)
      },
    };

    // 🏁 4. FAST RESPONSE
    const response = successResponse(responseData);
    const cookieMetadata = AuthService.getCookieMetadata(
      request.headers.get("host"), 
      request.headers.get("x-forwarded-proto") || "https"
    );

    response.cookies.set({
      name: cookieMetadata.name,
      value: sessionToken,
      ...cookieMetadata.options,
    });

    return response;

  } catch (error: any) {
    console.error(`🔥 [Auth_Gate_Fast]:`, error.message);
    return errorResponse("INTERNAL_HANDSHAKE_FAILURE", 500);
  }
}