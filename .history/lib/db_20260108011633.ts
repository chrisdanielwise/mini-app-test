import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "@/generated/prisma";

/**
 * 1. Database Connection Pool
 * Using standard pg Pool to manage persistent connections
 */
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // Added basic pool config for production stability
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

/**
 * 2. Prisma Driver Adapter
 * Required in Prisma 7 to bridge the Client and the PG pool
 */
const adapter = new PrismaPg(pool);

/**
 * 3. Global Instance Management
 * Prevents "Too many clients" errors during Next.js Hot Reloads
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * 4. Prisma Client Initialization
 * Passing the adapter explicitly as per Prisma 7 specifications
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: adapter as any, // Cast to any to bypass minor version type mismatches
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

/**
 * 5. Global Assignment
 */
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * 6. Graceful Shutdown
 * Ensures the pool closes when the server process ends
 */
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    await pool.end();
  });
}

export default prisma;