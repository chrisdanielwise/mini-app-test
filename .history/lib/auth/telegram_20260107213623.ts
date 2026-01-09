import crypto from "crypto"
import { SignJWT, jwtVerify } from "jose"

// =================================================================
// TELEGRAM WEBAPP AUTHENTICATION
// Validates initData from Telegram Mini Apps
// =================================================================

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  photo_url?: string
}

export interface TelegramInitData {
  query_id?: string
  user?: TelegramUser
  auth_date: number
  hash: string
  start_param?: string
}

export interface JWTPayload {
  telegramId: number
  userId: string
  role: string
  merchantId?: string
  iat: number
  exp: number
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production")

const JWT_EXPIRY = "7d" // 7 days

/**
 * Validates Telegram WebApp initData
 * @see https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function validateTelegramInitData(initData: string): TelegramInitData | null {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      console.error("[Auth] TELEGRAM_BOT_TOKEN not configured")
      return null
    }

    // Parse the initData string
    const urlParams = new URLSearchParams(initData)
    const hash = urlParams.get("hash")

    if (!hash) {
      console.error("[Auth] No hash in initData")
      return null
    }

    // Remove hash from params and sort alphabetically
    urlParams.delete("hash")
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("\n")

    // Create secret key: HMAC_SHA256(botToken, "WebAppData")
    const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest()

    // Calculate HMAC_SHA256(dataCheckString, secretKey)
    const calculatedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex")

    if (calculatedHash !== hash) {
      console.error("[Auth] Hash mismatch - invalid initData")
      return null
    }

    // Check auth_date is not too old (allow 1 day)
    const authDate = Number.parseInt(urlParams.get("auth_date") || "0", 10)
    const now = Math.floor(Date.now() / 1000)
    const maxAge = 86400 // 24 hours

    if (now - authDate > maxAge) {
      console.error("[Auth] initData expired")
      return null
    }

    // Parse user data
    const userJson = urlParams.get("user")
    const user = userJson ? JSON.parse(userJson) : undefined

    return {
      query_id: urlParams.get("query_id") || undefined,
      user,
      auth_date: authDate,
      hash,
      start_param: urlParams.get("start_param") || undefined,
    }
  } catch (error) {
    console.error("[Auth] Error validating initData:", error)
    return null
  }
}

/**
 * Creates a JWT token for authenticated users
 */
export async function createJWT(payload: Omit<JWTPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET)
}

/**
 * Verifies and decodes a JWT token
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as JWTPayload
  } catch (error) {
    console.error("[Auth] JWT verification failed:", error)
    return null
  }
}

/**
 * Extracts JWT from Authorization header
 */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader) return null

  const parts = authHeader.split(" ")
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null
  }

  return parts[1]
}
