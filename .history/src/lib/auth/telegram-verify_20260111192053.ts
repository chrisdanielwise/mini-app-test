import crypto from "crypto";

/**
 * 🛰️ TELEGRAM HASH VERIFIER (Apex Tier)
 * Performs high-fidelity cryptographic validation of Telegram initData.
 * Safeguards against tampering, impersonation, and replay attacks.
 */

export function verifyTelegramHash(data: any, botToken: string): boolean {
  const { hash, ...dataCheck } = data;

  if (!hash) return false;

  // 1. Temporal Guard: 24-hour threshold
  const authTimestamp = parseInt(dataCheck.auth_date);
  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (currentTimestamp - authTimestamp > 86400) {
    console.error("[Auth_Node] Temporal Lock: Session Expired.");
    return false;
  }

  // 2. Normalization Protocol
  // 🚩 FIX: We must ensure nested objects (like 'user') are strings, 
  // exactly as they arrived from Telegram's raw initData string.
  const dataCheckString = Object.keys(dataCheck)
    .sort()
    .map((key) => {
      const value = typeof dataCheck[key] === 'object' 
        ? JSON.stringify(dataCheck[key]) 
        : dataCheck[key];
      return `${key}=${value}`;
    })
    .join("\n");

  // 3. Cryptographic Handshake
  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  // 4. Timing-Safe Verification
  try {
    return crypto.timingSafeEqual(
      Buffer.from(calculatedHash, "hex"),
      Buffer.from(hash, "hex")
    );
  } catch (err) {
    return false;
  }
}