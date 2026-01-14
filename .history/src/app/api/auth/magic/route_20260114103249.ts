import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";
import { AuditService } from "@/lib/services/audit.service";
import { Prisma } from "@/generated/prisma";

/**
 * 🛠️ TYPE DEFINITION
 */
type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    merchantProfile: { select: { id: true } };
  };
}>;

/**
 * 🛰️ MAGIC HANDSHAKE HANDLER (v15.0.2)
 * Logic: Redirects to /auth/callback to trigger cross-tab synchronization.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const publicBaseUrl = `${protocol}://${host}`;

  if (!token) {
    return NextResponse.redirect(new URL("/dashboard/login?reason=no_token", publicBaseUrl));
  }

  try {
    const user = (await AuthService.verifyMagicToken(token)) as UserWithRelations | null;

    if (!user) {
      return NextResponse.redirect(new URL("/dashboard/login?reason=invalid_token", publicBaseUrl));
    }

    const sessionToken = await AuthService.createSession(user);
    const cookieMetadata = AuthService.getCookieMetadata(host, protocol, user.role);

    // 🛡️ SECURITY AUDIT
    await AuditService.log({
      userId: user.id,
      merchantId: user.merchantProfile?.id,
      action: "LOGIN",
      ip: request.headers.get("x-forwarded-for")?.split(",")[0] || "0.0.0.0",
      metadata: { method: "MAGIC_LINK", gateway: host },
    });

    const userRole = user.role?.toUpperCase();
    const isPrivileged = ["SUPER_ADMIN", "PLATFORM_MANAGER", "MERCHANT"].includes(userRole);
    
    // 🛰️ THE HANDSHAKE BRIDGE: Force redirect to /auth/callback
    // This is required so Tab B can pulse Tab A to change its path.
    const finalTarget = redirectTo || (isPrivileged ? "/dashboard" : "/home");
    
    const callbackUrl = new URL("/auth/callback", publicBaseUrl);
    callbackUrl.searchParams.set("target", finalTarget);

    const response = NextResponse.redirect(callbackUrl);

    // 🍪 ATOMIC COOKIE INJECTION
    const cookieDomain = host?.includes("localhost") ? undefined : host?.split(":")[0];

    response.cookies.set(cookieMetadata.name, sessionToken, {
      ...cookieMetadata.options,
      path: "/",
      domain: cookieDomain,
      secure: true,
      sameSite: "none", // Required for cross-site cookie setting from Telegram
      partitioned: true, // 2026 Chrome Standard for cross-tab cookies
    });

    return response;
  } catch (error: any) {
    console.error("🔥 [Magic_Critical]:", error.message);
    return NextResponse.redirect(new URL("/dashboard/login?reason=system_error", publicBaseUrl));
  }
}