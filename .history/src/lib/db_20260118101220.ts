import { Pool, types } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma";
import "server-only";

/**
 * 🛠️ BIGINT_PROTOCOL (OID 20)
 * Strategy: Cast BigInts to strings at the driver level.
 * Mission: Solve "Cannot serialize a BigInt" failures in RSC/API handshakes.
 */
types.setTypeParser(20, (val) => val.toString());

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const rawUrl = process.env.DATABASE_URL;

if (!rawUrl) {
  throw new Error("❌ [DB_Fatal]: DATABASE_URL is missing from environment registry.");
}

/**
 * 🚀 CONNECTION_OVERRIDE
 * Optimized for institutional database handshakes.
 */
const connectionString = !rawUrl.includes("connect_timeout")
  ? `${rawUrl}${rawUrl.includes("?") ? "&" : "?"}connect_timeout=60&pool_timeout=60&sslmode=require`
  : rawUrl;

/**
 * 🛡️ PG_POOL_SINGLETON
 * Strategy: Connection recycling to prevent P2037 exhaustion.
 */
const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString,
    max: 15,                        // Institutional safe-limit for single node
    connectionTimeoutMillis: 30000, 
    idleTimeoutMillis: 10000,       // Recycle idle nodes faster
    maxUses: 5000,                  // Hard recycle to purge memory drift
    ssl: {
      rejectUnauthorized: false,    // Solves TLS handshake rejection
    },
  });

// 🛰️ Driver Adapter Synchronization
const adapter = new PrismaPg(pool);

/**
 * 🛰️ PRISMA_CLIENT_SINGLETON
 * Mission: Survival through Next.js Hot Reloads.
 * Standard: Institutional Apex v2.0
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: [
      { emit: "event", level: "query" },
      { emit: "stdout", level: "error" },
      { emit: "stdout", level: "warn" },
    ],
  });

/**
 * 🐢 TELEMETRY_OVERSIGHT
 * Logic: Identifies physical bottlenecks in the data layer.
 */
// @ts-ignore
prisma.$on("query", (e: any) => {
  if (e.duration > 1500) {
    console.warn(`🐢 [Physical_Lag]: Query exceeding threshold (${e.duration}ms): ${e.query}`);
  }
});

// 🔒 PERSISTENCE_LOCK: Essential for Development Stability
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export default prisma;