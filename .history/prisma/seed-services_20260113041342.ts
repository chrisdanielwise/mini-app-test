import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { 
  PrismaClient 
} from "../src/generated/prisma";
import * as dotenv from "dotenv";

// 1. Load environment variables explicitly
dotenv.config();

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("❌ DATABASE_URL is not defined in your .env file");
  }

  console.log("🛰️ [Seed] Attempting connection to Identity Cluster...");

  const pool = new Pool({ 
    connectionString,
    ssl: { rejectUnauthorized: false } // Required for Neon/Postgres over SSL
  });
  
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const merchantId = "201414b8-b107-4b9b-9d4d-8d0296b1da6d";
    const adminId = BigInt("994858530"); // Placeholder BigInt for User.telegramId

    // 🛑 STEP A: Ensure the Admin User exists first (Foreign Key Requirement)
    // Your schema requires MerchantProfile to link to an existing User.telegramId
    console.log("🕵️ [Seed] Verifying Admin Node...");
    await prisma.user.upsert({
      where: { telegramId: adminId },
      update: {},
      create: {
        id: "09c55e7c-1143-4cf7-b302-8683ff5a14f9", // ID from your logs
        telegramId: adminId,
        fullName: "System Admin",
        role: "SUPER_ADMIN",
      }
    });

    // 🛑 STEP B: Deploy Merchant
    console.log("🏢 [Seed] Deploying Merchant Tenant...");
    const merchant = await prisma.merchantProfile.upsert({
      where: { id: merchantId },
      update: { provisioningStatus: "COMPLETED" },
      create: {
        id: merchantId,
        adminUserId: adminId,
        companyName: "Tommy Tactical HQ",
        botUsername: "TommySupportBot",
        provisioningStatus: "COMPLETED",
        planStatus: "ACTIVE",
      }
    });

    // 🛑 STEP C: Deploy Service Mesh
    const services = [
      { id: "tommy-signals-alpha", name: "Alpha Signal Ingress", tag: "SIGNALS", price: 49.99 },
      { id: "tommy-copy-delta", name: "Delta Trade Copier", tag: "COPIER", price: 99.99 },
      { id: "tommy-mentorship-vanguard", name: "Vanguard Mentorship", tag: "EDUCATION", price: 199.99 },
      { id: "tommy-prop-omega", name: "Omega Prop Firm Sync", tag: "PROP_FIRM", price: 75.00 },
      { id: "tommy-insider-gamma", name: "Gamma Insider Intel", tag: "RESEARCH", price: 149.99 },
    ];

    for (const s of services) {
      process.stdout.write(`📡 Deploying Node: ${s.name}... `);
      await prisma.service.upsert({
        where: { id: s.id },
        update: { isActive: true },
        create: {
          id: s.id,
          merchantId: merchant.id,
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
      console.log("OK");
    }

    console.log("\n✅ [Seed] Institutional Handshake Complete. 5 Nodes Live.");

  } catch (error) {
    console.error("\n🔥 [Seed_Critical_Failure]:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();