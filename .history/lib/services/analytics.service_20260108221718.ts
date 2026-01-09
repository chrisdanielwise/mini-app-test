import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { startOfDay, endOfDay, eachDayOfInterval, format } from "date-fns";

export interface DateRange {
  from: Date;
  to: Date;
}

/**
 * 🚀 DB RESILIENCE HELPER
 * Handles Neon cold starts by retrying connection-related failures.
 */
async function withRetry<T>(fn: () => Promise<T>, label: string, maxAttempts = 3): Promise<T> {
  let attempts = 0;
  while (attempts < maxAttempts) {
    try {
      return await fn();
    } catch (error: any) {
      attempts++;
      const isTimeout = error.message.includes('timeout') || error.message.includes('terminated');
      if (isTimeout && attempts < maxAttempts) {
        console.warn(`[Neon Retry] ${label}: Cold Start detected. Attempt ${attempts}/${maxAttempts}.`);
        await new Promise(res => setTimeout(res, 2000));
        continue;
      }
      throw error;
    }
  }
  throw new Error(`Max retry attempts reached for ${label}`);
}

export class AnalyticsService {
  /**
   * 📊 REVENUE ANALYTICS
   * Optimized with aggregate functions to minimize data transfer.
   */
  static async getRevenueAnalytics(merchantId: string, range: DateRange) {
    if (!isUUID(merchantId)) throw new Error("Invalid Merchant ID format");

    return withRetry(async () => {
      // 1. Get aggregate totals for the period
      const stats = await prisma.payment.aggregate({
        where: {
          merchantId,
          status: "SUCCESS",
          createdAt: { gte: range.from, lte: range.to },
        },
        _sum: { amount: true },
        _count: { id: true },
      });

      // 2. Fetch daily points for chart visualization
      const dailyPayments = await prisma.payment.findMany({
        where: {
          merchantId,
          status: "SUCCESS",
          createdAt: { gte: range.from, lte: range.to },
        },
        select: { amount: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      });

      // Map to daily intervals using date-fns for robust timeline display
      const dailyData = this.mapToDailyIntervals(range, dailyPayments, "amount");

      return {
        total: stats._sum.amount?.toString() || "0.00",
        currency: "USD",
        dailyData,
        transactionCount: stats._count.id || 0,
      };
    }, "getRevenueAnalytics");
  }

  /**
   * 📈 USER GROWTH ANALYTICS
   */
  static async getSubscriberGrowth(merchantId: string, range: DateRange) {
    if (!isUUID(merchantId)) throw new Error("Invalid Merchant ID format");

    return withRetry(async () => {
      const subscriptions = await prisma.subscription.findMany({
        where: {
          merchantId,
          createdAt: { gte: range.from, lte: range.to },
        },
        select: { status: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      });

      const activeCount = await prisma.subscription.count({
        where: { merchantId, status: "ACTIVE" },
      });

      return {
        activeSubscribers: activeCount,
        dailyData: this.mapToDailyIntervals(range, subscriptions, "count"),
      };
    }, "getSubscriberGrowth");
  }

  /**
   * 🏆 TOP PERFORMING SERVICES
   */
  static async getTopServices(merchantId: string, limit = 5) {
    if (!isUUID(merchantId)) return [];

    return withRetry(async () => {
      const services = await prisma.service.findMany({
        where: { merchantId, isActive: true },
        include: {
          _count: {
            select: { subscriptions: { where: { status: "ACTIVE" } } },
          },
          payments: {
            where: { status: "SUCCESS" },
            select: { amount: true },
          },
        },
        take: limit,
      });

      return services.map((service) => ({
        id: service.id,
        name: service.name,
        activeSubscribers: service._count.subscriptions,
        totalRevenue: service.payments.reduce((sum, p) => {
          return sum + parseFloat(p.amount.toString());
        }, 0).toFixed(2),
      })).sort((a, b) => b.activeSubscribers - a.activeSubscribers);
    }, "getTopServices");
  }

  /**
   * 🛠️ INTERNAL HELPER: Time-Series Mapping
   * Ensures charts always have data points for every day in the range.
   */
  private static mapToDailyIntervals(
    range: DateRange, 
    items: any[], 
    type: "amount" | "count"
  ) {
    const days = eachDayOfInterval({ start: range.from, end: range.to });
    
    return days.map(day => {
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);
      const formattedDate = format(day, "MMM dd");

      const dayItems = items.filter(item => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= dayStart && itemDate <= dayEnd;
      });

      if (type === "amount") {
        const sum = dayItems.reduce((acc, i) => acc + parseFloat(i.amount.toString()), 0);
        return { date: formattedDate, amount: sum.toFixed(2) };
      } else {
        const count = dayItems.filter(i => i.status === "ACTIVE").length;
        const churned = dayItems.filter(i => i.status === "CANCELLED" || i.status === "EXPIRED").length;
        return { date: formattedDate, new: count, churned };
      }
    });
  }
}