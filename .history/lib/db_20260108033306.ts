import { Pool, types } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "@/generated/prisma";

// PRISMA 7 FIX: Ensure BigInt is handled as string to prevent serialization errors
types.setTypeParser(20, (val) => val); 

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const connectionString = process.env.DATABASE_URL;

/**
 * 2. Ultra-Resilient Pool Config
 * Optimized for Ngrok + Cloud Database (Supabase/Neon)
 */
const pool = globalForPrisma.pool ?? new Pool({ 
  connectionString,
  max: 5, // Keep it low for development to avoid hitting DB limits
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 15000,
  maxUses: 7500,
  // This is the "Nuclear Fix" for terminated connections:
  keepAlive: true, 
  keepAliveInitialDelayMillis: 10000,
  ssl: connectionString?.includes('localhost') 
    ? false 
    : { rejectUnauthorized: false }
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: adapter as any,
    log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export default prisma;