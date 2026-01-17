import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth/session";

/**
 * 📥 SECURITY AUDIT EXPORT (v16.16.12)
 * Logic: Stream-optimized CSV generation with Tenant Isolation.
 */
export async function GET(request: NextRequest) {
  // 🔐 1. IDENTITY HANDSHAKE
  const session = await getSession();
  
  // 🛡️ SECURITY GATE: Only Merchants or Staff can trigger an audit
  if (!session || (!session.isStaff && !session.merchantId)) {
    return NextResponse.json({ error: "UNAUTHORIZED_EXPORT" }, { status: 403 });
  }

  try {
    // 2. DATA RESOLUTION
    // Fetches logs with the 'actor' joined to get human-readable names
    const logs = await prisma.activityLog.findMany({
      where: session.isStaff ? {} : { merchantId: session.merchantId },
      include: { 
        actor: { select: { username: true, email: true } } 
      },
      orderBy: { createdAt: "desc" },
      take: 2000, 
    });

    // 3. CSV ARCHITECTURE
    const headers = ["TIMESTAMP", "ACTION", "ACTOR_NAME", "RESOURCE", "IP_ADDRESS", "METADATA"];
    
    const csvRows = logs.map(log => {
      const actorName = log.actor?.username || log.actor?.email || "SYSTEM";
      const metadata = log.metadata ? JSON.stringify(log.metadata).replace(/"/g, '""') : "{}";
      
      return [
        log.createdAt.toISOString(),
        log.action,
        `"${actorName}"`, // Encapsulated for names with commas
        log.resource,
        log.ipAddress || "0.0.0.0",
        `"${metadata}"`
      ].join(",");
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");

    // 4. DISPATCH
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="ZIPHA_AUDIT_${session.user.id.slice(0,8)}_${Date.now()}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    console.error("🔥 [Audit_Export_Fault]:", error.message);
    return NextResponse.json({ error: "EXPORT_FAILED" }, { status: 500 });
  }
}