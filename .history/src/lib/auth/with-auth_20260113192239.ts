import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"; 
import { AuthService } from "@/lib/services/auth.service"; // 🚀 Unified Auth
import { isUUID } from "@/lib/utils/validators";
import { JWT_CONFIG } from "./config";
import { hasPermission } from "./permissions";

/**
 * 🛰️ IDENTITY PROTOCOL INTERFACES
 */
export type AuthenticatedRequest = NextRequest & {
  user: any; // Using the AuthService session payload type
};

export interface AuthContext {
  user: any;
  isAdmin: boolean;    // Master Clearance
  isStaff: boolean;    // Global Platform Oversight
  isMerchant: boolean; // Merchant Node Operator
  merchantId?: string; // Active Node UUID
  can: (action: any) => boolean; 
}

/**
 * 🛰️ GLOBAL API AUTH WRAPPER (Institutional v13.2.0)
 * Architecture: Hybrid Ingress Protocol
 * Logic: Prioritizes HttpOnly Cookie -> Authorization Bearer Fallback.
 */
export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  
  // 1. INGRESS EXTRACTION
  // 🛡️ PRIMARY: Cookie (Standard for Browser & Magic Link sessions)
  const cookieStore = await cookies();
  let token = cookieStore.get(JWT_CONFIG.cookieName)?.value || null;
  let ingressMethod = "COOKIE";

  // 🚀 FALLBACK: Bearer (Recovery for TMA SecureStorage if cookies are blocked)
  if (!token) {
    const authHeader = request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
      ingressMethod = "BEARER";
    }
  }

  if (!token) {
    console.warn(`[Auth_Wrapper] 🛡️ Access Denied: No credentials found for ${request.nextUrl.pathname}`);
    return NextResponse.json(
      { error: "Unauthorized", code: "CREDENTIALS_MISSING" },
      { status: 401 }
    );
  }

  // 2. CRYPTOGRAPHIC HANDSHAKE
  // Uses the centralized AuthService to verify the JWT
  const payload = await AuthService.verifySession(token);

  if (!payload) {
    console.warn(`[Auth_Wrapper] ❌ ${ingressMethod} Token Rejected or Expired.`);
    return NextResponse.json(
      { error: "Unauthorized", code: "SESSION_EXPIRED" },
      { status: 401 }
    );
  }

  // 3. ROLE & CLEARANCE CALCULATION
  const role = (payload.role as string || "user").toLowerCase();
  const merchantId = payload.merchantId as string | undefined;
  
  // 🛡️ INSTITUTIONAL GUARD: Malformed Node Detection
  if (merchantId && !isUUID(merchantId)) {
    return NextResponse.json({ error: "Forbidden", code: "MALFORMED_NODE_ID" }, { status: 403 });
  }

  const isPlatformStaff = JWT_CONFIG.staffRoles.includes(role) || !!payload.isStaff;

  const context: AuthContext = {
    user: payload,
    isAdmin: role === "super_admin",
    isStaff: isPlatformStaff,
    isMerchant: !!merchantId,
    merchantId: merchantId || undefined,
    can: (action) => hasPermission(role, action)
  };

  // 4. REQUEST ENRICHMENT
  const authenticatedRequest = request as AuthenticatedRequest;
  authenticatedRequest.user = payload;

  return handler(authenticatedRequest, context);
}

/**
 * 🛰️ MERCHANT ACCESS PROTOCOL (Requires Staff or Merchant role)
 */
export async function withMerchant(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  return withAuth(request, async (req, context) => {
    if (!context.isStaff && !context.isMerchant) {
      return NextResponse.json({ error: "Forbidden", code: "MERCHANT_CONTEXT_REQUIRED" }, { status: 403 });
    }
    return handler(req, context);
  });
}

/**
 * 🛰️ ADMIN COMMAND PROTOCOL (Staff Only)
 */
export async function withAdmin(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  return withAuth(request, async (req, context) => {
    if (!context.isStaff) {
      return NextResponse.json({ error: "Forbidden", code: "PLATFORM_STAFF_REQUIRED" }, { status: 403 });
    }
    return handler(req, context);
  });
}