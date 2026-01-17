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

// ✅ CORRECT DECIMAL IMPORT FOR PRISMA 7
import { Decimal } from '@prisma/client/runtime/library';

dotenv.config();

// ==========================================
// 1. DATABASE CONNECTION SETUP (SSL FIX)
// ==========================================
let connectionString = process.env.DATABASE_URL;
if (connectionString && connectionString.includes('?')) {
  connectionString = connectionString.split('?')[0];
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// --- HELPER FUNCTIONS ---
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const pastDate = (daysAgo: number) => new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
const futureDate = (daysForward: number) => new Date(Date.now() + daysForward * 24 * 60 * 60 * 1000);

// 🛡️ RETRY HELPER
async function retry<T>(operation: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (retries > 0 && (error.code === 'P1017' || error.message?.includes('closed the connection'))) {
      console.warn(`⚠️ Database connection dropped. Retrying... (${retries} attempts left)`);
      await new Promise((res) => setTimeout(res, delay));
      return retry(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting Simulation with FAKER & STANDARD SERVICES...');
  console.log('✅ VERSION 10.0 (Global Double-Cast Fix)');

  const merchants: any[] = []; // Internal array to track created merchants

  // ==========================================
  // 1. GLOBAL SYSTEM SETUP
  // ==========================================
  console.log('⚙️  Initializing Global Config...');

  await retry(() => prisma.settings.upsert({
    where: { adminId: 999999999n },
    update: {},
    create: {
      adminId: 999999999n,
      nairaPrice: 1750,
      vipPrice: { monthly: 50 },
      vipDiscountPrice: { monthly: 50 },
      language: "en" as unknown as LanguageCode, // ✅ Cast
    },
  }));

  const plans: any[] = [];
  const starter = await retry(() => prisma.platformPlan.upsert({
    where: { name: 'Starter' },
    update: {},
    create: {
      name: 'Starter',
      priceMonthly: new Decimal(0),
      priceYearly: new Decimal(0),
      transactionFeePercent: new Decimal(10),
      maxSubscribers: 50,
    },
  }));

  const pro = await retry(() => prisma.platformPlan.upsert({
    where: { name: 'Pro' },
    update: {},
    create: {
      name: 'Pro',
      priceMonthly: new Decimal(29),
      priceYearly: new Decimal(290),
      transactionFeePercent: new Decimal(5),
      maxSubscribers: 1000,
      allowWhitelabel: true,
    },
  }));

  const enterprise = await retry(() => prisma.platformPlan.upsert({
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
  }));
  plans.push(starter, pro, enterprise);

  // ==========================================
  // 2. MERCHANTS CREATION
  // ==========================================
  console.log('👑 Minting Merchants...');

  // --- 2A. PRIMARY MERCHANT (GreysuitFx) ---
  console.log('   -> Configuring Primary Merchant: GreysuitFx');

  const greyUser = await retry(() => prisma.user.upsert({
    where: { telegramId: 994858530n },
    update: {},
    create: {
      telegramId: 994858530n,
      fullName: 'GreysuitFx Admin',
      username: 'greysuit_admin',
      role: "MERCHANT" as unknown as UserRole, // ✅ Double Cast
      email: 'admin@greysuitfx.com',
      platformSubscription: {
        create: { 
          status: "ACTIVE" as unknown as SubscriptionStatus, // ✅ Double Cast
          expiresAt: futureDate(365) 
        },
      },
    },
  }));

  const greyProfile = await retry(() => prisma.merchantProfile.upsert({
    where: { adminUserId: greyUser.telegramId },
    update: {},
    create: {
      adminUserId: greyUser.telegramId,
      companyName: 'GreysuitFx',
      planId: enterprise.id,
      botId: 6838294498n,
      botToken: '6838294498:AAHR907AbARqogosjcVtSscTyhBWHiGYQDc',
      planStatus: "ACTIVE" as unknown as SubscriptionStatus, // ✅ Double Cast
      payoutConfig: {
        approvalChannelId: '-1002073074417',
        contactSupportUrl: 'https://t.me/AlphaSupport',
        supportEmail: 'support@alphatrading.com',
        bankName: 'Access Bank',
        accountName: 'Alpha Ventures',
        accountNumber: '0011223344',
      },
      botConfig: {
        create: {
          welcomeMessage: 'Welcome to GreysuitFx!',
          enableSignals: true,
          enableMentorship: true,
          enablePropFirm: true,
          enableAffiliate: true,
          supportUrl: 'https://t.me/AlphaSupport',
        },
      },
      paymentConfig: {
        create: {
          stripeSecretKey: 'sk_test_greysuit_mock',
          isEnabled: true,
          cryptoWallets: { trc20: 'TMockGreysuitAddress' },
        },
      },
      analytics: { create: { totalRevenue: new Decimal(0), activeSubs: 0 } },
    },
  }));

  // --- 2B. YOUR STANDARD SERVICES ---
  const standardServicesData = [
    {
      name: 'Vip Signal',
      description: 'Access to VIP trading signals.',
      vipChannelId: -1002142536274n,
      tiers: [
        { name: '1 Month Access', price: 52.0, interval: "MONTH" as unknown as IntervalUnit, intervalCount: 1, type: "CUSTOM" as unknown as SubscriptionType },
        { name: '3 Months Access', price: 130.0, interval: "MONTH" as unknown as IntervalUnit, intervalCount: 3, type: "CUSTOM" as unknown as SubscriptionType },
      ],
    },
    {
        name: 'Mentorship',
        vipChannelId: 987654321n,
        tiers: [{ name: 'Group Mentorship Fee - $300', price: 300.0, interval: "MONTH" as unknown as IntervalUnit, intervalCount: 6, type: "CUSTOM" as unknown as SubscriptionType }],
    }
  ];

  const createdGreyServices: any[] = [];
  for (const sData of standardServicesData) {
    const s = await retry(() => prisma.service.create({
      data: {
        merchantId: greyProfile.id,
        name: sData.name,
        description: sData.description || '',
        vipChannelId: sData.vipChannelId,
        autoAdd: true,
        tiers: {
          create: sData.tiers.map((t) => ({
            name: t.name,
            price: new Decimal(t.price),
            interval: t.interval,
            intervalCount: t.intervalCount,
            type: t.type,
            isActive: true,
          })),
        },
      },
      include: { tiers: true },
    }));
    createdGreyServices.push(s);
  }

  // Affiliate Link
  let greyAffiliate = await retry(() => prisma.affiliateLink.create({
    data: {
      merchantId: greyProfile.id,
      affiliateId: greyUser.id,
      code: 'GREYSUIT_OFFICIAL',
      totalEarnings: new Decimal(0),
    },
  }));

  merchants.push({
    profile: greyProfile,
    adminUserUuid: greyUser.id,
    services: createdGreyServices,
    affiliateLink: greyAffiliate,
  });

  // --- 2C. OTHER MERCHANTS (4 Random) ---
  for (let i = 0; i < 4; i++) {
    const user = await retry(() => prisma.user.create({
      data: {
        telegramId: BigInt(faker.number.int({ min: 100000000, max: 999999999 })),
        fullName: faker.person.fullName(),
        role: "MERCHANT" as unknown as UserRole,
        email: faker.internet.email(),
        platformSubscription: { create: { status: "ACTIVE" as unknown as SubscriptionStatus, expiresAt: futureDate(365) } },
      },
    }));

    const profile = await retry(() => prisma.merchantProfile.create({
      data: {
        adminUserId: user.telegramId,
        companyName: faker.company.name(),
        planId: plans[randomInt(0, 2)].id,
        botId: BigInt(faker.number.int({ min: 5000000000, max: 6000000000 })),
        botToken: `ENCRYPTED_TOKEN_${faker.string.alphanumeric(10)}`,
        planStatus: "ACTIVE" as unknown as SubscriptionStatus,
        paymentConfig: { create: { isEnabled: true } },
        analytics: { create: { totalRevenue: new Decimal(0) } },
        botConfig: { create: { welcomeMessage: 'Welcome!' } },
      },
    }));

    const s = await retry(() => prisma.service.create({
      data: {
        merchantId: profile.id,
        name: 'Premium Access',
        tiers: { create: [{ name: 'Monthly', price: new Decimal(40.0), interval: "MONTH" as unknown as IntervalUnit, intervalCount: 1, type: "CUSTOM" as unknown as SubscriptionType }] },
      },
      include: { tiers: true },
    }));

    merchants.push({ profile, adminUserUuid: user.id, services: [s] });
  }

  // ==========================================
  // PHASE 3: CUSTOMER SIMULATION
  // ==========================================
  console.log('👥 Simulating 195 Unique Customers...');

  for (let i = 0; i < 195; i++) {
    const scenario = getScenario(i);
    const merchantData = Math.random() > 0.2 ? merchants[0] : randomElement(merchants.slice(1));
    const randomService = randomElement(merchantData.services);
    const tier = randomElement(randomService.tiers) as any;
    const tierPrice = new Decimal(tier.price);

    const user = await retry(() => prisma.user.create({
      data: {
        telegramId: BigInt(faker.number.int({ min: 100000000, max: 888888888 })),
        fullName: faker.person.fullName(),
        role: "USER" as unknown as UserRole,
        email: faker.internet.email(),
        platformSubscription: {
          create: {
            status: (scenario === 'FRAUD' || scenario === 'CHURNED') ? "INACTIVE" as unknown as SubscriptionStatus : "ACTIVE" as unknown as SubscriptionStatus,
            expiresAt: scenario === 'CHURNED' ? pastDate(10) : futureDate(30),
          },
        },
      },
    }));

    if (scenario === 'WHALE' || scenario === 'STANDARD' || scenario === 'AFFILIATE') {
      const payment = await retry(() => prisma.payment.create({
        data: {
          userId: user.id,
          serviceId: randomService.id,
          merchantId: merchantData.profile.id,
          amount: tierPrice,
          currency: 'USD',
          status: "SUCCESS" as unknown as PaymentStatus,
          gatewayProvider: 'STRIPE',
          gatewayReference: `ch_${faker.string.alphanumeric(20)}`,
        },
      }));

      await retry(() => prisma.ledger.create({
        data: {
          merchantId: merchantData.profile.id,
          amount: tierPrice.mul(0.95),
          type: "CREDIT" as unknown as LedgerType,
          description: `Sale: ${tier.name}`,
          balanceAfter: tierPrice.mul(0.95),
          paymentId: payment.id,
        },
      }));

      await retry(() => prisma.subscription.create({
        data: {
          userId: user.id,
          merchantId: merchantData.profile.id,
          serviceId: randomService.id,
          serviceTierId: tier.id,
          status: "ACTIVE" as unknown as SubscriptionStatus,
          expiresAt: futureDate(30),
        },
      }));

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

    if (i % 15 === 0) {
      await retry(() => prisma.ticket.create({
        data: {
          merchantId: merchantData.profile.id,
          userId: user.id,
          subject: faker.lorem.words(3),
          status: 'OPEN',
          priority: "HIGH" as unknown as TicketPriority,
          category: "PAYMENT_ISSUE" as unknown as TicketCategory,
        },
      }));
    }
  }

  console.log('✅ Seeding Complete!');
}

function getScenario(index: number) {
  if (index < 10) return 'WHALE';
  if (index < 20) return 'FRAUD';
  if (index < 60) return 'AFFILIATE';
  return 'STANDARD';
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());