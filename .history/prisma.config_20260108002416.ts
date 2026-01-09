import { PrismaClient } from "@/generated/prisma";
export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
