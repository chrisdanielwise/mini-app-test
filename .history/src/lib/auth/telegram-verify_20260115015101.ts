import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { JWT_CONFIG } from "./config"; 

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

export interface JWTPayload {
  sub: string;               // userId (JWT Standard Subject)
  telegramId: string;        
  role: string;              
  merchantId: string | null; 
  isStaff: boolean;
  securityStamp: string;     // 🚨 Essential for remote revocation
  iat?: number;
  exp?: number;
}

/**
 * 🔐 TELEGRAM HASH VERIFIER (v16.16.12)
 * Logic: Two-stage HMAC-SHA256 signature verification.
 * Threshold: 24-hour expiry for initData payloads.
 */
export function verifyTelegramHash(data: any, botToken: string): boolean {
  const { hash, ...dataCheck } = data;
  if (!hash || !botToken) return false;

  // 1. TEMPORAL GUARD: Replay Attack Protection
  const authTimestamp = parseInt(dataCheck.auth_date);
  const currentTimestamp = Math.floor(Date.now() / 1000);
  
  if (isNaN(authTimestamp) || Math.abs(currentTimestamp - authTimestamp) > 86400) {
    console.error("🔐 [Auth_Sentinel]: Handshake Expired (Temporal Lock).");
    return false;
  }

  // 2. DATA NORMALIZATION (Alphabetical Sort)
  const dataCheckString = Object.keys(dataCheck)
    .sort()
    .map((key) => `${key}=${typeof dataCheck[key] === 'object' ? JSON.stringify(dataCheck[key]) : dataCheck[key]}`)
    .join("\n");

  // 3. CRYPTOGRAPHIC DERIVATION
  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  // 4. TIMING-SAFE EQUALITY
  // Prevents side-channel timing attacks by comparing buffers in constant time.
  try {
    return crypto.timingSafeEqual(
      Buffer.from(hash, "hex"),
      Buffer.from(calculatedHash, "hex")
    );
  } catch (err) {
    return false;
  }
}

/**
 * 🛰️ JWT COMMANDS: Stateless Identity
 */
export async function createJWT(payload: JWTPayload): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_CONFIG.maxAge.default + 's') 
    .sign(secret);               
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret); 
    return payload as unknown as JWTPayload;
  } catch (error: any) {
    return null;
  }
}

/**
 * 🛠️ TOKEN EXTRACTION
 * Standard: Supports both Bearer (Traditional) and tma (Mini App) schemes.
 */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(" ");
  return ["Bearer", "tma"].includes(scheme) ? token : null;
}