import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthService } from "@/lib/services/auth.service";
import { AuditService } from "@/lib/services/audit.service";
import { JWT_CONFIG } from "@/lib/auth/config";

/**
 * 🧹 ATOMIC SESSION EXPULSION (Institutional v13.9.12)
 * Logic: Clears HttpOnly Cookies + Records Security Audit.
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    
    // 🛡️ 1. Resolve Identity before purging (for the Audit Log)
    // We attempt to get the user ID from the request headers or cookie before we kill it.
    const user = await AuthService.getUserFromRequest(request as any);
    
    // 🛡️ 2. Resolve Environment Security Context
    const host = request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const cookieMetadata = AuthService.getCookieMetadata(host, protocol);

    // 🛡️ 3. Instruct Browser to Expunge the Cookie
    // We explicitly set maxAge: 0 and expires: 1970 to force immediate browser purging.
    cookieStore.set({
      name: cookieMetadata.name,
      value: "",
      ...cookieMetadata.options,
      maxAge: 0,
      expires: new Date(0),
    });

    // 🛡️ 4. Security Audit Trail
    if (user) {
      await AuditService.log({
        userId: user.id,
        merchantId: (user as any).merchantProfile?.id,
        action: "LOGOUT",
        ip: request.headers.get("x-forwarded-for") || "0.0.0.0",
        metadata: {
          method: "MANUAL_DISCONNECT",
          ua: request.headers.get("user-agent")
        }
      });
      console.log(`✅ [Auth_Logout] Node ${user.id} session terminated.`);
    }

    return NextResponse.json({ 
      success: true, 
      message: "SESSION_TERMINATED" 
    });

  } catch (error: any) {
    console.error("🔥 [Logout_API_Crash]:", error.message);
    return NextResponse.json({ 
      error: "LOGOUT_FAILED",
      reason: error.message 
    }, { status: 500 });
  }
}