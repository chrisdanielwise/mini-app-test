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
 * We force a 10s timeout and ensure the SSL mode is set to 'require'
 * to skip the "discovery" phase of the handshake.
 */
const connectionString = process.env.DATABASE_URL + 
  (process.env.DATABASE_URL?.includes('?') ? '&' : '?') + 
  "connect_timeout=10&statement_timeout=10000&sslmode=require";

/**
 * 🚀 POOL CONFIGURATION
 * We keep the pool at 'max: 1' for local dev to prevent fighting the Neon Pooler.
 */
const pool = globalForPrisma.pool ?? new Pool({ 
  connectionString,
  max: 1, 
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 5000,
  // Keep alive helps maintain the secure link once it's open
  keepAlive: true,
  ssl: { rejectUnauthorized: false } 
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