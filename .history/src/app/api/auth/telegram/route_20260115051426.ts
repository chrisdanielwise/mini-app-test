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
// import { Prisma } from "@prisma/client";

/**
 * 🚀 GLOBAL BIGINT PATCH
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
 * 🔐 TELEGRAM AUTH GATE (Institutional v16.16.14)
 * Logic: Consolidated DB Upsert + Named Function Handshake.
 * Fix: Resolves "AuthService.createSession is not a function" errors.
 */
export async function POST(request: NextRequest) {
  try {
    const { initData, merchantId: requestedMerchantId } = await request.json();
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
        role: "USER",
      },
      include: {
        merchantProfile: { select: { id: true } },
        teamMemberships: { take: 1, select: { merchantId: true } },
      },
    })) as UserWithRelations;

    // 🔐 3. SESSION & ROLE RESOLUTION (Atomic Calls)
    const sessionToken = await createSession(user);
    const normalizedRole = user.role.toLowerCase();

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

    // 🏁 4. RESPONSE & COOKIE ANCHOR (v16.16.14 Standard)
    // Simplified getCookieMetadata call to prevent Proxy_Fault errors
    const cookieMetadata = getCookieMetadata(user.role);

    const response = successResponse(responseData);

    response.cookies.set({
      name: cookieMetadata.name,
      value: sessionToken,
      ...cookieMetadata.options,
    });

    // 🛡️ 5. SECURITY AUDIT (Atomic Call)
    const ip = request.headers.get("x-forwarded-for")?.split(',')[0] || "0.0.0.0";
    await logAuthEvent(user.id, ip, "TELEGRAM_LOGIN");

    console.log(
      `✅ [Auth_Gate] Node Verified: ${user.id} | Mode: TMA_Partitioned`
    );
    return response;
  } catch (error: any) {
    console.error(`🔥 [Auth_Gate_Crash]:`, error.message);
    return errorResponse("INTERNAL_HANDSHAKE_FAILURE", 500);
  }
}