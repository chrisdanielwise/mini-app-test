import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import * as MerchantService from "@/lib/services/merchant.service"; // 👈 Import all named exports
/**
 * 🔗 AUTH SYNC BRIDGE
 * Connects Telegram User IDs to Merchant Profile UUIDs.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { telegramId } = body;

    if (!telegramId) {
      return NextResponse.json({ error: "Missing Telegram ID" }, { status: 400 });
    }

    // 1. Fetch Merchant using BigInt conversion
    // This uses the MerchantService we just updated with sanitized outputs
    const merchant = await MerchantService.getByAdminTelegramId(BigInt(telegramId));

    if (!merchant) {
      console.warn(`[Sync] No merchant found for Telegram ID: ${telegramId}`);
      return NextResponse.json({ 
        isMerchant: false,
        message: "Account sync required." 
      });
    }

    /**
     * 2. SECURE DATA RETURN
     * We return the UUID (merchantId) which the Profile page uses 
     * to trigger the Auth Callback.
     */
    return NextResponse.json({
      isMerchant: true,
      merchantId: merchant.id, // This is the UUID
      companyName: merchant.companyName,
      // Fallback role if adminUser wasn't included in the service call
      role: merchant.adminUser?.role || "MERCHANT", 
      status: merchant.provisioningStatus
    });

  } catch (error) {
    // Log detailed error for Turbopack console debugging
    console.error("❌ Auth Sync Crash:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Internal Identity Sync Error" }, 
      { status: 500 }
    );
  }
}