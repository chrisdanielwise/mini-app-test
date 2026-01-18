import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"; 
import { verifySession } from "@/lib/services/auth.service"; 
import { JWT_CONFIG } from "./config";
import { hasPermission } from "./permissions";
import { isUUID } from "@/lib/utils/validators";

export type AuthenticatedRequest = NextRequest & { user: any };

export interface AuthContext {
  user: any;
  isAdmin: boolean;
  isStaff: boolean;
  isMerchant: boolean;
  merchantId?: string;
  ingress: "COOKIE" | "BEARER";
  can: (action: string) => boolean; 
}

/**
 * 🌊 UNIVERSAL_API_GATEKEEPER (v16.16.20)
 * Logic: Dual-Mode Ingress (Partitioned Cookies > Bearer Tokens).
 * Architecture: Fail-Fast Validation with Security Stamp Verification.
 * Standard: Safari 2026 CHIPS / Next.js 15 Asynchronous Headers.
 */
export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  
  // 1. INGRESS_EXTRACTION
  // Next.js 15: cookies() is now an asynchronous call
  const cookieStore = await cookies();
  let token = cookieStore.get(JWT_CONFIG.cookieName)?.value || null;
  let ingressMethod: "COOKIE" | "BEARER" = "COOKIE";

  // 🚀 RECOVERY_PROTOCOL: Bearer Fallback for TMA (Telegram Mini App) Iframes
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

  // 🔐 2. CRYPTOGRAPHIC_HANDSHAKE & SECURITY STAMP CHECK
  // verifySession now cross-references the live DB for session revocation
  const payload = await verifySession(token);

  if (!payload || !payload.user) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", code: "SESSION_EXPIRED_OR_REVOKED" }, 
      { status: 401 }
    );
  }

  // 3. CONTEXT_CALIBRATION
  const role = (payload.user.role || "user").toLowerCase();
  const merchantId = payload.user.merchantId;
  
  // 🛡️ SECURITY_GUARD: Node Integrity
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

  const authenticatedRequest = request as AuthenticatedRequest;
  authenticatedRequest.user = payload.user;

  // 4. PROTOCOL_EXECUTION
  return handler(authenticatedRequest, context);
}