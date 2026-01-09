import { Pool, types } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "@/generated/prisma";

types.setTypeParser(20, (val) => val); 

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// 🚀 CRITICAL: We add parameters directly to the string to force Neon's hand
const connectionString = process.env.DATABASE_URL + (process.env.DATABASE_URL?.includes('?') ? '&' : '?') + "connect_timeout=10&statement_timeout=10000";

const pool = globalForPrisma.pool ?? new Pool({ 
  connectionString,
  max: 1, // Reduced to 1 to ensure we don't fight the Neon pooler
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 5000, 
  ssl: { rejectUnauthorized: false } 
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: adapter as any,
    // Add specific engine configuration
    log: ['error'],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export default prisma;