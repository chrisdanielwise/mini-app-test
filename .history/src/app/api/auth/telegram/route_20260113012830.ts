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
 * 🔐 TELEGRAM AUTH GATE (Institutional v10.1.0)
 * Architecture: Tiered Handshake with Partitioned Session Persistence.
 */
export async function POST(request: NextRequest) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const actualOrigin = `${protocol}://${host}`;

  try {
    const body = await request.json();
    const { initData, merchantId } = body;

    if (!initData) return validationError("INIT_DATA_MISSING");

    // 🛡️ 1. DYNAMIC BOT TOKEN DISCOVERY
    let botTokenOverride: string | undefined;
    if (merchantId) {
      const node = await prisma.merchantP.findUnique({
        where: { id: merchantId },
        select: { botToken: true },
      });
      botTokenOverride = node?.botToken ?? undefined;
    }

    // 🛡️ 2. CRYPTOGRAPHIC HANDSHAKE
    const validated = validateTelegramInitData(initData, botTokenOverride);
    if (!validated || !validated.user) {
      console.error(`❌ [Auth_Gate] Signature Mismatch at ${actualOrigin}`);
      return errorResponse("INVALID_SIGNATURE", 401);
    }

    // 🕵️ 3. IDENTITY RESOLUTION (Data Access Layer)
    const user = await findOrCreateFromTelegram(validated.user);

    // 🚀 ROLE NORMALIZATION
    // Enforcing lowercase role syncs with the Middleware/Proxy requirement.
    const normalizedRole = user.role.toLowerCase();
    
    // 🔐 4. CONTEXT-LOCKED JWT GENERATION
    const token = await createJWT({
      telegramId: user.telegramId.toString(), // Hardened BigInt safety
      userId: user.id,
      role: normalizedRole,
      merchantId: merchantId || user.merchantProfile?.id || null,
    });

    // 🏗️ 5. PAYLOAD PREPARATION (Next.js 16 Serialized)
    const responseData = {
      token,
      user: {
        id: user.id,
        telegramId: user.telegramId.toString(),
        fullName: user.fullName,
        role: normalizedRole,
        merchantId: user.merchantProfile?.id || null,
      },
    };

    // 🏁 6. SESSION ANCHOR: Set HttpOnly Cookie
    const response = successResponse(responseData);
    
    /**
     * 🛡️ INDUSTRY STANDARD 2026: Partitioned Cookies
     * Since Telegram Mini Apps often run in cross-site contexts, we use:
     * - sameSite: "none" (Required for cross-site/iframe)
     * - partitioned: true (Modern security for third-party contexts)
     */
    response.cookies.set(JWT_CONFIG.cookieName, token, {
      path: "/",
      httpOnly: true,
      secure: true, 
      sameSite: "none", 
      // @ts-ignore - 'partitioned' is supported in modern engines
      partitioned: true, 
      maxAge: 60 * 60 * 24 * 7, 
    });

    // Bypasses tunnel warning pages for mobile logic (Ngrok/Cloudflare)
    response.headers.set("ngrok-skip-browser-warning", "true");

    return response;

  } catch (error: any) {
    console.error(`🔥 [Auth_Gate_Crash]:`, error.message);
    return errorResponse("INTERNAL_HANDSHAKE_FAILURE", 500);
  }
}