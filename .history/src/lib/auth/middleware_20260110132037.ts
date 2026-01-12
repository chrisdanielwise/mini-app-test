import { type NextRequest, NextResponse } from "next/server";
import { verifyJWT, extractToken, type JWTPayload } from "./telegram";
import { isUUID } from "@/lib/utils/validators";

export type AuthenticatedRequest = NextRequest & {
  user: JWTPayload;
};

export interface AuthContext {
  user: JWTPayload;
  isAdmin: boolean;
  isMerchant: boolean;
  merchantId?: string;
}

/**
 * 🛰️ GLOBAL API AUTH WRAPPER (Apex Tier)
 * Performs the initial cryptographic and structural handshake.
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
  if (payload.merchantId && !isUUID(payload.merchantId)) {
    return NextResponse.json(
      { error: "Forbidden", code: "MALFORMED_ID" },
      { status: 403 }
    );
  }

  const context: AuthContext = {
    user: payload,
    isAdmin: ["super_admin", "platform_manager"].includes(payload.role),
    isMerchant: payload.role === "merchant",
    merchantId: payload.merchantId,
  };

  const authenticatedRequest = request as AuthenticatedRequest;
  authenticatedRequest.user = payload;

  return handler(authenticatedRequest, context);
}

/**
 * 🛰️ MERCHANT ACCESS PROTOCOL
 * Ensures the requester is either the Merchant or a Super Admin with context.
 */
export async function withMerchant(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  return withAuth(request, async (req, context) => {
    // Permission Logic: Admins bypass, Merchants must have an ID
    const hasPermission = context.isAdmin || (context.isMerchant && context.merchantId);

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
 */
export async function withAdmin(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  return withAuth(request, async (req, context) => {
    if (!context.isAdmin) {
      return NextResponse.json(
        { error: "Forbidden", code: "ADMIN_REQUIRED" },
        { status: 403 }
      );
    }
    return handler(req, context);
  });
}