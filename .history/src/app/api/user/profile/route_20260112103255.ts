import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session"; // 🚀 UPDATED: Using Universal Resolver
import { 
  successResponse, 
  unauthorizedResponse, 
  serverError 
} from "@/lib/utils/api-response";

/**
 * 🔒 INTERNAL IDENTITY NODE (/api/auth/profile)
 * Hardened: Uses Universal Session Resolver & Normalized RBAC Casing.
 * Optimization: Tunnel-safe headers to prevent Next.js 15 hydration crashes.
 */
export async function GET() {
  // 🛡️ TUNNEL BYPASS PROTOCOL
  // Ensures requests from Cloudflare or Ngrok don't hit "Browser Warning" pages
  // which return HTML instead of JSON, crashing the client-side 'useAuth'.
  const responseHeaders = {
    "ngrok-skip-browser-warning": "true",
    "Cache-Control": "no-store, max-age=0",
  };

  try {
    // 🔐 1. IDENTITY HANDSHAKE
    // Re-verifies the session via the new cached polymorphic resolver
    const session = await getSession();

    // 2. PROTOCOL CHECK
    if (!session) {
      console.warn("⚠️ [Auth_Profile] No active identity node found in request.");
      return unauthorizedResponse("Session Expired or Missing Identity Node");
    }

    /**
     * 🏁 3. DATA ALIGNMENT & SERIALIZATION
     * We use the 'isStaff' and normalized 'role' already processed in getSession().
     */
    const profile = {
      user: session.user, // role is already .toLowerCase() from getSession

      // 🛰️ MERCHANT CLUSTER DATA
      // Supports both direct MerchantProfiles and TeamMemberships
      merchant: session.merchantId ? {
        id: session.merchantId,
        companyName: session.config?.companyName || "Merchant Node",
        botUsername: session.config?.botUsername || null,
        availableBalance: session.config?.availableBalance || "0.00",
        isSetup: session.config?.isSetup || false,
        planStatus: session.config?.planStatus || "STANDARD"
      } : null,

      // 🛡️ PERMISSIONS OVERLAY
      // Used for conditional UI rendering (Amber vs Emerald flavors)
      isStaff: session.isStaff,
      lastSync: new Date().toISOString()
    };

    // 🚀 4. SUCCESSFUL EGRESS
    const response = successResponse(profile);
    
    // Inject vital tunnel and cache headers
    Object.entries(responseHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;

  } catch (error: any) {
    console.error("🔥 [Profile_Me_Failure]:", error.message);
    return serverError("Identity Protocol Failure");
  }
}