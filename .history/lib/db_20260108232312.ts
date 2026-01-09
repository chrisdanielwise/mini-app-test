import { Pool, types } from "pg";
// import { PrismaPg } from "@prisma/adapter-pg"; // ✅ Fixed: Ensure this is uncommented
import { PrismaClient } from "@/generated/prisma"; // ✅ Fixed: Matches your custom output path

// Handle BigInt as string to prevent Telegram ID precision loss
types.setTypeParser(20, (val) => val);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const rawUrl = process.env.DATABASE_URL;

if (!rawUrl) {
  console.error(
    "❌ CRITICAL: DATABASE_URL is undefined. Check your .env file."
  );
}

// Optimization for Neon Serverless
const connectionString =
  rawUrl && !rawUrl.includes("connect_timeout")
    ? `${rawUrl}${rawUrl.includes("?") ? "&" : "?"}connect_timeout=30&sslmode=require`
    : rawUrl;

// Initialize the PG Pool
const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString,
    max: 10,
    connectionTimeoutMillis: 30000, // 30s buffer for Neon cold starts
    idleTimeoutMillis: 10000,
    ssl: { rejectUnauthorized: false },
  });

// 🚀 THE BRIDGE: Initialize the Adapter
const adapter = new PrismaPg(pool);

// Initialize Prisma Client with the Adapter
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter, // ✅ Correctly passing the adapter instance
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export default prisma;