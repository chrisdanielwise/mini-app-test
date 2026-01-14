import prisma from "@/lib/db";

export const AuditService = {
  async log(params: {
    userId: string;
    merchantId?: string;
    action: "LOGIN" | "LOGOUT" | "REMOTE_WIPE" | "MAGIC_LINK_ISSUE";
    metadata?: any;
    ip?: string;
  }) {
    try {
      return await prisma.activityLog.create({
        data: {
          actorId: params.userId,
          merchantId: params.merchantId || null,
          action: params.action,
          resource: "IDENTITY_NODE",
          metadata: params.metadata || {},
          ipAddress: params.ip || "0.0.0.0",
        },
      });
    } catch (err) {
      console.error("🔥 [Audit_Log_Failed]:", err);
    }
  },
};