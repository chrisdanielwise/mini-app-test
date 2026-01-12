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
 * 🔐 TELEGRAM AUTH GATE (Institutional v8.9.6)
 * Hardened: Forces role.toLowerCase() & injects HttpOnly session cookies.
 * Fixes: Next.js 15 hydration loops by providing a server-side session anchor.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { initData, merchantId } = body;

    if (!initData) return validationError("initData is required");

    // 🛡️ DYNAMIC HANDSHAKE: Bot-specific token validation
    let botTokenOverride: string | undefined;
    if (merchantId) {
      const node = await prisma.merchant.findUnique({
        where: { id: merchantId },
        select: { botToken: true },
      });
      if (node?.botToken) botTokenOverride = node.botToken;
    }

    const validated = validateTelegramInitData(initData, botTokenOverride);
    if (!validated || !validated.user) {
      return errorResponse("Invalid identity node.", 401);
    }

    const user = await findOrCreateFromTelegram(validated.user);

    // 🚀 ROLE NORMALIZATION: Ensures "SUPER_ADMIN" -> "super_admin"
    const normalizedRole = user.role.toLowerCase();

    // 🔐 GENERATE CONTEXT-LOCKED JWT
    const token = await createJWT({
      telegramId: user.telegramId.toString(),
      userId: user.id,
      role: normalizedRole,
      merchantId: merchantId || user.merchantProfile?.id || null,
    });

    // 🏗️ PREPARE RESPONSE
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

    // 🏁 SESSION ANCHOR: Set HttpOnly Cookie
    // This allows the Middleware to verify the session on the NEXT request
    const response = successResponse(responseData);
    
    response.cookies.set("auth_token", token, {
      path: "/",
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: t,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Bypasses Tunnel warning pages for mobile WebViews
    response.headers.set("ngrok-skip-browser-warning", "true");

    return response;
  } catch (error: any) {
    console.error("🔥 [Auth_Gate_Crash]:", error.message);
    return errorResponse("Handshake failed", 500);
  }
}