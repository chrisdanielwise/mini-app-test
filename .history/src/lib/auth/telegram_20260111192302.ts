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