import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthService } from "@/lib/services/auth.service";
import { AuditService } from "@/lib/services/audit.service";
import { JWT_CONFIG } from "@/lib/auth/config";

/**
 * 🧹 ATOMIC SESSION EXPULSION (Institutional v14.10.0)
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await AuthService.getUserFromRequest(request);
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    
    // Ensure we target the correct role-based cookie name
    const cookieMetadata = AuthService.getCookieMetadata(host, protocol, user?.role);

    // 🛡️ 1. CRYPTOGRAPHIC PURGE (Cookie Death)
    cookieStore.set({
      name: cookieMetadata.name,
      value: "",
      ...cookieMetadata.options,
      maxAge: 0,
      expires: new Date(0),
    });

    // 🛡️ 2. SECURITY AUDIT
    if (user) {
      await AuditService.log({
        userId: user.id,
        merchantId: user.merchantId,
        action: "LOGOUT",
        ip: request.headers.get("x-forwarded-for")?.split(',')[0] || "0.0.0.0",
        metadata: { method: "MANUAL_TERMINATION", protocol: "ATOMIC_V14" }
      });
    }

    const response = NextResponse.json({ 
      success: true, 
      message: "SESSION_TERMINATED" 
    });

    // 🛡️ 3. GLOBAL CLEARANCE
    // Clear-Site-Data is an institutional header that tells the browser 
    // to wipe EVERYTHING associated with the origin.
    response.headers.set("Clear-Site-Data", '"cookies", "storage"');
    
    // 🚀 4. CROSS-TAB SIGNAL
    // Custom header that the frontend interceptor can use to trigger a broadcast
    response.headers.set("x-auth-signal", "SIG_LOGOUT");

    return response;

  } catch (error: any) {
    console.error("🔥 [Logout_API_Crash]:", error.message);
    return NextResponse.json({ error: "LOGOUT_FAILED" }, { status: 500 });
  }
}