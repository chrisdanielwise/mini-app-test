import { NextRequest, NextResponse } from "next/server";
import { 
  getUserFromRequest, 
  createSession, 
  getCookieMetadata 
} from "@/lib/services/auth.service";

/**
 * 💓 SESSION HEARTBEAT (Institutional v16.16.14)
 * Logic: Extends JWT expiration for active users to prevent session timeout.
 * Fix: Uses Atomic Ingress Functions to resolve Turbopack Export Errors.
 */
export async function POST(request: NextRequest) {
  try {
    // 🛡️ 1. RESOLVE IDENTITY (Atomic Call)
    // De-referenced from AuthService object to prevent serialization failure.
    const user = await getUserFromRequest();

    if (!user) {
      console.warn("⚠️ [Heartbeat_Reject]: Unauthenticated pulse ignored.");
      return NextResponse.json({ active: false }, { status: 401 });
    }

    // 🚀 2. REFRESH: Generate fresh session with new expiry (Staff: 24h | User: 7d)
    const sessionToken = await createSession(user);
    
    // 🛡️ 3. COOKIE METADATA: Simplified for 2026 TMA Contexts
    // Removed host/protocol params to prevent Proxy_Fault signature errors.
    const cookieMetadata = getCookieMetadata(user.role);

    const response = NextResponse.json({ 
      active: true, 
      timestamp: new Date().toISOString(),
      role: user.role
    });
    
    // 🍪 4. SET REFRESHED IDENTITY ANCHOR
    // Partitioned (CHIPS) enabled for Telegram Mini App iframe persistence.
    response.cookies.set({
      name: cookieMetadata.name,
      value: sessionToken,
      ...cookieMetadata.options,
    });

    return response;
  } catch (error: any) {
    console.error("🔥 [Heartbeat_Crash]:", error.message);
    return NextResponse.json({ 
      active: false, 
      error: "PULSE_FAILED",
      reason: "INTERNAL_CORE_FAULT"
    }, { status: 500 });
  }
}