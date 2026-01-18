"use server";

import { requireAuth } from "@/lib/auth/session";
import { updateMerchant } from "@/lib/services/merchant.service";
import { revalidateTag } from "next/cache";
import { CACHE_PROFILES } from "@/lib/auth/config";
import { z } from "zod";

/**
 * 🛡️ PROTOCOL SCHEMA: Bot_Config_Validation
 */
const BotConfigSchema = z.object({
  botToken: z.string().min(10, "TOKEN_TOO_SHORT").max(100, "TOKEN_TOO_LONG"),
  botUsername: z.string().min(3).max(32),
});

/**
 * 🌊 UPDATE_BOT_CONFIG_ACTION (v16.16.20 - Hardened)
 * Logic: Authorized session-to-service mapping with tagged revalidation.
 * Fix: Replaced revalidatePath with revalidateTag(profile) for 2026 standards.
 */
export async function updateBotConfigAction(formData: FormData) {
  try {
    // 1. IDENTITY HANDSHAKE
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
        errors: validatedData.error.flatten().fieldErrors 
      };
    }

    // 3. DATABASE_PERSISTENCE
    await updateMerchant(session.merchantId, {
      botToken: validatedData.data.botToken.trim(),
      botUsername: validatedData.data.botUsername.replace("@", "").trim(),
    });

    // 4. ATOMIC CACHE REVALIDATION
    // Fix: Using the SYSTEM profile ("config") to ensure the whole dashboard 
    // knows the bot identity has changed.
    revalidateTag("config_node", CACHE_PROFILES.SYSTEM);

    return { 
      success: true, 
      message: "CONFIGURATION_PROVISIONED_SUCCESSFULLY" 
    };

  } catch (error: any) {
    console.error("🚨 [Protocol_Error] Bot_Config_Update_Failed:", error);
    return { 
      success: false, 
      error: "INTERNAL_SERVER_ERROR" 
    };
  }
}