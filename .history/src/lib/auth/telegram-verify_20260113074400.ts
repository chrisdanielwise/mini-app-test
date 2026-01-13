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
  sub: string;               // userId (JWT Standard)
  telegramId: string;        
  role: string;              
  merchantId: string | null; 
  isStaff: boolean;          
  iat?: number;
  exp?: number;
}

/**
 * 🔐 TELEGRAM HASH VERIFIER (Apex Tier)
 * Architecture: Two-stage HMAC-SHA256 Handshake.
 * Logic: Timing-safe comparison & 24-hour temporal locking.
 */
export function verifyTelegramHash(data: any, botToken: string): boolean {
  const { hash, ...dataCheck } = data;
  if (!hash || !botToken) return false;

  // 1. TEMPORAL GUARD: 24-hour threshold
  const authTimestamp = parseInt(dataCheck.auth_date);
  const currentTimestamp = Math.floor(Date.now() / 1000);
  
  if (isNaN(authTimestamp) || currentTimestamp - authTimestamp > 86400) {
    console.error("🔐 [Auth_Node] Temporal Lock: Handshake Expired.");
    return false;
  }

  // 2. NORMALIZATION PROTOCOL
  const dataCheckString = Object.keys(dataCheck)
    .sort()
    .map((key) => `${key}=${dataCheck[key]}`)
    .join("\n");

  // 3. CRYPTOGRAPHIC HANDSHAKE
  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  // 4. TIMING-SAFE VERIFICATION
  try {
    const hashBuffer = Buffer.from(hash, "hex");
    const calculatedBuffer = Buffer.from(calculatedHash, "hex");

    if (hashBuffer.length !== calculatedBuffer.length) return false;
    return crypto.timingSafeEqual(hashBuffer, calculatedBuffer);
  } catch (err) {
    return false;
  }
}

/**
 * 🛰️ JWT COMMANDS: Sign & Verify
 * Logic: Aligned with AuthService to prevent "Algorithm Mismatch" crashes.
 */
export async function createJWT(payload: any): Promise<string> {
  return new SignJWT({ 
    sub: payload.userId, // Standardizing on 'sub' for userId
    telegramId: payload.telegramId.toString(), 
    merchantId: payload.merchantId || null,     
    role: payload.role,
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
    return null;
  }
}

/**
 * 🛠️ TOKEN INGRESS: Protocol Extraction
 */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const parts = authHeader.trim().split(" ");
  if (parts.length !== 2) return null;
  const [scheme, token] = parts;
  if (!["Bearer", "tma"].includes(scheme)) return null;
  return token;
}

/**
 * 🛰️ TELEGRAM DATA PARSER
 * Decodes the raw initData string from the Telegram WebApp.
 */
export function parseInitData(initData: string): any {
  const params = new URLSearchParams(initData);
  const data: any = {};
  for (const [key, value] of params.entries()) {
    try {
      data[key] = JSON.parse(value);
    } catch (e) {
      data[key] = value;
    }
  }
  return data;
}