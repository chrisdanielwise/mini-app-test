/**
 * 🔐 UNIVERSAL AUTH CONFIG
 * Centralizes the JWT Secret to prevent "Decryption Failed" errors 
 * caused by environment sync issues in Turbopack.
 */
export const JWT_CONFIG = {
  // Use the env variable or a strict fallback. 
  // TIP: Ensure this string is identical across your entire project.
  secret: new TextEncoder().encode(
    process.env.JWT_SECRET || "zipha_secure_secret_2026"
  ),
  cookieName: "auth_token",
  expiresIn: "7d",
};