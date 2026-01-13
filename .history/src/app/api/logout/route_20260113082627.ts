import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthService } from "@/lib/services/auth.service";
import { JWT_CONFIG } from "@/lib/auth/config";

/**
 * 🧹 ATOMIC SESSION EXPULSION (Institutional v13.9.8)
 * Logic: Clears the HttpOnly Cookie across all security partitions.
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    
    // 1. Resolve Environment Security Context
    const host = request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const cookieMetadata = AuthService.getCookieMetadata(host, protocol);

    // 2. Instruct Browser to Expunge the Cookie
    // We set maxAge to 0 and an expiration date in the past to force immediate deletion.
    cookieStore.set({
      name: cookieMetadata.name,
      value: "",
      ...cookieMetadata.options,
      maxAge: 0,
      expires: new Date(0),
    });

    console.log("✅ [Auth_Logout] Global Session Cookie Purged.");
    
    return NextResponse.json({ 
      success: true, 
      message: "SESSION_TERMINATED" 
    });
  } catch (error: any) {
    console.error("🔥 [Logout_API_Crash]:", error.message);
    return NextResponse.json({ error: "LOGOUT_FAILED" }, { status: 500 });
  }
}