import { NextResponse } from "next/server";
import { getByAdminTelegramId } from "@/lib/services/merchant.service";
import { getUserByTelegramId } from "@/lib/services/user.service";
import { successResponse, errorResponse } from "@/lib/utils/api-response";

/**
 * 🛰️ MASTER IDENTITY RESOLVER (Institutional v2.27)
 * Hardened: Force-normalization of roles to ensure Middleware/RBAC parity.
 * Scaling: Parallel discovery protocol optimized for 1M concurrent user nodes.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { telegramId } = body;

    // 1. IDENTITY VALIDATION
    if (!telegramId) {
      console.error("❌ [Auth_Sync] Missing identity node reference.");
      return errorResponse("Missing Telegram ID", 400);
    }

    // 2. BIGINT PROTOCOL
    // Handles Telegram's 64-bit ID space safely for Prisma/PostgreSQL.
    const bigIntId = BigInt(telegramId);

    /**
     * 3. PARALLEL DISCOVERY
     * Simultaneously query Merchant and User clusters to minimize connection latency.
     */
    const [merchant, user] = await Promise.all([
      getByAdminTelegramId(bigIntId),
      getUserByTelegramId(bigIntId),
    ]);

    // 🛡️ ROLE NORMALIZATION (Critical Stability Fix)
    // We convert DB roles (e.g., "SUPER_ADMIN") to lowercase (e.g., "super_admin")
    // to match the Middleware's strict validation array and stop redirect loops.
    const normalizedRole = user?.role?.toLowerCase() || "user";
    
    // Check clearance based on normalized string
    const isStaff = ["super_admin", "platform_manager", "platform_support"].includes(normalizedRole);

    // 4. AUTHORIZATION GATE
    if (!merchant && !isStaff) {
      console.warn(`⚠️ [Auth_Sync] Node ${telegramId} lacks elevated clearance.`);
      return successResponse({
        authorized: false,
        role: "user",
        message: "No merchant profile or staff clearance found for this node.",
      });
    }

    /**
     * 🏁 5. SECURE EGRESS PAYLOAD
     * Returns a synchronized identity manifest for the Login Terminal.
     */
    console.log(
      `✅ [Auth_Sync] Verified: ${user?.username || "Operator"} | Role: ${normalizedRole}`
    );

    return successResponse({
      authorized: true,
      isMerchant: !!merchant,
      isStaff: isStaff,
      merchantId: merchant?.id || null,
      role: normalizedRole, // 🚀 Standardized casing for 100% Middleware compatibility
      companyName: merchant?.companyName || (isStaff ? "PLATFORM_ROOT" : null),
      status: merchant?.provisioningStatus || "ACTIVE",
    });

  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : "Unknown Node Failure";
    console.error("🔥 [Auth_Sync_Critical]:", errorMessage);

    return errorResponse("Internal Identity Sync Error", 500);
  }
}