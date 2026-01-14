import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";
import { AuditService } from "@/lib/services/audit.service";

/**
 * 🛰️ GLOBAL PROTOCOL EXPULSION (Institutional v14.8.0)
 * Logic: Rotates the Identity Anchor (Security Stamp).
 * Result: Instantly invalidates all JWTs across all devices for the actor.
 */
export async function POST(request: NextRequest) {
  try {
    // 🛡️ 1. Resolve Identity
    const user = await AuthService.getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED_REVOCATION" }, { status: 401 });
    }

    // 🛡️ 2. Resolve Network Context
    const ip = request.headers.get("x-forwarded-for")?.split(',')[0] || "0.0.0.0";
    const ua = request.headers.get("user-agent");

    // 🚀 3. THE KILL SWITCH: Rotate the database-level stamp
    // This makes the 'securityStamp' stored in existing cookies obsolete.
    await AuthService.rotateSecurityStamp(user.id);

    // 🛡️ 4. Security Audit Trail
    await AuditService.log({
      userId: user.id,
      merchantId: user.merchantId,
      action: "REMOTE_WIPE",
      ip: ip,
      metadata: {
        method: "GLOBAL_REVOCATION_PROTOCOL",
        ua: ua,
        timestamp: new Date().toISOString()
      }
    });

    console.log(`✅ [Security_Sentinel]: Global wipe completed for Node ${user.id}`);

    // 🛡️ 5. Clean up the current browser's local state
    const response = NextResponse.json({ 
      success: true, 
      message: "GLOBAL_REVOCATION_COMPLETE" 
    });

    // Clear current cookie and local storage buffers
    const cookieMeta = AuthService.getCookieMetadata(
      request.headers.get("host"), 
      request.headers.get("x-forwarded-proto") || "https"
    );

    response.cookies.delete(cookieMeta.name);
    response.headers.set("Clear-Site-Data", '"cookies", "storage"');

    return response;

  } catch (error: any) {
    console.error("🔥 [Global_Logout_Crash]:", error.message);
    return NextResponse.json({ 
      error: "REVOCATION_FAILURE",
      reason: "INTERNAL_CORE_ERROR" 
    }, { status: 500 });
  }
}