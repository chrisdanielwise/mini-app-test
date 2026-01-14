import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";

/**
 * 🛰️ SESSION HEARTBEAT (Institutional v13.0.2)
 * Logic: Extends JWT expiration for active users.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await AuthService.getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ active: false }, { status: 401 });
    }

    // Generate a fresh session with an extended expiry
    const sessionToken = await AuthService.createSession(user);
    const host = request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const cookieMetadata = AuthService.getCookieMetadata(host, protocol);

    const response = NextResponse.json({ active: true, timestamp: new Date().toISOString() });
    
    response.cookies.set({
      name: cookieMetadata.name,
      value: sessionToken,
      ...cookieMetadata.options,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ active: false }, { status: 500 });
  }
}