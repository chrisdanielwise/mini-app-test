import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db"; 
import {  verifySession } from "@/lib/services/auth.service";
import { JWT_CONFIG } from "@/lib/auth/config";
import {
  successResponse,
  unauthorizedResponse,
  errorResponse,
} from "@/lib/utils/api-response";

/**
 * 🔒 INTERNAL IDENTITY NODE (Institutional v16.16.9)
 * Logic: Thin-Fetch Gating to bypass 11s+ Database Congestion.
 * Performance: Strips all relations to ensure sub-100ms Handshake.
 */
export async function GET(request: Request) {
  const responseHeaders = {
    "ngrok-skip-browser-warning": "true",
    "Cache-Control": "no-store, max-age=0, must-revalidate",
    "Pragma": "no-cache",
    "Access-Control-Allow-Credentials": "true",
  };

  try {
    if (!prisma?.systemConfig) {
      console.error("🔥 [Profile_Me_Critical]: SystemConfig model unreachable.");
      return errorResponse("DB_INITIALIZATION_ERROR", 500);
    }

    /**
     * 🛠️ 1. SYSTEM CONFIGURATION HYDRATION (Thin Fetch)
     * Fetches only necessary broadcast/maintenance flags.
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

    if (systemStatus?.maintenanceMode) {
      return NextResponse.json({ 
        error: "MAINTENANCE_MODE", 
        message: systemStatus.maintenanceMessage || "Node offline." 
      }, { status: 503 });
    }

    // 🔐 2. SESSION EXTRACTION
    const cookieStore = await cookies();
    const token = cookieStore.get(JWT_CONFIG.cookieName)?.value;

    if (!token) {
      return unauthorizedResponse("SESSION_MISSING");
    }

    // 🕵️ 3. IDENTITY HANDSHAKE (JWT Verification)
    const payload = await verifySession(token);

    if (!payload || !payload.sub) {
      return unauthorizedResponse("SESSION_EXPIRED");
    }

    /**
     * 🔍 4. AUTH-ONLY FETCH (The Fix)
     * 🚀 CRITICAL: We NO LONGER 'include' merchantProfile or teamMemberships.
     * This prevents the 11,000ms database lockup during login.
     */
    const user = await prisma.user.findUnique({
      where: { id: payload.sub as string },
      select: {
        id: true,
        telegramId: true,
        fullName: true,
        username: true,
        role: true,
        securityStamp: true
        // ❌ NO RELATIONS ALLOWED HERE
      }
    });

    if (!user) return unauthorizedResponse("USER_NOT_FOUND");

    // 🛰️ 5. DATA NORMALIZATION
    const normalizedRole = user.role.toLowerCase();
    const isStaff = JWT_CONFIG.staffRoles.includes(normalizedRole);

    const profile = {
      user: {
        id: user.id,
        telegramId: user.telegramId.toString(),
        username: user.username,
        fullName: user.fullName, 
        role: normalizedRole,
      },

      // 🛡️ SYSTEM BROADCAST STATE
      systemConfig: systemStatus ? {
        broadcastActive: systemStatus.broadcastActive,
        broadcastMessage: systemStatus.broadcastMessage,
        broadcastLevel: systemStatus.broadcastLevel
      } : null,

      isStaff,
      lastSync: new Date().toISOString(),
    };

    // 🏁 6. EGRESS
    const response = successResponse(profile);
    
    Object.entries(responseHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;

  } catch (error: any) {
    console.error("🔥 [Profile_Me_Failure]:", error.message);
    return errorResponse("IDENTITY_SYNC_CRASH", 500);
  }
}