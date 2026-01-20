import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"; 
import { verifySession } from "@/lib/services/auth.service"; 
import { JWT_CONFIG } from "./config";
import { hasPermission, type AppPermission } from "./permissions";
import { isUUID } from "@/lib/utils/validators";

/**
 * 🛰️ UNIVERSAL_AUTH_TYPES
 * Logic: Exported for cross-component protocol alignment.
 */
export type AuthIngress = "COOKIE" | "BEARER";

export type AuthRole = 
  | "super_admin" 
  | "platform_manager" 
  | "platform_support" 
  | "merchant" 
  | "user" 
  | "amber";

export interface SessionPayload {
  user: {
    id: string;
    role: AuthRole;
    merchantId?: string | null;
    [key: string]: any;
  };
}

export type AuthenticatedRequest = NextRequest & { user: SessionPayload["user"] };

export interface AuthContext {
  user: SessionPayload["user"];
  isAdmin: boolean;
  isStaff: boolean;
  isMerchant: boolean;
  merchantId?: string;
  ingress: AuthIngress;
  can: (action: AppPermission) => boolean; 
}

/**
 * 🌊 UNIVERSAL_API_GATEKEEPER (Institutional Apex v2026.1.20)
 * Logic: Dual-Mode Ingress with Security Stamp Verification.
 * Standard: Next.js 15 Asynchronous Headers + Safari 2026 CHIPS.
 */
export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  
  // 1. INGRESS_EXTRACTION
  const cookieStore = await cookies();
  let token = cookieStore.get(JWT_CONFIG.cookieName)?.value || null;
  let ingressMethod: AuthIngress = "COOKIE";

  // 🚀 RECOVERY_PROTOCOL: Bearer Fallback for TMA (Telegram Mini App)
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

  // 🔐 2. CRYPTOGRAPHIC_HANDSHAKE
  const payload = await verifySession(token) as SessionPayload | null;

  if (!payload || !payload.user) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", code: "SESSION_EXPIRED_OR_REVOKED" }, 
      { status: 401 }
    );
  }

  // 3. CONTEXT_CALIBRATION
  const role = payload.user.role || "user";
  const merchantId = payload.user.merchantId;
  
  // 🛡️ SECURITY_GUARD: Node Integrity
  if (merchantId && !isUUID(merchantId)) {
    return NextResponse.json(
      { error: "FORBIDDEN", code: "MALFORMED_NODE_ID" }, 
      { status: 403 }
    );
  }

  const isStaff = JWT_CONFIG.staffRoles.includes(role.toLowerCase());

  const context: AuthContext = {
    user: payload.user,
    isAdmin: role === "super_admin",
    isStaff: isStaff,
    isMerchant: !!merchantId,
    merchantId: merchantId || undefined,
    ingress: ingressMethod,
    can: (action: AppPermission) => hasPermission(role, action)
  };

  const authenticatedRequest = request as AuthenticatedRequest;
  authenticatedRequest.user = payload.user;

  // 4. PROTOCOL_EXECUTION
  return handler(authenticatedRequest, context);
}