"use server";

import { requireAuth } from "@/lib/auth/session";
import { updateMerchant } from "@/lib/services/merchant.service";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * 🛡️ PROTOCOL SCHEMA: Bot_Config_Validation
 * Strict validation of Telegram Bot tokens and usernames.
 */
const BotConfigSchema = z.object({
  botToken: z.string().min(10, "TOKEN_TOO_SHORT").max(100, "TOKEN_TOO_LONG"),
  botUsername: z.string().min(3).max(32),
});

/**
 * 🌊 UPDATE_BOT_CONFIG_ACTION (v16.16.12)
 * Logic: Authorized session-to-service mapping with cache revalidation.
 * Security: Zod-validation with atomic database persistence.
 */
export async function updateBotConfigAction(formData: FormData) {
  try {
    // 1. IDENTITY HANDSHAKE
    // Verification is performed at the server edge before processing data.
    const session = await requireAuth();

    if (!session.merchantId) {
      return { success: false, error: "UNAUTHORIZED_ACCESS" };
    }

    // 2. PAYLOAD CALIBRATION
    const rawData = {
      botToken: formData.get("botToken") as string,
      botUsername: formData.get("botUsername") as string,
    };

    const validatedData = BotConfigSchema.safeParse(rawData);

    if (!validatedData.success) {
      return { 
        success: false, 
        error: "VALIDATION_FAILED", 
        issues: validatedData.error.flatten() 
      };
    }

    // 3. DATABASE_PERSISTENCE
    // Strip '@' and trim whitespace to ensure clean protocol routing.
    await updateMerchant(session.merchantId, {
      botToken: validatedData.data.botToken.trim(),
      botUsername: validatedData.data.botUsername.replace("@", "").trim(),
      updatedAt: new Date().toISOString(),
    });

    // 4. CACHE_REVALIDATION (Water Design Flow)
    // Synchronize the dashboard and settings views across the mesh.
    revalidatePath("/dashboard", "layout");
    revalidatePath("/settings");

    return { 
      success: true, 
      message: "CONFIGURATION_PROVISIONED_SUCCESSFULLY" 
    };

  } catch (error: any) {
    console.error("🚨 [Protocol_Error] Bot_Config_Update_Failed:", error);
    return { 
      success: false, 
      error: "INTERNAL_SERVER_ERROR", 
      message: error.message 
    };
  }
}