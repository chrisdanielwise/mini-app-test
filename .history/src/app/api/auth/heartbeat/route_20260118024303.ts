import { NextRequest, NextResponse } from "next/server";
import { 
  getUserFromRequest, 
  createSession, 
  getCookieMetadata 
} from "@/lib/services/auth.service";

/**
 * 💓 SESSION_HEARTBEAT (Institutional v16.16.63)
 * Strategy: Atomic Signal Refresh & Partitioned Identity Anchors.
 * Mission: Extend session TTL for active nodes and prevent TMA iframe auth-drops.
 */
export async function POST(request: NextRequest) {
  try {
    // 🛡️ 1. IDENTITY HANDSHAKE (Atomic Ingress)
    // De-referenced function call prevents serialization conflicts during Vercel/Edge build.
    const user = await getUserFromRequest(request);

    if (!user) {
      console.warn("⚠️ [Heartbeat_Reject]: Unauthenticated pulse ignored. Voiding node.");
      return NextResponse.json({ 
        active: false,
        status: "UNAUTHORIZED_SIGNAL" 
      }, { status: 401 });
    }

    // 🚀 2. REGENERATE: New JWT with sliding expiration
    // Staff Node: 24h | Merchant Node: 7d // Defined in createSession logic.
    const sessionToken = await createSession(user);
    
    // 🛡️ 3. METADATA ACQUISITION: Hardened for 2026 TMA Contexts
    // Partitioned (CHIPS) is now mandatory for cross-site cookie persistence in Telegram.
    const cookieMetadata = getCookieMetadata(user.role);

    const response = NextResponse.json({ 
      active: true, 
      timestamp: new Date().toISOString(),
      role: user.role,
      signal: "PULSE_STABLE"
    });
    
    // 🍪 4. ANCHOR SET: Sliding Expiration Implementation
    // partitioned: true ensures the cookie survives the Telegram WebView sandbox.
    response.cookies.set({
      name: cookieMetadata.name,
      value: sessionToken,
      ...cookieMetadata.options,
      partitioned: true, // 🛰️ Vital for Telegram Mini App support
    });

    return response;
  } catch (error: any) {
    console.error("🔥 [Heartbeat_Crash]: Internal Signal Failure", error.message);
    return NextResponse.json({ 
      active: false, 
      error: "INTERNAL_CORE_FAULT",
      reason: "PULSE_TIMEOUT_OR_SERVERSIDE_CRASH"
    }, { status: 500 });
  }
}