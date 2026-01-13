import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"; 
import { verifyJWT, extractToken, type JWTPayload } from "./telegram";
import { isUUID } from "@/lib/utils/validators";
import { JWT_CONFIG } from "./config";

/**
 * 🛰️ IDENTITY PROTOCOL INTERFACES
 */
export type AuthenticatedRequest = NextRequest & {
  user: JWTPayload;
};

export interface AuthContext {
  user: JWTPayload;
  isAdmin: boolean;    // Global Platform Admin
  isStaff: boolean;    // Global Platform Staff/Support
  isMerchant: boolean; // Merchant Cluster Operator (Owner/Agent)
  merchantId?: string; // UUID of the active cluster node
}

/**
 * 🛰️ GLOBAL API AUTH WRAPPER (Apex Tier)
 * Architecture: Next.js 16 Node.js Runtime
 * Logic: Cross-Protocol Ingress (Bearer + Partitioned Cookie)
 */
export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  // 1. INGRESS EXTRACTION
  const authHeader = request.headers.get("Authorization");
  let token = extractToken(authHeader);

  // 🛡️ FALLBACK: Next.js 16 Async Cookie Verification
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get(JWT_CONFIG.cookieName)?.value || null;
  }

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized", code: "MISSING_IDENTITY_TOKEN" },
      { status: 401 }
    );
  }

  // 2. CRYPTOGRAPHIC HANDSHAKE
  const payload = await verifyJWT(token);

  if (!payload) {
    return NextResponse.json(
      { error: "Unauthorized", code: "INVALID_SESSION_NODE" },
      { status: 401 }
    );
  }

  // 3. ROLE NORMALIZATION & CLEARANCE CALCULATION
  const role = payload.role.toLowerCase();
  
  // UUID Guard: Ensuring the node identifier is institutional-grade
  if (payload.merchantId && !isUUID(payload.merchantId)) {
    return NextResponse.json({ error: "Forbidden", code: "MALFORMED_NODE_ID" }, { status: 403 });
  }

  const context: AuthContext = {
    user: payload,
    // Using explicit payload flags where possible for high-speed resolution
    isAdmin: role === "super_admin",
    isStaff: payload.isStaff || ["super_admin", "platform_manager", "platform_support"].includes(role),
    isMerchant: !!payload.merchantId,
    merchantId: payload.merchantId || undefined,
  };

  // 4. REQUEST ENRICHMENT
  const authenticatedRequest = request as AuthenticatedRequest;
  authenticatedRequest.user = payload;

  return handler(authenticatedRequest, context);
}

/**
 * 🛰️ CLUSTER-SPECIFIC ACCESS (Merchant Gate)
 * Allows access to the Node Owner OR Platform Oversight Staff.
 */
export async function withMerchant(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  return withAuth(request, async (req, context) => {
    // 🛡️ Institutional Oversight: Staff can bypass node-isolation for support.
    const hasClearance = context.isStaff || (context.isMerchant && context.merchantId);

    if (!hasClearance) {
      return NextResponse.json({ error: "Forbidden", code: "MERCHANT_NODE_REQUIRED" }, { status: 403 });
    }

    return handler(req, context);
  });
}