import { NextResponse } from "next/server";
import { MerchantService } from "@/lib/services/merchant.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const telegramId = searchParams.get("telegramId");

  if (!telegramId) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  // Use the service we fixed to get the GreysuitFx UUID
  const merchant = await MerchantService.getByAdminTelegramId(BigInt(telegramId));

  return NextResponse.json({ 
    merchantId: merchant?.id || null 
  });
}