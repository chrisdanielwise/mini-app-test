import prisma from "@/src/lib/db";
import type { PaymentStatus } from "@/generated/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { SubscriptionService } from "./subscription.service";
import { v4 as uuidv4 } from "uuid";
import { isUUID } from "@/src/lib/utils/validators";

export interface CreatePaymentInput {
  userId: string;
  merchantId: string;
  serviceId: string;
  serviceTierId: string;
  subscriptionId?: string;
  amount: Decimal;
  currency: string;
  gatewayProvider: string;
  paymentMethod?: string;
  couponId?: string;
  couponCode?: string;
  originalPrice?: Decimal;
  discountApplied?: Decimal;
  exchangeRate?: Decimal;
  originalUSD?: Decimal;
}

export class PaymentService {
  /**
   * Create a pending payment
   * PRISMA 7: Safeguarded against malformed UUIDs
   */
  static async create(input: CreatePaymentInput) {
    // 1. Validate UUIDs to prevent PostgreSQL syntax errors
    if (
      !isUUID(input.userId) ||
      !isUUID(input.merchantId) ||
      !isUUID(input.serviceId)
    ) {
      throw new Error("Invalid format for User, Merchant, or Service ID");
    }

    const gatewayReference = `PAY_${uuidv4()}`;

    return prisma.payment.create({
      data: {
        userId: input.userId,
        merchantId: input.merchantId,
        serviceId: input.serviceId,
        serviceTierId: input.serviceTierId,
        subscriptionId: input.subscriptionId,
        amount: input.amount,
        currency: input.currency,
        gatewayProvider: input.gatewayProvider,
        gatewayReference,
        paymentMethod: input.paymentMethod,
        couponId: input.couponId,
        couponCode: input.couponCode,
        originalPrice: input.originalPrice,
        discountApplied: input.discountApplied,
        exchangeRate: input.exchangeRate,
        originalUSD: input.originalUSD,
        status: "PENDING",
      },
    });
  }

