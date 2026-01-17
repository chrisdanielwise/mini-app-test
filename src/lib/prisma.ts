import { Pool, types } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma';

// Force BigInt to be treated as numbers/strings to avoid serialization issues
types.setTypeParser(20, (val) => val.toString());

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({
  connectionString,
  // 🛡️ THE CRITICAL FIX: Disable strict SSL verification for self-signed certs
  ssl: {
    rejectUnauthorized: false,
  },
  // Optimization: prevents the pool from hanging
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;