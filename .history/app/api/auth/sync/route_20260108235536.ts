import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { MerchantService } from "@/lib/services/merchant.service";

/**
 * 🔗 AUTH SYNC BRIDGE
 * This route connects a Telegram User ID to their Merchant Profile.
 * Without this, the Profile page cannot find the 'merchantId'.
 */
export async function POST(request: Request) {
  try {
    const { telegramId } = await request.json();

    if (!telegramId) {
      return NextResponse.json({ error: "Missing Telegram ID" }, { status: 400 });
    }

    // 1. Find the merchant using the service we fixed earlier
    // We use BigInt because Telegram IDs are large numbers
    const merchant = await MerchantService.getByAdminTelegramId(BigInt(telegramId));

    if (!merchant) {
      return NextResponse.json({ 
        isMerchant: false,
        message: "No merchant profile linked to this Telegram account." 
      });
    }

    // 2. Return the data the Profile Page is looking for
    return NextResponse.json({
      isMerchant: true,
      merchantId: merchant.id,
      role: "MERCHANT", // or merchant.adminUser.role
      companyName: merchant.companyName
    });

  } catch (error) {
    console.error("❌ Sync Route Crash:", error);
    return NextResponse.json({ error: "Internal Sync Error" }, { status: 500 });
  }
}