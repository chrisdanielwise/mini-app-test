import { type NextRequest, NextResponse } from "next/server"
import { verifyJWT, extractToken, type JWTPayload } from "./telegram"

export type AuthenticatedRequest = NextRequest & {
  user: JWTPayload
}

export interface AuthContext {
  user: JWTPayload
  isAdmin: boolean
  isMerchant: boolean
  merchantId?: string
}

/**
 * Middleware to require authentication on API routes
 */
export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>,
): Promise<NextResponse> {
  const token = extractToken(request.headers.get("Authorization"))

  if (!token) {
    return NextResponse.json({ error: "Unauthorized", message: "No token provided" }, { status: 401 })
  }

  const payload = await verifyJWT(token)

  if (!payload) {
    return NextResponse.json({ error: "Unauthorized", message: "Invalid or expired token" }, { status: 401 })
  }

  const authenticatedRequest = request as AuthenticatedRequest
  authenticatedRequest.user = payload

  const context: AuthContext = {
    user: payload,
    isAdmin: ["super_admin", "platform_manager"].includes(payload.role),
    isMerchant: payload.role === "merchant",
    merchantId: payload.merchantId,
  }

  return handler(authenticatedRequest, context)
}

/**
 * Middleware to require merchant role
 */
export async function withMerchant(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>,
): Promise<NextResponse> {
  return withAuth(request, async (req, context) => {
    if (!context.isMerchant && !context.isAdmin) {
      return NextResponse.json({ error: "Forbidden", message: "Merchant access required" }, { status: 403 })
    }

    if (!context.merchantId && !context.isAdmin) {
      return NextResponse.json({ error: "Forbidden", message: "No merchant profile found" }, { status: 403 })
    }

    return handler(req, context)
  })
}

/**
 * Middleware to require admin role
 */
export async function withAdmin(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>,
): Promise<NextResponse> {
  return withAuth(request, async (req, context) => {
    if (!context.isAdmin) {
      return NextResponse.json({ error: "Forbidden", message: "Admin access required" }, { status: 403 })
    }

    return handler(req, context)
  })
}

/**
 * Rate limiting helper (simple in-memory implementation)
 * For production, use Redis (Upstash)
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(
  identifier: string,
  limit = 100,
  windowMs = 60000,
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || record.resetAt < now) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs }
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt }
  }

  record.count++
  return { allowed: true, remaining: limit - record.count, resetAt: record.resetAt }
}
