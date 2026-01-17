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
  MembershipStatus,
  DocStatus,
  LanguageCode
} from '../src/generated/prisma'; 
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { Decimal } from '@prisma/client-runtime-utils';
// import { Decimal } from '@prisma/client/runtime/library';
const merchantRole: UserRole = "merchant" as any;
dotenv.config();

// 1. Connection logic
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

const pastDate = (daysAgo: number) => new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
const futureDate = (daysForward: number) => new Date(Date.now() + daysForward * 24 * 60 * 60 * 1000);

async function retry<T>(op: () => Promise<T>, retries = 3): Promise<T> {
  try { return await op(); } catch (e: any) {
    if (retries > 0 && (e.code === 'P1017' || e.message?.includes('closed'))) {
      await new Promise(r => setTimeout(r, 1000));
      return retry(op, retries - 1);
    }
    throw e;
  }
}

async function main() {
  console.log('🚀 PRO SEED V7: Populating strict Enum-mapped tables...');

  // 1. Global Settings
  await retry(() => prisma.settings.upsert({
    where: { adminId: 999999999n },
    update: {},
    create: {
      adminId: 999999999n,
      nairaPrice: 1750,
      vipPrice: { monthly: 50 },
      vipDiscountPrice: { monthly: 40 },
      language: "en"
    }
  }));

  // 2. Plans
  const enterprisePlan = await retry(() => prisma.platformPlan.upsert({
    where: { name: 'Enterprise' },
    update: {},
    create: {
      name: 'Enterprise',
      priceMonthly: new Decimal(99),
      transactionFeePercent: new Decimal(2),
      maxSubscribers: 10000,
      allowBroadcasts: true,
      allowWhitelabel: true
    }
  }));

  // 3. Primary Merchant (Strict Enum Fix)
  // 2. Use the objects in the upsert
/const greyUser = await retry(() =>
  prisma.user.upsert({
    where: { 
      telegramId: 994858530n 
    },
    update: {},
    create: {
      telegramId: 994858530n,
      fullName: "GreysuitFx Admin",
      username: "greysuit_admin",
      email: "admin@greysuitfx.com",
      // ✅ DO NOT use "merchant" (string). 
      // ✅ Use UserRole.MERCHANT (Enum Object).
      role: UserRole.MERCHANT, 
      // ✅ DO NOT use "en". 
      // ✅ Use LanguageCode.EN (Enum Object).
      language: LanguageCode.EN 
    },
  })
);

  const greyMerchant: any = await retry(() => prisma.merchantProfile.upsert({
    where: { adminUserId: greyUser.telegramId },
    update: {},
    create: {
      adminUserId: greyUser.telegramId,
      companyName: 'GreysuitFx',
      planId: enterprisePlan.id,
      botId: 6838294498n,
      botToken: '6838294498:AAHR907AbARqogosjcVtSscTyhBWHiGYQDc',
      planStatus: SubscriptionStatus.ACTIVE, // ✅ STRICT ENUM
      availableBalance: new Decimal(1000),
      botConfig: { create: { welcomeMessage: 'GreysuitFx Bot Active' } },
      analytics: { create: { totalRevenue: new Decimal(0) } },
      paymentConfig: { create: { isEnabled: true } }
    }
  }));

  // 4. Digital Service
  const service = await retry(() => prisma.service.create({
    data: {
      merchantId: greyMerchant.id,
      name: 'Alpha VIP Signals',
      description: 'Expert Institutional Signals',
      tiers: {
        create: {
          name: 'Monthly Plan',
          price: new Decimal(50),
          interval: IntervalUnit.MONTH,
          type: SubscriptionType.CUSTOM
        }
      }
    },
    include: { tiers: true }
  }));

  // 5. Customer Simulation (The Loop)
  console.log('👥 Generating users and financial records...');
  for (let i = 0; i < 15; i++) {
    const customer = await prisma.user.create({
      data: {
        telegramId: BigInt(faker.number.int({ min: 111111111, max: 999999999 })),
        fullName: faker.person.fullName(),
        role: UserRole.USER,
        email: faker.internet.email()
      }
    });

    const payment = await prisma.payment.create({
      data: {
        userId: customer.id,
        merchantId: greyMerchant.id,
        serviceId: service.id,
        amount: new Decimal(50),
        currency: 'USD',
        status: PaymentStatus.SUCCESS, // ✅ STRICT ENUM
        gatewayProvider: 'STRIPE',
        gatewayReference: `txn_${faker.string.alphanumeric(10)}`
      }
    });

    await prisma.ledger.create({
      data: {
        merchantId: greyMerchant.id,
        paymentId: payment.id,
        amount: new Decimal(48),
        type: LedgerType.CREDIT, // ✅ STRICT ENUM
        description: 'VIP signals payout',
        balanceAfter: new Decimal(1000 + (i * 48))
      }
    });

    await prisma.subscription.create({
      data: {
        userId: customer.id,
        merchantId: greyMerchant.id,
        serviceId: service.id,
        serviceTierId: service.tiers[0].id,
        status: SubscriptionStatus.ACTIVE,
        expiresAt: futureDate(30)
      }
    });

    // Support & Engagement
    if (i % 5 === 0) {
      const ticket = await prisma.ticket.create({
        data: {
          userId: customer.id,
          merchantId: greyMerchant.id,
          subject: 'MT4 Config Help',
          status: 'OPEN',
          priority: TicketPriority.MEDIUM,
          category: TicketCategory.COPIER_ISSUE
        }
      });
      await prisma.ticketMessage.create({
        data: {
          ticketId: ticket.id,
          senderId: customer.id,
          senderType: SenderType.CUSTOMER,
          message: 'How do I link my broker?'
        }
      });
    }
  }

  // 6. Metrics & Logs
  await prisma.merchantDailyMetric.create({
    data: {
      merchantId: greyMerchant.id,
      date: new Date(),
      dailyRevenue: new Decimal(750),
      dailyNewSubs: 15,
      dailyActiveSubs: 15
    }
  });

  await prisma.activityLog.create({
    data: {
      merchantId: greyMerchant.id,
      actorId: greyUser.id,
      action: 'INIT_SEED',
      resource: 'MerchantProfile',
      metadata: { status: 'COMPLETE' }
    }
  });

  console.log('✅ SEEDING COMPLETE: Database populated correctly.');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
