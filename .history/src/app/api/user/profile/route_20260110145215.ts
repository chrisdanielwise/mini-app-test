import { NextResponse } from "next/server";
import { getMerchantSession } from "@/src/lib/auth/merchant-session";
import { successResponse, unauthorizedResponse, serverError } from "@/src/lib/utils/api-response";

/**
 * 🔒 INTERNAL IDENTITY NODE
 * Tier 2/3 Bridge: Returns verified session data for the UI.
 */
export async function GET() {
  try {
    // 🔐 1. Identity Handshake: Verify the stateless JWT session
    const session = await getMerchantSession();

    // 2. Protocol Check: If no session, return unauthorized
    if (!session) {
      return unauthorizedResponse("Authentication Required");
    }

    /**
     * 🏁 3. DATA ALIGNMENT & SERIALIZATION
     * Mapping the session node to the frontend response structure.
     * We use session.config and session.merchantId as defined in getMerchantSession.
     */
    const profile = {
      id: session.user.id,
      telegramId: session.user.telegramId.toString(),
      fullName: session.user.fullName,
      username: session.user.username,
      role: session.user.role,
      
      // ✅ MERCHANT NODE: Safely map if merchantId exists
      merchant: session.merchantId ? {
        id: session.merchantId,
        companyName: session.config?.companyName || "Unknown Merchant",
        botUsername: session.config?.botUsername,
        // Using Decimal-to-String for high-precision capital values
        availableBalance: session.config?.availableBalance?.toString() || "0.00",
        isSetup: session.config?.isSetup || false
      } : null
    };

    return successResponse(profile);

  } catch (error: any) {
    console.error("🔥 Profile API Error:", error.message);
    return serverError("Internal Protocol Failure");
  }
}