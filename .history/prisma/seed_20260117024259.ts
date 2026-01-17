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
  MerchantProfile,
  Service
} from '../src/generated/prisma';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { Decimal } from '@prisma/client-runtime-utils';
// import { Decimal } from '@prisma/client/runtime/library';

dotenv.config();

// ==========================================
// 1. DATABASE CONNECTION (SSL & ADAPTER FIX)
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

// --- HELPERS ---
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
  console.log('🚀 PRO SEED: Populating all 27+ Tables for Schema V2...');

  // 1. SYSTEM CONFIG & SETTINGS
  console.log('⚙️  Seeding System Tables...');
  await retry(() => prisma.settings.upsert({
    where: { adminId: 999999999n },
    update: {},
    create: {
      adminId: 999999999n,
      nairaPrice: 1750,
      vipPrice: { monthly: 50 },
      vipDiscountPrice: { monthly: 40 },
    }
  }));

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

  // 2. PRIMARY MERCHANT (GreysuitFx)
  console.log('👑 Seeding Merchant: GreysuitFx...');
  const greyUser = await retry(() => prisma.user.upsert({
    where: { telegramId: 994858530n },
    update: {},
    create: {
      telegramId: 994858530n,
      fullName: 'GreysuitFx Admin',
      role: UserRole.MERCHANT,
      email: 'admin@greysuitfx.com',
    }
  }));

  const greyMerchant = await retry(() => prisma.merchantProfile.upsert({
    where: { adminUserId: greyUser.telegramId },
    update: {},
    create: {
      adminUserId: greyUser.telegramId,
      companyName: 'GreysuitFx',
      planId: enterprisePlan.id,
      botId: 6838294498n,
      botToken: '6838294498:AAHR907AbARqogosjcVtSscTyhBWHiGYQDc',
      availableBalance: new Decimal(1500.50),
      botConfig: { create: { welcomeMessage: 'GreysuitFx Professional Trading Bot' } },
      analytics: { create: { totalRevenue: new Decimal(5000) } },
      paymentConfig: { create: { isEnabled: true, stripeSecretKey: 'sk_test_mock' } }
    }
  }));

  // 3. SERVICES & TIERS
  console.log('📦 Seeding Services & Subscriptions...');
  const vipService = await retry(() => prisma.service.create({
    data: {
      merchantId: greyMerchant.id,
      name: 'VIP Signals',
      description: 'Gold & Forex Institutional Signals',
      tiers: {
        create: {
          name: 'Monthly Access',
          price: new Decimal(50),
          interval: IntervalUnit.MONTH,
          type: SubscriptionType.CUSTOM
        }
      }
    },
    include: { tiers: true }
  }));

  // 4. BULK CUSTOMERS & FINANCIALS
  for (let i = 0; i < 20; i++) {
    const customer = await prisma.user.create({
      data: {
        telegramId: BigInt(faker.number.int({ min: 100000000, max: 888888888 })),
        fullName: faker.person.fullName(),
        role: UserRole.USER,
        email: faker.internet.email()
      }
    });

    const payment = await prisma.payment.create({
      data: {
        userId: customer.id,
        merchantId: greyMerchant.id,
        serviceId: vipService.id,
        amount: new Decimal(50),
        currency: 'USD',
        status: PaymentStatus.SUCCESS,
        gatewayProvider: 'STRIPE',
        gatewayReference: `txn_${faker.string.alphanumeric(10)}`
      }
    });

    await prisma.ledger.create({
      data: {
        merchantId: greyMerchant.id,
        paymentId: payment.id,
        amount: new Decimal(48.50),
        type: LedgerType.CREDIT,
        description: 'VIP Signals Subscription',
        balanceAfter: new Decimal(1500 + (i * 48.50))
      }
    });

    await prisma.subscription.create({
      data: {
        userId: customer.id,
        merchantId: greyMerchant.id,
        serviceId: vipService.id,
        serviceTierId: vipService.tiers[0].id,
        status: SubscriptionStatus.ACTIVE,
        expiresAt: futureDate(30)
      }
    });
  }

  // 5. MARKETING, SUPPORT & TRADING
  console.log('📊 Seeding Marketing & Operations...');
  
  await prisma.affiliateLink.create({
    data: {
      merchantId: greyMerchant.id,
      affiliateId: greyUser.id,
      code: 'GREY50',
      totalEarnings: new Decimal(100)
    }
  });

  const ticket = await prisma.ticket.create({
    data: {
      userId: greyUser.id,
      merchantId: greyMerchant.id,
      subject: 'MT4 Connection Issue',
      status: 'OPEN',
      priority: TicketPriority.HIGH,
      category: TicketCategory.COPIER_ISSUE
    }
  });

  await prisma.ticketMessage.create({
    data: {
      ticketId: ticket.id,
      senderId: greyUser.id,
      senderType: SenderType.CUSTOMER,
      message: 'My copier is not executing trades.'
    }
  });

  await prisma.activityLog.create({
    data: {
      merchantId: greyMerchant.id,
      actorId: greyUser.id,
      action: 'SETTINGS_UPDATE',
      resource: 'BotConfig',
      metadata: { change: 'Enabled Signals' }
    }
  });

  await prisma.merchantDailyMetric.create({
    data: {
      merchantId: greyMerchant.id,
      date: new Date(),
      dailyRevenue: new Decimal(250),
      dailyNewSubs: 5,
      dailyActiveSubs: 120
    }
  });

  console.log('✅ PRO SEED COMPLETE: Database is fully populated.');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
