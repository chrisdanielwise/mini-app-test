import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "@/generated/prisma";

/**
 * 1. Global Singleton Pattern
 * Prevents "Too many clients" errors by reusing the same pool and client across reloads.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

/**
 * 2. Optimized Pool Configuration
 * We add 'ssl' support which is required for cloud databases like Supabase or Neon.
 */
const pool = globalForPrisma.pool ?? new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000, // Increased to 15s for ngrok stability
  // FIX: This prevents "Connection terminated unexpectedly" on cloud DBs
  ssl: process.env.DATABASE_URL?.includes('localhost') 
    ? false 
    : { rejectUnauthorized: false }
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: adapter as any,
    log: ["error", "warn"], // Minimal logging to reduce console noise
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export default prisma;