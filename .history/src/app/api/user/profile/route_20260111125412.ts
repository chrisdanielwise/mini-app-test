import { NextResponse } from "next/server";
import { getMerchantSession } from "@/lib/auth/session";
import { 
  successResponse, 
  unauthorizedResponse, 
  serverError 
} from "@/lib/utils/api-response";

/**
 * 🔒 INTERNAL IDENTITY NODE (/api/auth/profile)
 * This route acts as the source of truth for the current session.
 * It is role-agnostic: handling Staff, Merchants, and Riders via a single ingress.
 */
export async function GET() {
  try {
    // 🔐 1. IDENTITY HANDSHAKE
    // Re-verifies the secure HTTP-only JWT cookie
    const session = await getMerchantSession();

    // 2. PROTOCOL CHECK
    if (!session) {
      console.warn("⚠️ [Auth_Me] Unauthorized access attempt detected.");
      return unauthorizedResponse("Session Expired or Missing Identity Node");
    }

    /**
     * 🏁 3. DATA ALIGNMENT & SERIALIZATION
     * We map the session data to a structure the UI Terminal can ingest.
     * BigInt and Decimal values are stringified to prevent JSON parsing failures.
     */
    const profile = {
      user: {
        id: session.user.id,
        telegramId: session.user.telegramId.toString(),
        fullName: session.user.fullName,
        username: session.user.username,
        role: session.user.role, // "super_admin", "merchant", "platform_manager", etc.
      },

      // 🛰️ MERCHANT CLUSTER DATA
      // If the user is a Merchant, we provide their node config.
      // If Staff, this remains null, signaling the UI to enter 'Global Mode'.
      merchant: session.merchantId ? {
        id: session.merchantId,
        companyName: session.config?.companyName || "Merchant Node",
        botUsername: session.config?.botUsername,
        availableBalance: session.config?.availableBalance?.toString() || "0.00",
        pendingEscrow: session.config?.pendingEscrow?.toString() || "0.00",
        isSetup: session.config?.isSetup || false,
        planStatus: session.config?.planStatus || "TRIAL"
      } : null,

      // 🛡️ PERMISSIONS OVERLAY
      // Useful for frontend conditional rendering: if (profile.isStaff) ...
      isStaff: ["super_admin", "platform_manager", "platform_support"].includes(session.user.role),
      lastSync: new Date().toISOString()
    };

    // 🚀 4. SUCCESSFUL EGRESS
    return successResponse(profile);

  } catch (error: any) {
    console.error("🔥 [Profile_Me_Failure]:", error.message);
    return serverError("Identity Protocol Failure");
  }
}