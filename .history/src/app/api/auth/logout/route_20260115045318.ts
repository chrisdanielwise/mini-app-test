import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { 
  getUserFromRequest, 
  getCookieMetadata 
} from "@/lib/services/auth.service";
import { logAuthEvent } from "@/lib/services/audit.service";

/**
 * 🧹 ATOMIC SESSION EXPULSION (Institutional v16.16.14)
 * Logic: Decoupled Function Ingress for Turbopack Stabilization.
 * Feature: CHIPS-Compatible Cookie Death + Clear-Site-Data Header.
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    // 🛡️ 1. RESOLVE IDENTITY (Atomic Call)
    // We no longer call AuthService.getUserFromRequest
    const user = await getUserFromRequest();
    
    // 🛡️ 2. FETCH COOKIE METADATA
    // Simplified to remove host/protocol params that cause serialization lag
    const cookieMetadata = getCookieMetadata(user?.role);

    // 🛡️ 3. CRYPTOGRAPHIC PURGE (Cookie Death)
    // We set maxAge: 0 and partitioned: true to ensure cross-site TMA deletion
    cookieStore.set({
      name: cookieMetadata.name,
      value: "",
      ...cookieMetadata.options,
      maxAge: 0,
      expires: new Date(0),
    });

    // 🛡️ 4. SECURITY AUDIT (Refactored Call)
    if (user) {
      const ip = request.headers.get("x-forwarded-for")?.split(',')[0] || "0.0.0.0";
      await logAuthEvent(user.id, ip, "MANUAL_LOGOUT");
    }

    const response = NextResponse.json({ 
      success: true, 
      message: "SESSION_TERMINATED" 
    });

    // 🛡️ 5. GLOBAL CLEARANCE
    // Institutional header that wipes local storage and session buffers
    response.headers.set("Clear-Site-Data", '"cookies", "storage"');
    
    // 🚀 6. CROSS-TAB SIGNAL
    // Signals the frontend interceptor to broadcast SIG_LOGOUT
    response.headers.set("x-auth-signal", "SIG_LOGOUT");

    return response;

  } catch (error: any) {
    console.error("🔥 [Logout_API_Crash]:", error.message);
    return NextResponse.json({ 
      error: "LOGOUT_FAILED",
      reason: "INTERNAL_CORE_FAULT" 
    }, { status: 500 });
  }
}