import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";
import { AuditService } from "@/lib/services/audit.service"; 
import { Prisma } from "@/generated/prisma";

/**
 * 🛠️ TYPE DEFINITION
 */
type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    merchantProfile: { select: { id: true } }
  }
}>;

/**
 * 🛰️ MAGIC HANDSHAKE HANDLER (v14.45.0)
 * Logic: Hardened for Next.js 16, Cloudflare Tunnels, & Cross-Origin Ingress.
 * Fix: Dynamic Redirect Target based on User Role to prevent "Guard_Fail" loops.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  // 🛰️ DYNAMIC HOST DETECTION
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const publicBaseUrl = `${protocol}://${host}`;

  console.log(`🔑 [Magic_Handshake]: Initializing sequence for: ${publicBaseUrl}`);

  if (!token) {
    return NextResponse.redirect(new URL("/dashboard/login?reason=no_token", publicBaseUrl));
  }

  try {
    // 1. 🛡️ VERIFY & ROTATE TOKEN
    const user = await AuthService.verifyMagicToken(token) as UserWithRelations | null;

    if (!user) {
      console.warn("⚠️ [Magic_Auth]: Identity token invalid or expired.");
      return NextResponse.redirect(new URL("/dashboard/login?reason=invalid_token", publicBaseUrl));
    }

    // 2. 🔐 GENERATE HARDENED SESSION
    const sessionToken = await AuthService.createSession(user);
    const cookieMetadata = AuthService.getCookieMetadata(host, protocol, user.role);

    // 3. 📝 AUDIT SENTINEL
    await AuditService.log({
      userId: user.id,
      merchantId: user.merchantProfile?.id,
      action: "LOGIN",
      ip: request.headers.get("x-forwarded-for")?.split(',')[0] || "0.0.0.0",
      metadata: { method: "MAGIC_LINK", gateway: host, ua: request.headers.get("user-agent") },
    });

    // 4. 🧭 INTELLIGENT ROUTING
    // Logic: If they are a standard user, send them to /home. 
    // If they are Staff or Merchant, send them to the Dashboard.
    const userRole = user.role?.toUpperCase();
    const isPrivileged = ["SUPER_ADMIN", "PLATFORM_MANAGER", "MERCHANT"].includes(userRole);
    const targetPath = isPrivileged ? "/dashboard" : "/home";

    const response = NextResponse.redirect(new URL(targetPath, publicBaseUrl));

    // 5. 🍪 IDENTITY ANCHOR (v16.0 Tunnel-Safe)
    // We explicitly clear the cookie domain for localhost to prevent cross-origin blocks
    const cookieDomain = host?.includes("localhost") ? undefined : host?.split(":")[0];

    response.cookies.set(cookieMetadata.name, sessionToken, {
      ...cookieMetadata.options,
      path: "/", 
      domain: cookieDomain,
      secure: true,
      sameSite: "none", // 🚀 Required for Telegram Mini App frames
      partitioned: true, // 🚀 2026 Standard: Required for Safari cross-site cookie privacy
    });

    console.log(`✅ [Magic_Success]: Identity anchored for Node ${user.id.slice(0, 8)} [${userRole}]`);
    
    // Performance Header
    response.headers.set("x-auth-refresh", "true");

    return response;

  } catch (error: any) {
    console.error("🔥 [Magic_Critical]: Handshake sequence failed:", error.message);
    return NextResponse.redirect(new URL("/dashboard/login?reason=system_error", publicBaseUrl));
  }
}