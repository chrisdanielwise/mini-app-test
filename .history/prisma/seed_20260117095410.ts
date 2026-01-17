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
  Prisma
} from '../src/generated/prisma'; 
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { Decimal } from '@prisma/client-runtime-utils';

// ✅ Correct Decimal import for Prisma 7 Driver Adapters
// import { Decimal } from '@prisma/client/runtime/library';

dotenv.config();

// ==========================================
// 1. DATABASE CONNECTION SETUP
// ==========================================
let connectionString = process.env.DATABASE_URL;

if (connectionString && connectionString.includes('?')) {
  connectionString = connectionString.split('?')[0];
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, 
  },
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
      (error.code === 'P1017' || error.message?.includes('closed the connection'))
    ) {
      console.warn(`⚠️ Connection dropped. Retrying... (${retries} attempts left)`);
      await new Promise((res) => setTimeout(res, delay));
      return retry(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting Full Simulation...');
  console.log('✅ VERSION 12.0 (Double-Cast Compliance - NO SKIPPING)');

  const merchants: any[] = [];

  // ==========================================
  // 1. GLOBAL SYSTEM SETUP
  // ==========================================
  console.log('⚙️  Initializing Global Config...');

  await retry(() =>
    prisma.settings.upsert({
      where: { adminId: 999999999n },
      update: {},
      create: {
        adminId: 999999999n,
        nairaPrice: 1750,
        vipPrice: { monthly: 50 },
        vipDiscountPrice: { monthly: 50 },
        language: "EN" as unknown as LanguageCode,
      },
    }),
  );

  const starter = await retry(() =>
    prisma.platformPlan.upsert({
      where: { name: 'Starter' },
      update: {},
      create: {
        name: 'Starter',
        priceMonthly: new Decimal(0),
        priceYearly: new Decimal(0),
        transactionFeePercent: new Decimal(10),
        maxSubscribers: 50,
      },
    }),
  );

  const enterprise = await retry(() =>
    prisma.platformPlan.upsert({
      where: { name: 'Enterprise' },
      update: {},
      create: {
        name: 'Enterprise',
        priceMonthly: new Decimal(99),
        priceYearly: new Decimal(990),
        transactionFeePercent: new Decimal(2),
        maxSubscribers: 10000,
        allowBroadcasts: true,
      },
    }),
  );
  const plans = [starter, enterprise];

  // ==========================================
  // 2. PRIMARY MERCHANT (GreysuitFx)
  // ==========================================
  console.log('👑 Configuring Primary Merchant: GreysuitFx');

  const greyUser = await retry(() =>
    prisma.user.upsert({
      where: { telegramId: 994858530n },
      update: {},
      create: {
        telegramId: 994858530n,
        fullName: 'GreysuitFx Admin',
        username: 'greysuit_admin',
        role: "MERCHANT" as unknown as UserRole,
        email: 'admin@greysuitfx.com',
        platformSubscription: {
          create: { 
            status: "ACTIVE" as unknown as SubscriptionStatus,
            expiresAt: futureDate(365) 
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
        companyName: 'GreysuitFx',
        planId: enterprise.id,
        botId: 6838294498n,
        botToken: '6838294498:AAHR907AbARqogosjcVtSscTyhBWHiGYQDc',
        planStatus: "ACTIVE" as unknown as SubscriptionStatus,
        botConfig: {
          create: {
            welcomeMessage: 'Welcome to GreysuitFx!',
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

  // --- 2B. SERVICES ---
  const standardServicesData = [
    {
      name: 'Vip Signal',
      description: 'VIP trading signals.',
      vipChannelId: -1002142536274n,
      tiers: [
        { name: 'Monthly', price: 52.0, interval: "MONTH" as unknown as IntervalUnit, type: "CUSTOM" as unknown as SubscriptionType },
      ],
    }
  ];

  const createdGreyServices: any[] = [];
  for (const sData of standardServicesData) {
    const s = await retry(() =>
      prisma.service.create({
        data: {
          merchantId: greyProfile.id,
          name: sData.name,
          description: sData.description,
          vipChannelId: sData.vipChannelId,
          tiers: {
            create: sData.tiers.map((t) => ({
              name: t.name,
              price: new Decimal(t.price),
              interval: t.interval,
              intervalCount: 1,
              type: t.type,
              isActive: true,
            })),
          },
        },
        include: { tiers: true },
      }),
    );
    createdGreyServices.push(s);
  }

  // Affiliate Link
console.log('🔗 Synchronizing Affiliate Link...');
const greyAffiliate = await retry(() =>
  prisma.affiliateLink.upsert({
    where: { 
      code: 'GREYSUIT_OFFICIAL' 
    },
    update: {}, // No changes needed if it exists
    create: {
      merchantId: greyProfile.id,
      affiliateId: greyUser.id,
      code: 'GREYSUIT_OFFICIAL',
      totalEarnings: new Decimal(0),
    },
  })
);

  merchants.push({
    profile: greyProfile,
    adminUserUuid: greyUser.id,
    services: createdGreyServices,
    affiliateLink: greyAffiliate,
  });

  // ==========================================
  // 3. OTHER MERCHANTS (4 Random)
  // ==========================================
  for (let i = 0; i < 4; i++) {
    const user = await retry(() =>
      prisma.user.create({
        data: {
          telegramId: BigInt(faker.number.int({ min: 100000000, max: 999999999 })),
          fullName: faker.person.fullName(),
          role: "MERCHANT" as unknown as UserRole,
          email: faker.internet.email(),
          platformSubscription: { create: { status: "ACTIVE" as unknown as SubscriptionStatus, expiresAt: futureDate(365) } },
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
          planStatus: "ACTIVE" as unknown as SubscriptionStatus,
          botConfig: { create: { welcomeMessage: 'Welcome!' } },
          analytics: { create: { totalRevenue: new Decimal(0) } },
        },
      }),
    );

    const s = await retry(() =>
      prisma.service.create({
        data: {
          merchantId: profile.id,
          name: 'Premium Signals',
          tiers: { create: [{ name: 'Monthly', price: new Decimal(40.0), interval: "MONTH" as unknown as IntervalUnit, intervalCount: 1, type: "CUSTOM" as unknown as SubscriptionType }] },
        },
        include: { tiers: true },
      }),
    );
    merchants.push({ profile, adminUserUuid: user.id, services: [s] });
  }

  // ==========================================
  // 4. CUSTOMER SIMULATION (195 USERS)
  // ==========================================
  console.log('👥 Simulating 195 Unique Customers...');

  const usedTelegramIds = new Set<bigint>();
  usedTelegramIds.add(994858530n);

  for (let i = 0; i < 195; i++) {
    const scenario = getScenario(i);
    const merchantData = Math.random() > 0.2 ? merchants[0] : randomElement(merchants.slice(1));
    const randomService = randomElement(merchantData.services);
    const tier = randomElement(randomService.tiers) as any;
    const tierPrice = new Decimal(tier.price);

    let telegramId = BigInt(faker.number.int({ min: 100000000, max: 999999999 }));
    while (usedTelegramIds.has(telegramId)) {
      telegramId = BigInt(faker.number.int({ min: 100000000, max: 999999999 }));
    }
    usedTelegramIds.add(telegramId);

    const user = await retry(() =>
      prisma.user.create({
        data: {
          telegramId: telegramId,
          fullName: faker.person.fullName(),
          username: faker.internet.username(),
          role: "USER" as unknown as UserRole,
          email: faker.internet.email(),
          platformSubscription: {
            create: {
              status: (scenario === 'FRAUD' || scenario === 'CHURNED') ? "INACTIVE" as unknown as SubscriptionStatus : "ACTIVE" as unknown as SubscriptionStatus,
              expiresAt: scenario === 'CHURNED' ? pastDate(10) : futureDate(30),
            },
          },
        },
      }),
    );

    // Context & Menu
    await retry(() => prisma.merchantUserContext.create({
      data: { userId: user.id, merchantId: merchantData.profile.id, inviteLink: 'https://t.me/...' }
    }));

    // Financials
    if (scenario === 'WHALE' || scenario === 'STANDARD' || scenario === 'AFFILIATE') {
      const payment = await retry(() =>
        prisma.payment.create({
          data: {
            userId: user.id,
            serviceId: randomService.id,
            merchantId: merchantData.profile.id,
            amount: tierPrice,
            currency: 'USD',
            status: "SUCCESS" as unknown as PaymentStatus,
            gatewayProvider: 'STRIPE',
            gatewayReference: `txn_${faker.string.alphanumeric(15)}`,
          },
        }),
      );

      await retry(() =>
        prisma.ledger.create({
          data: {
            merchantId: merchantData.profile.id,
            amount: tierPrice.mul(0.95),
            type: "CREDIT" as unknown as LedgerType,
            description: `Sale: ${tier.name}`,
            balanceAfter: tierPrice.mul(0.95),
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
            status: "ACTIVE" as unknown as SubscriptionStatus,
            expiresAt: futureDate(30),
          },
        }),
      );

      if (scenario === 'WHALE') {
        const signal = await retry(() => prisma.tradeSignal.create({
            data: { merchantId: merchantData.profile.id, symbol: 'XAUUSD', action: 'BUY', entryPrice: new Decimal(2000) }
        }));
        await retry(() => prisma.copierExecution.create({
          data: {
            userId: user.id,
            status: "SUCCESS" as unknown as ExecutionStatus,
            brokerTicket: String(faker.number.int({ min: 1000000, max: 9999999 })),
            entryPrice: new Decimal(2000),
            signalId: signal.id,
          },
        }));
      }
    }

    // Support
    if (i % 15 === 0) {
      const ticket = await retry(() => prisma.ticket.create({
        data: {
          merchantId: merchantData.profile.id,
          userId: user.id,
          subject: 'Payment Issue',
          status: 'OPEN',
          priority: "HIGH" as unknown as TicketPriority,
          category: "PAYMENT_ISSUE" as unknown as TicketCategory,
        },
      }));
      await retry(() => prisma.ticketMessage.create({
        data: {
          ticketId: ticket.id,
          senderId: user.id,
          senderType: "CUSTOMER" as unknown as SenderType,
          message: faker.lorem.paragraph(),
        },
      }));
    }

    if (scenario === 'FRAUD') {
        await retry(() => prisma.activityLog.create({
          data: { merchantId: merchantData.profile.id, actorId: merchantData.adminUserUuid, action: 'BAN_USER', resource: 'User' }
        }));
    }
  }

  // ==========================================
  // 5. METRICS & LOGS
  // ==========================================
  console.log('📊 Generating Final Metrics & Logs...');
  // PHASE 5: METRICS
console.log('📊 Synchronizing 30 Days of Metrics...');
for (let d = 0; d < 30; d++) {
  const targetDate = pastDate(30 - d);
  // Set time to midnight to ensure date consistency
  targetDate.setHours(0, 0, 0, 0);

  await retry(() => prisma.merchantDailyMetric.upsert({
    where: {
      merchantId_date: {
        merchantId: greyProfile.id,
        date: targetDate,
      },
    },
    update: {
      dailyRevenue: new Decimal(randomInt(500, 5000)),
      dailyActiveSubs: 100 + d * 2,
    },
    create: {
      merchantId: greyProfile.id,
      date: targetDate,
      dailyRevenue: new Decimal(randomInt(500, 5000)),
      dailyNewSubs: randomInt(5, 20),
      dailyActiveSubs: 100 + d * 2,
    },
  }));
}

  await retry(() => prisma.webhookEvent.create({
    data: { provider: 'STRIPE', externalId: faker.string.alphanumeric(10), eventType: 'invoice.failed', status: "FAILED" as unknown as any, errorLog: 'Sample Error' }
  }));

  await retry(() => prisma.verificationDocument.create({
    data: { merchantId: greyProfile.id, type: 'PASSPORT', fileUrl: faker.image.url(), status: 'APPROVED' as unknown as SubscriptionType.APPROVED }
  }));

  console.log('✅ Seeding Complete! 200 Unique Users Generated.');
}

function getScenario(index: number) {
  if (index < 10) return 'WHALE';
  if (index < 20) return 'FRAUD';
  if (index < 30) return 'REFUNDED';
  if (index < 45) return 'MANUAL_PAYMENT';
  if (index < 60) return 'AFFILIATE';
  if (index < 80) return 'CHURNED';
  return 'STANDARD';
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());