import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"; 
import { verifySession } from "@/lib/services/auth.service"; 
import { JWT_CONFIG } from "./config";
import { hasPermission, type AppPermission } from "./permissions";
import { isUUID } from "@/lib/utils/validators";
import prisma from "@/lib/db"; // ✅ Added Prisma for live data hydration

/**
 * 🛰️ UNIVERSAL_AUTH_TYPES
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
 * 🌊 UNIVERSAL_API_GATEKEEPER (Institutional Apex v2.0)
 * Logic: Hydrates stale JWT data with live Database state.
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

  // 🧬 3. DYNAMIC_HYDRATION (Root Cause Fix)
  // We fetch the LATEST data from the DB to overwrite any stale roles in the JWT.
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

  // Use the Database value as the source of truth, fallback to payload
  const currentRole = (liveUser.role as AuthRole) || payload.user.role || "user";
  const currentMerchantId = liveUser.merchantProfile?.id || payload.user.merchantId;
  
  // 🛡️ SECURITY_GUARD: Node Integrity
  if (currentMerchantId && !isUUID(currentMerchantId)) {
    return NextResponse.json({ error: "FORBIDDEN", code: "MALFORMED_NODE_ID" }, { status: 403 });
  }

  const isStaff = JWT_CONFIG.staffRoles.includes(currentRole.toLowerCase());

  // Update the user object for the rest of the application
  const hydratedUser = {
    ...payload.user,
    role: currentRole,
    merchantId: currentMerchantId
  };

  const context: AuthContext = {
    user: hydratedUser,
    isAdmin: currentRole === "super_admin",
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