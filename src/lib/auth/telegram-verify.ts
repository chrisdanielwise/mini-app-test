import crypto from "crypto";

/**
 * 🛰️ TELEGRAM HASH VERIFIER (Institutional v9.7.7)
 * Architecture: Cryptographic Handshake Protocol.
 * Hardened: Timing-safe comparison & 24-hour temporal locking.
 */
export function verifyTelegramHash(data: any, botToken: string): boolean {
  const { hash, ...dataCheck } = data;

  if (!hash || !botToken) return false;

  // 1. TEMPORAL GUARD: 24-hour threshold
  // Prevents "Replay Attacks" where old valid data is reused.
  const authTimestamp = parseInt(dataCheck.auth_date);
  const currentTimestamp = Math.floor(Date.now() / 1000);
  
  if (isNaN(authTimestamp) || currentTimestamp - authTimestamp > 86400) {
    console.error("🔐 [Auth_Node] Temporal Lock: Handshake Expired.");
    return false;
  }

  /**
   * 2. NORMALIZATION PROTOCOL
   * Logic: Sort keys alphabetically and join with newlines.
   * Note: The 'user' field must be the exact JSON string received from Telegram.
   */
  const dataCheckString = Object.keys(dataCheck)
    .sort()
    .map((key) => {
      // Telegram sends 'user' as a JSON-serialized string in raw initData.
      // If your parser already converted it to an object, we re-serialize it.
      const value = typeof dataCheck[key] === 'object' 
        ? JSON.stringify(dataCheck[key]) 
        : dataCheck[key];
      return `${key}=${value}`;
    })
    .join("\n");

  // 3. CRYPTOGRAPHIC HANDSHAKE
  // Step A: Generate Secret Key using Bot Token and 'WebAppData' constant
  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  // Step B: Generate Hash from the normalized data string
  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  /**
   * 4. TIMING-SAFE VERIFICATION
   * Hardened: Prevents 'Side-Channel Timing Attacks' that guess hash characters 
   * based on the micro-seconds the comparison takes.
   */
  try {
    const hashBuffer = Buffer.from(hash, "hex");
    const calculatedBuffer = Buffer.from(calculatedHash, "hex");

    if (hashBuffer.length !== calculatedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(hashBuffer, calculatedBuffer);
  } catch (err) {
    console.error("🔥 [Auth_Node] Cryptographic comparison error.");
    return false;
  }
}