import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"; 
import { AuthService } from "@/lib/services/auth.service"; // 🚀 Unified Handshake
import { JWT_CONFIG } from "./config";
import { hasPermission } from "./permissions";

/**
 * 🛰️ IDENTITY PROTOCOL INTERFACES
 */
export type AuthenticatedRequest = NextRequest & {
  user: any; // Using the AuthService session payload
};

export interface AuthContext {
  user: any;
  isAdmin: boolean;    // Master Clearance (Super Admin)
  isStaff: boolean;    // Platform Oversight
  isMerchant: boolean; // Merchant Node Operator
  merchantId?: string; // Active Node UUID
  can: (action: any) => boolean; 
}

/**
 * 🛰️ GLOBAL API AUTH WRAPPER (Institutional v13.2.5)
 * Logic: Dual-Mode Ingress (HttpOnly Cookies > Bearer Tokens).
 * Purpose: Stops redirect loops by ensuring API and Middleware use the same session logic.
 */
export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
): Promise<NextResponse> {
  
  // 1. INGRESS EXTRACTION
  // 🛡️ PRIMARY: Check for HttpOnly Cookie (Safari 2026 Partitioned Standard)
  const cookieStore = await cookies();
  let token = cookieStore.get(JWT_CONFIG.cookieName)?.value || null;
  let ingressMethod = "COOKIE";

  // 🚀 FALLBACK: Check for Authorization Bearer (Recovery for TMA SecureStorage)
  if (!token) {
    const authHeader = request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
      ingressMethod = "BEARER";
    }
  }

  if (!token) {
    console.warn(`[Auth_Wrapper] 🛡️ Access Blocked: No credentials for ${request.nextUrl.pathname}`);
    return NextResponse.json(
      { error: "Unauthorized", code: "CREDENTIALS_MISSING" }, 
      { status: 401 }
    );
  }

  // 🔐 2. CRYPTOGRAPHIC HANDSHAKE
  // We use the centralized verifySession to ensure consistent JWT validation.
  const payload = await AuthService.verifySession(token);

  if (!payload) {
    console.warn(`[Auth_Wrapper] ❌ ${ingressMethod} session rejected or expired.`);
    return NextResponse.json(
      { error: "Unauthorized", code: "SESSION_EXPIRED" }, 
      { status: 401 }
    );
  }

  // 3. ROLE & CLEARANCE CALCULATION
  // Normalize roles to lowercase to prevent RBAC mismatch errors.
  const role = (payload.role as string || "user").toLowerCase();
  
  // Resolve staff status using centralized staffRoles (includes 'merchant' if added to config)
  const isPlatformStaff = JWT_CONFIG.staffRoles.includes(role) || !!payload.isStaff;

  const context: AuthContext = {
    user: payload,
    isAdmin: role === "super_admin",
    isStaff: isPlatformStaff,
    isMerchant: !!payload.merchantId,
    merchantId: (payload.merchantId as string) || undefined,
    can: (action) => hasPermission(role, action)
  };

  const authenticatedRequest = request as AuthenticatedRequest;
  authenticatedRequest.user = payload;

  // 🚀 4. EXECUTE HANDLER
  console.log(`✅ [API_Auth] Handshake verified via ${ingressMethod} for UID: ${payload.sub}`);
  return handler(authenticatedRequest, context);
}

/**
 * 🛰️ MERCHANT ACCESS PROTOCOL
 */
export async function withMerchant(
  request: NextRequest,
  handler: (req: AuthenticatedRequest, context: AuthContext) => Promise<NextResponse>
) {
  return withAuth(request, async (req, context) => {
    // Allows access if user is Staff OR an authorized Merchant/Agent
    const hasAccess = context.isStaff || (context.isMerchant && context.merchantId);

    if (!hasAccess) {
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
) {
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