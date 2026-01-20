import { NextRequest, NextResponse } from "next/server";
import { 
  getUserFromRequest, 
  createSession, 
  getCookieMetadata 
} from "@/lib/services/auth.service";

/**
 * 💓 SESSION_HEARTBEAT (Institutional Apex v2026.1.20)
 * Strategy: Atomic Signal Refresh & Partitioned Identity Anchors.
 * Mission: Extend session TTL for active nodes and prevent TMA iframe auth-drops.
 */
export async function POST(request: NextRequest) {
  try {
    // 🛡️ 1. IDENTITY HANDSHAKE (Atomic Ingress)
    // Ensures we resolve the user from either the Bearer token or existing Cookie
    const user = await getUserFromRequest(request);

    if (!user) {
      console.warn("⚠️ [Heartbeat_Reject]: Unauthenticated pulse ignored. Voiding node.");
      return NextResponse.json({ 
        active: false,
        status: "UNAUTHORIZED_SIGNAL" 
      }, { status: 401 });
    }

    // 🚀 2. REGENERATE: Sliding expiration logic
    // Refreshes the JWT with a fresh IAT (Issued At) and EXP (Expiration)
    const sessionToken = await createSession(user);
    
    // 🛡️ 3. METADATA ACQUISITION
    // Fetches security flags (httpOnly, secure, sameSite) based on user clearance
    const cookieMetadata = getCookieMetadata(user.role);

    const response = NextResponse.json({ 
      active: true, 
      timestamp: new Date().toISOString(),
      role: user.role.toUpperCase(),
      signal: "PULSE_STABLE"
    });
    
    // 🍪 4. ANCHOR SET: 2026 Telegram Sandbox Compatibility
    // 'partitioned: true' (CHIPS) allows the cookie to be sent in cross-site contexts
    // like the Telegram Webview on iOS/Android.
    response.cookies.set({
      name: cookieMetadata.name,
      value: sessionToken,
      ...cookieMetadata.options,
      partitioned: true, 
      path: "/",
      sameSite: "none", // Required when partitioned is true
      secure: true,     // Required when partitioned is true
    });

    return response;
  } catch (error: any) {
    console.error("🔥 [Heartbeat_Crash]: Internal Signal Failure", error.message);
    return NextResponse.json({ 
      active: false, 
      error: "INTERNAL_CORE_FAULT",
      reason: error.message || "PULSE_TIMEOUT"
    }, { status: 500 });
  }
}