import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";

/**
 * 🛰️ TELEGRAM IDENTITY SCHEMAS
 */
export interface TelegramUser {
  id: number; 
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
  telegramId: string; // 🔒 BigInt safe for DB (Prisma/Postgres)
  userId: string; 
  role: string;
  merchantId?: string; 
  iat?: number;
  exp?: number;
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

const JWT_EXPIRY = "7d";

/**
 * 🛡️ VALIDATE TELEGRAM INITDATA (Apex Tier)
 * Performs cryptographic verification and temporal checks.
 */
export function validateTelegramInitData(initData: string): TelegramInitData | null {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) throw new Error("TELEGRAM_BOT_TOKEN_MISSING");

    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get("hash");

    if (!hash) return null;

    // 1. Prepare Data Check String
    urlParams.delete("hash");
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    // 2. Derive Secret Key (WebAppData + BotToken)
    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(botToken)
      .digest();
    
    // 3. Compute HMAC Signature
    const calculatedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

    // 🔒 TIMING-SAFE COMPARISON: Prevents cryptographic side-channel attacks
    if (!crypto.timingSafeEqual(Buffer.from(calculatedHash, "hex"), Buffer.from(hash, "hex"))) {
      console.error("[Auth] Signature Verification Failed");
      return null;
    }

    // 4. Temporal Expiry Check (24H window)
    const authDate = Number.parseInt(urlParams.get("auth_date") || "0", 10);
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 86400) {
      console.error("[Auth] Identity Token Expired");
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
    console.error("[Auth] Handshake Error:", error);
    return null;
  }
}

/**
 * 🛰️ JWT COMMANDS: Sign & Verify
 */
export async function createJWT(payload: Omit<JWTPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT({ ...payload })
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
    return null;
  }
}

/**
 * 🛠️ TOKEN INGRESS: Extracts from TMA/Bearer schemes
 */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(" ");
  // Support for standard 'Bearer' and Telegram-specific 'tma' schemes
  if (!token || !["Bearer", "tma"].includes(scheme)) return null;
  return token;
}