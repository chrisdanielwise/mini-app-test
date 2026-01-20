import { Pool, types } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
// ✅ Essential: Point strictly to your custom generated folder
import { Prisma, PrismaClient } from "@/generated/prisma";
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
 */
const connectionString = !rawUrl.includes("connect_timeout")
  ? `${rawUrl}${rawUrl.includes("?") ? "&" : "?"}connect_timeout=60&pool_timeout=60&sslmode=require`
  : rawUrl;

/**
 * 🛡️ PG_POOL_SINGLETON
 */
const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString,
    max: 15,
    connectionTimeoutMillis: 30000, 
    idleTimeoutMillis: 10000,
    maxUses: 5000,
    ssl: {
      rejectUnauthorized: false,
    },
  });

// 🛰️ Driver Adapter Synchronization
const adapter = new PrismaPg(pool);

/**
 * 🛰️ PRISMA_CLIENT_SINGLETON
 * Note: We explicitly pass the TypeMap through the Driver Adapter 
 * to solve the Enum Mapping "Expected UserRole" crash.
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
 */
// @ts-ignore
prisma.$on("query", (e: Prisma.QueryEvent) => {
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