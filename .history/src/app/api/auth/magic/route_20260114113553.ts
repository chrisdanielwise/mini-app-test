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
 * 🛰️ MAGIC HANDSHAKE HANDLER (Institutional v15.5.0)
 * Logic: Validates Telegram identity, injects partitioned cookies, and hands off to the Callback Bridge.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const publicBaseUrl = `${protocol}://${host}`;

  // 🛡️ SECURITY GATE: Token Presence
  if (!token) {
    return NextResponse.redirect(new URL("/dashboard/login?reason=no_token", publicBaseUrl));
  }

  try {
    // 1. 🔑 IDENTITY VERIFICATION
    const user = (await AuthService.verifyMagicToken(token)) as UserWithRelations | null;

    if (!user) {
      return NextResponse.redirect(new URL("/dashboard/login?reason=invalid_token", publicBaseUrl));
    }

    // 2. 📝 SESSION PROVISIONING
    const sessionToken = await AuthService.createSession(user);
    const cookieMetadata = AuthService.getCookieMetadata(host, protocol, user.role);

    // 🛡️ SECURITY AUDIT LOGGING
    await AuditService.log({
      userId: user.id,
      merchantId: user.merchantProfile?.id,
      action: "LOGIN",
      ip: request.headers.get("x-forwarded-for")?.split(",")[0] || "0.0.0.0",
      metadata: { 
        method: "TELEGRAM_MAGIC_LINK", 
        gateway: host,
        userAgent: request.headers.get("user-agent")
      },
    });

    // 3. 🛰️ DYNAMIC ROUTING PREPARATION
    const userRole = user.role?.toUpperCase();
    const isPrivileged = ["SUPER_ADMIN", "PLATFORM_MANAGER", "MERCHANT"].includes(userRole);
    const finalTarget = redirectTo || (isPrivileged ? "/dashboard" : "/home");
    
    // 🚀 THE BRIDGE HANDOFF
    // We redirect to the callback page to trigger the cross-tab pulse.
    const callbackUrl = new URL("/auth/callback", publicBaseUrl);
    callbackUrl.searchParams.set("target", finalTarget);

    const response = NextResponse.redirect(callbackUrl);

    // 4. 🍪 ATOMIC COOKIE INJECTION (2026 Standards)
    const cookieDomain = host?.includes("localhost") ? undefined : host?.split(":")[0];

    response.cookies.set(cookieMetadata.name, sessionToken, {
      ...cookieMetadata.options,
      path: "/",
      domain: cookieDomain,
      secure: true,
      httpOnly: true,
      sameSite: "none", // 🔒 Crucial for cookies set from external app redirects
      partitioned: true, // 🌐 Modern Chrome support for cross-tab session persistence
    });

    return response;
  } catch (error: any) {
    console.error("🔥 [Magic_Critical]: Handshake sequence failed:", error.message);
    return NextResponse.redirect(new URL("/dashboard/login?reason=system_error", publicBaseUrl));
  }
}