import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"; 
import { verifySession } from "@/lib/services/auth.service";
import { isUUID } from "@/lib/utils/validators";
import { JWT_CONFIG } from "./config";
import { hasPermission, type AppPermission } from "./permissions";

/**
 * 👤 AUTH_USER_IDENTITY
 * Logic: Explicitly defines properties for strict RBAC resolution.
 */
export interface AuthUser {
  id: string;
  role: string;
  merchantId?: string | null;
  telegramId?: string;
  securityStamp?: string;
  [key: string]: any; 
}

export type AuthenticatedRequest = NextRequest & { user: AuthUser };

/**
 * 🛰️ AUTH_CONTEXT
 * Ingress: Standardized union for protocol identification.
 */
export interface AuthContext {
  user: AuthUser;
  isAdmin: boolean;
  isStaff: boolean;
  isMerchant: boolean;
  merchantId?: string;
  ingress: "COOKIE" | "BEARER";
  // ✅ FIX: Unified AppPermission type ingress
  can: (action: AppPermission) => boolean; 
}

/**
 * 🌊 GLOBAL_API_AUTH_WRAPPER (Institutional Apex v2026.1.20)
 * Logic: Dual-Ingress Handshake (Partitioned Cookie + Bearer Fallback).
 * Architecture: Optimized for Next.js 15 Async Headers & Safari 2026 CHIPS.
 */
export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  
  // 1. INGRESS_EXTRACTION
  // Next.js 15: cookies() is an asynchronous call
  const cookieStore = await cookies();
  let token = cookieStore.get(JWT_CONFIG.cookieName)?.value || null;
  let ingressMethod: "COOKIE" | "BEARER" = "COOKIE";

  // 🚀 RECOVERY: Bearer Sync for Telegram Mini App (TMA) Iframes
  if (!token) {
    const authHeader = request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
      ingressMethod = "BEARER";
    }
  }

  if (!token) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", code: "CREDENTIALS_MISSING" },
      { status: 401 }
    );
  }

  // 2. CRYPTOGRAPHIC_HANDSHAKE
  const payload = await verifySession(token);

  if (!payload || !payload.user) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", code: "SESSION_EXPIRED_OR_REVOKED" },
      { status: 401 }
    );
  }

  // 3. CONTEXT_ENRICHMENT (RBAC)
  // ✅ FIX: Casting payload.user as AuthUser resolves ts(2339)
  const user = payload.user as AuthUser;
  const role = (user.role || "user").toLowerCase();
  const merchantId = user.merchantId || null;
  
  // 🛡️ SECURITY_GUARD: Node Integrity Check
  if (merchantId && !isUUID(merchantId)) {
    return NextResponse.json(
      { error: "FORBIDDEN", code: "MALFORMED_NODE_ID" }, 
      { status: 403 }
    );
  }

  const isStaff = JWT_CONFIG.staffRoles.includes(role);

  const context: AuthContext = {
    user: user,
    isAdmin: role === "super_admin",
    isStaff: isStaff,
    isMerchant: !!merchantId,
    merchantId: merchantId || undefined,
    ingress: ingressMethod,
    // ✅ FIX: Resolved ts(2345) by mapping to AppPermission type
    can: (action: AppPermission) => hasPermission(role, action)
  };

  // 4. PROTOCOL_EXECUTION
  const authenticatedRequest = request as AuthenticatedRequest;
  authenticatedRequest.user = user;

  return handler(authenticatedRequest, context);
}

// 🛰️ SCOPED ACCESS WRAPPERS
export const withMerchant = (
  request: NextRequest, 
  handler: (req: AuthenticatedRequest, ctx: AuthContext) => Promise<NextResponse>
) => withAuth(request, async (req, ctx) => {
    if (!ctx.isStaff && !ctx.isMerchant) {
      return NextResponse.json(
        { error: "FORBIDDEN", code: "MERCHANT_CONTEXT_REQUIRED" }, 
        { status: 403 }
      );
    }
    return handler(req, ctx);
  });

export const withAdmin = (
  request: NextRequest, 
  handler: (req: AuthenticatedRequest, ctx: AuthContext) => Promise<NextResponse>
) => withAuth(request, async (req, ctx) => {
    if (!ctx.isStaff) {
      return NextResponse.json(
        { error: "FORBIDDEN", code: "PLATFORM_STAFF_REQUIRED" }, 
        { status: 403 }
      );
    }
    return handler(req, ctx);
  });