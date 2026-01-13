import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🛰️ [Seed] Initializing Service Node Deployment...");

  // 1. RECOVER/CREATE MERCHANT NODE
  // Using the Merchant ID from your logs to prevent "Node Offline" errors
  const merchantId = "201414b8-b107-4b9b-9d4d-8d0296b1da6d"; 
  
  const merchant = await prisma.merchant.upsert({
    where: { id: merchantId },
    update: {},
    create: {
      id: merchantId,
      companyName: "Tommy Tactical Services",
      botUsername: "TommySupportBot",
      provisioningStatus: "ACTIVE",
    },
  });

  console.log(`✅ [Seed] Merchant Node Secured: ${merchant.companyName}`);

  // 2. DEPLOY TOMMY SERVICE CLUSTER
  const serviceId = "tommy-service-alpha"; // Use a slug or UUID

  const service = await prisma.service.upsert({
    where: { id: serviceId },
    update: {},
    create: {
      id: serviceId,
      merchantId: merchant.id,
      name: "Tommy Premium Signal Node",
      description: "Institutional grade signal ingress with 256-bit encryption.",
      currency: "USD",
      categoryTag: "SIGNALS",
      tiers: {
        create: [
          {
            name: "Tactical Alpha",
            price: "49.99",
            interval: "MONTHLY",
            type: "RECURRING",
          },
          {
            name: "Vanguard Delta",
            price: "129.99",
            interval: "QUARTERLY",
            type: "RECURRING",
          }
        ],
      },
    },
  });

  console.log(`✅ [Seed] Service Node Deployed: ${service.name}`);
  console.log("🏁 [Seed] Handshake Complete. Database is now populated.");
}

main()
  .catch((e) => {
    console.error("🔥 [Seed_Failure]:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });