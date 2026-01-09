import { Pool, types } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "@/generated/prisma";

// PRISMA 7 FIX: Handle BigInt IDs as strings for Telegram compatibility
types.setTypeParser(20, (val) => val); 

/**
 * 1. Deep Singleton Pattern
 * We must store BOTH the pool and the prisma client in the global object.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const connectionString = process.env.DATABASE_URL;

/**
 * 2. Neon-Specific Pool Logic
 * Since you are using a pooler endpoint (twilight-sound-...-pooler), 
 * we keep the local pool very small to avoid conflicts.
 */
const pool = globalForPrisma.pool ?? new Pool({ 
  connectionString,
  max: 2, // Low number for Neon pooler compatibility
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000, // Matching your successful test script
  ssl: { rejectUnauthorized: false }
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: adapter as any,
    log: ["error"], // Keep logs clean
  });

/**
 * 3. Prevents "Connection terminated" during Next.js Hot Reloads
 */
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export default prisma;