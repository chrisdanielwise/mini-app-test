import prisma from "@/lib/db";
import { JWT_CONFIG } from "../auth/config";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose"; // ✅ Fixed: Explicitly imported jose

/**
 * 🛡️ AUDIT & IDENTITY SERVICE
 * Logic: Handles security logging and cryptographic session resolution.
 */
export const AuditService = {
  /**
   * 📝 SECURITY AUDIT LOG
   * Records critical identity events into the database.
   */
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
   * Security: Uses the pre-encoded Uint8Array secret from JWT_CONFIG.
   */
  async getUserFromRequest(request: NextRequest) {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get(JWT_CONFIG.cookieName)?.value;

      if (!token) return null;

      // ✅ Fixed: Using the pre-encoded JWT_CONFIG.secret directly. 
      // This solves the: "Argument of type 'Uint8Array' is not assignable to type 'string'" error.
      const { payload } = await jose.jwtVerify(
        token,
        JWT_CONFIG.secret
      );

      // Return the user payload stored in the JWT
      return payload.user as any; 
    } catch (error) {
      console.error("🔐 [AuditService_Error]: Session resolution failed or token expired.");
      return null;
    }
  },
};