  /**
   * Get payment by ID
   * Maps BigInt to String for JSON safety
   */
  static async getById(paymentId: string) {
    if (!isUUID(paymentId)) return null;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        user: {
          select: {
            id: true,
            telegramId: true,
            fullName: true,
            username: true,
          },
        },
        service: true,
        merchant: {
          select: {
            id: true,
            companyName: true,
          },
        },
        subscription: true,
      },
    });

    if (!payment) return null;

    return {
      ...payment,
      user: {
        ...payment.user,
        telegramId: payment.user.telegramId.toString(), // BigInt safety
      },
    };
  }

  /**
   * Get payment by gateway reference
   */
  static async getByGatewayReference(gatewayReference: string) {
    const payment = await prisma.payment.findUnique({
      where: { gatewayReference },
      include: {
        user: true,
        service: true,
        merchant: true,
      },
    });

    if (!payment) return null;

    return {
      ...payment,
      user: {
        ...payment.user,
        telegramId: payment.user.telegramId.toString(),
      },
    };
  }

  /**
   * Complete a payment
   * Uses high-precision Decimal math for financial integrity
   */
  static async complete(
    paymentId: string,
    providerTransactionId?: string,
    providerResponse?: object
  ) {
    if (!isUUID(paymentId)) throw new Error("Invalid Payment ID format");

    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: {
          merchant: { include: { plan: true } },
        },
      });

      if (!payment) throw new Error("Payment not found");
      if (payment.status !== "PENDING")
        throw new Error(`Payment already processed: ${payment.status}`);

      // 2. Financial Logic using Prisma Decimal methods
      const feePercent =
        payment.merchant.plan?.transactionFeePercent || new Decimal(5);
      const platformFee = payment.amount.mul(feePercent).div(100);
      const netAmount = payment.amount.sub(platformFee);

      // Update payment status
      const updatedPayment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: "SUCCESS",
          providerTransactionId,
          providerResponse: providerResponse as any,
        },
      });

      // Create or extend subscription
      const subscription = await SubscriptionService.createOrExtend({
        userId: payment.userId,
        merchantId: payment.merchantId,
        serviceId: payment.serviceId,
        serviceTierId: payment.serviceTierId!,
        paymentId: payment.id,
      });

      // Update payment with link to subscription
      await tx.payment.update({
        where: { id: paymentId },
        data: { subscriptionId: subscription.id },
      });

      // 3. Update Merchant Wallet Balance
      const merchant = await tx.merchantProfile.findUnique({
        where: { id: payment.merchantId },
        select: { availableBalance: true },
      });

      const newBalance = (merchant?.availableBalance || new Decimal(0)).add(
        netAmount
      );

      await tx.merchantProfile.update({
        where: { id: payment.merchantId },
        data: { availableBalance: newBalance },
      });

      // Create ledger entry for accounting
      await tx.ledger.create({
        data: {
          merchantId: payment.merchantId,
          paymentId: payment.id,
          amount: netAmount,
          type: "CREDIT",
          description: `Payment for subscription tier`,
          balanceAfter: newBalance,
        },
      });

      // 4. Atomic Analytics Upsert
      await tx.merchantAnalytics.upsert({
        where: { merchantId: payment.merchantId },
        create: {
          merchantId: payment.merchantId,
          totalRevenue: payment.amount,
          netRevenue: netAmount,
          totalSubscribers: 1,
          revenueToday: payment.amount,
          revenueThisMonth: payment.amount,
          newSubsToday: 1,
          newSubsThisMonth: 1,
          activeSubs: 1,
        },
        update: {
          totalRevenue: { increment: payment.amount },
          netRevenue: { increment: netAmount },
          revenueToday: { increment: payment.amount },
          revenueThisMonth: { increment: payment.amount },
          newSubsToday: { increment: 1 },
          newSubsThisMonth: { increment: 1 },
        },
      });

      // Update coupon usage
      if (payment.couponId) {
        await tx.coupon.update({
          where: { id: payment.couponId },
          data: { currentUses: { increment: 1 } },
        });

        await tx.couponRedemption.create({
          data: {
            userId: payment.userId,
            couponId: payment.couponId,
            subscriptionId: subscription.id,
          },
        });
      }

      return {
        payment: updatedPayment,
        subscription,
        netAmount: netAmount.toString(),
        platformFee: platformFee.toString(),
      };
    });
  }

  /**
   * Fail a payment
   */
  static async fail(paymentId: string, reason?: string) {
    if (!isUUID(paymentId)) throw new Error("Invalid Payment ID format");
    return prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "FAILED",
        providerResponse: reason ? { error: reason } : undefined,
      },
    });
  }

  /**
   * Refund a payment
   */
  static async refund(
    paymentId: string,
    reason: string,
    approvedByUserId: string
  ) {
    if (!isUUID(paymentId)) throw new Error("Invalid Payment ID format");

    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: { merchant: true },
      });

      if (!payment) throw new Error("Payment not found");
      if (payment.status !== "SUCCESS")
        throw new Error("Can only refund successful payments");

      // Create refund record
      const refund = await tx.refund.create({
        data: {
          merchantId: payment.merchantId,
          paymentId: payment.id,
          amount: payment.amount,
          reason,
          status: "PENDING",
          approvedByUserId,
        },
      });

      // Update payment status
      await tx.payment.update({
        where: { id: paymentId },
        data: { status: "REFUNDED" },
      });

      // Deduct from merchant balance
      const newBalance = payment.merchant.availableBalance.sub(payment.amount);

      await tx.merchantProfile.update({
        where: { id: payment.merchantId },
        data: { availableBalance: newBalance },
      });

      // Record in ledger
      await tx.ledger.create({
        data: {
          merchantId: payment.merchantId,
          paymentId: payment.id,
          amount: payment.amount,
          type: "DEBIT",
          description: `Refund: ${reason}`,
          balanceAfter: newBalance,
        },
      });

      // Cancel subscription
      if (payment.subscriptionId) {
        await tx.subscription.update({
          where: { id: payment.subscriptionId },
          data: { status: "CANCELLED" },
        });
      }

      return refund;
    });
  }

  /**
   * Get merchant payments
   */
  static async getMerchantPayments(
    merchantId: string,
    options: { status?: PaymentStatus; limit?: number; offset?: number } = {}
  ) {
    if (!isUUID(merchantId)) return { payments: [], total: 0 };

    const { status, limit = 50, offset = 0 } = options;
    const where = { merchantId, ...(status && { status }) };

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          user: { select: { fullName: true, username: true } },
          service: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.payment.count({ where }),
    ]);

    return {
      payments: payments.map((p) => ({ ...p, amount: p.amount.toString() })),
      total,
    };
  }
}
