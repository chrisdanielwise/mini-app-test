import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";
import { AuthService } from "@/lib/services/auth.service";
import { JWT_CONFIG } from "@/lib/auth/config";
import {
  successResponse,
  unauthorizedResponse,
  errorResponse,
} from "@/lib/utils/api-response";

/**
 * 🔒 INTERNAL IDENTITY NODE (Institutional v16.9.5)
 * Logic: Polymorphic Identity Resolution with Maintenance & Broadcast Sync.
 * Feature: Optimized for 2026 TMA Native Hybrid Protocol.
 */
export async function GET(request: Request) {
  // 🛡️ TUNNEL & CACHE SHIELD
  const responseHeaders = {
    "ngrok-skip-browser-warning": "true",
    "Cache-Control": "no-store, max-age=0, must-revalidate",
    "Pragma": "no-cache",
    "Access-Control-Allow-Credentials": "true",
  };

  try {
    /**
     * 🛠️ 1. SYSTEM CONFIGURATION HYDRATION
     * Architecture: Fetches global states for maintenance and emergency alerts.
     */
    const systemStatus = await prisma.systemConfig.findFirst({
      select: { 
        maintenanceMode: true, 
        maintenanceMessage: true,
        broadcastActive: true,
        broadcastMessage: true,
        broadcastLevel: true
      }
    });

    // ⛔ MAINTENANCE CIRCUIT BREAKER
    if (systemStatus?.maintenanceMode) {
      return NextResponse.json({ 
        error: "MAINTENANCE_MODE", 
        message: systemStatus.maintenanceMessage || "Node offline for scheduled maintenance." 
      }, { status: 503 });
    }

    // 🔐 2. SESSION EXTRACTION
    const cookieStore = await cookies();
    const token = cookieStore.get(JWT_CONFIG.cookieName)?.value;

    /**
     * 🚀 SOFT AUTH TRIGGER
     * Returns 401 if token is missing to trigger client-side redirection.
     */
    if (!token) {
      console.warn("⚠️ [Profile_Me] Ingress Rejected: No Session Cookie.");
      return unauthorizedResponse("SESSION_MISSING");
    }

    // 🕵️ 3. IDENTITY HANDSHAKE (JWT Verification)
    const payload = await AuthService.verifySession(token);

    if (!payload || !payload.sub) {
      return unauthorizedResponse("SESSION_EXPIRED");
    }

    // 🔍 4. RELATIONAL DATA HYDRATION
    const user = await prisma.user.findUnique({
      where: { id: payload.sub as string },
      include: {
        merchantProfile: true,
        teamMemberships: { take: 1, select: { merchantId: true } }
      }
    });

    if (!user) return unauthorizedResponse("USER_NOT_FOUND");

    // 🚀 5. DATA ALIGNMENT & NORMALIZATION
    const normalizedRole = user.role.toLowerCase();
    const isStaff = JWT_CONFIG.staffRoles.includes(normalizedRole);
    const resolvedMerchantId = user.merchantProfile?.id || user.teamMemberships[0]?.merchantId || null;

    // 🛰️ CONSTRUCT POLYMORPHIC PROFILE
    const profile = {
      user: {
        id: user.id,
        telegramId: user.telegramId.toString(),
        username: user.username,
        fullName: user.fullName, 
        role: normalizedRole,
      },

      // 🛰️ MERCHANT CLUSTER DATA
      merchant: user.merchantProfile
        ? {
            id: user.merchantProfile.id,
            companyName: user.merchantProfile.companyName || "Operational Node",
            status: user.merchantProfile.provisioningStatus,
            isOwner: true,
          }
        : resolvedMerchantId ? { id: resolvedMerchantId, isOwner: false } : null,

      // 🛡️ SYSTEM & BROADCAST STATE
      // This allows NavGuard to render emergency banners immediately.
      systemConfig: systemStatus ? {
        broadcastActive: systemStatus.broadcastActive,
        broadcastMessage: systemStatus.broadcastMessage,
        broadcastLevel: systemStatus.broadcastLevel
      } : null,

      // 🛡️ PERMISSIONS & AUDIT
      isStaff,
      lastSync: new Date().toISOString(),
      nodeFingerprint: crypto.randomUUID().substring(0, 8),
    };

    // 🏁 6. EGRESS
    const response = successResponse(profile);
    
    // Apply institutional headers to ensure no-cache behavior
    Object.entries(responseHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;

  } catch (error: any) {
    console.error("🔥 [Profile_Me_Failure]:", error.message);
    return errorResponse("IDENTITY_SYNC_CRASH", 500);
  }
}