import { NextResponse } from "next/server";
import { z } from "zod";
import { getByAdminTelegramId } from "@/lib/services/merchant.service";
import { AuthService, getCookieMetadata } from "@/lib/services/auth.service";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { getUserByTelegramId } from "@/lib/services/user.service";

/**
 * 🛰️ MASTER IDENTITY RESOLVER (v4.0.0)
 * Architecture: Parallel Discovery + Cookie Injection.
 * Logic: Exchanges Telegram Identity for a Hardened HttpOnly Session.
 */

// 🛡️ 1. INPUT VALIDATION SCHEMA
const IdentitySchema = z.object({
  telegramId: z.union([z.string(), z.number()]).transform((val) => BigInt(val)),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 🛡️ 2. VALIDATION GATE
    const validation = IdentitySchema.safeParse(body);
    if (!validation.success) {
      return errorResponse("INVALID_NODE_REFERENCE", 400);
    }

    const { telegramId } = validation.data;
    const host = request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "http";

    /**
     * 3. PARALLEL DISCOVERY
     * Simultaneously querying separate DB clusters (Merchant/User).
     */
    const [merchant, user] = await Promise.all([
      getByAdminTelegramId(telegramId),
      getUserByTelegramId(telegramId),
    ]);

    if (!user) {
      return errorResponse("IDENTITY_NOT_FOUND", 404);
    }

    // 🛡️ 4. ROLE NORMALIZATION
    const rawRole = user.role || "user";
    const normalizedRole = rawRole.toLowerCase();
    const isStaff = ["super_admin", "platform_manager", "platform_support"].includes(normalizedRole);

    /**
     * 🔐 5. SESSION GENERATION (The Redirect-Loop Fix)
     * We generate the session token and cookie metadata using the central 
     */
    const sessionToken = await createSession(user);
    const cookieMetadata = getCookieMetadata(host, protocol);

    // 6. IDENTITY MANIFEST PREPARATION
    const responseData = {
      authorized: true,
      identity: {
        userId: user.id,
        telegramId: telegramId.toString(),
        username: user.username || "Operator",
      },
      rbac: {
        role: normalizedRole,
        isMerchant: !!merchant,
        isStaff: isStaff,
      },
      merchant: merchant ? {
        id: merchant.id,
        company: merchant.companyName,
        status: merchant.provisioningStatus,
      } : null,
      meta: {
        issuedAt: new Date().toISOString(),
      }
    };

    /**
     * 🏁 7. RESPONSE & COOKIE INJECTION
     * We manually build the response to ensure the 'Set-Cookie' header is attached.
     */
    const response = NextResponse.json({
      success: true,
      data: responseData
    });

    response.cookies.set({
      name: cookieMetadata.name,
      value: sessionToken,
      ...cookieMetadata.options,
    });

    console.log(`✅ [Identity_Resolved] Node: ${telegramId} | Role: ${normalizedRole} | Session_Set: true`);
    
    return response;

  } catch (error: any) {
    console.error("🔥 [Identity_Critical_Failure]:", error.message);
    return errorResponse("INTERNAL_IDENTITY_SYNC_ERROR", 500);
  }
}