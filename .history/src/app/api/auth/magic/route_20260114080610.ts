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
 * 🛰️ MAGIC HANDSHAKE HANDLER (v14.50.0)
 * Logic: Hardened for Next.js 16, Cloudflare Tunnels, & Cross-Origin Ingress.
 * Feature: Double Ternary Routing with 'redirectTo' override.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  
  // 🚀 REDIRECT OVERRIDE: Look for a 'redirect' param, default to current path logic
  const redirectTo = searchParams.get("redirect");

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

    // 4. 🧭 INTELLIGENT ROUTING (The Double Ternary)
    // Logic: 
    // - If 'redirectTo' is explicitly "/", stay at "/".
    // - Otherwise, route based on privilege: Merchant -> Dashboard, User -> Home.
    const userRole = user.role?.toUpperCase();
    const isPrivileged = ["SUPER_ADMIN", "PLATFORM_MANAGER", "MERCHANT"].includes(userRole);

    const targetPath = redirectTo === "/" 
      ? "/" 
      : (isPrivileged ? "/dashboard" : "/home");

    const response = NextResponse.redirect(new URL(targetPath, publicBaseUrl));

    // 5. 🍪 IDENTITY ANCHOR (v16.0 Tunnel-Safe)
    const cookieDomain = host?.includes("localhost") ? undefined : host?.split(":")[0];

    response.cookies.set(cookieMetadata.name, sessionToken, {
      ...cookieMetadata.options,
      path: "/", 
      domain: cookieDomain,
      secure: true,
      sameSite: "none", 
      partitioned: true, 
    });

    console.log(`✅ [Magic_Success]: Identity anchored. Redirecting to: ${targetPath}`);
    
    response.headers.set("x-auth-refresh", "true");
    return response;

  } catch (error: any) {
    console.error("🔥 [Magic_Critical]: Handshake sequence failed:", error.message);
    return NextResponse.redirect(new URL("/dashboard/login?reason=system_error", publicBaseUrl));
  }
}