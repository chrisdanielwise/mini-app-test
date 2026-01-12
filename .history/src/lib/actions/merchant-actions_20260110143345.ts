"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireMerchantSession } from "@/lib/auth/merchant-session";

export async function updateMerchantSettingsAction(data: any) {
  const session = await requireMerchantSession();

  try {
    await prisma.merchant.update({
      where: { id: session.merchant.id },
      data: {
        companyName: data.companyName,
        supportEmail: data.supportEmail,
        // Add other settings fields here
      }
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    return { error: "Database Sync Failure" };
  }
}