import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT, extractToken, type JWTPayload } from "./telegram";
import { hasPermission } from "./permissions";
import { JWT_CONFIG } from "./config";

export type AuthenticatedRequest = NextRequest & {
  user: JWTPayload;
};

export interface AuthContext {
  user: JWTPayload;
  isAdmin: boolean;    
  isStaff: boolean;    
  isMerchant: boolean; 
  merchantId?: string; 
  can: (action: any) => boolean; 
}

/**
 * 🛰️ GLOBAL API AUTH WRAPPER (Institutional v12.12.0)
 * Logic: Dual-Mode Ingress (Bearer + Partitioned Cookies).
 * Purpose: Unified security for Mini Apps, Dashboards, and CLI/API tools.
 */
export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  const authHeader = request.headers.get("Authorization");
  let token = extractToken(authHeader);

  // 🛡️ BROWSER FALLBACK (TMA Iframe Recovery)
  // If no Bearer token, check for the Partitioned Cookie.
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get(JWT_CONFIG.cookieName)?.value || null;
  }

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized", code: "CREDENTIALS_MISSING" }, 
      { status: 401 }
    );
  }

  // 🔐 CRYPTOGRAPHIC HANDSHAKE
  // Verifies the signature against the institutional JWT_SECRET.
  const payload = await verifyJWT(token);

  if (!payload) {
    return NextResponse.json(
      { error: "Unauthorized", code: "SESSION_EXPIRED" }, 
      { status: 401 }
    );
  }

  const role = payload.role.toLowerCase();

  // 🏗️ CONTEXT HYDRATION
  // We use the centralized staffRoles from config to determine clearance.
  const isPlatformStaff = JWT_CONFIG.staffRoles.includes(role) || payload.isStaff;

  const context: AuthContext = {
    user: payload,
    isAdmin: role === "super_admin",
    isStaff: isPlatformStaff,
    isMerchant: !!payload.merchantId,
    merchantId: payload.merchantId || undefined,
    can: (action) => hasPermission(role, action)
  };

  const authenticatedRequest = request as AuthenticatedRequest;
  authenticatedRequest.user = payload;

  // 🚀 EXECUTE HANDLER
  return handler(authenticatedRequest, context);
}

/**
 * 🛰️ MERCHANT ACCESS PROTOCOL
 * Enforces that the operator is either the Merchant Owner/Agent 
 * OR a Platform Staff member performing oversight.
 */
export async function withMerchant(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
) {
  return withAuth(request, async (req, context) => {
    const hasAccess = context.isStaff || (context.isMerchant && context.merchantId);

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Forbidden", code: "MERCHANT_CONTEXT_REQUIRED" }, 
        { status: 403 }
      );
    }

    return handler(req, context);
  });
}

/**
 * 🛰️ ADMIN COMMAND PROTOCOL
 * Strictly limits access to platform-level staff nodes.
 */
export async function withAdmin(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
) {
  return withAuth(request, async (req, context) => {
    if (!context.isStaff) {
      return NextResponse.json(
        { error: "Forbidden", code: "PLATFORM_STAFF_REQUIRED" }, 
        { status: 403 }
      );
    }
    return handler(req, context);
  });
}