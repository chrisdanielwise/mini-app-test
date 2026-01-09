import { Pool, types } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "@prisma/client"; // Use standard import if possible
import "dotenv/config";
import { PrismaClient } from "@/src/generated/prisma";

types.setTypeParser(20, (val) => val);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// 🏁 THE FIX: Safely check if the URL exists first
const rawUrl = process.env.DATABASE_URL;

if (!rawUrl) {
  console.error(
    "❌ CRITICAL: DATABASE_URL is undefined. Check your .env file location."
  );
}

// Only append if parameters aren't already there to avoid "Extra Strings"
const connectionString =
  rawUrl && !rawUrl.includes("connect_timeout")
    ? `${rawUrl}${
        rawUrl.includes("?") ? "&" : "?"
      }connect_timeout=30&sslmode=require`
    : rawUrl;

const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString,
    max: 10, // Increased for Prisma 7 + Next.js 16 stability
    connectionTimeoutMillis: 30000, // Wait 30s for Neon Cold Start
    idleTimeoutMillis: 10000,
    ssl: { rejectUnauthorized: false },
  });

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: adapter as any,
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export default prisma;
