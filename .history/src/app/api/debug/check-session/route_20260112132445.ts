import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  
  // 🚩 LOG TO TERMINAL: We need to see these 3 things
  console.log("------- CLOUDFLARE TUNNEL AUDIT -------");
  console.log("1. Full Cookie Header:", request.headers.get('cookie'));
  console.log("2. Total Cookies Parsed:", allCookies.length);
  console.log("3. X-Forwarded-Proto:", request.headers.get('x-forwarded-proto'));
  console.log("---------------------------------------");

  if (allCookies.length === 0) {
    return NextResponse.json({ 
      status: "FAILED", 
      reason: "Cloudflare stripped the cookie header.",
      tip: "Check your Tunnel 'Access' settings." 
    });
  }

  return NextResponse.json({ status: "SUCCESS", cookies: allCookies });
}