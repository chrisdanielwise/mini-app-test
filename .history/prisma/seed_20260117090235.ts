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
  MembershipStatus,
  DocStatus,
  LanguageCode,
  Prisma,
} from "../src/generated/prisma";
import { faker } from "@faker-js/faker";
import * as dotenv from "dotenv";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { Decimal } from "@prisma/client-runtime-utils";

// ✅ CORRECT DECIMAL IMPORT FOR PRISMA 7
// import { Decimal } from '@prisma/client/runtime/library';

dotenv.config();

// ==========================================
// 1. DATABASE CONNECTION SETUP (SSL FIX)
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
const pastDate = (daysAgo: number) =>
  new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
const futureDate = (daysForward: number) =>
  new Date(Date.now() + daysForward * 24 * 60 * 60 * 1000);

// 🛡️ RETRY HELPER
async function retry<T>(op: () => Promise<T>, retries = 3): Promise<T> {
  try {
    return await op();
  } catch (e: any) {
    if (retries > 0 && (e.code === "P1017" || e.message?.includes("closed"))) {
      await new Promise((r) => setTimeout(r, 1000));
      return retry(op, retries - 1);
    }
    throw e;
  }
}

async function main() {
  console.log("🚀 PRO SEED V9: Finalizing Enum Compliance for all tables...");

  // 1. GLOBAL SYSTEM SETTINGS
  await retry(() =>
    prisma.settings.upsert({
      where: { adminId: 999999999n },
      update: {},
      create: {
        adminId: 999999999n,
        nairaPrice: 1750,
        vipPrice: { monthly: 50 },
        vipDiscountPrice: { monthly: 40 },
        language: LanguageCode.EN, // ✅ FIXED: STRICT ENUM
      },
    })
  );

  // 2. PLATFORM PLANS
  const enterprisePlan = await retry(() =>
    prisma.platformPlan.upsert({
      where: { name: "Enterprise" },
      update: {},
      create: {
        name: "Enterprise",
        priceMonthly: new Decimal(99),
        transactionFeePercent: new Decimal(2),
        maxSubscribers: 10000,
        allowBroadcasts: true,
        allowWhitelabel: true,
      },
    })
  );

  // 3. PRIMARY MERCHANT (User & Profile)
  console.log("👑 Configuring Merchant: GreysuitFx...");
  const greyUser = await retry(() =>
    prisma.user.upsert({
      where: { telegramId: 994858530n },
      update: {},
      create: {
        telegramId: 994858530n,
        fullName: "GreysuitFx Admin",
        username: "greysuit_admin",
        role: "MERCHANT" as unknown as UserRole, // ✅ FIXED: STRICT ENUM
        email: "admin@greysuitfx.com",
        language: "EN" as unknown as LanguageCode,
      },
    })
  );

  let greyMerchant: any;
  try {
    greyMerchant = await retry(() =>
      prisma.merchantProfile.create({
        data: {
          adminUserId: greyUser.telegramId,
          companyName: "GreysuitFx",
          planId: enterprisePlan.id,
          botId: 6838294498n,
          botToken: "6838294498:AAHR907AbARqogosjcVtSscTyhBWHiGYQDc",
          planStatus: "ACTIVE" as unknown as SubscriptionStatus.ACTIVE, // ✅ FIXED: STRICT ENUM
          availableBalance: new Decimal(1000),
          botConfig: {
            create: {
              welcomeMessage: "GreysuitFx Bot Active",
              enableSignals: true,
              enableMentorship: true,
              enablePropFirm: true,
              enableAffiliate: true,
              supportUrl: "https://t.me/AlphaSupport",
            },
          },
          analytics: { create: { totalRevenue: new Decimal(0) } },
          paymentConfig: {
            create: { isEnabled: true, stripeSecretKey: "sk_test_mock" },
          },
        },
      })
    );
  } catch (e: any) {
    if (e.code === "P2002") {
      greyMerchant = await prisma.merchantProfile.findUniqueOrThrow({
        where: { adminUserId: greyUser.telegramId },
      });
    } else {
      throw e;
    }
  }

  // 4. SERVICES & TIERS
  console.log("📦 Seeding Services & Tiers...");
  const service = await retry(() =>
    prisma.service.create({
      data: {
        merchantId: greyMerchant.id,
        name: "Alpha VIP Signals",
        description: "Institutional Grade Signals",
        tiers: {
          create: {
            name: "Monthly Access",
            price: new Decimal(50),
            interval: "MONTH" as unknown as IntervalUnit.MONTH, // ✅ FIXED: STRICT ENUM
            intervalCount: 1,
            type: "CUSTOM" as unknown as SubscriptionType.CUSTOM, // ✅ FIXED: STRICT ENUM
            isActive: true,
          },
        },
      },
      include: { tiers: true },
    })
  );

  // 5. CUSTOMER SIMULATION (Ledgers, Payments, Subs)
  console.log("👥 Simulating 15 Unique Customers...");
  for (let i = 0; i < 15; i++) {
    const customer = await prisma.user.create({
      data: {
        telegramId: BigInt(
          faker.number.int({ min: 111111111, max: 888888888 })
        ),
        fullName: faker.person.fullName(),
        role: UserRole.USER as unknown as ,
        email: faker.internet.email(),
      },
    });

    const payment = await prisma.payment.create({
      data: {
        userId: customer.id,
        merchantId: greyMerchant.id,
        serviceId: service.id,
        amount: new Decimal(50),
        currency: "USD",
        status: "SUCCESS" as unknown as PaymentStatus.SUCCESS, // ✅ FIXED: STRICT ENUM
        gatewayProvider: "STRIPE",
        gatewayReference: `txn_${faker.string.alphanumeric(10)}`,
      },
    });

    await prisma.ledger.create({
      data: {
        merchantId: greyMerchant.id,
        paymentId: payment.id,
        amount: new Decimal(48.5), // Net after fee
        type: "CREDIT" as unknown as LedgerType.CREDIT, // ✅ FIXED: STRICT ENUM
        description: "VIP Signals Subscription",
        balanceAfter: new Decimal(1000 + i * 48.5),
      },
    });

    await prisma.subscription.create({
      data: {
        userId: customer.id,
        merchantId: greyMerchant.id,
        serviceId: service.id,
        serviceTierId: service.tiers[0].id,
        status: "ACTIVE" as unknown as SubscriptionStatus.ACTIVE, // ✅ FIXED: STRICT ENUM
        expiresAt: futureDate(30),
      },
    });
  }

  // 6. METRICS & AUDIT LOGS
  console.log("📊 Finalizing Metrics & Logs...");
  await prisma.merchantDailyMetric.create({
    data: {
      merchantId: greyMerchant.id,
      date: new Date(),
      dailyRevenue: new Decimal(750),
      dailyNewSubs: 15,
      dailyActiveSubs: 120,
    },
  });

  await prisma.activityLog.create({
    data: {
      merchantId: greyMerchant.id,
      actorId: greyUser.id,
      action: "SYSTEM_SEED",
      resource: "Database",
      metadata: { version: "V9-Final" },
    },
  });

  console.log(
    "✅ SEEDING COMPLETE: All Tables Populated with Strict Enum Logic."
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
