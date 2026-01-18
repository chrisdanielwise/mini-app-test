import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"; 
import { verifySession } from "@/lib/services/auth.service";
import { isUUID } from "@/lib/utils/validators";
import { JWT_CONFIG } from "./config";
import { hasPermission } from "./permissions";

export type AuthenticatedRequest = NextRequest & { user: any };

export interface AuthContext {
  user: any;
  isAdmin: boolean;
  isStaff: boolean;
  isMerchant: boolean;
  merchantId?: string;
  ingress: "COOKIE" | "BEARER"; // Telemetry tracking for ingress security
  can: (action: string) => boolean; 
}

/**
 * 🛰️ GLOBAL_API_AUTH_WRAPPER (v16.16.20)
 * Logic: Dual-Ingress Handshake (Partitioned Cookie + Bearer Fallback).
 * Design: Institutional Fail-Fast Security Gate.
 * Standard: Next.js 15 Async-Header Ready.
 */
export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  
  // 1. INGRESS_EXTRACTION
  // 🏁 Next.js 15: cookies() is now an asynchronous resolution
  const cookieStore = await cookies();
  let token = cookieStore.get(JWT_CONFIG.cookieName)?.value || null;
  let ingressMethod: "COOKIE" | "BEARER" = "COOKIE";

  // 🚀 RECOVERY: Bearer Sync (Essential for TMA Iframe environments)
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
  const role = (payload.user.role || "user").toLowerCase();
  const merchantId = payload.user.merchantId || null;
  
  // 🛡️ SECURITY_GUARD: Node Integrity Check
  if (merchantId && !isUUID(merchantId)) {
    return NextResponse.json(
      { error: "FORBIDDEN", code: "MALFORMED_NODE_ID" }, 
      { status: 403 }
    );
  }

  const isStaff = JWT_CONFIG.staffRoles.includes(role);

  const context: AuthContext = {
    user: payload.user,
    isAdmin: role === "super_admin",
    isStaff: isStaff,
    isMerchant: !!merchantId,
    merchantId: merchantId || undefined,
    ingress: ingressMethod,
    can: (action) => hasPermission(role, action)
  };

  // 4. PROTOCOL_EXECUTION
  const authenticatedRequest = request as AuthenticatedRequest;
  authenticatedRequest.user = payload.user;

  return handler(authenticatedRequest, context);
}

// 🛰️ SCOPED ACCESS UTILITIES
export const withMerchant = (request: NextRequest, handler: any) => 
  withAuth(request, async (req, ctx) => {
    if (!ctx.isStaff && !ctx.isMerchant) {
      return NextResponse.json(
        { error: "FORBIDDEN", code: "MERCHANT_CONTEXT_REQUIRED" }, 
        { status: 403 }
      );
    }
    return handler(req, ctx);
  });

export const withAdmin = (request: NextRequest, handler: any) => 
  withAuth(request, async (req, ctx) => {
    if (!ctx.isStaff) {
      return NextResponse.json(
        { error: "FORBIDDEN", code: "PLATFORM_STAFF_REQUIRED" }, 
        { status: 403 }
      );
    }
    return handler(req, ctx);
  });