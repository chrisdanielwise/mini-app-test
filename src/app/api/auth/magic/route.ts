import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  
  // 🛰️ DETECT PUBLIC ORIGIN (The Tunnel URL)
  // Cloudflare sends 'x-forwarded-host' and 'x-forwarded-proto'
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  const publicBaseUrl = `${protocol}://${host}`;

  console.log(`🔑 [Magic_Handshake]: Attempting login for origin: ${publicBaseUrl}`);

  if (!token) {
    return NextResponse.redirect(new URL("/dashboard/login?reason=no_token", publicBaseUrl));
  }

  try {
    const user = await AuthService.verifyMagicToken(token);

    if (!user) {
      console.warn("⚠️ [Magic_Auth]: Token invalid or already used.");
      return NextResponse.redirect(new URL("/dashboard/login?reason=invalid_token", publicBaseUrl));
    }

    const sessionToken = await AuthService.createSession(user);
    const cookieMetadata = AuthService.getCookieMetadata(host, protocol);

    // ✅ FIX: Redirect using the Public Base URL instead of request.url
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