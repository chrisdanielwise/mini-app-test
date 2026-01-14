import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client"; //
import { AuthService } from "@/lib/services/auth.service";
import { AuditService } from "@/lib/services/audit.service"; //

/**
 * 🛠️ TYPE DEFINITION
 * Ensures TypeScript recognizes 'merchantProfile' and other relations.
 */
type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    merchantProfile: { select: { id: true } }
  }
}>;

/**
 * 🛰️ MAGIC HANDSHAKE HANDLER (v13.9.60)
 * Logic: Exchange Magic Token for Secure Session + Public Origin Detection.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  // 🛰️ DETECT PUBLIC ORIGIN (The Tunnel URL)
  // Cloudflare/Ngrok send 'x-forwarded-host' and 'x-forwarded-proto'
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const publicBaseUrl = `${protocol}://${host}`;

  console.log(`🔑 [Magic_Handshake]: Attempting login for origin: ${publicBaseUrl}`);

  if (!token) {
    return NextResponse.redirect(new URL("/dashboard/login?reason=no_token", publicBaseUrl));
  }

  try {
    // 1. VERIFY & BURN TOKEN
    // Cast result to UserWithRelations to satisfy the type checker
    const user = await AuthService.verifyMagicToken(token) as UserWithRelations | null;

    if (!user) {
      console.warn("⚠️ [Magic_Auth]: Token invalid or already used.");
      return NextResponse.redirect(new URL("/dashboard/login?reason=invalid_token", publicBaseUrl));
    }

    // 2. GENERATE SESSION
    const sessionToken = await AuthService.createSession(user);
    const cookieMetadata = AuthService.getCookieMetadata(host, protocol);

    // 3. SECURITY AUDIT
    await AuditService.log({
      userId: user.id,
      merchantId: user.merchantProfile?.id,
      action: "LOGIN",
      ip: request.headers.get("x-forwarded-for") || "0.0.0.0",
      metadata: {
        method: "MAGIC_LINK",
        browser: request.headers.get("user-agent"),
      },
    });

    // 4. PROTOCOL-AWARE REDIRECT
    // We redirect using the Public Base URL to prevent localhost protocol mismatches.
    const response = NextResponse.redirect(new URL("/dashboard", publicBaseUrl));

    response.cookies.set({
      name: cookieMetadata.name,
      value: sessionToken,
      ...cookieMetadata.options,
    });

    console.log(`✅ [Magic_Success]: Identity established for Node ${user.id}`);
    return response;

  } catch (error: any) {
    console.error("🔥 [Magic_Critical]:", error.message);
    return NextResponse.redirect(new URL("/dashboard/login?reason=system_error", publicBaseUrl));
  }
}