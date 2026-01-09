import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "@/generated/prisma";

// 1. Create the database connection pool using your environment variable
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Initialize the Prisma Driver Adapter for PostgreSQL
const adapter = new PrismaPg(pool);

// 3. Setup global instance to prevent multiple connections during Next.js Hot Reloading
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 4. Initialize Prisma Client with the adapter
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter, // This line is required in Prisma 7
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;