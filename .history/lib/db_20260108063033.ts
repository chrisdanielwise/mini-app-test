import { Pool, types } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma";

// 1. BIGINT HANDLING: Converts PostgreSQL BigInt (type ID 20) to String.
// This is critical for Telegram IDs so they don't lose precision in JavaScript.
types.setTypeParser(20, (val) => val);

/**
 * 2. SINGLETON PATTERN
 * Next.js hot-reloads cause multiple Prisma instances.
 * We attach them to 'globalThis' to reuse the same connection.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const connectionString = process.env.DATABASE_URL;

/**
 * 3. NEON-OPTIMIZED POOL
 * - max: 2 prevents your local app from exhausting Neon's pooler slots.
 * - connectionTimeoutMillis: 15000 gives the DB time to "wake up" without crashing the app.
 */
const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString,
    max: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000,
    ssl: { rejectUnauthorized: false },
  });

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: adapter as any,
    // Setting log level to 'warn' and 'error' reduces terminal noise.
    log: [
      { emit: "stdout", level: "warn" },
      { emit: "stdout", level: "error" },
    ],
  });

// Save to global in development to prevent memory leaks/multiple pools
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export default prisma;
