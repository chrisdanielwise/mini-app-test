"use server"; // This directive must be at the very top

import { MerchantService } from "@/src/lib/services/merchant.service";
import { revalidatePath } from "next/cache";

export async function updateMerchantAction(formData: FormData, merchantId: string) {
  const companyName = formData.get("companyName") as string;
  const contactSupportUrl = formData.get("contactSupportUrl") as string;

  await MerchantService.update(merchantId, {
    companyName,
    contactSupportUrl,
  });

  revalidatePath("/dashboard/settings");
}