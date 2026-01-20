import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * 🛰️ PRISMA_CONFIG (Institutional Apex v2026.1.18)
 * Fix: Removed 'engine' property to satisfy PrismaConfig type constraints.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // 🏁 Engine strategy is handled in schema.prisma or via PRISMA_CLIENT_ENGINE_TYPE env var
  datasource: {
    url: env("DATABASE_URL"),
  },
});