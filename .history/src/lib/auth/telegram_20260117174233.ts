import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { JWT_CONFIG, JWT_SECRET_UINT8 } from "./config"; 

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
  sub: string;               // 🔑 Standard User UUID (Subject)
  telegramId: string;        // 🔒 BigInt safe string
  role: string;              
  merchantId: string | null; 
  isStaff: boolean;          
  iat?: number;
  exp?: number;
}

/**
 * 🛰️ TELEGRAM HASH VERIFIER (Apex Tier)
 * Logic: Two-stage HMAC-SHA256 signature verification.
 */
export function validateTelegramInitData(initData: string, tokenOverride?: string): any | null {
  try {
    const botToken = tokenOverride || process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) throw new Error("BOT_TOKEN_MISSING");

    const params = Object.fromEntries(new URLSearchParams(initData));
    const hash = params.hash;
    
    if (!hash) return null;
    delete params.hash;

    // 🛡️ REPLAY ATTACK GUARD (24h Window)
    const authDate = parseInt(params.auth_date);
    const now = Math.floor(Date.now() / 1000);
    if (isNaN(authDate) || (now - authDate) > 86400) {
      console.warn("🛰️ [Auth] STALE_DATA: InitData expired.");
      return null;
    }

    // 2. NORMALIZATION: Keys must be sorted alphabetically
    const dataCheckString = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("\n");

    // 3. CRYPTOGRAPHIC HANDSHAKE
    // 
    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(botToken)
      .digest();
    
    const calculatedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

    // 4. TIMING-SAFE VERIFICATION
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
 * 🛰️ JWT COMMANDS: Sign & Verify
 * Logic: Tiered Expiry based on institutional role.
 */
export async function createJWT(payload: any): Promise<string> {
  const role = (payload.role || "user").toLowerCase();
  const isStaff = JWT_CONFIG.staffRoles.includes(role);
  
  // 🚀 TIERED PERSISTENCE RESOLUTION
  const maxAge = isStaff 
    ? JWT_CONFIG.maxAge.staff 
    : (payload.merchantId ? JWT_CONFIG.maxAge.merchant : JWT_CONFIG.maxAge.default);

  return new SignJWT({ 
    sub: payload.userId || payload.sub, // 🚀 Standardizing on 'sub'
    telegramId: payload.telegramId.toString(), 
    merchantId: payload.merchantId || null,
    role: role,     
    isStaff: isStaff           
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${maxAge}s`) 
    .sign(JWT_SECRET_UINT8);               
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_UINT8); 
    return payload as unknown as JWTPayload;
  } catch (error: any) {
    if (error.code === 'ERR_JWT_EXPIRED') {
      console.warn("🔐 [JWT_Node] Protocol Session Expired.");
    }
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