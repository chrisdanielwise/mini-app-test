import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { validateTelegramInitData, createJWT } from "@/lib/auth/telegram";
import { findOrCreateFromTelegram } from "@/lib/services/user.service";
import {
  successResponse,
  errorResponse,
  validationError,
} from "@/lib/utils/api-response";

/**
 * 🔐 TELEGRAM AUTH GATE (Institutional v8.6)
 * Hardened: Forces role.toLowerCase() to ensure Middleware/RBAC parity.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { initData, merchantId } = body;

    if (!initData) return validationError("initData is required");

    // 🛡️ DYNAMIC HANDSHAKE: Merchant-specific or Global fallback
    let botTokenOverride: string | undefined;
    if (merchantId) {
      const node = await prisma.merchant.findUnique({
        where: { id: merchantId },
        select: { botToken: true },
      });
      if (node?.botToken) botTokenOverride = node.botToken;
    }

    const validated = validateTelegramInitData(initData, botTokenOverride);
    if (!validated || !validated.user)
      return errorResponse("Invalid identity node.", 401);

    const user = await findOrCreateFromTelegram(validated.user);

    // 🚀 CRITICAL FIX: Standardize casing for Middleware compatibility
    const token = await createJWT({
      telegramId: user.telegramId,
      userId: user.id,
      role: user.role.toLowerCase(), // 🛡️ Normalized
      merchantId: merchantId || user.merchantProfile?.id || null,
    });

    return successResponse({
      token,
      user: {
        id: user.id,
        role: user.role.toLowerCase(),
        merchant: user.merchantProfile ? { id: user.merchantProfile.id } : null,
      },
    });
  } catch (error) {
    return errorResponse("Handshake failed", 500);
  }
}
