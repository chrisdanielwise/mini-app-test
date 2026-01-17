// import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🛰️ INITIALIZING DATA SEED PROTOCOL...");

  // 1. Create the Root Merchant Node
  const merchant = await prisma.merchant.upsert({
    where: { telegramId: "12345678" }, // Your test TG ID
    update: {},
    create: {
      telegramId: "12345678",
      companyName: "Alpha Signal Group",
      botUsername: "AlphaBot",
      isActive: true,
      planStatus: "Institutional",
    },
  });

  // 2. Deploy Service Nodes
  const cryptoService = await prisma.service.create({
    data: {
      merchantId: merchant.id,
      name: "Crypto Alpha Signals",
      categoryTag: "CRYPTO",
      isActive: true,
      vipChannelId: "-10022334455",
      tiers: {
        create: [
          { name: "Daily Access", price: 10, interval: "DAY", isActive: true },
          { name: "Monthly Pro", price: 99, interval: "MONTH", isActive: true },
          { name: "Institutional Lifetime", price: 999, interval: "YEAR", isActive: true },
        ],
      },
    },
    include: { tiers: true },
  });

  // 3. Generate User Identity Nodes & Subscriptions
  console.log("👥 GENERATING SUBSCRIBER TELEMETRY...");
  for (let i = 0; i < 20; i++) {
    const user = await prisma.user.create({
      data: {
        telegramId: `user_${i}`,
        username: `trader_node_${i}`,
        fullName: `Trader Alpha ${i}`,
      },
    });

    // Randomly assign a tier from the crypto service
    const tier = cryptoService.tiers[Math.floor(Math.random() * cryptoService.tiers.length)];

    await prisma.subscription.create({
      data: {
        userId: user.id,
        serviceId: cryptoService.id,
        tierId: tier.id,
        status: "ACTIVE",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        payments: {
          create: {
            merchantId: merchant.id,
            amount: tier.price,
            currency: "USDT",
            status: "SUCCESSFUL",
          },
        },
      },
    });
  }

  // 4. Populate Liquidity Payouts
  console.log("💰 SIMULATING CAPITAL DISBURSEMENT...");
  await prisma.payout.createMany({
    data: [
      {
        merchantId: merchant.id,
        amount: 500,
        currency: "USDT",
        status: "COMPLETED",
        method: "USDT_TRC20",
        destination: "TL9...xZ4",
      },
      {
        merchantId: merchant.id,
        amount: 1200,
        currency: "USDT",
        status: "PENDING",
        method: "USDT_ERC20",
        destination: "0x7...a2B",
      },
    ],
  });

  console.log("🏁 SEED PROTOCOL COMPLETE: DASHBOARD SYNCHRONIZED.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
//   npx prisma db seed