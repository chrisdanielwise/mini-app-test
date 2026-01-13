import { NextResponse } from "next/server";
import { z } from "zod";
import { getByAdminTelegramId } from "@/lib/services/merchant.service";
import { getUserByTelegramId } from "@/lib/services/user.service";
import { successResponse, errorResponse } from "@/lib/utils/api-response";

/**
 * 🛰️ MASTER IDENTITY RESOLVER (v3.0.0)
 * Architecture: Parallel Zero-Trust Discovery
 * Logic: Hardened against BigInt serialization crashes and RBAC mismatch.
 */

// 🛡️ 1. INPUT VALIDATION SCHEMA
const IdentitySchema = z.object({
  telegramId: z.union([z.string(), z.number()]).transform((val) => BigInt(val)),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 🛡️ 2. VALIDATION GATE: Catch malformed nodes before DB overhead
    const validation = IdentitySchema.safeParse(body);
    if (!validation.success) {
      return errorResponse("INVALID_NODE_REFERENCE", 400);
    }

    const { telegramId } = validation.data;

    /**
     * 3. PARALLEL DISCOVERY (Institutional v3.0.0)
     * Simultaneously querying separate DB clusters (Merchant/User) 
     * to keep handshake latency < 50ms.
     */
    const [merchant, user] = await Promise.all([
      getByAdminTelegramId(telegramId),
      getUserByTelegramId(telegramId),
    ]);

    // 🛡️ 4. ROLE NORMALIZATION & RBAC SYNC
    // Standardizing case prevents the "307 Redirect Loop" where Middleware 
    // expects 'admin' but the DB returns 'ADMIN'.
    const rawRole = user?.role || "user";
    const normalizedRole = rawRole.toLowerCase();
    
    const isStaff = ["super_admin", "platform_manager", "platform_support"].includes(normalizedRole);

    // 5. CLEARANCE EVALUATION
    if (!merchant && !isStaff) {
      return successResponse({
        authorized: false,
        role: "user",
        manifest: {
          status: "INSUFFICIENT_CLEARANCE",
          nodeId: telegramId.toString(), // 🚀 Standard: BigInt must be stringified for JSON
        }
      });
    }

    /**
     * 🏁 6. IDENTITY MANIFEST EGRESS
     * Note: Every BigInt MUST be cast to String to prevent serialization crashes.
     */
    const responseData = {
      authorized: true,
      identity: {
        userId: user?.id,
        telegramId: telegramId.toString(), // 🛡️ Fix for TS/BigInt crash
        username: user?.username || "Operator",
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
        nodeFingerprint: crypto.randomUUID(), // For session tracking
      }
    };

    console.log(`✅ [Identity_Resolved] Node: ${telegramId} | Role: ${normalizedRole}`);
    return successResponse(responseData);

  } catch (error: any) {
    console.error("🔥 [Identity_Critical_Failure]:", error.message);
    return errorResponse("INTERNAL_IDENTITY_SYNC_ERROR", 500);
  }
}