import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { validateTelegramInitData, createJWT } from "@/lib/auth/telegram";
import { findOrCreateFromTelegram } from "@/lib/services/user.service";
import {
  successResponse,
  errorResponse,
  validationError,
} from "@/lib/utils/api-response";
import { JWT_CONFIG, getSecurityContext } from "@/lib/auth/config";

/**
 * 🔐 TELEGRAM AUTH GATE (Institutional v12.5.0)
 * Architecture: Relational Context Hydration + Hybrid Identity Egress.
 * Optimization: Environment-aware CHIPS Partitioning for Safari 2026.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { initData, merchantId: requestedMerchantId } = body;

    if (!initData) return validationError("INIT_DATA_MISSING");

    // 🛡️ 1. DYNAMIC BOT TOKEN DISCOVERY
    // Allows multi-tenant bots to validate signatures using their own secrets.
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

    // 🕵️ 3. IDENTITY RESOLUTION (Relational Fetch)
    const baseUser = await findOrCreateFromTelegram(validated.user);
    
    // We fetch full relations to resolve the Merchant Node ID (Owner or Staff)
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
    
    // Check against centralized staff roles from JWT_CONFIG
    const isPlatformStaff = JWT_CONFIG.staffRoles.includes(normalizedRole);

    const resolvedMerchantId = 
      requestedMerchantId || 
      user.merchantProfile?.id || 
      user.teamMemberships[0]?.merchantId || 
      null;

    // 🔐 5. SECURE JWT GENERATION
    // Includes isStaff flag for high-speed Proxy/Middleware checks.
    const token = await createJWT({
      telegramId: user.telegramId.toString(),
      userId: user.id,
      role: normalizedRole,
      merchantId: resolvedMerchantId,
      isStaff: isPlatformStaff,
    });

    // 🏗️ 6. PAYLOAD PREPARATION
    // 'token' is explicitly returned so useAuth can save it to SecureStorage.
    const responseData = {
      token, 
      user: {
        id: user.id,
        telegramId: user.telegramId.toString(),
        fullName: user.fullName,
        role: normalizedRole,
        merchantId: resolvedMerchantId,
      },
    };

    // 🏁 7. SESSION ANCHOR: Protocol-Aware Cookies
    const response = successResponse(responseData);
    
    // Resolve security flags (Secure, SameSite, Partitioned) based on Tunnel/Prod status
    const host = request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto");
    const security = getSecurityContext(host, protocol);

    response.cookies.set(JWT_CONFIG.cookieName, token, {
      ...JWT_CONFIG.cookieOptions,
      secure: security.secure,
      sameSite: security.sameSite,
      // @ts-ignore - CHIPS support for 2026 iframe persistence
      partitioned: security.partitioned, 
    });

    // Bypass Cloudflare/Ngrok browser warning interstitial
    response.headers.set("ngrok-skip-browser-warning", "true");

    console.log(`✅ [Auth_Gate] Sync Success: ${user.id} | Mode: ${security.partitioned ? 'Partitioned' : 'Standard'}`);
    return response;

  } catch (error: any) {
    console.error(`🔥 [Auth_Gate_Crash]:`, error.message);
    return errorResponse("INTERNAL_HANDSHAKE_FAILURE", 500);
  }
}