import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

/**
 * 2. Enhanced Connection Strategy
 * Adding keepAlive and application_name helps cloud providers (Neon/Supabase)
 * maintain the connection through your ngrok tunnel.
 */
const pool = globalForPrisma.pool ?? new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 10, // Reduced max to prevent overwhelming free-tier DBs
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 20000, // 20s for maximum ngrok stability
  maxUses: 7500, // Periodically rotate connections to prevent stale pipes
  keepAlive: true, // IMPORTANT: Tells the DB not to close the socket
  ssl: process.env.DATABASE_URL?.includes('localhost') 
    ? false 
    : { rejectUnauthorized: false }
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