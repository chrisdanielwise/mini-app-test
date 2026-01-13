import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { 
  PrismaClient, 
  ProvisioningStep, 
  IntervalUnit, 
  SubscriptionType 
} from "../src/generated/prisma";

// 🚀 SETUP DATABASE CONNECTION FOR SEEDER
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 🚀 INITIALIZE CLIENT WITH EXPLICIT CONFIG
const prisma = new PrismaClient({ 
  adapter 
});

async function main() {
  // IDs from your previous logs to ensure the UI "Unsticks"
  const merchantId = "201414b8-b107-4b9b-9d4d-8d0296b1da6d";
  const adminId = BigInt("994858530"); // Replace with your actual TG ID if known

  console.log("🛰️ [Seed] Initializing Hex-Node Deployment...");

  // 1. SECURE MERCHANT TENANT
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

  // 2. DEFINE SERVICE MESH (5 Nodes)
  const services = [
    { id: "tommy-signals-alpha", name: "Alpha Signal Ingress", tag: "SIGNALS", price: 49.99 },
    { id: "tommy-copy-delta", name: "Delta Trade Copier", tag: "COPIER", price: 99.99 },
    { id: "tommy-mentorship-vanguard", name: "Vanguard Mentorship", tag: "EDUCATION", price: 199.99 },
    { id: "tommy-prop-omega", name: "Omega Prop Firm Sync", tag: "PROP_FIRM", price: 75.00 },
    { id: "tommy-insider-gamma", name: "Gamma Insider Intel", tag: "RESEARCH", price: 149.99 },
  ];

  for (const s of services) {
    console.log(`📡 Deploying Node: ${s.name}...`);
    await prisma.service.upsert({
      where: { id: s.id },
      update: { name: s.name, isActive: true },
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
  }

  console.log("✅ [Seed] 5 Service Nodes successfully deployed to Mesh.");
}

main()
  .catch((e) => {
    console.error("🔥 [Seed_Failure]:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // 🚩 Close the pool or the script won't exit
  });