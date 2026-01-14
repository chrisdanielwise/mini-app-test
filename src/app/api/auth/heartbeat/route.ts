import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";

/**
 * 💓 SESSION HEARTBEAT (Institutional v13.0.5)
 * Logic: Extends JWT expiration for active users to prevent session timeout.
 */
export async function POST(request: NextRequest) {
  try {
    // ✅ Extract user identity from current valid session
    const user = await AuthService.getUserFromRequest(request);

    if (!user) {
      console.warn("⚠️ [Heartbeat_Reject]: Unauthenticated pulse ignored.");
      return NextResponse.json({ active: false }, { status: 401 });
    }

    // 🚀 Refresh: Generate a fresh session token with new expiry
    const sessionToken = await AuthService.createSession(user);
    
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    
    // Resolve institutional cookie metadata (Safari 2026 / Partitioning aware)
    const cookieMetadata = AuthService.getCookieMetadata(host, protocol);

    const response = NextResponse.json({ 
      active: true, 
      timestamp: new Date().toISOString(),
      role: user.role
    });
    
    // Set the refreshed HttpOnly Cookie
    response.cookies.set({
      name: cookieMetadata.name,
      value: sessionToken,
      ...cookieMetadata.options,
    });

    return response;
  } catch (error: any) {
    console.error("🔥 [Heartbeat_Crash]:", error.message);
    return NextResponse.json({ active: false, error: "PULSE_FAILED" }, { status: 500 });
  }
}