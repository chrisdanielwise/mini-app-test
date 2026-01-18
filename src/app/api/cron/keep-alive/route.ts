import { NextResponse } from "next/server";
import prisma from "@/lib/db";

/**
 * 🛰️ HEARTBEAT_INGRESS (v2026.1.18)
 * Frequency: 5 Minutes
 * Mission: Database Warm-up & Connection Pooling Maintenance.
 */
export async function GET(request: Request) {
  // 🔐 1. AUTHENTICATION HANDSHAKE
  // Vercel sends a special header for Cron jobs to prevent public abuse.
  const authHeader = request.headers.get('authorization');
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('ERR_UNAUTHORIZED_INGRESS', { status: 401 });
  }

  try {
    const start = Date.now();

    // ⚡ 2. DATABASE PING
    // We use a raw query for maximum speed and minimum overhead.
    await prisma.$queryRaw`SELECT 1`;

    const latency = Date.now() - start;

    // 🏁 3. TELEMETRY RETURN
    return NextResponse.json({
      node: "ZIPHA_CORE_PROD",
      status: "STABLE",
      latency: `${latency}ms`,
      timestamp: new Date().toISOString(),
      protocol: "KEEP_ALIVE_v1"
    });
  } catch (error) {
    console.error("🛰️ [Keep_Alive_Critical_Failure]:", error);
    return NextResponse.json(
      { status: "DEGRADED", error: "DB_HIBERNATION_DETECTED" }, 
      { status: 500 }
    );
  }
}