import { NextResponse } from "next/server";
import * as MerchantService from "@/lib/services/merchant.service";

/**
 * 🔗 AUTH SYNC BRIDGE
 * This route connects a Telegram User ID to their Merchant Profile UUID.
 * Updated to use Named Exports to fix Turbopack resolution errors.
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

    /**
     * 2. FETCH MERCHANT IDENTITY
     * We pass the Telegram ID as a BigInt to match the database schema.
     * The MerchantService.getByAdminTelegramId is now a named export.
     */
    const merchant = await MerchantService.getByAdminTelegramId(BigInt(telegramId));

    if (!merchant) {
      console.warn(`⚠️ [Auth Sync] No MerchantProfile linked to Telegram ID: ${telegramId}`);
      return NextResponse.json({ 
        isMerchant: false,
        message: "No merchant profile found. Please register as a merchant first." 
      });
    }

    /**
     * 3. SECURE PAYLOAD RETURN
     * We return exactly what the ProfilePage needs to unblock the dashboard button.
     */
    console.log(`✅ [Auth Sync] Identity verified for: ${merchant.companyName} (${merchant.id})`);
    
    return NextResponse.json({
      isMerchant: true,
      merchantId: merchant.id, // This is the UUID required for the Auth Callback
      companyName: merchant.companyName,
      role: merchant.adminUser?.role || "MERCHANT",
      status: merchant.provisioningStatus,
    });

  } catch (error) {
    // Detailed error logging for development (Turbopack console)
    const errorMessage = error instanceof Error ? error.message : "Unknown Error";
    console.error("❌ [Auth Sync Crash]:", errorMessage);
    
    return NextResponse.json(
      { error: "Internal Identity Sync Error", details: errorMessage }, 
      { status: 500 }
    );
  }
}