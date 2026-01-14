/**
 * 🔐 UNIVERSAL AUTH CONFIG (Institutional v16.11.0)
 * Hardened for: Safari 2026, Cloudflare Tunnels, and TMA Partitioning.
 * Logic: Persistent Identity Anchoring with 30-Day TTL.
 */

const RAW_SECRET = process.env.JWT_SECRET || "zipha_secure_node_secret_2026_institutional";
// 🚀 CRITICAL: Stable Uint8Array for environment-agnostic verification
export const JWT_SECRET_UINT8 = new TextEncoder().encode(RAW_SECRET);

export const JWT_CONFIG = {
  secret: JWT_SECRET_UINT8,
  cookieName: "session_node_identity", // Synchronized with Middleware
  
  // 🚀 SESSION PERSISTENCE: 30-Day TTL for frictionless re-entry

  cookieOptions: {
    httpOnly: true,
    path: "/",
    // 🚀 MAX AGE: 30 days in seconds (30 * 24 * 60 * 60)
    maxAge: 2592000, 
    priority: "high" as const,
  },
  endpoints: {
    telegramAuth: "/api/auth/telegram",
    magicHandshake: "/api/auth/magic", 
    profile: "/api/user/profile",
    logout: "/api/auth/logout",
    heartbeat: "/api/auth/heartbeat"
  },
  // Normalized for case-insensitive role verification
  staffRoles: ["super_admin", "platform_manager", "platform_support", "amber"],
};

/**
 * 🛰️ SECURITY CONTEXT RESOLVER
 * Logic: Enforces CHIPS (Partitioned) and SameSite: None for TMA environments.
 */
export const getSecurityContext = (host: string | null, protocol: string | null) => {
  // Detect if running through an institutional tunnel
  const isTunnel = host?.includes("trycloudflare.com") || host?.includes("ngrok") || host?.includes("localhost");
  const isHttps = protocol === "https" || isTunnel;
  const isProd = process.env.NODE_ENV === "production";
  
  const useSecure = isHttps || isProd;

  return {
    secure: useSecure,
    // 🛡️ 'none' is mandatory for Telegram WebApp cookie acceptance
    sameSite: useSecure ? ("none" as const) : ("lax" as const),
    // 🛡️ 'partitioned' is mandatory for Safari 2026 / TMA isolation
    partitioned: useSecure,
    // 🛡️ Domain isolation prevents session ghosting
    domain: (isTunnel && host) ? host.split(':')[0] : undefined
  };
};