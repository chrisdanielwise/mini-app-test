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
  PlatformPlan,
  Service
} from '../src/generated/prisma'; // 👈 Check this path matches your generate output
// import { Decimal } from '@prisma/client/runtime/library';
import { faker } from '@faker-js/faker';
import { Decimal } from '@prisma/client-runtime-utils';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

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
      console.warn(
        `⚠️ Database connection dropped. Retrying in ${delay}ms... (${retries} attempts left)`,
      );
      await new Promise((res) => setTimeout(res, delay));
      return retry(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting Simulation with FAKER & STANDARD SERVICES...');

  // ==========================================
  // 1. GLOBAL SYSTEM SETUP
  // ==========================================
  console.log('⚙️  Initializing Global Config...');

  await retry(() =>
    prisma.settings.upsert({
      where: { adminId: 999999999n }, // 👈 Fixed: Using BigInt
      update: {},
      create: {
        adminId: 999999999n,
        nairaPrice: 1750,
        vipPrice: { monthly: 50 },
        vipDiscountPrice: { monthly: 50 },
        language: 'en',
      },
    }),
  );

  const plans: PlatformPlan[] = [];

  const starter = await retry(() =>
    prisma.platformPlan.upsert({
      where: { name: 'Starter' },
      update: {},
      create: {
        name: 'Starter',
        priceMonthly: new Decimal(0),
        priceYearly: new Decimal(0),
        transactionFeePercent: new Decimal(10), // 👈 Fixed: Decimal
        maxSubscribers: 50,
      },
    }),
  );

  const pro = await retry(() =>
    prisma.platformPlan.upsert({
      where: { name: 'Pro' },
      update: {},
      create: {
        name: 'Pro',
        priceMonthly: new Decimal(29),
        priceYearly: new Decimal(290),
        transactionFeePercent: new Decimal(5), // 👈 Fixed: Decimal
        maxSubscribers: 1000,
        allowWhitelabel: true,
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
        transactionFeePercent: new Decimal(2), // 👈 Fixed: Decimal
        maxSubscribers: 10000,
        allowBroadcasts: true,
      },
    }),
  );
  plans.push(starter, pro, enterprise);

  // ==========================================
  // 2. MERCHANTS CREATION
  // ==========================================
  console.log('👑 Minting Merchants...');

  interface MerchantData {
    profile: MerchantProfile;
    services: Service[];
    affiliateLink?: any;
    adminUserUuid: string;
  }
  const merchants: MerchantData[] = [];

  // --- 2A. PRIMARY MERCHANT (GreysuitFx) ---
  console.log('   -> Configuring Primary Merchant: GreysuitFx');

  const greyUser = await retry(() =>
    prisma.user.upsert({
      where: { telegramId: 994858530n },
      update: {},
      create: {
        telegramId: 994858530n,
        fullName: 'GreysuitFx Admin',
        username: 'greysuit_admin',
        role: UserRole.MERCHANT,
        email: 'admin@greysuitfx.com',
        platformSubscription: {
          create: { status: 'ACTIVE', expiresAt: futureDate(365) },
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
        planStatus: 'ACTIVE',
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
            welcomeMessage: 'Welcome to GreysuitFx! Select a service to begin.',
            enableSignals: true,
            enableMentorship: true,
            enablePropFirm: true,
            enableAffiliate: true,
            supportUrl: 'https://t.me/AlphaSupport',
            customLinks: [
              { text: 'Official Website', url: 'https://greysuitfx.com' },
              { text: 'Results Channel', url: 'https://t.me/greysuit_results' },
            ],
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
    }),
  );

  // --- 2B. YOUR STANDARD SERVICES ---
  const standardServicesData = [
    {
      name: 'Vip Signal',
      description: 'Access to VIP trading signals.',
      vipChannelId: -1002142536274n,
      tiers: [
        {
          name: '1 Month Access',
          price: 52.0,
          interval: IntervalUnit.MONTH,
          intervalCount: 1,
          type: SubscriptionType.CUSTOM,
        },
        {
          name: '3 Months Access',
          price: 130.0,
          interval: IntervalUnit.MONTH,
          intervalCount: 3,
          type: SubscriptionType.CUSTOM,
        },
        {
          name: '6 Months Access',
          price: 240.0,
          interval: IntervalUnit.MONTH,
          intervalCount: 6,
          type: SubscriptionType.CUSTOM,
        },
        {
          name: '12 Months Access',
          price: 400.0,
          interval: IntervalUnit.YEAR,
          intervalCount: 1,
          type: SubscriptionType.CUSTOM,
        },
      ],
    },
    {
      name: 'Mentorship',
      vipChannelId: 987654321n,
      tiers: [
        {
          name: 'Group Mentorship Fee - $300',
          price: 300.0,
          interval: IntervalUnit.MONTH,
          intervalCount: 6,
          type: SubscriptionType.CUSTOM,
        },
      ],
    },
    {
      name: '3 Days BootCamp',
      vipChannelId: -1002142536274n,
      tiers: [
        {
          name: 'Bootcamp Fee',
          price: 79.99,
          interval: IntervalUnit.MONTH,
          intervalCount: 1,
          type: SubscriptionType.CUSTOM,
        },
      ],
    },
    {
      name: 'Fund Management',
      description: 'Capital allocation programs.',
      vipChannelId: null,
      tiers: [
        {
          name: '$10,000 - $49,000 Program',
          price: 1000.0,
          interval: IntervalUnit.MONTH,
          intervalCount: 1,
          type: SubscriptionType.CUSTOM,
        },
        {
          name: '$50,000 - $1 million Program',
          price: 1000.0,
          interval: IntervalUnit.MONTH,
          intervalCount: 1,
          type: SubscriptionType.CUSTOM,
        },
      ],
    },
  ];

  const createdGreyServices: any[] = [];

  for (const sData of standardServicesData) {
    const existingService = await retry(() =>
      prisma.service.findFirst({
        where: { merchantId: greyProfile.id, name: sData.name },
      }),
    );

    if (existingService) {
      const s = await retry(() =>
        prisma.service.findUnique({
          where: { id: existingService.id },
          include: { tiers: true },
        }),
      );
      createdGreyServices.push(s);
    } else {
      const s = await retry(() =>
        prisma.service.create({
          data: {
            merchantId: greyProfile.id,
            name: sData.name,
            description: sData.description,
            vipChannelId: sData.vipChannelId,
            autoAdd: true,
            tiers: {
              create: sData.tiers.map((t) => ({
                name: t.name,
                price: new Decimal(t.price), // 👈 Fixed: Decimal
                interval: t.interval,
                intervalCount: t.intervalCount,
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
  }

  // Affiliate Link
  let greyAffiliate = await retry(() =>
    prisma.affiliateLink.findFirst({ where: { code: 'GREYSUIT_OFFICIAL' } }),
  );
  if (!greyAffiliate) {
    greyAffiliate = await retry(() =>
      prisma.affiliateLink.create({
        data: {
          merchantId: greyProfile.id,
          affiliateId: greyUser.id,
          code: 'GREYSUIT_OFFICIAL',
          totalEarnings: new Decimal(0),
        },
      }),
    );
  }

  merchants.push({
    profile: greyProfile,
    adminUserUuid: greyUser.id,
    services: createdGreyServices,
    affiliateLink: greyAffiliate,
  });

  // --- 2C. OTHER MERCHANTS (4 Random using Faker) ---
  for (let i = 0; i < 4; i++) {
    const plan = i < 2 ? plans[0] : plans[1];
    const companyName = faker.company.name();
    const telegramId = BigInt(
      faker.number.int({ min: 100000000, max: 999999999 }),
    );

    const user = await retry(() =>
      prisma.user.create({
        data: {
          telegramId: telegramId,
          fullName: faker.person.fullName(),
          role: UserRole.MERCHANT,
          email: faker.internet.email(),
          platformSubscription: {
            create: { status: 'ACTIVE', expiresAt: futureDate(365) },
          },
        },
      }),
    );

    const profile = await retry(() =>
      prisma.merchantProfile.create({
        data: {
          adminUserId: user.telegramId,
          companyName: companyName,
          planId: plan.id,
          botId: BigInt(faker.number.int({ min: 5000000000, max: 6000000000 })),
          botToken: `ENCRYPTED_TOKEN_${faker.string.alphanumeric(10)}`,
          planStatus: 'ACTIVE',
          paymentConfig: {
            create: {
              stripeSecretKey: `sk_${faker.string.alphanumeric(20)}`,
              isEnabled: true,
            },
          },
          analytics: { create: { totalRevenue: new Decimal(0), activeSubs: 0 } },
          botConfig: {
            create: { welcomeMessage: `Welcome to ${companyName}!` },
          },
        },
      }),
    );

    const s = await retry(() =>
      prisma.service.create({
        data: {
          merchantId: profile.id,
          name: 'Premium Access',
          vipChannelId: BigInt(
            faker.number.int({ min: -1009999999999, max: -1001000000000 }),
          ),
          tiers: {
            create: [
              {
                name: 'Monthly',
                price: new Decimal(40.0), // 👈 Fixed: Decimal
                interval: IntervalUnit.MONTH,
                intervalCount: 1,
              },
            ],
          },
        },
        include: { tiers: true },
      }),
    );

    merchants.push({
      profile,
      adminUserUuid: user.id,
      services: [s],
    });
  }

  // ==========================================
  // PHASE 3: CUSTOMER SIMULATION
  // ==========================================
  console.log('👥 Simulating 195 Unique Customers...');

  const usedTelegramIds = new Set<bigint>();
  usedTelegramIds.add(994858530n);

  for (let i = 0; i < 195; i++) {
    const scenario = getScenario(i);
    const merchantData =
      Math.random() > 0.2 ? merchants[0] : randomElement(merchants.slice(1));

    let randomService;
    if (merchantData.services.length > 0) {
      randomService = randomElement(merchantData.services);
    } else {
      const services = await retry(() =>
        prisma.service.findMany({
          where: { merchantId: merchantData.profile.id },
          include: { tiers: true },
        }),
      );
      randomService = randomElement(services);
    }

    const tier = randomElement(randomService.tiers) as any;
    const tierPrice = new Decimal(tier.price);
    const tierId = tier.id;

    let telegramId = BigInt(
      faker.number.int({ min: 100000000, max: 999999999 }),
    );
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
          role: UserRole.USER,
          email: faker.internet.email(),
          platformSubscription: {
            create: {
              status:
                scenario === 'FRAUD' || scenario === 'CHURNED'
                  ? 'INACTIVE'
                  : 'ACTIVE',
              expiresAt: scenario === 'CHURNED' ? pastDate(10) : futureDate(30),
            },
          },
        },
      }),
    );

    // Merchant Context
    await retry(() =>
      prisma.merchantUserContext.create({
        data: {
          userId: user.id,
          merchantId: merchantData.profile.id,
          inviteLink: `https://t.me/+${faker.string.alphanumeric(10)}`,
          lastActiveAt: faker.date.recent(),
        },
      }),
    );

    await retry(() =>
      prisma.userMenuState.create({
        data: {
          userId: user.id,
          menu: 'MAIN_MENU',
          stack: ['Main Menu'],
          updatedAt: new Date(),
        },
      }),
    );

    // --- SCENARIO LOGIC ---

    if (
      scenario === 'WHALE' ||
      scenario === 'STANDARD' ||
      scenario === 'AFFILIATE'
    ) {
      // ⚠️ IMPORTANT: Removed non-existent fields (platformFee, merchantNet) from Payment
      const payment = await retry(() =>
        prisma.payment.create({
          data: {
            userId: user.id,
            serviceId: randomService.id,
            merchantId: merchantData.profile.id, // 👈 Added: Required by Schema
            amount: tierPrice,
            currency: 'USD',
            status: PaymentStatus.SUCCESS,
            gatewayProvider: 'STRIPE',
            gatewayReference: `ch_${faker.string.alphanumeric(20)}`,
            // ❌ Removed platformFee & merchantNet as they are NOT in schema
          },
        }),
      );

      // 🧮 Calculate Ledger amounts manually for the ledger entry
      const platformFee = tierPrice.mul(0.05); // 5% fee assumption
      const merchantNet = tierPrice.sub(platformFee);

      await retry(() =>
        prisma.ledger.create({
          data: {
            merchantId: merchantData.profile.id,
            amount: merchantNet,
            type: LedgerType.CREDIT,
            description: `Sale: ${tier.name}`,
            balanceAfter: merchantNet, // Simplified for seed
            paymentId: payment.id,
          },
        }),
      );

      const sub = await retry(() =>
        prisma.subscription.create({
          data: {
            userId: user.id,
            merchantId: merchantData.profile.id,
            serviceId: randomService.id,
            serviceTierId: tierId,
            status: SubscriptionStatus.ACTIVE,
            expiresAt: futureDate(30),
            // finalPrice: tierPrice, // ❌ Removed: Not in schema, or if exists check schema
          },
        }),
      );

      // Affiliate Attribution
      if (scenario === 'AFFILIATE' && merchantData.affiliateLink) {
        await retry(() =>
          prisma.affiliateConversion.create({
            data: {
              affiliateLinkId: merchantData.affiliateLink!.id,
              referredUserId: user.id,
              paymentId: payment.id,
              commissionAmount: tierPrice.mul(0.1),
              status: 'PENDING',
            },
          }),
        );
        const coupon = await retry(() =>
          prisma.coupon.findFirst({
            where: { merchantId: merchantData.profile.id },
          }),
        );
        if (coupon) {
          await retry(() =>
            prisma.couponRedemption.create({
              data: {
                userId: user.id,
                couponId: coupon.id,
                subscriptionId: sub.id,
              },
            }),
          );
        }
      }

      // Group Membership
      if (randomService.vipChannelId) {
        await retry(() =>
          prisma.groupMembership.create({
            data: {
              userId: user.id,
              channelId: randomService.vipChannelId,
              status: 'JOINED',
              joinedAt: faker.date.recent(),
            },
          }),
        );
      }

      // Trading Engine (Whale)
      if (scenario === 'WHALE') {
        await retry(() =>
          prisma.copierSetting.create({
            data: {
              userId: user.id,
              mt4AccountId: faker.finance.accountNumber(8),
              mt4Password: 'ENCRYPTED_PW',
              brokerServer: 'Exness-Real',
              isEnabled: true,
              riskValue: new Decimal(1.0), // 👈 Fixed: Decimal
            },
          }),
        );

        const signal = await retry(() =>
          prisma.tradeSignal.create({
            data: {
              merchantId: merchantData.profile.id,
              symbol: 'XAUUSD',
              action: 'BUY',
              entryPrice: new Decimal(2000), // 👈 Fixed: Decimal
            },
          }),
        );

        await retry(() =>
          prisma.copierExecution.create({
            data: {
              userId: user.id,
              status: ExecutionStatus.SUCCESS,
              brokerTicket: String(
                faker.number.int({ min: 1000000, max: 9999999 }),
              ),
              entryPrice: new Decimal(2000), // 👈 Fixed: Decimal
              signalId: signal.id,
            },
          }),
        );
      }
    }

    // 11. REFUNDS
    if (scenario === 'REFUNDED') {
      const payment = await retry(() =>
        prisma.payment.create({
          data: {
            userId: user.id,
            serviceId: randomService.id,
            merchantId: merchantData.profile.id,
            amount: tierPrice,
            currency: 'USD',
            status: PaymentStatus.REFUNDED,
            gatewayProvider: 'STRIPE',
            gatewayReference: `ch_${faker.string.alphanumeric(20)}`,
          },
        }),
      );

      await retry(() =>
        prisma.refund.create({
          data: {
            paymentId: payment.id,
            merchantId: merchantData.profile.id,
            amount: tierPrice,
            reason: faker.lorem.sentence(),
            status: 'APPROVED',
          },
        }),
      );
    }

    // 12. MANUAL PAYMENTS
    if (scenario === 'MANUAL_PAYMENT') {
      await retry(() =>
        prisma.screenshot.create({
          data: {
            userId: user.id,
            merchantId: merchantData.profile.id,
            photoId: `file_${faker.string.alphanumeric(10)}`,
            messageId: faker.number.int({ min: 1000, max: 50000 }),
            status: 'PENDING',
            packageType: 'Generic',
            serviceOption: randomService.name,
            paymentType: 'USDT',
          },
        }),
      );
    }

    // 13. AUDIT LOGS
    if (scenario === 'FRAUD') {
      await retry(() =>
        prisma.payment.create({
          data: {
            userId: user.id,
            serviceId: randomService.id,
            merchantId: merchantData.profile.id,
            amount: tierPrice,
            currency: 'USD',
            status: PaymentStatus.FAILED,
            gatewayProvider: 'STRIPE',
            gatewayReference: `ch_fail_${faker.string.alphanumeric(10)}`,
            // idempotencyKey: faker.string.uuid(), // ❌ Removed: Not in Payment schema
          },
        }),
      );

      await retry(() =>
        prisma.activityLog.create({
          data: {
            merchantId: merchantData.profile.id,
            actorId: merchantData.adminUserUuid,
            action: 'BAN_USER',
            resource: 'User',
            metadata: { reason: 'Suspicious IP: ' + faker.internet.ipv4() },
          },
        }),
      );

      await retry(() =>
        prisma.user.update({
          where: { id: user.id },
          data: { deletedAt: new Date() },
        }),
      );
    }

    // 14. SUPPORT TICKETS
    if (i % 15 === 0) {
      const ticket = await retry(() =>
        prisma.ticket.create({
          data: {
            merchantId: merchantData.profile.id,
            userId: user.id,
            subject: faker.lorem.words(5),
            status: 'OPEN',
            priority: TicketPriority.HIGH,
            category: TicketCategory.PAYMENT_ISSUE,
          },
        }),
      );

      await retry(() =>
        prisma.ticketMessage.create({
          data: {
            ticketId: ticket.id,
            senderId: user.id,
            senderType: SenderType.CUSTOMER,
            message: faker.lorem.paragraph(),
          },
        }),
      );
    }
  }

  // ==========================================
  // PHASE 5: METRICS & RELIABILITY
  // ==========================================
  console.log('📊 Generating 30 Days of Metrics...');
  const metricMerchant = merchants[0].profile;
  await retry(() =>
    prisma.merchantDailyMetric.deleteMany({
      where: { merchantId: metricMerchant.id },
    }),
  );

  for (let d = 0; d < 30; d++) {
    await retry(() =>
      prisma.merchantDailyMetric.create({
        data: {
          merchantId: metricMerchant.id,
          date: pastDate(30 - d),
          dailyRevenue: new Decimal(randomInt(500, 5000)), // 👈 Fixed: Decimal
          dailyNewSubs: randomInt(5, 20),
          dailyActiveSubs: 100 + d * 2,
          dailyCancellations: randomInt(0, 3),
        },
      }),
    );
  }

  // 15. WEBHOOK LOGS
  console.log('📡 Generating Webhook Logs...');
  await retry(() =>
    prisma.webhookEvent.create({
      data: {
        provider: 'STRIPE',
        externalId: `evt_${faker.string.alphanumeric(15)}`,
        eventType: 'invoice.payment_failed',
        payload: { id: 'evt_123', object: 'event', data: 'sample' },
        status: 'FAILED',
        errorLog: 'User not found in database',
      },
    }),
  );

  // 16. VERIFICATION DOCS
  await retry(() =>
    prisma.verificationDocument.create({
      data: {
        merchantId: merchants[0].profile.id,
        type: 'PASSPORT',
        fileUrl: faker.image.url(),
        status: 'APPROVED',
      },
    }),
  );

  console.log('✅ Seeding Complete! 200 Unique Users Generated.');
}

function getScenario(
  index: number,
):
  | 'WHALE'
  | 'FRAUD'
  | 'CHURNED'
  | 'AFFILIATE'
  | 'REFUNDED'
  | 'MANUAL_PAYMENT'
  | 'STANDARD' {
  if (index < 10) return 'WHALE';
  if (index < 20) return 'FRAUD';
  if (index < 30) return 'REFUNDED';
  if (index < 45) return 'MANUAL_PAYMENT';
  if (index < 60) return 'AFFILIATE';
  if (index < 80) return 'CHURNED';
  return 'STANDARD';
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });