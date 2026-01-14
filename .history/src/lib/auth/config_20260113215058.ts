/**
 * 🔐 UNIVERSAL AUTH CONFIG (Institutional v13.2.0)
 * Centralizes security primitives to prevent "Handshake Mismatch" errors.
 * Logic: Environment-aware session flags for Safari 2026/TMA.
 */

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