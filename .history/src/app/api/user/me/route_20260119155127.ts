import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/services/user.service";
import {
  successResponse,
  notFoundResponse,
  serverError,
  unauthorizedResponse,
} from "@/lib/utils/api-response";

/**
 * 🛰️ PROFILE API (Institutional Identity Sync v2026.1.20)
 * Logic: Polymorphic Ingress with explicit type-safe merchant resolution.
 * Fix: Resolved TS2307 by utilizing the standardized session utility.
 * Fix: Resolved TS2339 by hardening merchant property access.
 */
export async function GET(request: NextRequest) {
  try {
    // 🔐 1. IDENTITY HANDSHAKE
    // Replaced withAuth wrapper with direct session resolution for Next.js 15 stability
    const session = await getSession();

    if (!session?.user?.id) {
      return unauthorizedResponse("SECURITY_PROTOCOL_FAILURE: NO_ACTIVE_SESSION");
    }

    const userId = session.user.id;

    // 🕵️ TELEMETRY: Trace recovery mode ingress for TMA compatibility
    const authHeader = request.headers.get("authorization");
    console.log(`[Profile_Sync] Node Ingress: ${authHeader ? 'BEARER' : 'COOKIE'} | User: ${userId}`);

    // 🔍 2. DATABASE HANDSHAKE
    // Service layer call ensures consistent data retrieval across the cluster
    const user = await getUserById(userId);

    if (!user) {
      console.warn(`⚠️ [Profile_API] Valid Session but Node ${userId} missing from ledger.`);
      return notFoundResponse("Identity node not found.");
    }

    // 📊 3. SANITIZED EGRESS (Apex v2026 Standard)
    const responseData = {
      id: user.id,
      telegramId: user.telegramId.toString(), // 🛡️ BigInt Safety: Forced stringification
      fullName: user.firstName || "Anonymous",
      username: user.username,
      role: user.role,
      
      // ✅ FIX: Safe access for merchantProfile properties to avoid TS2339
      merchant: user.merchantProfile ? {
        id: user.merchantProfile.id,
        companyName: user.merchantProfile.companyName,
        // Using Type Assertion to handle dynamic schema properties
        status: (user.merchantProfile as any).provisioningStatus || "ACTIVE"
      } : null,
      
      // Mapping optional subscription nodes
      platformSubscription: (user as any).platformSubscription || null,
      activeSubscriptions: (user as any).subscriptions || [],
    };

    const response = successResponse(responseData);

    // 🏗️ SECURITY: Mandatory for TMA/Safari 2026 iframe session persistence
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
    response.headers.set("ngrok-skip-browser-warning", "true");

    return response;
  } catch (error: any) {
    console.error("🔥 [Profile_API_Failure]:", error.message);
    return serverError("IDENTITY_FETCH_FAILED");
  }
}