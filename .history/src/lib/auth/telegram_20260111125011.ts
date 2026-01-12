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
 * 🛡️ VALIDATE TELEGRAM INITDATA (Apex Tier)
 * Refined: Handles the cryptographic handshake for Mini Apps.
 */
export function validateTelegramInitData(initData: string): TelegramInitData | null {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) throw new Error("TELEGRAM_BOT_TOKEN_MISSING");

    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get("hash");

    if (!hash) return null;

    // 1. Data Normalization (Alphabetical sorting is mandatory)
    const dataCheck = Array.from(urlParams.entries())
      .filter(([key]) => key !== "hash")
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    // 2. Cryptographic Handshake
    // HMAC-SHA-256(WebAppData, botToken) -> Secret
    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(botToken)
      .digest();
    
    // 3. Signature Computation
    const calculatedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheck)
      .digest("hex");

    // 🔒 TIMING-SAFE VERIFICATION
    const isValid = crypto.timingSafeEqual(
      Buffer.from(calculatedHash, "hex"),
      Buffer.from(hash, "hex")
    );

    if (!isValid) {
      console.error("⚠️ [Auth_Node] Integrity Breach: Invalid Hash.");
      return null;
    }

    // 4. Temporal Expiry (24H window to prevent replays)
    const authDate = Number.parseInt(urlParams.get("auth_date") || "0", 10);
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 86400) {
      console.error("⚠️ [Auth_Node] Temporal Breach: Expired Session.");
      return null;
    }

    const userJson = urlParams.get("user");
    return {
      query_id: urlParams.get("query_id") || undefined,
      user: userJson ? JSON.parse(userJson) : undefined,
      auth_date: authDate,
      hash,
      start_param: urlParams.get("start_param") || undefined,
    };
  } catch (error) {
    console.error("🔥 [Auth_Handshake_Error]:", error);
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