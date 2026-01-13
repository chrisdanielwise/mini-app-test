import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";

/**
 * 🛰️ MAGIC HANDSHAKE HANDLER (v13.0.4)
 * Logic: Exchange One-Time Token (OTT) for a Secure Session.
 * Security: HttpOnly, Secure, Partitioned (Safari 2026 Compatible).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  
  // 🛡️ SECURITY CONTEXT: Protocol awareness for Tunnels/Production
  const host = request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "http";

  // 1. Validate Token Presence
  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing_credentials", request.url));
  }

  try {
    // 2. Database Verification & Token Burn
    // This calls verifyMagicToken which checks expiry and sets used = true
    const user = await AuthService.verifyMagicToken(token);

    if (!user) {
      console.warn("⚠️ [Auth_Failure] Invalid or Expired Magic Token.");
      return NextResponse.redirect(new URL("/login?error=token_invalid", request.url));
    }

    // 3. Generate Signed Session JWT
    const sessionToken = await AuthService.createSession(user);

    // 4. Resolve Cookie Metadata (Standardized Flags)
    const cookieMetadata = AuthService.getCookieMetadata(host, protocol);

    // 5. Build Response and Set Hardened Cookie
    // We redirect to the Dashboard (Staff/Merchant entrance)
    const response = NextResponse.redirect(new URL("/dashboard", request.url));

    response.cookies.set({
      name: cookieMetadata.name,
      value: sessionToken,
      ...cookieMetadata.options,
    });

    console.log(`✅ [Auth_Success] Session established for UID: ${user.id}`);
    return response;

  } catch (error) {
    console.error("🔥 [Critical_Auth_Error]:", error);
    return NextResponse.redirect(new URL("/login?error=system_fault", request.url));
  }
}