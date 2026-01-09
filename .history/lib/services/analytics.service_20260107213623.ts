import prisma from "@/lib/db"

export interface DateRange {
  from: Date
  to: Date
}

export class AnalyticsService {
  /**
   * Get revenue analytics for a merchant
   */
  static async getRevenueAnalytics(merchantId: string, range: DateRange) {
    const payments = await prisma.payment.findMany({
      where: {
        merchantId,
        status: "SUCCESS",
        createdAt: {
          gte: range.from,
          lte: range.to,
        },
      },
      select: {
        amount: true,
        currency: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    })

    // Group by day
    const dailyRevenue = new Map<string, number>()
    let totalRevenue = 0

    payments.forEach((payment) => {
      const date = payment.createdAt.toISOString().split("T")[0]
      const amount = Number(payment.amount)
      dailyRevenue.set(date, (dailyRevenue.get(date) || 0) + amount)
      totalRevenue += amount
    })

    return {
      total: totalRevenue,
      currency: "USD",
      dailyData: Array.from(dailyRevenue.entries()).map(([date, amount]) => ({
        date,
        amount,
      })),
      transactionCount: payments.length,
    }
  }

  /**
   * Get subscriber growth analytics
   */
  static async getSubscriberGrowth(merchantId: string, range: DateRange) {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        merchantId,
        createdAt: {
          gte: range.from,
          lte: range.to,
        },
      },
      select: {
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    })

    // Group by day
    const dailyGrowth = new Map<string, { new: number; churned: number }>()

    subscriptions.forEach((sub) => {
      const date = sub.createdAt.toISOString().split("T")[0]
      const current = dailyGrowth.get(date) || { new: 0, churned: 0 }
      if (sub.status === "ACTIVE") {
        current.new++
      } else if (sub.status === "CANCELLED" || sub.status === "EXPIRED") {
        current.churned++
      }
      dailyGrowth.set(date, current)
    })

    const activeCount = await prisma.subscription.count({
      where: { merchantId, status: "ACTIVE" },
    })

    return {
      activeSubscribers: activeCount,
      dailyData: Array.from(dailyGrowth.entries()).map(([date, data]) => ({
        date,
        ...data,
      })),
    }
  }

  /**
   * Get top performing services
   */
  static async getTopServices(merchantId: string, limit = 5) {
    const services = await prisma.service.findMany({
      where: { merchantId, isActive: true },
      include: {
        _count: {
          select: {
            subscriptions: { where: { status: "ACTIVE" } },
          },
        },
        payments: {
          where: { status: "SUCCESS" },
          select: { amount: true },
        },
      },
      orderBy: {
        subscriptions: { _count: "desc" },
      },
      take: limit,
    })

    return services.map((service) => ({
      id: service.id,
      name: service.name,
      activeSubscribers: service._count.subscriptions,
      totalRevenue: service.payments.reduce((sum, p) => sum + Number(p.amount), 0),
    }))
  }

  /**
   * Get daily metrics snapshot
   */
  static async recordDailyMetrics(merchantId: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [newSubscribers, churned, revenue, activeEnd] = await Promise.all([
      prisma.subscription.count({
        where: {
          merchantId,
          createdAt: { gte: today },
        },
      }),
      prisma.subscription.count({
        where: {
          merchantId,
          status: { in: ["CANCELLED", "EXPIRED"] },
          updatedAt: { gte: today },
        },
      }),
      prisma.payment.aggregate({
        where: {
          merchantId,
          status: "SUCCESS",
          createdAt: { gte: today },
        },
        _sum: { amount: true },
      }),
      prisma.subscription.count({
        where: { merchantId, status: "ACTIVE" },
      }),
    ])

    return prisma.merchantDailyMetric.upsert({
      where: {
        merchantId_date: {
          merchantId,
          date: today,
        },
      },
      create: {
        merchantId,
        date: today,
        newSubscribers,
        churnedSubscribers: churned,
        revenue: revenue._sum.amount || 0,
        activeSubscribersEnd: activeEnd,
        activeSubscribersStart: activeEnd - newSubscribers + churned,
      },
      update: {
        newSubscribers,
        churnedSubscribers: churned,
        revenue: revenue._sum.amount || 0,
        activeSubscribersEnd: activeEnd,
      },
    })
  }
}
