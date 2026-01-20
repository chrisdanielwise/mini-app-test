import { NextRequest, NextResponse } from "next/server";
import { createJWT } from "@/lib/services/auth.service"; 
import prisma from "@/lib/db";
import { JWT_CONFIG } from "@/lib/auth/config"; 
import { UserRole } from "@/generated/prisma"; 

/**
 * 🛰️ SESSION INJECTOR (Institutional Apex v2026.1.20)
 * Hardened: Uses central createJWT service to prevent decryption mismatches.
 * Fix: Explicitly typed payload and handled BigInt conversion.
 */
export async function GET(request: NextRequest) {
  try {
    // 🔍 1. IDENTITY LOOKUP
    // Utilizing the strictly UPPERCASE Prisma Enum
    const testUser = await prisma.user.findFirst({ 
      where: { 
        role: UserRole.SUPER_ADMIN, 
        deletedAt: null 
      } 
    });

    if (!testUser) {
      return NextResponse.json({ 
        error: "Identity Node Missing: No SUPER_ADMIN found in database." 
      }, { status: 404 });
    }

    // 🔐 2. JWT GENERATION
    // Synchronized with the Institutional Staff List logic
    const token = await createJWT({
      sub: testUser.id,
      role: testUser.role, // createJWT handles normalization internally
      telegramId: testUser.telegramId.toString(),
      securityStamp: testUser.securityStamp || "debug_anchor_v1",
    });

    const response = NextResponse.json({ 
      status: "SUCCESS", 
      message: "Staff session injected via Apex Protocol.",
      user_id: testUser.id,
      clearance: testUser.role
    });
    
    // 🏁 3. TUNNEL-HARDENED COOKIE (2026 TMA Standard)
    // Partitioned (CHIPS) is mandatory for cross-site cookie persistence in Telegram.
    response.cookies.set(JWT_CONFIG.cookieName, token, {
      path: "/",
      httpOnly: true,
      secure: true,   
      sameSite: "none", 
      partitioned: true, 
      maxAge: 60 * 60 * 24 * 7, // 7 Day TTL for debug nodes
    });

    // 🛡️ PROXY INGRESS: Bypass Ngrok/Cloudflare interstitial warnings
    response.headers.set("ngrok-skip-browser-warning", "true");

    return response;
  } catch (error: any) {
    console.error("🔥 [Debug_Inject_Error]:", error.message);
    return NextResponse.json({ 
      error: "INTERNAL_HANDSHAKE_FAILURE", 
      details: error.message 
    }, { status: 500 });
  }
}