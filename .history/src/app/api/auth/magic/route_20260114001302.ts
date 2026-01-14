import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";
import { AuditService } from "@/lib/services/audit.service"; 
import { Prisma } from "@/generated/prisma";

/**
 * 🛠️ TYPE DEFINITION
 * Ensures TypeScript recognizes 'merchantProfile' and 'securityStamp'.
 */
type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    merchantProfile: { select: { id: true } }
  }
}>;

/**
 * 🛰️ MAGIC HANDSHAKE HANDLER (v14.14.0)
 * Logic: Exchange Magic Token for Secure Session with Tunnel-Aware Cookies.
 * Environment: Hardened for Cloudflare Tunnels & Safari 2026.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  // 🛰️ DETECT PUBLIC ORIGIN (Crucial for Tunnel Environments)
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
    // The session now includes the securityStamp for the Global Kill Switch.
    const sessionToken = await AuthService.createSession(user);
    const cookieMetadata = AuthService.getCookieMetadata(host, protocol, user.role);

    // 3. 📝 AUDIT SENTINEL
    // Logs the entry into the institutional ledger.
    await AuditService.log({
      userId: user.id,
      merchantId: user.merchantProfile?.id,
      action: "LOGIN",
      ip: request.headers.get("x-forwarded-for")?.split(',')[0] || "0.0.0.0",
      metadata: {
        method: "MAGIC_LINK",
        gateway: host,
        ua: request.headers.get("user-agent"),
      },
    });

    // 4. 🚢 DEPLOY REDIRECT WITH COOKIE INJECTION
    const response = NextResponse.redirect(new URL("/dashboard", publicBaseUrl));

    // 🍪 IDENTITY ANCHOR (Partitioned for TMA/Safari 2026)
    // We explicitly spread the metadata and enforce path/domain for tunnels.
    response.cookies.set(cookieMetadata.name, sessionToken, {
      ...cookieMetadata.options,
      path: "/", // Ensure the cookie is available across the entire /dashboard
      domain: host?.includes("localhost") ? undefined : host?.split(":")[0],
    });

    console.log(`✅ [Magic_Success]: Identity anchored for Node ${user.id.slice(0, 8)}`);
    
    // 🚀 Performance Header: Informs the proxy that this is a fresh auth event
    response.headers.set("x-auth-refresh", "true");

    return response;

  } catch (error: any) {
    console.error("🔥 [Magic_Critical]: Handshake sequence failed:", error.message);
    return NextResponse.redirect(new URL("/dashboard/login?reason=system_error", publicBaseUrl));
  }
}