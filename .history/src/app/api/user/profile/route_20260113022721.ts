import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session"; 
import {
  successResponse,
  unauthorizedResponse,
  serverError,
} from "@/lib/utils/api-response";
import { JWT_CONFIG } from "@/lib/auth/config"; // 🚀 Centralized Source of Truth

/**
 * 🔒 INTERNAL IDENTITY NODE (Institutional v12.11.0)
 * Logic: Polymorphic Identity Resolution (Cookie or Bearer fallback).
 * Hardened: Tunnel-safe headers and Next.js 16 Cross-Origin compliance.
 */
export async function GET() {
  // 🛡️ TUNNEL BYPASS PROTOCOL
  // Prevents Cloudflare/Ngrok from returning HTML warning pages during JSON requests.
  const responseHeaders = {
    "ngrok-skip-browser-warning": "true",
    "Cache-Control": "no-store, max-age=0, must-revalidate",
    "Pragma": "no-cache",
  };

  try {
    // 🔐 1. IDENTITY HANDSHAKE
    // getSession() automatically checks Cookie first, then Authorization: Bearer.
    // This allows the useAuth hook to recover sessions even if cookies are blocked.
    const session = await getSession();

    // 2. PROTOCOL VALIDATION
    if (!session) {
      console.warn("⚠️ [Auth_Profile] Unauthorized request: Missing or Expired Identity Node.");
      return unauthorizedResponse("SESSION_INVALID_OR_EXPIRED");
    }

    /**
     * 🏁 3. DATA ALIGNMENT & SERIALIZATION
     * Hydrates the UI with synchronized data from the DB + JWT.
     */
    const profile = {
      user: session.user, // id, fullName, role, username, telegramId

      // 🛰️ MERCHANT CLUSTER DATA
      // Standardizes the context for Owners, Agents, and Staff.
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
      // Used by the frontend for conditional feature rendering.
      isStaff: session.isStaff,
      syncId: session.user.id.substring(0, 8), // Debug/Sync ID
      lastSync: new Date().toISOString(),
    };

    // 🚀 4. SUCCESSFUL EGRESS
    const response = successResponse(profile);

    // 🏗️ SECURITY HEADERS: Essential for Safari Iframe / Telegram Mini App
    response.headers.set("Access-Control-Allow-Credentials", "true");
    
    // Inject tunnel-bypass and anti-cache headers
    Object.entries(responseHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    console.log(`✅ [Profile_Me] Identity Verified: ${session.user.id} | Mode: ${session.isStaff ? 'STAFF' : 'USER'}`);
    return response;

  } catch (error: any) {
    console.error("🔥 [Profile_Me_Failure]:", error.message);
    return serverError("IDENTITY_PROTOCOL_CRASH");
  }
}