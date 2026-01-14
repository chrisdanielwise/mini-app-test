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
 * 🛰️ MAGIC HANDSHAKE HANDLER (v14.60.0)
 * Optimized: Implements the "Vanishing Tab" protocol for 2026 Browser Sync.
 * Logic: Redirects to /auth/callback to allow cross-tab communication.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const redirectTo = searchParams.get("redirect") || "/";

  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const publicBaseUrl = `${protocol}://${host}`;

  if (!token) {
    return NextResponse.redirect(new URL("/dashboard/login?reason=no_token", publicBaseUrl));
  }

  try {
    const user = await AuthService.verifyMagicToken(token) as UserWithRelations | null;

    if (!user) {
      return NextResponse.redirect(new URL("/dashboard/login?reason=invalid_token", publicBaseUrl));
    }

    const sessionToken = await AuthService.createSession(user);
    const cookieMetadata = AuthService.getCookieMetadata(host, protocol, user.role);

    await AuditService.log({
      userId: user.id,
      merchantId: user.merchantProfile?.id,
      action: "LOGIN",
      ip: request.headers.get("x-forwarded-for")?.split(',')[0] || "0.0.0.0",
      metadata: { method: "MAGIC_LINK", gateway: host, ua: request.headers.get("user-agent") },
    });

    const userRole = user.role?.toUpperCase();
    const isPrivileged = ["SUPER_ADMIN", "PLATFORM_MANAGER", "MERCHANT"].includes(userRole);

    // 🛰️ DYNAMIC ROUTING EXCEPTION
    // Instead of redirecting directly to /dashboard or /home, we go to /auth/callback.
    // We pass the final 'target' as a query parameter.
    const finalTarget = redirectTo === "/" && isPrivileged ? "/dashboard" : redirectTo;
    
    const response = NextResponse.redirect(
      new URL(`/auth/callback?target=${encodeURIComponent(finalTarget)}`, publicBaseUrl)
    );

    const cookieDomain = host?.includes("localhost") ? undefined : host?.split(":")[0];

    response.cookies.set(cookieMetadata.name, sessionToken, {
      ...cookieMetadata.options,
      path: "/", 
      domain: cookieDomain,
      secure: true,
      sameSite: "none", 
      partitioned: true, 
    });

    response.headers.set("x-auth-refresh", "true");
    return response;

  } catch (error: any) {
    console.error("🔥 [Magic_Critical]: Handshake sequence failed:", error.message);
    return NextResponse.redirect(new URL("/dashboard/login?reason=system_error", publicBaseUrl));
  }
}