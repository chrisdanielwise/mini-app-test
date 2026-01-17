import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"; 
import {verifySession } from "@/lib/services/auth.service";
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
  can: (action: string) => boolean; 
}

/**
 * 🛰️ GLOBAL_API_AUTH_WRAPPER (v16.16.12)
 * Logic: Dual-Ingress Handshake (Partitioned Cookie + Bearer Fallback).
 * Design: Institutional Fail-Fast Security Gate.
 */
export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  
  // 1. INGRESS_EXTRACTION
  const cookieStore = await cookies();
  let token = cookieStore.get(JWT_CONFIG.cookieName)?.value || null;
  let ingressMethod = "COOKIE";

  // 🚀 RECOVERY: Bearer Sync
  // Essential for TMA (Telegram Mini App) environments where iframes might drop cookies.
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
  // Standardized via jose inside AuthService for Edge-compatibility.
  const payload = await AuthService.verifySession(token);

  if (!payload) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", code: "SESSION_EXPIRED" },
      { status: 401 }
    );
  }

  // 3. CONTEXT_ENRICHMENT (RBAC)
  const role = (payload.user?.role || "user").toLowerCase();
  const merchantId = payload.user?.merchantId || null;
  
  if (merchantId && !isUUID(merchantId)) {
    return NextResponse.json({ error: "FORBIDDEN", code: "MALFORMED_NODE_ID" }, { status: 403 });
  }

  const isStaff = ["super_admin", "amber"].includes(role);

  const context: AuthContext = {
    user: payload.user,
    isAdmin: role === "super_admin",
    isStaff: isStaff,
    isMerchant: !!merchantId,
    merchantId: merchantId || undefined,
    can: (action) => hasPermission(role, action)
  };

  // 4. PROTOCOL_EXECUTION
  const authenticatedRequest = request as AuthenticatedRequest;
  authenticatedRequest.user = payload.user;

  return handler(authenticatedRequest, context);
}

// 🛰️ SCOPED ACCESS UTILITIES
export const withMerchant = (request: NextRequest, handler: any) => 
  withAuth(request, (req, ctx) => {
    if (!ctx.isStaff && !ctx.isMerchant) {
      return NextResponse.json({ error: "FORBIDDEN", code: "MERCHANT_CONTEXT_REQUIRED" }, { status: 403 });
    }
    return handler(req, ctx);
  });

export const withAdmin = (request: NextRequest, handler: any) => 
  withAuth(request, (req, ctx) => {
    if (!ctx.isStaff) {
      return NextResponse.json({ error: "FORBIDDEN", code: "PLATFORM_STAFF_REQUIRED" }, { status: 403 });
    }
    return handler(req, ctx);
  });