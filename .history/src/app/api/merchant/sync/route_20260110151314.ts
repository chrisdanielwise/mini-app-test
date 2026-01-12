import { NextResponse } from "next/server";
import { getByAdminTelegramId } from "@/src/lib/services/merchant.service";
import { successResponse, errorResponse } from "@/src/lib/utils/api-response";

/**
 * 🛰️ MERCHANT RESOLVER (Apex Tier)
 * Converts a Telegram Identity into a Sovereign Merchant UUID.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const telegramIdStr = searchParams.get("telegramId");

  // 1. Validation Handshake
  if (!telegramIdStr) {
    return errorResponse("Identity Link Missing: telegramId is required.", 400);
  }

  try {
    // 2. BigInt Parsing (Standard 64-bit Telegram ID)
    const telegramId = BigInt(telegramIdStr);

    /**
     * 3. NODE DISCOVERY
     * Fetches the unique Merchant ID associated with this Admin.
     */
    const merchant = await getByAdminTelegramId(telegramId);

    if (!merchant) {
      return successResponse({ 
        merchantId: null, 
        message: "No merchant node associated with this identity." 
      });
    }

    // 4. Sanitized Egress
    return successResponse({ 
      merchantId: merchant.id,
      companyName: merchant.companyName 
    });

  } catch (error: any) {
    console.error("🔥 [Resolver_Failure]:", error.message);
    
    // Check for BigInt parsing errors (non-numeric strings)
    if (error instanceof SyntaxError) {
      return errorResponse("Invalid Identity Format: ID must be numeric.", 400);
    }
    
    return errorResponse("Internal Protocol Failure", 500);
  }
}