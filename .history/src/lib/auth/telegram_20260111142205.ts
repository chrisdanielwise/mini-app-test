import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";

/**
 * 🛰️ TELEGRAM IDENTITY SCHEMAS
 */
export interface TelegramUser {
  id: number; // Telegram's raw ID
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface TelegramInitData {
  query_id?: string;
  user?: TelegramUser;
  auth_date: number;
  hash: string;
  start_param?: string;
}

export interface JWTPayload {
  telegramId: string; // 🔒 BigInt safe for DB
  userId: string;     // UUID from Prisma
  role: string;       // "super_admin" | "merchant" | "user"
  merchantId: string | null; // Nullable for Platform Staff
  iat?: number;
  exp?: number;
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

const JWT_EXPIRY = "7d";

/**
 * 🛰️ TELEGRAM HASH VERIFIER (Apex Tier)
 * Performs high-fidelity cryptographic validation.
 * @param initData - The raw query string from Telegram
 * @param tokenOverride - Optional merchant-specific bot token
 */
export function validateTelegramInitData(initData: string, tokenOverride?: string): any | null {
  try {
    // 1. Determine which token to use for the handshake
    const botToken = tokenOverride || process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) throw new Error("TELEGRAM_BOT_TOKEN_MISSING");

    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get("hash");
    if (!hash) return null;

    // 2. Prepare Data Check String (Alphabetical sorting)
    urlParams.delete("hash");
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    // 3. Cryptographic Handshake (Derive Secret Key)
    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(botToken)
      .digest();
    
    const calculatedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

    // 🔒 TIMING-SAFE COMPARISON
    if (!crypto.timingSafeEqual(Buffer.from(calculatedHash, "hex"), Buffer.from(hash, "hex"))) {
      console.error("[Auth] Signature Mismatch");
      return null;
    }

    const userJson = urlParams.get("user");
    return {
      user: userJson ? JSON.parse(userJson) : undefined,
      auth_date: urlParams.get("auth_date"),
    };
  } catch (error) {
    console.error("[Auth] Handshake Error:", error);
    return null;
  }
}

/**
 * 🛰️ JWT COMMANDS: Sign & Verify
 * Refined: Explicitly ensures telegramId is stored as a string.
 */
export async function createJWT(payload: Omit<JWTPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT({ 
    ...payload,
    telegramId: payload.telegramId.toString(), // Hardened string casting
    merchantId: payload.merchantId || null      // Normalized null safety
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error("⚠️ [JWT_Verify_Fail]: Session invalid or expired.");
    return null;
  }
}

/**
 * 🛠️ TOKEN INGRESS: Protocol Extraction
 */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(" ");
  // Support for both 'Bearer' (Web) and 'tma' (Telegram Mini App)
  if (!token || !["Bearer", "tma"].includes(scheme)) return null;
  return token;
}