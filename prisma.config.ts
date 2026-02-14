import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import path from "path";

export default defineConfig({
  // ✅ Use an absolute-style relative path
  schema: path.join(process.cwd(), "prisma/schema.prisma"),
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});