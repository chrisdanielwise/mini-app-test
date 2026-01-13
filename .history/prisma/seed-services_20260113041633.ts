import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("❌ DATABASE_URL missing");

  const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    // 🏛️ CONSTANTS (Hardcoded UUIDs to match your App logic)
    const MERCHANT_ID = "201414b8-b107-4b9b-9d4d-8d0296b1da6d";
    const ADMIN_UUID = "09c55e7c-1143-4cf7-b302-8683ff5a14f9";
    const ADMIN_TELEGRAM_ID = BigInt("955273410"); 

    console.log("🕵️ [Seed] Synchronizing Admin Identity...");
    await prisma.user.upsert({
      where: { id: ADMIN_UUID },
      update: { telegramId: ADMIN_TELEGRAM_ID },
      create: {
        id: ADMIN_UUID,
        telegramId: ADMIN_TELEGRAM_ID,
        fullName: "Tommy Tactical Admin",
        role: "SUPER_ADMIN",
      }
    });

    console.log("🏢 [Seed] Deploying Merchant Node...");
    await prisma.merchantProfile.upsert({
      where: { id: MERCHANT_ID },
      update: { provisioningStatus: "COMPLETED" },
      create: {
        id: MERCHANT_ID,
        adminUserId: ADMIN_TELEGRAM_ID,
        companyName: "Tommy Tactical HQ",
        botUsername: "TommySupportBot",
        provisioningStatus: "COMPLETED",
        planStatus: "ACTIVE",
      }
    });

    // 🛰️ SERVICE MESH (Now using valid UUIDs)
    const services = [
      { id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d", name: "Alpha Signal Ingress", tag: "SIGNALS", price: 49.99 },
      { id: "b2c3d4e5-f6a7-4b6c-9d0e-1f2a3b4c5d6e", name: "Delta Trade Copier", tag: "COPIER", price: 99.99 },
      { id: "c3d4e5f6-a7b8-4c7d-0e1f-2a3b4c5d6e7f", name: "Vanguard Mentorship", tag: "EDUCATION", price: 199.99 },
      { id: "d4e5f6a7-b8c9-4d8e-1f2a-3b4c5d6e7f8a", name: "Omega Prop Firm Sync", tag: "PROP_FIRM", price: 75.00 },
      { id: "e5f6a7b8-c9d0-4e9f-2a3b-4c5d6e7f8a9b", name: "Gamma Insider Intel", tag: "RESEARCH", price: 149.99 },
    ];

    for (const s of services) {
      process.stdout.write(`📡 Deploying: ${s.name}... `);
      await prisma.service.upsert({
        where: { id: s.id },
        update: { isActive: true, categoryTag: s.tag },
        create: {
          id: s.id,
          merchantId: MERCHANT_ID,
          name: s.name,
          currency: "USD",
          categoryTag: s.tag,
          isActive: true,
          tiers: {
            create: [
              {
                name: "Standard Access",
                price: s.price,
                interval: "MONTH",
                type: "CUSTOM",
                isActive: true,
              }
            ]
          }
        }
      });
      console.log("ONLINE");
    }

    console.log("\n✅ [Mesh_Deployment] Success. 5 Nodes Operational.");

  } catch (error) {
    console.error("\n🔥 [Seed_Critical_Failure]:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();