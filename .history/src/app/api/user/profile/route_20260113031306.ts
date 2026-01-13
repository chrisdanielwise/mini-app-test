import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session"; 
import {
  successResponse,
  unauthorizedResponse,
  serverError,
} from "@/lib/utils/api-response";
import { JWT_CONFIG } from "@/lib/auth/config";

/**
 * 🔒 INTERNAL IDENTITY NODE (Institutional v12.18.0)
 * Logic: Polymorphic Identity Resolution (Cookie or Bearer fallback).
 * Performance: Optimized for the 2026 TMA Native Hybrid Protocol.
 */
export async function GET() {
  // 🛡️ TUNNEL & CACHE SHIELD
  // Mandatory for Ngrok/Cloudflare tunnels to prevent HTML interstitial pages.
  const responseHeaders = {
    "ngrok-skip-browser-warning": "true",
    "Cache-Control": "no-store, max-age=0, must-revalidate",
    "Pragma": "no-cache",
    "Access-Control-Allow-Credentials": "true",
  };

  try {
    // 🔐 1. IDENTITY HANDSHAKE
    // Re-verifies the session node. If cookies are blocked by Safari, 
    // it seamlessly falls back to the Authorization: Bearer header.
    const session = await getSession();

    // 2. PROTOCOL VALIDATION
    if (!session) {
      console.warn("⚠️ [Auth_Profile] Unauthorized Ingress: Session Node missing.");
      return unauthorizedResponse("SESSION_INVALID");
    }

    /**
     * 🏁 3. DATA ALIGNMENT
     * Data is pulled from the React-cached getSession() to prevent redundant DB hits.
     */
    const profile = {
      user: session.user,

      // 🛰️ MERCHANT CLUSTER DATA
      merchant: session.merchantId
        ? {
            id: session.merchantId,
            companyName: session.config?.companyName || "Operational Node",
            botUsername: session.config?.botUsername || null,
            planStatus: session.config?.planStatus || "FREE",
            isOwner: session.config?.isOwner || false,
            isSetup: session.config?.isSetup || false,
          }
        : null,

      // 🛡️ PERMISSIONS & AUDIT
      isStaff: session.isStaff,
      syncId: session.user.id.substring(0, 8),
      lastSync: new Date().toISOString(),
    };

    // 🚀 4. SUCCESSFUL EGRESS
    const response = successResponse(profile);
    
    // Apply institutional headers
    Object.entries(responseHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    // 🕵️ TELEMETRY: Identify if the session was recovered via Bearer
    // This helps debug the "Safari Iframe" cookie issue.
    console.log(`✅ [Profile_Me] Identity Verified: ${session.user.id}`);
    
    return response;

  } catch (error: any) {
    console.error("🔥 [Profile_Me_Failure]:", error.message);
    return serverError("IDENTITY_SYNC_CRASH");
  }
}