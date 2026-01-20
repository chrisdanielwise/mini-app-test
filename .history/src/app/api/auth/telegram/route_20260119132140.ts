import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validateTelegramInitData } from "@/lib/auth/telegram";
import { 
  createSession, 
  getCookieMetadata 
} from "@/lib/services/auth.service";
import { logAuthEvent } from "@/lib/services/audit.service";
import {
  successResponse,
  errorResponse,
  validationError,
} from "@/lib/utils/api-response";
import { JWT_CONFIG } from "@/lib/auth/config";
import { Prisma, UserRole } from "@/generated/prisma"; // ✅ IMPORTING ENUMS

/**
 * 🚀 GLOBAL BIGINT PATCH
 * Essential for serializing Telegram IDs to JSON
 */
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

/**
 * 🛠️ TYPE DEFINITION
 */
type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    merchantProfile: { select: { id: true } };
    teamMemberships: { select: { merchantId: true } };
  };
}>;

/**
 * 🔐 TELEGRAM AUTH GATE (Institutional v2026.1.20)
 * Logic: Consolidated DB Upsert + Named Function Handshake.
 * Fix: Synchronized strictly UPPERCASE Prisma Enums with lowercase logic.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { initData, merchantId: requestedMerchantId } = body;
    
    if (!initData) return validationError("INIT_DATA_MISSING");

    // 🛡️ 1. LEAN SIGNATURE CHECK
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

    // 🕵️ 2. CONSOLIDATED IDENTITY SYNC (One DB Trip)
    // Using UserRole.USER to match generated Prisma Enum exactly
    const user = (await prisma.user.upsert({
      where: { telegramId: BigInt(validated.user.id) },
      update: {
        firstName: validated.user.first_name,
        username: validated.user.username,
        lastLoginAt: new Date(),
      },
      create: {
        telegramId: BigInt(validated.user.id),
        firstName: validated.user.first_name,
        username: validated.user.username,
        role: UserRole.USER, // ✅ FIXED: Using UPPERCASE Enum member
      },
      include: {
        merchantProfile: { select: { id: true } },
        teamMemberships: { take: 1, select: { merchantId: true } },
      },
    })) as UserWithRelations;

    // 🔐 3. SESSION & ROLE RESOLUTION
    const sessionToken = await createSession(user);
    const normalizedRole = user.role.toLowerCase();

    // Determine the merchant context: Requested > Owned > Membership
    const resolvedMerchantId =
      requestedMerchantId ||
      user.merchantProfile?.id ||
      user.teamMemberships[0]?.merchantId ||
      null;

    const responseData = {
      token: sessionToken,
      user: {
        id: user.id,
        telegramId: user.telegramId.toString(),
        firstName: user.firstName,
        role: normalizedRole,
        merchantId: resolvedMerchantId,
        isStaff: JWT_CONFIG.staffRoles.includes(normalizedRole),
      },
    };

    // 🏁 4. RESPONSE & COOKIE ANCHOR
    // Fetches metadata based on the database role
    const cookieMetadata = getCookieMetadata(user.role);

    const response = successResponse(responseData);

    // 🍪 Set Partitioned Cookie for TMA Cross-Site Support
    response.cookies.set({
      name: cookieMetadata.name,
      value: sessionToken,
      ...cookieMetadata.options,
      partitioned: true, // 🛰️ Vital for 2026 Safari/Chrome security
      path: "/",
      sameSite: "none",
      secure: true,
    });

    // 🛡️ 5. SECURITY AUDIT
    const ip = request.headers.get("x-forwarded-for")?.split(',')[0] || "0.0.0.0";
    await logAuthEvent(user.id, ip, "TELEGRAM_LOGIN");

    console.log(`✅ [Auth_Gate] Node Verified: ${user.id} | Role: ${normalizedRole}`);
    return response;
    
  } catch (error: any) {
    console.error(`🔥 [Auth_Gate_Crash]:`, error.message);
    return errorResponse("INTERNAL_HANDSHAKE_FAILURE", 500);
  }
}