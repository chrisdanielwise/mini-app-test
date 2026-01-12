import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"; // 🛡️ CRITICAL FIX: Next.js 16/Turbopack requirement
import { verifyJWT, extractToken, type JWTPayload } from "./telegram";
import { isUUID } from "@/lib/utils/validators";

export type AuthenticatedRequest = NextRequest & {
  user: JWTPayload;
};

export interface AuthContext {
  user: JWTPayload;
  isAdmin: boolean;    // Master Clearance (Super Admin / Manager)
  isStaff: boolean;    // Institutional Oversight (Staff / Support)
  isMerchant: boolean; // Merchant cluster operator
  merchantId?: string; // UUID of the linked cluster
}

/**
 * 🛰️ GLOBAL API AUTH WRAPPER (Apex Tier v9.7.5)
 * Logic: Dual-Mode Validation (Bearer & Cookie).
 * Hardened: Role-based context generation for Next.js 16.
 */
export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  const authHeader = request.headers.get("Authorization");
  let token = extractToken(authHeader);

  // 🛡️ FALLBACK: Authenticate via HTTP-Only cookies for Dashboard/SSR ingress
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get("auth_token")?.value || null;
  }

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized", code: "MISSING_TOKEN" },
      { status: 401 }
    );
  }

  const payload = await verifyJWT(token);

  if (!payload) {
    return NextResponse.json(
      { error: "Unauthorized", code: "INVALID_SESSION" },
      { status: 401 }
    );
  }

  // 🏗️ UUID TYPE GUARD: Only validate if a merchantId is present
  // (Staff/Admin accounts may lack a merchantId as they sit above clusters)
  if (payload.merchantId && !isUUID(payload.merchantId)) {
    return NextResponse.json(
      { error: "Forbidden", code: "MALFORMED_ID" },
      { status: 403 }
    );
  }

  const context: AuthContext = {
    user: payload,
    isAdmin: ["super_admin", "platform_manager"].includes(payload.role),
    isStaff: ["super_admin", "platform_manager", "platform_support"].includes(payload.role),
    isMerchant: payload.role === "merchant",
    merchantId: payload.merchantId,
  };

  const authenticatedRequest = request as AuthenticatedRequest;
  authenticatedRequest.user = payload;

  return handler(authenticatedRequest, context);
}

/**
 * 🛰️ MERCHANT ACCESS PROTOCOL (Oversight Enabled)
 * Logic: Grants access to the Cluster Owner OR Institutional Staff.
 */
export async function withMerchant(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  return withAuth(request, async (req, context) => {
    // 🛡️ Logic: Staff bypasses merchantId requirements for Global Oversight.
    // Merchants MUST have a valid merchantId signature.
    const hasPermission = context.isStaff || (context.isMerchant && context.merchantId);

    if (!hasPermission) {
      return NextResponse.json(
        { error: "Forbidden", code: "MERCHANT_REQUIRED" },
        { status: 403 }
      );
    }

    return handler(req, context);
  });
}

/**
 * 🛰️ ADMIN COMMAND PROTOCOL
 * Strictly limits ingress to Institutional Staff nodes only.
 */
export async function withAdmin(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  return withAuth(request, async (req, context) => {
    if (!context.isStaff) {
      return NextResponse.json(
        { error: "Forbidden", code: "STAFF_REQUIRED" },
        { status: 403 }
      );
    }
    return handler(req, context);
  });
}