import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { AuthService } from "@/lib/services/auth.service";

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  try {
    const logs = await prisma.activityLog.findMany({
      where: {
        actorId: user.id,
        action: { in: ["LOGIN", "LOGOUT", "REMOTE_WIPE"] }
      },
      orderBy: { createdAt: "desc" },
      take: 5
    });

    return NextResponse.json({ sessions: logs });
  } catch (error) {
    return NextResponse.json({ error: "LOG_FETCH_FAILED" }, { status: 500 });
  }
}