import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { JWT_CONFIG } from "./config"; // 🛡️ Institutional Source of Truth

/**
 * 🛰️ TELEGRAM IDENTITY SCHEMAS
 */
export interface TelegramUser {
  id: number; // Telegram's raw ID (Handle as BigInt in DB)
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface JWTPayload {
  telegramId: string;        // 🔒 BigInt safe for DB/JSON serialization
  userId: string;            // UUID from Prisma
  role: string;              // "super_admin" | "merchant" | "user"
  merchantId: string | null; // Nullable for Platform Staff Oversight
  isStaff: boolean;          // 🚀 Centralized Clearance Flag
  iat?: number;
  exp?: number;
}

/**
 * 🛰️ TELEGRAM HASH VERIFIER (Apex Tier)
 * Performs high-fidelity cryptographic validation of Telegram's initData.
 * Logic: Mandatory 'auth_date' check to prevent Replay Attacks (2026 Standard).
 */
export function validateTelegramInitData(initData: string, tokenOverride?: string): any | null {
  try {
    const botToken = tokenOverride || process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) throw new Error("BOT_TOKEN_MISSING_IN_ENVIRONMENT");

    const params = Object.fromEntries(new URLSearchParams(initData));
    const hash = params.hash;
    
    if (!hash) return null;
    delete params.hash;

    // 🛡️ REPLAY ATTACK GUARD
    // If the data is older than 24 hours, reject it immediately.
    const authDate = parseInt(params.auth_date);
    const now = Math.floor(Date.now() / 1000);
    if (isNaN(authDate) || (now - authDate) > 86400) {
      console.warn("🛰️ [Auth] STALE_DATA: InitData expired.");
      return null;
    }

    const dataCheckString = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("\n");

    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(botToken)
      .digest();
    
    const calculatedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

    // Timing-safe comparison to prevent side-channel attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(calculatedHash, "hex"),
      Buffer.from(hash, "hex")
    );

    if (!isValid) {
      console.error("🛰️ [Auth] HMAC_MISMATCH: Unauthorized Identity Attempt.");
      return null;
    }

    return {
      user: params.user ? JSON.parse(params.user) : undefined,
      auth_date: authDate,
      start_param: params.start_param
    };
  } catch (error) {
    console.error("🛰️ [Auth] Handshake Failure:", error);
    return null;
  }
}

/**
 * 🛰️ JWT COMMANDS: Institutional Sign & Verify
 * Logic: Uses JWT_CONFIG.secret (Uint8Array) for cross-node compatibility.
 */
export async function createJWT(payload: Omit<JWTPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT({ 
    ...payload,
    telegramId: payload.telegramId.toString(), // Hardened casting for BigInt safety
    merchantId: payload.merchantId || null,     
    isStaff: payload.isStaff || false           
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_CONFIG.expiresIn) 
    .sign(JWT_CONFIG.secret);               
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_CONFIG.secret); 
    return payload as unknown as JWTPayload;
  } catch (error: any) {
    if (error.code === 'ERR_JWT_EXPIRED') {
      console.warn("🔐 [JWT_Node] Protocol Session Expired.");
    } else {
      console.error("⚠️ [JWT_Node] Handshake Fail: Cryptographic Mismatch.");
    }
    return null;
  }
}

/**
 * 🛠️ TOKEN INGRESS: Protocol Extraction
 * Logic: Supports 'Bearer' for browser/API and 'tma' for native Telegram headers.
 */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const parts = authHeader.trim().split(" ");
  if (parts.length !== 2) return null;
  const [scheme, token] = parts;
  
  // 🚀 Support both modern Bearer and legacy/custom tma schemes
  if (!["Bearer", "tma"].includes(scheme)) return null;
  return token;
}