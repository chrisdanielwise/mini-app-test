"use server";

import prisma from "@/src/lib/db";
import { revalidatePath } from "next/cache";
import { requireMerchantSession } from "@/src/lib/auth/merchant-auth";

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