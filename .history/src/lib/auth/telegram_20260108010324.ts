import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";

// =================================================================
// TELEGRAM WEBAPP AUTHENTICATION
// Validates initData from Telegram Mini Apps
// =================================================================

export interface TelegramUser {
  id: number; // Telegram's raw JSON returns number
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
  telegramId: string; // Changed to string for BigInt safety in JSON
  userId: string; // Database UUID
  role: string;
  merchantId?: string; // Database UUID
  iat: number;
  exp: number;
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production"
);

const JWT_EXPIRY = "7d";

/**
 * Validates Telegram WebApp initData
 */
export function validateTelegramInitData(
  initData: string
): TelegramInitData | null {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      console.error("[Auth] TELEGRAM_BOT_TOKEN not configured in .env");
      return null;
    }

    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get("hash");

    if (!hash) return null;

    urlParams.delete("hash");
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    // HMAC validation per Telegram Bot API specs
    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(botToken)
      .digest();
    const calculatedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

    if (calculatedHash !== hash) {
      console.error("[Auth] Hash mismatch");
      return null;
    }

    // Check expiration (24 hours)
    const authDate = Number.parseInt(urlParams.get("auth_date") || "0", 10);
    if (Math.floor(Date.now() / 1000) - authDate > 86400) {
      console.error("[Auth] initData expired");
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
    console.error("[Auth] Validation Error:", error);
    return null;
  }
}

/**
 * Creates a JWT token
 */
export async function createJWT(
  payload: Omit<JWTPayload, "iat" | "exp">
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET);
}

/**
 * Verifies and decodes a JWT token
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error("[Auth] JWT Invalid:", error);
    return null;
  }
}

/**
 * Extracts JWT from Authorization header
 * Supports both 'Bearer <token>' and 'tma <token>' formats
 */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader) return null;

  const [scheme, token] = authHeader.split(" ");
  if (!token || (scheme !== "Bearer" && scheme !== "tma")) {
    return null;
  }

  return token;
}
