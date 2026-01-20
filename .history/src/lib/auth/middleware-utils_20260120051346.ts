import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"; 
import { verifySession } from "@/lib/services/auth.service"; 
import { JWT_CONFIG } from "./config";
import { hasPermission, type AppPermission } from "./permissions";
import { isUUID } from "@/lib/utils/validators";
import prisma from "@/lib/db"; // ✅ Verified Prisma singleton ingress

/**
 * 🛰️ UNIVERSAL_AUTH_TYPES
 * Logic: Protocol alignment for cross-component hydration.
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
 * 🌊 UNIVERSAL_API_GATEKEEPER
 * Logic: Hydrates stale JWT data with live Database state to prevent Auth Drift.
 * Strategy: Dynamic Role Resolution for Merchant & Staff nodes.
 */
export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  
  // 1. INGRESS_EXTRACTION
  const cookieStore = await cookies();
  let token = cookieStore.get(JWT_CONFIG.cookieName)?.value || null;
  let ingressMethod: AuthIngress = "COOKIE";

  if (!token) {
    const authHeader = request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
      ingressMethod = "BEARER";
    }
  }

  if (!token) {
    return NextResponse.json({ error: "UNAUTHORIZED", code: "CREDENTIALS_MISSING" }, { status: 401 });
  }

  // 🔐 2. CRYPTOGRAPHIC_HANDSHAKE
  const payload = await verifySession(token) as SessionPayload | null;

  if (!payload || !payload.user) {
    return NextResponse.json({ error: "UNAUTHORIZED", code: "SESSION_EXPIRED" }, { status: 401 });
  }

  // 🧬 3. DYNAMIC_HYDRATION (The "Anti-Redirect" Fix)
  // We fetch the LATEST truth from the DB to ignore any stale roles baked into the JWT.
  const liveUser = await prisma.user.findUnique({
    where: { id: payload.user.id },
    select: { 
      role: true, 
      merchantProfile: { select: { id: true } } 
    }
  });

  if (!liveUser) {
    return NextResponse.json({ error: "UNAUTHORIZED", code: "USER_NOT_FOUND" }, { status: 401 });
  }

  // 🏁 RESOLVE IDENTITY: Database truth > JWT payload
  const currentRole = (liveUser.role as AuthRole) || payload.user.role || "user";
  const currentMerchantId = liveUser.merchantProfile?.id || payload.user.merchantId;
  
  // 🛡️ SECURITY_GUARD: Merchant Node Integrity
  if (currentMerchantId && !isUUID(currentMerchantId)) {
    return NextResponse.json({ error: "FORBIDDEN", code: "MALFORMED_NODE_ID" }, { status: 403 });
  }

  /**
   * ✅ THE FIX: HYBRID STAFF RESOLUTION
   * Logic: Merchants must be considered 'Staff' for the purpose of accessing 
   * dashboard features like Coupons.
   */
  const normalizedRole = currentRole.toLowerCase();
  const isStaff = JWT_CONFIG.staffRoles.includes(normalizedRole) || normalizedRole === "merchant";

  // Package the hydrated identity for the request cycle
  const hydratedUser = {
    ...payload.user,
    role: currentRole,
    merchantId: currentMerchantId
  };

  const context: AuthContext = {
    user: hydratedUser,
    isAdmin: normalizedRole === "super_admin",
    isStaff: isStaff,
    isMerchant: !!currentMerchantId,
    merchantId: currentMerchantId || undefined,
    ingress: ingressMethod,
    can: (action: AppPermission) => hasPermission(currentRole, action)
  };

  const authenticatedRequest = request as AuthenticatedRequest;
  authenticatedRequest.user = hydratedUser;

  // 4. PROTOCOL_EXECUTION
  return handler(authenticatedRequest, context);
}