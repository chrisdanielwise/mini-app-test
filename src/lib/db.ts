import { Pool, types } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma";

/**
 * 🛠️ BIGINT CONFIGURATION
 * Prevents precision loss for Telegram IDs by parsing BigInt as string.
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
 * 🚀 NEON OPTIMIZATION
 * Increased timeouts to 60s to survive high-latency Ngrok tunnels and DB cold starts.
 */
const connectionString = !rawUrl.includes("connect_timeout")
    ? `${rawUrl}${rawUrl.includes("?") ? "&" : "?"}connect_timeout=60&sslmode=require`
    : rawUrl;

// Initialize or reuse the PG Pool
const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString,
    max: 10,                 // Limit pool size to stay within Neon free-tier limits
    connectionTimeoutMillis: 60000, // Wait 60s for handshake
    idleTimeoutMillis: 30000,       // Keep connections alive longer
    maxUses: 7500,                  // Periodically recycle connections
    ssl: { rejectUnauthorized: false },
  });

/**
 * 🚀 THE ADAPTER BRIDGE
 * Enables Prisma to communicate via the PG driver directly.
 */
const adapter = new PrismaPg(pool);

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

// Debugging: Log slow queries that might cause timeouts
// @ts-ignore
prisma.$on('query', (e: any) => {
  if (e.duration > 2000) {
    console.warn(`🐢 Slow Query (${e.duration}ms): ${e.query}`);
  }
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export default prisma;