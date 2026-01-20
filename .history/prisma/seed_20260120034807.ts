import {
  PrismaClient,
  UserRole,
  SubscriptionStatus,
  LedgerType,
  PaymentStatus,
  MerchantRole,
  TicketPriority,
  TicketCategory,
  SenderType,
  ExecutionStatus,
  NotificationType,
  IntervalUnit,
  SubscriptionType,
  CouponScope,
  DiscountType,
  LanguageCode,
  DocStatus, // ✅ Added for Document verification
  Prisma,
} from "../src/generated/prisma";
import { faker } from "@faker-js/faker";
import * as dotenv from "dotenv";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { Decimal } from "@prisma/client/runtime/library"; // ✅ Final Standard for Prisma 6/7

dotenv.config();

// ==========================================
// 1. DATABASE CONNECTION SETUP
// ==========================================
let connectionString = process.env.DATABASE_URL;

if (connectionString && connectionString.includes("?")) {
  connectionString = connectionString.split("?")[0];
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// --- HELPER FUNCTIONS ---
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomElement = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
const pastDate = (daysAgo: number) =>
  new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
const futureDate = (daysForward: number) =>
  new Date(Date.now() + daysForward * 24 * 60 * 60 * 1000);

// 🛡️ RETRY HELPER
async function retry<T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 1000,
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (
      retries > 0 &&
      (error.code === "P1017" ||
        error.message?.includes("closed the connection"))
    ) {
      console.warn(
        `⚠️ Connection dropped. Retrying... (${retries} attempts left)`,
      );
      await new Promise((res) => setTimeout(res, delay));
      return retry(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

function getScenario(index: number) {
  if (index < 10) return "WHALE";
  if (index < 20) return "FRAUD";
  if (index < 30) return "REFUNDED";
  if (index < 45) return "MANUAL_PAYMENT";
  if (index < 60) return "AFFILIATE";
  if (index < 80) return "CHURNED";
  return "STANDARD";
}

async function main() {
  console.log("🚀 Starting Full Simulation...");
  console.log("✅ VERSION 12.0 (Institutional Apex Compliance)");

  const merchants: any[] = [];

  // ==========================================
  // 1. GLOBAL SYSTEM SETUP
  // ==========================================
  console.log("⚙️  Initializing Global Config...");

  await retry(() =>
    prisma.settings.upsert({
      where: { adminId: 999999999n },
      update: {},
      create: {
        adminId: 999999999n,
        nairaPrice: 1750,
        vipPrice: { monthly: 50 },
        vipDiscountPrice: { monthly: 50 },
        language: "en",
      },
    }),
  );

  const starter = await retry(() =>
    prisma.platformPlan.upsert({
      where: { name: "Starter" },
      update: {},
      create: {
        name: "Starter",
        priceMonthly: new Decimal(0),
        priceYearly: new Decimal(0),
        transactionFeePercent: new Decimal(10),
        maxSubscribers: 50,
      },
    }),
  );

  const enterprise = await retry(() =>
    prisma.platformPlan.upsert({
      where: { name: "Enterprise" },
      update: {},
      create: {
        name: "Enterprise",
        priceMonthly: new Decimal(99),
        priceYearly: new Decimal(990),
        transactionFeePercent: new Decimal(2),
        maxSubscribers: 10000,
        allowBroadcasts: true,
      },
    }),
  );

  // ==========================================
  // 2. PRIMARY MERCHANT (GreysuitFx)
  // ==========================================
  console.log("👑 Configuring Primary Merchant: GreysuitFx");

  const greyUser = await retry(() =>
    prisma.user.upsert({
      where: { telegramId: 994858530n },
      update: {},
      create: {
        telegramId: 994858530n,
        fullName: "GreysuitFx Admin",
        username: "greysuit_admin",
        role: UserRole.MERCHANT,
        email: "admin@greysuitfx.com",
        platformSubscription: {
          create: {
            status: SubscriptionStatus.ACTIVE,
            expiresAt: futureDate(365),
          },
        },
      },
    }),
  );

  const greyProfile = await retry(() =>
    prisma.merchantProfile.upsert({
      where: { adminUserId: greyUser.telegramId },
      update: {},
      create: {
        adminUserId: greyUser.telegramId,
        companyName: "GreysuitFx",
        planId: enterprise.id,
        botId: 6838294498n,
        botToken: "6838294498:AAHR907AbARqogosjcVtSscTyhBWHiGYQDc",
        planStatus: SubscriptionStatus.ACTIVE,
        botConfig: {
          create: {
            welcomeMessage: "Welcome to GreysuitFx!",
            enableSignals: true,
            enableMentorship: true,
            enableAffiliate: true,
          },
        },
        paymentConfig: { create: { isEnabled: true } },
        analytics: { create: { totalRevenue: new Decimal(0) } },
      },
    }),
  );

  const greyService = await retry(() =>
    prisma.service.create({
      data: {
        merchantId: greyProfile.id,
        name: "Vip Signal",
        description: "VIP trading signals.",
        vipChannelId: -1002142536274n,
        tiers: {
          create: [
            {
              name: "Monthly",
              price: new Decimal(52.0),
              interval: IntervalUnit.MONTH,
              type: SubscriptionType.CUSTOM,
            },
          ],
        },
      },
      include: { tiers: true },
    }),
  );

  merchants.push({
    profile: greyProfile,
    adminUserUuid: greyUser.id,
    services: [greyService],
  });

  // ==========================================
  // 3. OTHER MERCHANTS (4 Random Cluster Expansion)
  // ==========================================
  for (let i = 0; i < 4; i++) {
    const user = await retry(() =>
      prisma.user.create({
        data: {
          telegramId: BigInt(
            faker.number.int({ min: 100000000, max: 999999999 }),
          ),
          fullName: faker.person.fullName(),
          role: UserRole.MERCHANT,
          email: faker.internet.email(),
        },
      }),
    );

    const profile = await retry(() =>
      prisma.merchantProfile.create({
        data: {
          adminUserId: user.telegramId,
          companyName: faker.company.name(),
          planId: starter.id,
          botId: BigInt(faker.number.int({ min: 5000000000, max: 6000000000 })),
          botToken: `TOKEN_${faker.string.alphanumeric(10)}`,
          planStatus: SubscriptionStatus.ACTIVE,
          botConfig: { create: { welcomeMessage: "Welcome!" } },
          analytics: { create: { totalRevenue: new Decimal(0) } },
        },
      }),
    );

    const s = await retry(() =>
      prisma.service.create({
        data: {
          merchantId: profile.id,
          name: "Premium Signals",
          tiers: {
            create: [
              {
                name: "Monthly",
                price: new Decimal(40.0),
                interval: IntervalUnit.MONTH,
                intervalCount: 1,
                type: SubscriptionType.CUSTOM,
              },
            ],
          },
        },
        include: { tiers: true },
      }),
    );
    merchants.push({ profile, adminUserUuid: user.id, services: [s] });
  }

  // ==========================================
  // 4. CUSTOMER SIMULATION (195 USERS)
  // ==========================================
  console.log("👥 Simulating 195 Unique Customers...");

  for (let i = 0; i < 195; i++) {
    const scenario = getScenario(i);
    const merchantData = randomElement(merchants);
    const randomService = randomElement(merchantData.services);
    const tier = randomService.tiers[0];

    const user = await retry(() =>
      prisma.user.create({
        data: {
          telegramId: BigInt(
            faker.number.int({ min: 100000000, max: 999999999 }),
          ),
          fullName: faker.person.fullName(),
          username: faker.internet.username(),
          role: UserRole.USER,
          email: faker.internet.email(),
        },
      }),
    );

    await retry(() =>
      prisma.merchantUserContext.create({
        data: {
          userId: user.id,
          merchantId: merchantData.profile.id,
        },
      }),
    );

    if (["WHALE", "STANDARD", "AFFILIATE"].includes(scenario)) {
      const payment = await retry(() =>
        prisma.payment.create({
          data: {
            userId: user.id,
            serviceId: randomService.id,
            merchantId: merchantData.profile.id,
            amount: tier.price,
            currency: "USD",
            status: PaymentStatus.SUCCESS,
            gatewayProvider: "STRIPE",
            gatewayReference: `txn_${faker.string.alphanumeric(15)}`,
          },
        }),
      );

      await retry(() =>
        prisma.ledger.create({
          data: {
            merchantId: merchantData.profile.id,
            amount: tier.price.mul(0.95),
            type: LedgerType.CREDIT,
            description: `Sale: ${tier.name}`,
            balanceAfter: tier.price.mul(0.95),
            paymentId: payment.id,
          },
        }),
      );

      await retry(() =>
        prisma.subscription.create({
          data: {
            userId: user.id,
            merchantId: merchantData.profile.id,
            serviceId: randomService.id,
            serviceTierId: tier.id,
            status: SubscriptionStatus.ACTIVE,
            expiresAt: futureDate(30),
          },
        }),
      );
    }
  }

  // ==========================================
  // 5. METRICS & LOGS
  // ==========================================
  console.log("📊 Synchronizing Analytics Node...");

  for (let d = 0; d < 30; d++) {
    const targetDate = pastDate(30 - d);
    targetDate.setHours(0, 0, 0, 0);

    await retry(() =>
      prisma.merchantDailyMetric.upsert({
        where: {
          merchantId_date: { merchantId: greyProfile.id, date: targetDate },
        },
        update: {},
        create: {
          merchantId: greyProfile.id,
          date: targetDate,
          dailyRevenue: new Decimal(randomInt(500, 5000)),
          dailyNewSubs: randomInt(5, 20),
          dailyActiveSubs: 100 + d * 2,
        },
      }),
    );
  }

  await retry(() =>
    prisma.webhookEvent.create({
      data: {
        provider: "STRIPE",
        externalId: faker.string.alphanumeric(10),
        eventType: "invoice.payment_succeeded",
        payload: {
          id: "evt_123",
          status: "succeeded",
        } as Prisma.InputJsonObject,
        status: "SUCCESS",
      },
    }),
  );

  await retry(() =>
    prisma.verificationDocument.create({
      data: {
        merchantId: greyProfile.id,
        type: "PASSPORT",
        fileUrl: faker.image.url(),
        status: DocStatus.APPROVED, // ✅ FIXED Typo
      },
    }),
  );

  console.log("✅ Seeding Complete! 200 Nodes Online.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
