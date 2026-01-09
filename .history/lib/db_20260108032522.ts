import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "@/generated/prisma";

/**
 * 1. Global Type Definition
 * We store both the client and the pool to prevent memory leaks during dev reloads.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

/**
 * 2. Database Connection Pool
 * Increased connectionTimeoutMillis to 10 seconds to prevent the "Connection terminated" error.
 */
const pool = globalForPrisma.pool ?? new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // FIX: Increased from 2000 to 10000 for stability
});

/**
 * 3. Prisma Driver Adapter
 */
const adapter = new PrismaPg(pool);

/**
 * 4. Prisma Client Initialization
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: adapter as any,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

/**
 * 5. Global Assignment (Development only)
 */
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool; // Store pool globally to prevent "too many clients"
}

export default prisma;