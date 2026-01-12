import { type NextRequest, NextResponse } from "next/server";
import { verifyJWT, extractToken, type JWTPayload } from "./telegram";
import { isUUID } from "@/lib/utils/validators";

export type AuthenticatedRequest = NextRequest & {
  user: JWTPayload;
};

export interface AuthContext {
  user: JWTPayload;
  isAdmin: boolean;    // Super Admin / Manager
  isStaff: boolean;    // Any platform-level staff (including support)
  isMerchant: boolean; // Specific Merchant account
  merchantId?: string; // UUID of the linked merchant cluster
}

/**
 * 🛰️ GLOBAL API AUTH WRAPPER (Apex Tier)
 * Performs the initial cryptographic and structural handshake.
 * Updated to support Universal Identity Protocol.
 */
export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  const authHeader = request.headers.get("Authorization");
  const token = extractToken(authHeader);

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

  // 🛡️ PRISMA 7 TYPE GUARD: Hardening against UUID injection
  // Logic: Only validate merchantId if it exists (Admins often have null merchantId)
  if (payload.merchantId && !isUUID(payload.merchantId)) {
    return NextResponse.json(
      { error: "Forbidden", code: "MALFORMED_ID" },
      { status: 403 }
    );
  }

  // 🏗️ UNIVERSAL CONTEXT MAPPING
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
 * Ensures the requester is either the linked Merchant or Staff with Oversight clearance.
 */
export async function withMerchant(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  return withAuth(request, async (req, context) => {
    // 🛡️ Logic: Staff bypasses merchantId requirement for Global Oversight.
    // Merchants MUST have a valid merchantId.
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
 * Strictly limits access to Platform Staff only.
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