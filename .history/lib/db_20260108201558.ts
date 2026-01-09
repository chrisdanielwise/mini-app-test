import { Pool, types } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "@/generated/prisma";

// 1. Handle BigInt as String to prevent Telegram ID precision loss
types.setTypeParser(20, (val) => val); 

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

/**
 * 🚀 CONNECTION STRING OPTIMIZATION
 * We force a 10s timeout and ensure the SSL mode is set to 'require'.
 * Adding 'sslmode=require' is the standard way to skip the 'discovery' phase 
 * of the handshake, significantly reducing the "Initializing Link" time.
 */
const connectionString = process.env.DATABASE_URL + 
  (process.env.DATABASE_URL?.includes('?') ? '&' : '?') + 
  "connect_timeout=10&statement_timeout=10000&sslmode=require";

/**
 * 🚀 POOL CONFIGURATION
 * Optimized for Neon Serverless/Pooler environments.
 */
const pool = globalForPrisma.pool ?? new Pool({ 
  connectionString,
  max: 1, // Keeps connection overhead low for Neon's free tier
  connectionTimeoutMillis: 5000, // Fail fast if the link isn't secure in 5s
  idleTimeoutMillis: 10000,      // Keep connection open for 10s of inactivity
  // Keep alive helps maintain the secure tunnel once it's open
  keepAlive: true,
  ssl: { 
    rejectUnauthorized: false // Required for many serverless PG providers to bypass local CA checks
  } 
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: adapter as any,
    log: ['error'],
  });

// Singleton pattern to prevent "Too many clients" errors during Next.js Hot Reloads
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export default prisma;