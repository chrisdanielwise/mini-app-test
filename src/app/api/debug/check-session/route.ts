import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth/session";

/**
 * 🛰️ SESSION AUDITOR (Tunnel-Resilient v9.1.5)
 * Logs raw incoming headers to catch Cloudflare stripping cookies.
 */
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const allCookies = cookieStore.getAll();
  
  // 🚩 LOG TO TERMINAL: Check your server console for these lines
  console.log("------- 🛰️ CLOUDFLARE TUNNEL AUDIT -------");
  console.log("Full Cookie Header:", request.headers.get('cookie') || "EMPTY");
  console.log("Token Found:", !!token);
  console.log("Total Cookies Count:", allCookies.length);
  console.log("Forwarded Proto:", request.headers.get('x-forwarded-proto'));
  console.log("-----------------------------------------");

  // 1. Attempt the production resolver
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ 
      status: "FAILED", 
      reason: token ? "JWT Decryption Failed (Check Secret Match)" : "Cookie not found in request headers.",
      diagnostics: {
        cookie_header_present: !!request.headers.get('cookie'),
        token_extracted: !!token,
        total_cookies: allCookies.length,
        is_secure_context: request.headers.get('x-forwarded-proto') === 'https'
      },
      tip: "If 'token_extracted' is FALSE but you see it in Browser DevTools, your tunnel is stripping the header."
    });
  }

  return NextResponse.json({
    status: "SUCCESS",
    session_data: session
  });
}