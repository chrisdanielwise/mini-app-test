/**
 * 🔐 UNIVERSAL AUTH CONFIG (Institutional v16.16.2)
 * Hardened for: Safari 2026, Cloudflare Tunnels, and TMA Partitioning.
 */

const RAW_SECRET = process.env.JWT_SECRET || "zipha_secure_node_secret_2026_institutional";
export const JWT_SECRET_UINT8 = new TextEncoder().encode(RAW_SECRET);

export const JWT_CONFIG = {
  secret: JWT_SECRET_UINT8,
  cookieName: "session_node_identity", 
  
  // 🚀 TIERED PERSISTENCE CONSTANTS (In Seconds)
  // Logic: Matches your AuthService createSession logic exactly.
  maxAge: {
    staff: 86400,    // 24h
    merchant: 604800, // 7d
    default: 2592000  // 30d (Optional/Fallback)
  },

  cookieOptions: {
    httpOnly: true,
    path: "/",
    priority: "high" as const,
  },

  endpoints: {
    telegramAuth: "/api/auth/telegram",
    magicHandshake: "/api/auth/magic", 
    profile: "/api/user/profile",   // 🚀 Ensure src/app/api/user/profile/route.ts exists
    logout: "/api/auth/logout",      // 🚀 Ensure src/app/api/auth/logout/route.ts exists
    heartbeat: "/api/auth/heartbeat" // 🚀 Ensure src/app/api/auth/heartbeat/route.ts exists
  },

  staffRoles: ["super_admin", "platform_manager", "platform_support", "amber"],
};

/**
 * 🛰️ SECURITY CONTEXT RESOLVER
 */
export const getSecurityContext = (host: string | null, protocol: string | null) => {
  const isTunnel = host?.includes("trycloudflare.com") || host?.includes("ngrok") || host?.includes("localhost");
  const isHttps = protocol === "https" || isTunnel;
  
  const useSecure = isHttps;

  return {
    secure: useSecure,
    sameSite: useSecure ? ("none" as const) : ("lax" as const),
    partitioned: useSecure,
    // 🛡️ Ensure we split port for local development environments
    domain: (isTunnel && host) ? host.split(':')[0] : undefined
  };
};