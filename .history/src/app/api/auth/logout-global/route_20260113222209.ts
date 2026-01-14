import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { AuthService } from "@/lib/services/auth.service";
import { AuditService } from "@/lib/services/audit.service";

/**
 * 🛰️ GLOBAL PROTOCOL EXPULSION
 * Logic: Rotates the security stamp, invalidating every active JWT globally.
 */
export async function POST(request: NextRequest) {
  const user = await AuthService.getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  try {
    // 🚀 THE KILL SWITCH: Update the stamp in the database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { securityStamp: crypto.randomUUID() }
    });

    await AuditService.log({
      userId: user.id,
      action: "REMOTE_WIPE",
      metadata: { method: "GLOBAL_LOGOUT_TRIGGERED" }
    });

    const response = NextResponse.json({ success: true, message: "ALL_SESSIONS_REVOKED" });
    
    // Clear the current browser cookie too
    response.cookies.delete("auth_token");
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: "REVOCATION_FAILED" }, { status: 500 });
  }
}