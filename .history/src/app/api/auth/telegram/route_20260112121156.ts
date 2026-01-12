import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validateTelegramInitData, createJWT } from "@/lib/auth/telegram";
import { findOrCreateFromTelegram } from "@/lib/services/user.service";
import {
  successResponse,
  errorResponse,
  validationError,
} from "@/lib/utils/api-response";

/**
 * 🔐 TELEGRAM AUTH GATE (Institutional v9.0.7)
 * Hardened: Multi-stage Telemetry Logs to diagnose redirect loops.
 * Optimized: Unified Role Normalization for RBAC consistency.
 */
export async function POST(request: NextRequest) {
  // 🛰️ 1. ORIGIN TRACKING
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const actualOrigin = `${protocol}://${host}`;

  try {
    const body = await request.json();
    const { initData, merchantId } = body;

    if (!initData) {
      console.warn("🚩 [Auth_Gate] Handshake blocked: Missing initData.");
      return validationError("initData is required");
    }

    // 🛡️ 2. DYNAMIC HANDSHAKE TELEMETRY
    let botTokenOverride: string | undefined;
    if (merchantId) {
      console.log(`📡 [Auth_Gate] Dynamic Handshake requested for Merchant: ${merchantId}`);
      const node = await prisma.merchant.findUnique({
        where: { id: merchantId },
        select: { botToken: true },
      });
      if (node?.botToken) {
        botTokenOverride = node.botToken;
        console.log(" ✅ [Auth_Gate] Node-specific botToken successfully retrieved.");
      } else {
        console.warn(" ⚠️ [Auth_Gate] merchantId provided but no botToken found in DB. Falling back to default.");
      }
    }

    const validated = validateTelegramInitData(initData, botTokenOverride);
    if (!validated || !validated.user) {
      console.error(`❌ [Auth_Gate] Cryptographic Handshake Failed. Origin: ${actualOrigin}`);
      return errorResponse("Invalid identity node.", 401);
    }

    // 🕵️ 3. IDENTITY AUDIT
    // findOrCreateFromTelegram performs the database commit/lookup
    const user = await findOrCreateFromTelegram(validated.user);

    /**
     * 🚀 ROLE NORMALIZATION & TELEMETRY
     * We log the raw DB role to check for UPPERCASE vs lowercase conflicts 
     * that cause Middleware redirect storms.
     */
    const normalizedRole = user.role.toLowerCase();
    
    console.log(`✅ [Auth_Gate_Success] Identity Verified:
      -> User_ID: ${user.id}
      -> Raw_Role: ${user.role}
      -> Norm_Role: ${normalizedRole}
      -> Merchant_Linked: ${!!user.merchantProfile}
    `);

    // 🔐 4. GENERATE CONTEXT-LOCKED JWT
    const token = await createJWT({
      telegramId: user.telegramId.toString(),
      userId: user.id,
      role: normalizedRole,
      merchantId: merchantId || user.merchantProfile?.id || null,
    });

    // 🏗️ 5. PREPARE RESPONSE
    const responseData = {
      token,
      user: {
        id: user.id,
        telegramId: user.telegramId.toString(),
        fullName: user.fullName,
        username: user.username,
        role: normalizedRole,
        merchant: user.merchantProfile ? { id: user.merchantProfile.id } : null,
      },
    };

    // 🏁 6. SESSION ANCHOR: Set HttpOnly Cookie
    const response = successResponse(responseData);
    
    response.cookies.set("auth_token", token, {
      path: "/",
      httpOnly: true,
      secure: true, 
      sameSite: "lax", 
      maxAge: 60 * 60 * 24 * 7, 
    });

    // Bypasses Tunnel warning pages for mobile WebViews (Ngrok/Cloudflare)
    response.headers.set("ngrok-skip-browser-warning", "true");

    return response;

  } catch (error: any) {
    console.error(`🔥 [Auth_Gate_Crash] Critical Failure at ${actualOrigin}:`, error.message);
    return errorResponse("Handshake failed", 500);
  }
}