import { NextResponse } from "next/server";
// ✅ FIXED: Using named function imports for Turbopack & Consistency
import { getByAdminTelegramId } from "@/lib/services/merchant.service";
import { getUserByTelegramId } from "@/lib/services/user.service";
import { successResponse, errorResponse } from "@/lib/utils/api-response";

/**
 * 🛰️ IDENTITY RESOLVER (Universal Tier)
 * Logic: Resolves a Telegram ID to either a Merchant Node or a Staff Oversight role.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const telegramIdStr = searchParams.get("telegramId");

  // 1. Identity Validation
  if (!telegramIdStr) {
    return errorResponse("Identity Link Missing: telegramId is required.", 400);
  }

  try {
    // 2. BigInt Parsing (Safe 64-bit Protocol)
    const telegramId = BigInt(telegramIdStr);

    /**
     * 3. PARALLEL DISCOVERY
     * We simultaneously check if this ID belongs to a Merchant or a Platform Staff member.
     */
    const [merchant, user] = await Promise.all([
      getByAdminTelegramId(telegramId),
      getUserByTelegramId(telegramId)
    ]);

    // 🕵️ CLEARANCE CHECK
    const isStaff = user && ["super_admin", "platform_manager", "platform_support"].includes(user.role);

    // 4. ROLE-AWARE EGRESS
    // If they have no role and no merchant profile, they are a standard customer.
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
    
    if (error instanceof SyntaxError) {
      return errorResponse("Invalid Identity Format: ID must be numeric.", 400);
    }
    
    return errorResponse("Internal Protocol Failure", 500);
  }
}