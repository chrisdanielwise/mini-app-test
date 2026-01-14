import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { randomUUID } from "crypto"; // ✅ Use native crypto to avoid 'uuid' dependency

/**
 * 🛰️ EMERGENCY IDENTITY BACKFILL (v14.1.0)
 * Purpose: Populates the 208 NULL security_stamp rows.
 */
export async function GET() {
  try {
    // 1. Find all users where securityStamp is null OR empty
    const usersToUpdate = await prisma.user.findMany({
      where: {
        OR: [
          { securityStamp: null },
          { securityStamp: "" }
        ]
      },
      select: { id: true }
    });

    console.log(`📡 [Backfill]: Found ${usersToUpdate.length} nodes requiring anchors.`);

    if (usersToUpdate.length === 0) {
      return NextResponse.json({ message: "All nodes already anchored." });
    }

    // 2. Perform Atomic Updates
    // We use a loop here because each user needs a UNIQUE UUID
    const results = await Promise.allSettled(
      usersToUpdate.map((user) =>
        prisma.user.update({
          where: { id: user.id },
          data: { securityStamp: randomUUID() },
        })
      )
    );

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    console.log(`✅ [Backfill_Complete]: ${successful} updated, ${failed} failed.`);

    return NextResponse.json({
      success: true,
      total_processed: usersToUpdate.length,
      successful,
      failed
    });

  } catch (error: any) {
    console.error("🔥 [Backfill_Crash]:", error.message);
    return NextResponse.json({ 
      error: "INTERNAL_SERVER_ERROR", 
      details: error.message 
    }, { status: 500 });
  }
}
// api/admin/fix-stamps/route.ts