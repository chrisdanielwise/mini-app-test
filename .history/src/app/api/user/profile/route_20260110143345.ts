import { NextResponse } from "next/server";
import { getMerchantSession } from "@/lib/auth/merchant-session";

/**
 * 🔒 INTERNAL IDENTITY NODE
 * Tier 2/3 Bridge: Returns the verified session data for the UI.
 * This is the real implementation, replacing the mock.
 */
export async function GET() {
  try {
    // 🔐 1. Identity Handshake: Verify the stateless JWT session
    const session = await getMerchantSession();

    // 2. Protocol Check: If no session, return unauthorized
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Authentication Required" },
        { status: 401 }
      );
    }

    /**
     * 🏁 3. DATA SERIALIZATION
     * We convert BigInt (telegramId) and Decimal (balance) to strings
     * to prevent Next.js 16 JSON serialization crashes.
     */
    return NextResponse.json({
      success: true,
      data: {
        id: session.user.id,
        telegramId: session.user.telegramId.toString(),
        fullName: session.user.fullName,
        username: session.user.username,
        role: session.user.role,
        merchant: {
          id: session.merchant.id,
          companyName: session.merchant.companyName,
          // Ensuring the balance is treated as a high-precision string
          availableBalance: session.merchant.availableBalance?.toString() || "0.00",
          planStatus: session.merchant.planStatus,
          isActive: session.merchant.isActive
        }
      }
    });
  } catch (error) {
    console.error("🔥 Profile API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Protocol Failure" },
      { status: 500 }
    );
  }
}