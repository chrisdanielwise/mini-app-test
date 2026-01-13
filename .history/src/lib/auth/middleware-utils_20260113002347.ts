import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT, extractToken, type JWTPayload } from "./telegram";
import { isUUID } from "@/lib/utils/validators";
import { hasPermission, isStaff as checkIsStaff } from "./permissions";
import { JWT_CONFIG } from "./config";

export type AuthenticatedRequest = NextRequest & {
  user: JWTPayload;
};

export interface AuthContext {
  user: JWTPayload;
  isAdmin: boolean;    // Master Clearance (Super Admin)
  isStaff: boolean;    // Global Platform Access
  isMerchant: boolean; // Merchant/Agent Access
  merchantId?: string; // The specific cluster UUID
  /** Ad-hoc permission checker */
  can: (action: any) => boolean; 
}

/**
 * 🛰️ GLOBAL API AUTH WRAPPER (v10.5.0)
 * Dual-Mode: Supports Bearer (Bot/CLI) & Partitioned Cookies (Webview).
 */
export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  const authHeader = request.headers.get("Authorization");
  let token = extractToken(authHeader);

  // 🛡️ Cookie Fallback (Optimized for TMA Webviews)
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get(JWT_CONFIG.cookieName)?.value || null;
  }

  if (!token) {
    return NextResponse.json({ error: "Unauthorized", code: "MISSING_TOKEN" }, { status: 401 });
  }

  // 🔐 Cryptographic Handshake
  const payload = await verifyJWT(token);

  if (!payload) {
    return NextResponse.json({ error: "Unauthorized", code: "INVALID_SESSION" }, { status: 401 });
  }

  const role = payload.role.toLowerCase();

  // 🏗️ Context Overlay
  const context: AuthContext = {
    user: payload,
    isAdmin: role === "super_admin",
    isStaff: payload.isStaff || checkIsStaff(role),
    isMerchant: !!payload.merchantId,
    merchantId: payload.merchantId || undefined,
    can: (action) => hasPermission(role, action)
  };

  const authenticatedRequest = request as AuthenticatedRequest;
  authenticatedRequest.user = payload;

  return handler(authenticatedRequest, context);
}

/**
 * 🛰️ MERCHANT ACCESS PROTOCOL
 * Ensures the operator has a Merchant ID OR Global Staff clearance.
 */
export async function withMerchant(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
) {
  return withAuth(request, async (req, context) => {
    // 🛡️ Security: Platform Staff can bypass merchantId checks for oversight.
    const hasAccess = context.isStaff || (context.isMerchant && context.merchantId);

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden", code: "MERCHANT_REQUIRED" }, { status: 403 });
    }

    return handler(req, context);
  });
}

/**
 * 🛰️ ADMIN COMMAND PROTOCOL
 * Strictly limits ingress to Platform Staff nodes.
 */
export async function withAdmin(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
) {
  return withAuth(request, async (req, context) => {
    if (!context.isStaff) {
      return NextResponse.json({ error: "Forbidden", code: "STAFF_REQUIRED" }, { status: 403 });
    }
    return handler(req, context);
  });
}