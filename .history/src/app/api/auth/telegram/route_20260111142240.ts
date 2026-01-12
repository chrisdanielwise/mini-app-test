import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { validateTelegramInitData, createJWT } from "@/lib/auth/telegram";
import { findOrCreateFromTelegram } from "@/lib/services/user.service";
import { successResponse, errorResponse, validationError } from "@/lib/utils/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { initData, merchantId } = body;

    if (!initData) {
      return validationError("initData is required");
    }

    // 🛡️ 1. DYNAMIC TELEGRAM HANDSHAKE
    let botTokenOverride: string | undefined;

    // If the user is logging in via a specific Merchant's Bot
    if (merchantId) {
      const merchantNode = await prisma.merchant.findUnique({
        where: { id: merchantId },
        select: { botToken: true }
      });

      if (merchantNode?.botToken) {
        botTokenOverride = merchantNode.botToken;
      } else {
        console.warn(`[Auth_Gate] Merchant ${merchantId} has no specific botToken. Falling back to global.`);
      }
    }

    // Perform validation with either the Merchant's token or the Global Zipha token
    const validated = validateTelegramInitData(initData, botTokenOverride);

    if (!validated || !validated.user) {
      return errorResponse("Invalid Telegram authentication", 401);
    }

    // 👤 2. IDENTITY SYNC (Silent Upsert)
    // This function creates the user record if it doesn't exist
    const user = await findOrCreateFromTelegram(validated.user);

    /**
     * 🔐 3. JWT GENERATION
     * The merchantId is injected into the JWT to lock the session context.
     */
    const token = await createJWT({
      telegramId: user.telegramId,
      userId: user.id,
      role: user.role,
      merchantId: merchantId || user.merchantProfile?.id || null,
    });

    // 🚀 4. REFINED RESPONSE
    return successResponse({
      token,
      user: {
        id: user.id,
        telegramId: user.telegramId,
        fullName: user.fullName,
        username: user.username,
        role: user.role,
        merchant: user.merchantProfile
          ? {
              id: user.merchantProfile.id,
              companyName: user.merchantProfile.companyName,
              planStatus: user.merchantProfile.planStatus,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("[Auth_Gate_Crash]:", error);
    return errorResponse("Identity synchronization failed", 500);
  }
}