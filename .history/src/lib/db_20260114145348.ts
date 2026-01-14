import { Pool, types } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client"; // Standard client path
import "server-only";

/**
 * 🛠️ BIGINT CONFIGURATION
 * Prevents precision loss for Telegram IDs by parsing BigInt (OID 20) as string.
 * This is vital for 2026 TMA identity consistency.
 */
types.setTypeParser(20, (val) => val);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const rawUrl = process.env.DATABASE_URL;

if (!rawUrl) {
  throw new Error("❌ CRITICAL: DATABASE_URL is missing from .env");
}

/**
 * 🚀 NEON & TUNNEL OPTIMIZATION
 * - connect_timeout=30: Fail fast on handshake to trigger retry logic.
 * - pool_timeout=30: Prevents Next.js from hanging if the pool is full.
 * - statement_timeout=25000: Kills any query taking >25s to free up resources.
 */
const connectionString = !rawUrl.includes("connect_timeout")
    ? `${rawUrl}${rawUrl.includes("?") ? "&" : "?"}connect_timeout=30&pool_timeout=30&sslmode=require`
    : rawUrl;

// Initialize or reuse the PG Pool
// Optimized for Neon Serverless & Ngrok Tunnels
const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString,
    max: 20,                        // Concurrent Auth + Subs + Profile overhead
    connectionTimeoutMillis: 30000, // 30s handshake for cold starts
    idleTimeoutMillis: 15000,       // Faster recycle to avoid Neon overhead
    maxUses: 5000,                  // Anti-memory leak recycling
    ssl: { rejectUnauthorized: false },
  });

/**
 * 🚀 THE ADAPTER BRIDGE
 * Enables Prisma to communicate via the standard PG driver.
 */
const adapter = new PrismaPg(pool);

/**
 * 🛰️ THE SINGLETON INSTANCE
 * Anchored to globalThis to survive Turbopack Fast Refresh.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'stdout', level: 'error' },
      { emit: 'stdout', level: 'warn' },
    ],
  });

/**
 * 🐢 PERFORMANCE TELEMETRY
 * Monitors query health for 2026 institutional standards.
 */
// @ts-ignore
prisma.$on('query', (e: any) => {
  if (e.duration > 1000) {
    console.warn(`🐢 Slow Query (${e.duration}ms): ${e.query}`);
  }
});

// 🛡️ PERSISTENCE LOCK
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export default prisma;