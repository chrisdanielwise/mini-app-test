import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { AuthService } from "@/lib/services/auth.service";

/**
 * 📥 SECURITY AUDIT EXPORT (v14.4.0)
 * Logic: Stream-ready CSV generation for institutional compliance.
 */
export async function GET(request: NextRequest) {
  const user = await AuthService.getUserFromRequest(request);
  
  // 🛡️ SECURITY GATE: Only Merchants or Staff can export logs
  if (!user || !["MERCHANT", "SUPER_ADMIN"].includes(user.role?.toUpperCase())) {
    return NextResponse.json({ error: "UNAUTHORIZED_EXPORT" }, { status: 403 });
  }

  try {
    const logs = await prisma.activityLog.findMany({
      where: user.role === "SUPER_ADMIN" ? {} : { merchantId: user.merchantId },
      orderBy: { createdAt: "desc" },
      take: 1000, // Export last 1000 events
    });

    // 1. Define CSV Headers
    const headers = ["TIMESTAMP", "ACTION", "ACTOR_ID", "IP_ADDRESS", "RESOURCE", "METADATA"];
    
    // 2. Map Logs to CSV Rows
    const csvRows = logs.map(log => [
      log.createdAt.toISOString(),
      log.action,
      log.actorId,
      log.ipAddress,
      log.resource,
      JSON.stringify(log.metadata).replace(/"/g, '""') // Escape JSON for CSV
    ].join(","));

    const csvContent = [headers.join(","), ...csvRows].join("\n");

    // 3. Dispatch as Downloadable File
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="ZIPHA_AUDIT_${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "EXPORT_FAILED" }, { status: 500 });
  }
}