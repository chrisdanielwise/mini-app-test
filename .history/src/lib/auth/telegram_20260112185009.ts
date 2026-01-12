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
  iat?: number;
  exp?: number;
}

/**
 * 🛰️ TELEGRAM HASH VERIFIER (Apex Tier)
 * Performs high-fidelity cryptographic validation of Telegram's initData.
 * Safeguards against tampering, impersonation, and timing attacks.
 */
export function validateTelegramInitData(initData: string, tokenOverride?: string): any | null {
  try {
    const botToken = tokenOverride || process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) throw new Error("BOT_TOKEN_MISSING_IN_ENVIRONMENT");

    // 1. Ingress Parsing
    const params = Object.fromEntries(new URLSearchParams(initData));
    const hash = params.hash;
    
    if (!hash) return null;
    delete params.hash;

    // 2. Normalization: Alphabetical sorting per Telegram Protocol
    const dataCheckString = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("\n");

    // 3. Cryptographic Handshake
    // Derived key using the constant "WebAppData"
    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(botToken)
      .digest();
    
    const calculatedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

    // 🔒 TIMING-SAFE VERIFICATION
    // Prevents character-guessing via execution time analysis
    const isValid = crypto.timingSafeEqual(
      Buffer.from(calculatedHash, "hex"),
      Buffer.from(hash, "hex")
    );

    if (!isValid) {
      console.error("🛰️ [Auth] HMAC_MISMATCH: Unauthorized Identity Attempt.");
      return null;
    }

    // 4. Identity Extraction
    return {
      user: params.user ? JSON.parse(params.user) : undefined,
      auth_date: parseInt(params.auth_date),
      start_param: params.start_param
    };
  } catch (error) {
    console.error("🛰️ [Auth] Handshake Failure:", error);
    return null;
  }
}

/**
 * 🛰️ JWT COMMANDS: Institutional Sign & Verify
 * Synchronized with JWT_CONFIG to ensure cross-node compatibility.
 */
export async function createJWT(payload: Omit<JWTPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT({ 
    ...payload,
    telegramId: payload.telegramId.toString(), // Hardened casting for BigInt safety
    merchantId: payload.merchantId || null      // Explicit null normalization
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
 * Supports standard 'Bearer' and Telegram-specific 'tma' schemes.
 */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const parts = authHeader.trim().split(" ");
  if (parts.length !== 2) return null;
  const [scheme, token] = parts;
  if (!["Bearer", "tma"].includes(scheme)) return null;
  return token;
}