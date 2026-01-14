import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthService } from "@/lib/services/auth.service";
import { AuditService } from "@/lib/services/audit.service";
import { JWT_CONFIG } from "@/lib/auth/config";

/**
 * 🧹 ATOMIC SESSION EXPULSION (Institutional v14.0.0)
 * Logic: Dual-layer Purge (Server-side Audit + Client-side Cookie Wipe).
 * Security: Prevents session ghosting by ensuring Audit Log commits before cookie death.
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    // 🛡️ 1. IDENTITY CAPTURE
    // Extract identity while the cookie is still valid to ensure accurate auditing.
    const user = await AuthService.getUserFromRequest(request);
    
    // 🛡️ 2. SECURITY CONTEXT RESOLUTION
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    
    // Pass the user role to ensure the correct Tiered Cookie (24h vs 7d) is targeted
    const cookieMetadata = AuthService.getCookieMetadata(host, protocol, user?.role);

    // 🛡️ 3. CRYPTOGRAPHIC PURGE
    // Force immediate browser-level deletion across all security partitions.
    cookieStore.set({
      name: cookieMetadata.name,
      value: "",
      ...cookieMetadata.options,
      maxAge: 0,
      expires: new Date(0),
    });

    // 🛡️ 4. SECURITY AUDIT DISPATCH
    if (user) {
      await AuditService.log({
        userId: user.id,
        merchantId: user.merchantId,
        action: "LOGOUT",
        ip: request.headers.get("x-forwarded-for")?.split(',')[0] || "0.0.0.0",
        metadata: {
          method: "MANUAL_TERMINATION",
          ua: request.headers.get("user-agent"),
          protocol: "ATOMIC_V14"
        }
      });
      console.log(`✅ [Auth_Logout]: Node ${user.id} session terminated & logged.`);
    }

    const response = NextResponse.json({ 
      success: true, 
      message: "SESSION_TERMINATED",
      timestamp: new Date().toISOString()
    });

    // Final header cleanup to prevent state bleeding
    response.headers.set("Clear-Site-Data", '"cookies", "storage"');

    return response;

  } catch (error: any) {
    console.error("🔥 [Logout_API_Crash]:", error.message);
    return NextResponse.json({ 
      error: "LOGOUT_FAILED",
      reason: "INTERNAL_NODE_ERROR" 
    }, { status: 500 });
  }
}