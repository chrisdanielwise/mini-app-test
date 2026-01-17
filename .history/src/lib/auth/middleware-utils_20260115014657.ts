import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"; 
import { AuthService } from "@/lib/services/auth.service"; 
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
  can: (action: string) => boolean; 
}

/**
 * 🌊 UNIVERSAL_API_GATEKEEPER (v16.16.12)
 * Logic: Dual-Mode Ingress (Partitioned Cookies > Bearer Tokens).
 * Architecture: Fail-Fast Validation with Contextual Enrichment.
 */
export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  
  // 1. INGRESS_EXTRACTION
  const cookieStore = await cookies();
  let token = cookieStore.get(JWT_CONFIG.cookieName)?.value || null;
  let ingressMethod = "COOKIE";

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
  const payload = await AuthService.verifySession(token);

  if (!payload || !payload.user) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", code: "SESSION_EXPIRED" }, 
      { status: 401 }
    );
  }

  // 3. CONTEXT_CALIBRATION
  const role = (payload.user.role || "user").toLowerCase();
  const merchantId = payload.user.merchantId;
  
  // 🛡️ SECURITY_GUARD: Validate Merchant Node Integrity
  if (merchantId && !isUUID(merchantId)) {
    return NextResponse.json({ error: "FORBIDDEN", code: "MALFORMED_NODE_ID" }, { status: 403 });
  }

  const isStaff = JWT_CONFIG.staffRoles.includes(role);

  const context: AuthContext = {
    user: payload.user,
    isAdmin: role === "super_admin",
    isStaff: isStaff,
    isMerchant: !!merchantId,
    merchantId: merchantId || undefined,
    can: (action) => hasPermission(role, action)
  };

  const authenticatedRequest = request as AuthenticatedRequest;
  authenticatedRequest.user = payload.user;

  // 4. PROTOCOL_EXECUTION
  return handler(authenticatedRequest, context);
}