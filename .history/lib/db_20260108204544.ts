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
 * Increased connect_timeout to 15s to match Neon cold starts.
 */
const connectionString = process.env.DATABASE_URL + 
  (process.env.DATABASE_URL?.includes('?') ? '&' : '?') + 
  "connect_timeout=15&statement_timeout=10000&sslmode=require";

/**
 * 🚀 POOL CONFIGURATION
 * Optimized for Neon Serverless/Pooler environments.
 */
const pool = globalForPrisma.pool ?? new Pool({ 
  connectionString,
  max: 2,                        // Allow 2 connections for smoother dev refreshes
  connectionTimeoutMillis: 15000, // 🏁 CRITICAL: Wait 15s for Neon to wake up
  idleTimeoutMillis: 10000,      
  keepAlive: true,
  ssl: { 
    rejectUnauthorized: false 
  } 
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: adapter as any,
    // 💡 Enable 'query' log to see the actual SQL being sent to Neon
    log: ['error', 'warn', 'query'], 
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export default prisma;