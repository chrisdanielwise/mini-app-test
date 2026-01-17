/**
 * 🔐 UNIVERSAL AUTH CONFIG (Institutional v16.16.12)
 * Hardened for: Next.js 15, Safari 2026, and TMA Partitioning.
 */

// 🛡️ SECRET ANCHOR: Uses TextEncoder for 'jose' compatibility in Edge/Middleware
const RAW_SECRET = process.env.JWT_SECRET || "zipha_secure_node_secret_2026_institutional";
export const JWT_SECRET_UINT8 = new TextEncoder().encode(RAW_SECRET);

export const JWT_CONFIG = {
  secret: ,
  cookieName: "session_node_identity", 
  
  // 🚀 TIERED PERSISTENCE (In Seconds)
  maxAge: {
    staff: 86400,    // 24h
    merchant: 604800, // 7d
    default: 2592000  // 30d
  },

  cookieOptions: {
    httpOnly: true, // Prevents XSS-based identity theft
    path: "/",
    priority: "high" as const, // Hints to the browser to prioritize this cookie during cleanup
  },

  endpoints: {
    telegramAuth: "/api/auth/telegram",
    magicHandshake: "/api/auth/magic", 
    profile: "/api/user/profile",
    logout: "/api/auth/logout",
    heartbeat: "/api/auth/heartbeat"
  },

  staffRoles: ["super_admin", "platform_manager", "platform_support", "amber"],
};

/**
 * 🛰️ SECURITY CONTEXT RESOLVER
 * Logic: Dynamically adjusts sameSite and partitioned flags based on protocol.
 */
export const getSecurityContext = (host: string | null, protocol: string | null) => {
  // 🛡️ Tunnels/Dev Detection: Ensures cookies work in local testing environments
  const isTunnel = host?.includes("trycloudflare.com") || host?.includes("ngrok") || host?.includes("localhost");
  const isHttps = protocol === "https" || isTunnel;
  
  // 🏁 2026 Standard: Secure + None + Partitioned is mandatory for TMA Iframe context
  return {
    secure: isHttps,
    sameSite: isHttps ? ("none" as const) : ("lax" as const),
    partitioned: isHttps, // CHIPS Protocol: Vital for Safari 2026
    domain: (isTunnel && host) ? host.split(':')[0] : undefined
  };
};