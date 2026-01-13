import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"; 
import { verifyJWT, extractToken, type JWTPayload } from "./telegram";
import { isUUID } from "@/lib/utils/validators";
import { JWT_CONFIG } from "./config";
import { hasPermission } from "./permissions";

/**
 * 🛰️ IDENTITY PROTOCOL INTERFACES
 */
export type AuthenticatedRequest = NextRequest & {
  user: JWTPayload;
};

export interface AuthContext {
  user: JWTPayload;
  isAdmin: boolean;    // Master Clearance (Super Admin)
  isStaff: boolean;    // Global Platform Oversight
  isMerchant: boolean; // Merchant Node Operator
  merchantId?: string; // Active Node UUID
  can: (action: any) => boolean; // Ad-hoc permission checker
}

/**
 * 🛰️ GLOBAL API AUTH WRAPPER (Institutional v12.16.0)
 * Architecture: Hybrid Ingress Protocol
 * Logic: Prioritizes Bearer (Recovery Node) > Cookie (Standard Node)
 */
export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  // 1. INGRESS EXTRACTION
  const authHeader = request.headers.get("Authorization");
  
  // 🚀 PRIORITY: Check for Bearer token first to handle TMA SecureStorage recovery
  let token = extractToken(authHeader);
  let ingressMethod = "BEARER";

  // 🛡️ FALLBACK: Check for Cookies if no Authorization header is present
  if (!token) {
    const cookieStore = await cookies();
    token = (await cookieStore).get(JWT_CONFIG.cookieName)?.value || null;
    ingressMethod = "COOKIE";
  }

  if (!token) {
    // 🕵️ Recovery Logging for [Subs_Auth] diagnostics
    console.warn(`[Auth_Wrapper] Protocol Header: MISSING for path: ${request.nextUrl.pathname}`);
    return NextResponse.json(
      { error: "Unauthorized", code: "CREDENTIALS_MISSING" },
      { status: 401 }
    );
  }

  // 2. CRYPTOGRAPHIC HANDSHAKE
  const payload = await verifyJWT(token);

  if (!payload) {
    console.warn(`[Auth_Wrapper] ${ingressMethod} Token Rejected or Expired.`);
    return NextResponse.json(
      { error: "Unauthorized", code: "SESSION_EXPIRED" },
      { status: 401 }
    );
  }

  // 3. ROLE & CLEARANCE CALCULATION
  const role = payload.role.toLowerCase();
  
  // 🛡️ INSTITUTIONAL GUARD: Malformed UUID rejection
  if (payload.merchantId && !isUUID(payload.merchantId)) {
    return NextResponse.json(
      { error: "Forbidden", code: "MALFORMED_NODE_ID" }, 
      { status: 403 }
    );
  }

  // Resolve staff status using centralized config roles
  const isPlatformStaff = JWT_CONFIG.staffRoles.includes(role) || payload.isStaff;

  const context: AuthContext = {
    user: payload,
    isAdmin: role === "super_admin",
    isStaff: isPlatformStaff,
    isMerchant: !!payload.merchantId,
    merchantId: payload.merchantId || undefined,
    can: (action) => hasPermission(role, action)
  };

  // 4. REQUEST ENRICHMENT
  const authenticatedRequest = request as AuthenticatedRequest;
  authenticatedRequest.user = payload;

  return handler(authenticatedRequest, context);
}

/**
 * 🛰️ MERCHANT ACCESS PROTOCOL
 */
export async function withMerchant(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  return withAuth(request, async (req, context) => {
    const hasClearance = context.isStaff || (context.isMerchant && context.merchantId);

    if (!hasClearance) {
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
 */
export async function withAdmin(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
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