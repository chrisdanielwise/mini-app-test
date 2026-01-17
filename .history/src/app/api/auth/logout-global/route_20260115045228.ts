import { NextRequest, NextResponse } from "next/server";
import { 
  getUserFromRequest, 
  rotateSecurityStamp, 
  getCookieMetadata 
} from "@/lib/services/auth.service";
import { logAuthEvent } from "@/lib/services/audit.service"; // ✅ Atomic Import

/**
 * 🛰️ GLOBAL PROTOCOL EXPULSION (Institutional v16.16.14)
 * Logic: Rotates the Identity Anchor (Security Stamp).
 * Result: Instantly invalidates all JWTs across all devices for the actor.
 * Fix: Uses Atomic Ingress Functions to resolve Turbopack Export Errors.
 */
export async function POST(request: NextRequest) {
  try {
    // 🛡️ 1. Resolve Identity (Atomic Call)
    const user = await getUserFromRequest();
    
    if (!user) {
      return NextResponse.json({ 
        error: "UNAUTHORIZED_REVOCATION",
        reason: "IDENTITY_NOT_FOUND" 
      }, { status: 401 });
    }

    // 🛡️ 2. Resolve Network Context
    const ip = request.headers.get("x-forwarded-for")?.split(',')[0] || "0.0.0.0";
    const ua = request.headers.get("user-agent");

    // 🚀 3. THE KILL SWITCH: Rotate the database-level stamp
    // This makes the 'securityStamp' stored in existing JWTs obsolete.
    await rotateSecurityStamp(user.id);

    // 🛡️ 4. Security Audit Trail (v16.16.14 Refactored Call)
    await logAuthEvent(user.id, ip, "GLOBAL_REMOTE_WIPE");

    console.log(`✅ [Security_Sentinel]: Global wipe completed for Node ${user.id}`);

    // 🛡️ 5. Clean up the current session state
    const response = NextResponse.json({ 
      success: true, 
      message: "GLOBAL_REVOCATION_COMPLETE" 
    });

    // Clear current cookie buffers using the hardened metadata
    const cookieMeta = getCookieMetadata(user.role);

    response.cookies.set(cookieMeta.name, "", { 
      ...cookieMeta.options, 
      maxAge: 0 
    });

    // 🌐 2026 Privacy Standard: Clear local storage buffers via header
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