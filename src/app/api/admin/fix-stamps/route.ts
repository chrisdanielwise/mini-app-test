import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { randomUUID } from "crypto";

/**
 * 🛰️ EMERGENCY IDENTITY BACKFILL (v14.1.2)
 * Fixes: "Argument securityStamp is missing"
 */
export async function GET() {
  try {
    // 1. Fetch all users to check them manually in JS
    // This bypasses strict Prisma 'where' filters if the client is being stubborn
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        // @ts-ignore - Ignore the error until the client is regenerated
        securityStamp: true, 
      }
    });

    // 2. Filter for users who don't have a valid stamp
    const targetUsers = allUsers.filter((u: any) => !u.securityStamp);

    console.log(`📡 [Backfill]: Found ${targetUsers.length} nodes requiring anchors.`);

    if (targetUsers.length === 0) {
      return NextResponse.json({ message: "Identity nodes are already synchronized." });
    }

    // 3. Update nodes one by one to ensure unique UUIDs
    let successCount = 0;
    for (const user of targetUsers) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          // @ts-ignore
          securityStamp: randomUUID(),
        },
      });
      successCount++;
    }

    return NextResponse.json({
      success: true,
      updated: successCount,
      status: "NODES_ANCHORED"
    });

  } catch (error: any) {
    console.error("🔥 [Backfill_Crash]:", error.message);
    return NextResponse.json({ 
      error: "MIGRATION_FAILED", 
      details: "Ensure 'npx prisma generate' has been run." 
    }, { status: 500 });
  }
}