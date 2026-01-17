import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validateTelegramInitData } from "@/lib/auth/telegram"; 
import {  createSession, getCookieMetadata } from "@/lib/services/auth.service";
import { AuditService } from "@/lib/services/audit.service";
import {
  successResponse,
  errorResponse,
  validationError,
} from "@/lib/utils/api-response";
import { JWT_CONFIG } from "@/lib/auth/config";
import { Prisma } from "@/generated/prisma";

/**
 * 🚀 GLOBAL BIGINT PATCH
 */
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

/**
 * 🛠️ TYPE DEFINITION
 * Explicitly define the payload to include relations for TypeScript.
 */
type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    merchantProfile: { select: { id: true } },
    teamMemberships: { select: { merchantId: true } }
  }
}>;

/**
 * 🔐 TELEGRAM AUTH GATE
 * Logic: Consolidated DB Upsert + Audit Logging + BigInt Safety.
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
    // We type the result as UserWithRelations to satisfy the compiler
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
    }) as UserWithRelations;

    // 🔐 3. SESSION & ROLE RESOLUTION
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
        isStaff: JWT_CONFIG.staffRoles.includes(normalizedRole)
      },
    };

    // 🏁 4. RESPONSE & COOKIE ANCHOR
    const host = request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const cookieMetadata = getCookieMetadata(host, protocol);

    const response = successResponse(responseData);
    
    response.cookies.set({
      name: cookieMetadata.name,
      value: sessionToken,
      ...cookieMetadata.options,
    });

    // 🛡️ 5. SECURITY AUDIT
    await AuditService.log({
      userId: user.id,
      merchantId: resolvedMerchantId || undefined,
      action: "LOGIN",
      ip: request.headers.get("x-forwarded-for") || "0.0.0.0",
      metadata: { 
        method: "TELEGRAM_MINI_APP",
        ua: request.headers.get("user-agent")
      }
    });

    console.log(`✅ [Auth_Gate] Node Verified: ${user.id} | Protocol: ${protocol}`);
    return response;

  } catch (error: any) {
    console.error(`🔥 [Auth_Gate_Crash]:`, error.message);
    return errorResponse("INTERNAL_HANDSHAKE_FAILURE", 500);
  }
}