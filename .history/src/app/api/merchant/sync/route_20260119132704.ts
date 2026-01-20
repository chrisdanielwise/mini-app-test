"use server";

import { NextResponse } from "next/server";
// ✅ FIXED: Named imports now satisfy the TS(2305) protocol
import { getByAdminTelegramId } from "@/lib/services/merchant.service";
import { getUserByTelegramId } from "@/lib/services/user.service";
import { successResponse, errorResponse } from "@/lib/utils/api-response";

/**
 * 🛰️ IDENTITY RESOLVER (Institutional v2026.1.19)
 * Logic: Resolves a Telegram ID to either a Merchant Node or a Staff Oversight role.
 * Standard: Dual-path lookup with BigInt sanitation.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const telegramIdStr = searchParams.get("telegramId");

  // 1. Identity Validation
  if (!telegramIdStr) {
    return errorResponse("Identity Link Missing: telegramId is required.", 400);
  }

  try {
    // 2. BigInt Parsing (Safe 64-bit Protocol for 2026 IDs)
    const telegramId = BigInt(telegramIdStr);

    /**
     * 3. PARALLEL DISCOVERY
     * We simultaneously check if this ID belongs to a Merchant or a Platform Staff member.
     */
    const [merchant, user] = await Promise.all([
      getByAdminTelegramId(telegramId),
      getUserByTelegramId(telegramId)
    ]);

    // 🛡️ STAFF CLEARANCE AUDIT
    // Institutional roles are mapped to lowercase for comparison
    const staffRoles = ["super_admin", "platform_manager", "platform_support"];
    const isStaff = user && staffRoles.includes(user.role.toLowerCase());

    // 4. ROLE-AWARE EGRESS
    // Defaulting to "USER" (Customer) if no elevated nodes are found.
    if (!merchant && !isStaff) {
      return successResponse({ 
        authorized: false,
        merchantId: null, 
        role: "USER",
        message: "No elevated clearance associated with this identity." 
      });
    }

    return successResponse({ 
      authorized: true,
      merchantId: merchant?.id || null,
      companyName: merchant?.companyName || "PLATFORM_OPERATIONS",
      role: user?.role || "MERCHANT",
      isStaff: !!isStaff
    });

  } catch (error: any) {
    console.error("🔥 [Resolver_Failure]:", error.message);
    
    // Handle BigInt conversion failures (non-numeric strings)
    if (error instanceof Error && error.message.includes("BigInt")) {
      return errorResponse("Invalid Identity Format: ID must be numeric.", 400);
    }
    
    return errorResponse("Internal Protocol Failure", 500);
  }
}