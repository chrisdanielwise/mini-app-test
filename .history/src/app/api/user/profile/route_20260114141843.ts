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
 * 🔒 INTERNAL IDENTITY NODE (Institutional v16.8.0)
 * Logic: Polymorphic Identity Resolution with Soft Auth support.
 * Feature: Optimized for 2026 TMA Native Hybrid Protocol.
 */
export async function GET(request: Request) {
  // 🛡️ TUNNEL & CACHE SHIELD: Prevents caching of unauthorized states
  const responseHeaders = {
    "ngrok-skip-browser-warning": "true",
    "Cache-Control": "no-store, max-age=0, must-revalidate",
    "Pragma": "no-cache",
    "Access-Control-Allow-Credentials": "true",
  };

  try {
    // 🔐 1. SESSION EXTRACTION
    const cookieStore = await cookies();
    const token = cookieStore.get(JWT_CONFIG.cookieName)?.value;

    /**
     * 🚀 SOFT AUTH TRIGGER
     * If no token is found, return a clean 401. 
     * The /home component will catch this and redirect to login.
     */
    if (!token) {
      console.warn("⚠️ [Profile_Me] Ingress Rejected: No Session Cookie.");
      return unauthorizedResponse("SESSION_MISSING");
    }

    // 🕵️ 2. IDENTITY HANDSHAKE (JWT Verification)
    const payload = await AuthService.verifySession(token);

    if (!payload || !payload.sub) {
      return unauthorizedResponse("SESSION_EXPIRED");
    }

    // 🔍 3. RELATIONAL DATA HYDRATION
    const user = await prisma.user.findUnique({
      where: { id: payload.sub as string },
      include: {
        merchantProfile: true,
        teamMemberships: { take: 1, select: { merchantId: true } }
      }
    });

    if (!user) return unauthorizedResponse("USER_NOT_FOUND");

    // 🚀 4. DATA ALIGNMENT & NORMALIZATION
    const normalizedRole = user.role.toLowerCase();
    const isStaff = JWT_CONFIG.staffRoles.includes(normalizedRole);
    const resolvedMerchantId = user.merchantProfile?.id || user.teamMemberships[0]?.merchantId || null;

    const profile = {
      user: {
        id: user.id,
        telegramId: user.telegramId.toString(),
        username: user.username,
        fullName: user.fullName, // 🚀 Added for UI Consistency
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

      // 🛡️ PERMISSIONS & AUDIT
      isStaff,
      lastSync: new Date().toISOString(),
      nodeFingerprint: crypto.randomUUID().substring(0, 8),
    };

    // 🏁 5. EGRESS
    const response = successResponse(profile);
    
    // Apply institutional headers to the successful response
    Object.entries(responseHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;

  } catch (error: any) {
    console.error("🔥 [Profile_Me_Failure]:", error.message);
    // Standardized crash response for client-side error boundaries
    return errorResponse("IDENTITY_SYNC_CRASH", 500);
  }
}