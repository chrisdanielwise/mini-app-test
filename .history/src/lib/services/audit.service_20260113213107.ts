import prisma from "@/lib/db";
import { JWT_CONFIG } from "../auth/config";

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
  /**
   * 🛰️ IDENTITY EXTRACTION
   * Logic: Resolves a User object from the current request session cookie.
   */
  async getUserFromRequest(request: NextRequest) {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get(JWT_CONFIG.cookieName)?.value;

      if (!token) return null;

      const { payload } = await jose.jwtVerify(
        token,
        new TextEncoder().encode(JWT_CONFIG.secret as string)
      );

      // Return the user payload stored in the JWT
      return payload.user as any; 
    } catch (error) {
      console.error("🔐 [AuthService_Error]: Session resolution failed.");
      return null;
    }
  },
};