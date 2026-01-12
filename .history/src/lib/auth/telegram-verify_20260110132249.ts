import crypto from "crypto";

/**
 * 🛰️ TELEGRAM HASH VERIFIER (Apex Tier)
 * Performs high-fidelity cryptographic validation of Telegram initData.
 * Safeguards against tampering, impersonation, and replay attacks.
 */
export function verifyTelegramHash(data: any, botToken: string): boolean {
  // 1. Extraction Protocol: Isolate hash for comparison
  const { hash, ...dataCheck } = data;

  if (!hash || !dataCheck.auth_date) {
    console.error("[Auth_Node] Missing cryptographic parameters.");
    return false;
  }

  // 2. Temporal Guard: Block replay attacks (24-hour threshold)
  const authTimestamp = parseInt(dataCheck.auth_date);
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const EXPIRE_WINDOW = 86400; // 24 Hours in seconds

  if (currentTimestamp - authTimestamp > EXPIRE_WINDOW) {
    console.error("[Auth_Node] Telegram session has expired (Temporal Lock).");
    return false;
  }

  // 3. Normalization Protocol: Alphabetical key sorting
  const dataCheckString = Object.keys(dataCheck)
    .sort()
    .map((key) => `${key}=${dataCheck[key]}`)
    .join("\n");

  // 4. Cryptographic Handshake
  // HMAC-SHA-256 signature of the bot's token with the constant string 'WebAppData' as key.
  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  // 5. Signature Verification
  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  // Constant-time comparison to prevent timing attacks
  const isValid = crypto.timingSafeEqual(
    Buffer.from(calculatedHash, "hex"),
    Buffer.from(hash, "hex")
  );

  return isValid;
}