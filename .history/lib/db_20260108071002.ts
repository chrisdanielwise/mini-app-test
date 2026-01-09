import { Pool, types } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "@/generated/prisma";

types.setTypeParser(20, (val) => val); 

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// 🚀 THE FIX: Use the 'pooler' URL but add a strict timeout
const connectionString = process.env.DATABASE_URL;

const pool = globalForPrisma.pool ?? new Pool({ 
  connectionString,
  max: 2, 
  idleTimeoutMillis: 30000,
  // If it can't connect in 10 seconds, fail so we can retry
  connectionTimeoutMillis: 10000, 
  ssl: { rejectUnauthorized: false } 
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: adapter as any,
    // Add a query timeout to the Prisma engine itself
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export default prisma;