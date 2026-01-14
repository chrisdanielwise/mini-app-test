/**
 * 🔐 UNIVERSAL AUTH CONFIG (Institutional v14.16.0)
 * Hardened for: Safari 2026, Cloudflare Tunnels, and TMA Partitioning.
 */

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_node_secret_2026_institutional"
);
// 🚀 CRITICAL: Create a stable Uint8Array for all environments
export const JWT_SECRET_UINT8 = new TextEncoder().encode(RAW_SECRET);

export const JWT_CONFIG = {
  secret,
  cookieName: "auth_token",
  cookieOptions: {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 Days
  },
  endpoints: {
    telegramAuth: "/api/auth/telegram",
    magicHandshake: "/api/auth/magic", 
    profile: "/api/user/profile",
    logout: "/api/auth/logout",
    heartbeat: "/api/auth/heartbeat"
  },
  staffRoles: ["SUPER_ADMIN", "PLATFORM_MANAGER"],
};

/**
 * 🛰️ SECURITY CONTEXT RESOLVER
 * Logic: Enforces 'Partitioned' and 'SameSite: None' for Tunnel/TMA environments.
 */
export const getSecurityContext = (host: string | null, protocol: string | null) => {
  // Detect if we are running through an institutional tunnel
  const isTunnel = host?.includes("trycloudflare.com") || host?.includes("ngrok");
  const isHttps = protocol === "https" || isTunnel;
  const isProd = process.env.NODE_ENV === "production";
  
  const useSecure = isHttps || isProd;

  return {
    secure: useSecure,
    // 🛡️ MUST be 'none' for Telegram WebApp to accept the cookie via a tunnel
    sameSite: useSecure ? ("none" as const) : ("lax" as const),
    // 🛡️ MUST be true for Safari 2026 / CHIPS support
    partitioned: useSecure,
    // 🛡️ Explicitly define the domain to prevent localhost/tunnel collisions
    domain: (isTunnel && host) ? host.split(':')[0] : undefined
  };
};