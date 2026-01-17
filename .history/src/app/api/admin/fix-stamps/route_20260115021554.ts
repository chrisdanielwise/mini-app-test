import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth/session";

/**
 * 🛰️ EMERGENCY IDENTITY BACKFILL (v16.16.12)
 * Logic: Atomic bulk-patching of missing security anchors.
 * Security: Staff-Only access gate.
 */
export async function POST() {
  try {
    // 🔐 1. STAFF AUTHENTICATION
    const session = await getSession();
    if (!session?.isStaff) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    // 2. ATOMIC PATCH
    // We use updateMany for speed, but since securityStamp must be unique,
    // we use a PostgreSQL raw query to generate random UUIDs for each row.
    const result = await prisma.$executeRaw`
      UPDATE users 
      SET security_stamp = gen_random_uuid() 
      WHERE security_stamp IS NULL OR security_stamp = '';
    `;

    console.log(`📡 [Backfill]: Identity anchors synchronized for ${result} nodes.`);

    return NextResponse.json({
      success: true,
      updated: result,
      status: "NODES_ANCHORED"
    });

  } catch (error: any) {
    console.error("🔥 [Backfill_Crash]:", error.message);
    return NextResponse.json({ 
      error: "MIGRATION_FAILED", 
      details: "Database driver error during raw execution." 
    }, { status: 500 });
  }
}