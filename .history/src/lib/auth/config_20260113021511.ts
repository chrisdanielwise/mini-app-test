/**
 * 🔐 UNIVERSAL AUTH CONFIG (Institutional v12.3.0)
 * Centralizes security primitives to prevent "Handshake Mismatch" errors.
 * Logic: Environment-aware session flags for Safari 2026/TMA.
 */

// 🛡️ Secret Key Management
// We use Uint8Array via TextEncoder because 'jose' and 'webcrypto' 
// require this format for high-speed HMAC operations.
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
  // This is used by useAuth and SecureStorage logic
  storageKey: "session_token",
  
  // 🏁 Handshake Endpoints
  // Centralizing these prevents 404s if you rename folders later
  endpoints: {
    telegramAuth: "/api/auth/telegram",
    tokenExchange: "/api/auth/token-exchange",
    profile: "/api/user/profile",
    logout: "/api/auth/logout"
  },

  // 🛡️ RBAC: High-Clearance Roles
  // Used by getSession and Proxy to define "Staff" status
  staffRoles: ["super_admin", "platform_manager", "platform_support"],
  
  // ⏳ JWT Timing
  expiresIn: "7d",
};

/**
 * 🛠️ UTILITY: Protocol Guard
 * Detects if the current request is coming via a secure tunnel.
 */
export const getSecurityContext = (host: string | null, protocol: string | null) => {
  const isTunnel = host?.includes("trycloudflare.com") || host?.includes("ngrok") || protocol === "https";
  const isProd = process.env.NODE_ENV === "production";
  
  const useSecure = isTunnel || isProd;

  return {
    secure: useSecure,
    sameSite: useSecure ? ("none" as const) : ("lax" as const),
    // 🚀 CHIPS/Partitioned standard for 2026 iframes
    partitioned: useSecure,
  };
};