import { Pool, types } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma";
import "server-only";

/**
 * 🛠️ BIGINT CONFIGURATION (OID 20)
 * Converts database BigInts to strings for safe JSON serialization.
 * Vital for preventing "Do not know how to serialize a BigInt" errors in Next.js APIs.
 */
types.setTypeParser(20, (val) => val.toString());

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const rawUrl = process.env.DATABASE_URL;

if (!rawUrl) {
  throw new Error("❌ CRITICAL: DATABASE_URL is missing from .env");
}

/**
 * 🚀 CONNECTION STRING OPTIMIZATION
 * Automatically appends timeouts and SSL requirements if missing.
 * Optimized for Handshakes over Tunnels and Cloud Databases.
 */
const connectionString = !rawUrl.includes("connect_timeout")
  ? `${rawUrl}${rawUrl.includes("?") ? "&" : "?"}connect_timeout=60&pool_timeout=60&sslmode=require`
  : rawUrl;

/**
 * 🛡️ PG POOL INITIALIZATION
 * rejectUnauthorized: false is REQUIRED for Aiven/DigitalOcean self-signed certs.
 */
const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString,
    max: 20,                       // Adjust based on your concurrent user load
    connectionTimeoutMillis: 30000, // 30s handshake allowance for cold starts
    idleTimeoutMillis: 15000,       // Faster recycle to keep pool fresh
    maxUses: 7500,                  // Periodically recycle connections to avoid memory leaks
    ssl: {
      rejectUnauthorized: false,    // ✅ FIXED: Solves TLS self-signed cert chain error
    },
  });

// Enable Prisma to communicate via the standard PG driver
const adapter = new PrismaPg(pool);

/**
 * 🛰️ THE PRISMA SINGLETON
 * Anchored to globalThis to survive Turbopack/Next.js Fast Refresh cycles.
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
 * 🐢 PERFORMANCE TELEMETRY
 * Log queries taking longer than 1000ms to identify bottlenecks.
 */
// @ts-ignore
prisma.$on("query", (e: any) => {
  if (e.duration > 1000) {
    console.warn(`🐢 Slow Query (${e.duration}ms): ${e.query}`);
  }
});

// 🛡️ PERSISTENCE LOCK FOR DEVELOPMENT
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export default prisma;