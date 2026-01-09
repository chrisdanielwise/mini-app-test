import { Pool, types } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "@/generated/prisma";

// BIGINT PARSER: Prevents precision loss for Telegram IDs
types.setTypeParser(20, (val) => val); 

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const connectionString = process.env.DATABASE_URL;

const pool = globalForPrisma.pool ?? new Pool({ 
  connectionString,
  max: 2, 
  idleTimeoutMillis: 30000,
  /** * 🚀 CONNECTION SPEED FIX:
   * Shorten the timeout to prevent the app from hanging on a "cold" link.
   */
  connectionTimeoutMillis: 5000, 
  ssl: { rejectUnauthorized: false } // Speeds up the SSL handshake
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: adapter as any,
    log: ["error"], 
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export default prisma;