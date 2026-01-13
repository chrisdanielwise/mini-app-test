/**
 * 🔐 UNIVERSAL AUTH CONFIG (Institutional v13.2.0)
 * Centralizes security primitives to prevent "Handshake Mismatch" errors.
 * Logic: Environment-aware session flags for Safari 2026/TMA.
 */

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_node_secret_2026_institutional"
);

export const JWT_CONFIG = {
  secret,
  
  // 🍪 Cookie Configuration
  cookieName: "auth_token",
  cookieOptions: {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 Days
  },

  // 🛰️ Hybrid Protocol Settings
  storageKey: "session_token",
  
  // 🏁 Handshake Endpoints
  // Updated to include the new Magic Link entrance
  endpoints: {
    telegramAuth: "/api/auth/telegram",
    tokenExchange: "/api/auth/token-exchange",
    magicHandshake: "/api/auth/magic", // 🚀 NEW: Browser Redirect Entrance
    profile: "/api/user/profile",
    logout: "/api/auth/logout"
  },

  // 🛡️ RBAC: High-Clearance Roles
  staffRoles: ["super_admin", "platform_manager", "platform_support", "merchant"],
  
  // ⏳ JWT Timing
  expiresIn: "7d",
};

/**
 * 🛠️ UTILITY: Protocol Guard
 * Crucial for 2026 Safari Cookie Partitioning.
 */
export const getSecurityContext = (host: string | null, protocol: string | null) => {
  const isTunnel = host?.includes("trycloudflare.com") || host?.includes("ngrok") || protocol === "https";
  const isProd = process.env.NODE_ENV === "production";
  
  const useSecure = isTunnel || isProd;

  return {
    secure: useSecure,
    sameSite: useSecure ? ("none" as const) : ("lax" as const),
    // 🚀 CHIPS/Partitioned standard: Essential for Telegram Iframes
    partitioned: useSecure,
  };
};