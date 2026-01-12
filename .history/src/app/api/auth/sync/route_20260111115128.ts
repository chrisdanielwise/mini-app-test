import { NextResponse } from "next/server";
import * as MerchantService from "@/lib/services/merchant.service";
import * as UserService from "@/lib/services/user.service";

/**
 * 🔗 AUTH SYNC BRIDGE
 * Verified: Synchronizes Telegram Identity with Platform Clearance levels.
 * Logic: Checks for Merchant Profile OR Staff Role.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { telegramId } = body;

    // 1. Validation check
    if (!telegramId) {
      console.error("❌ [Auth Sync] Missing telegramId in request body");
      return NextResponse.json(
        { error: "Missing Telegram ID" }, 
        { status: 400 }
      );
    }

    const bigIntId = BigInt(telegramId);

    /**
     * 2. PARALLEL IDENTITY CHECK
     * We check for a Merchant Profile AND the base User record to determine role.
     */
    const [merchant, user] = await Promise.all([
      getByAdminTelegramId(bigIntId),
      getUserByTelegramId(bigIntId)
    ]);

    // Check if the user has platform clearance (Staff roles)
    const isStaff = user && ["super_admin", "platform_manager", "platform_support"].includes(user.role);

    // 3. AUTHORIZATION GATE
    if (!merchant && !isStaff) {
      console.warn(`⚠️ [Auth Sync] Identity Node ${telegramId} lacks clearance.`);
      return NextResponse.json({ 
        authorized: false,
        message: "No merchant profile or staff clearance found." 
      });
    }

    /**
     * 4. SECURE IDENTITY PAYLOAD
     * We return a normalized object that the Login Button uses to trigger 'terminal_access'.
     */
    console.log(`✅ [Auth Sync] Verified Identity: ${user?.username || 'Operator'} | Role: ${user?.role}`);
    
    return NextResponse.json({
      authorized: true,
      isMerchant: !!merchant,
      isStaff: isStaff,
      merchantId: merchant?.id || null, 
      role: user?.role || "USER",
      status: merchant?.provisioningStatus || "ACTIVE",
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown Error";
    console.error("❌ [Auth Sync Crash]:", errorMessage);
    
    return NextResponse.json(
      { error: "Internal Identity Sync Error", details: errorMessage }, 
      { status: 500 }
    );
  }
}