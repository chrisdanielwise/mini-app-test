import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { isUUID } from "@/lib/utils/validators";
import { PaymentStatus, Prisma } from "@/generated/prisma";

/**
 * 💳 CHECKOUT_GATEWAY_API (Institutional v2026.1.20)
 * Fix: Handled potential missing metadata property by ensuring strict type alignment.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tierId, merchantId } = body;

    // 🛡️ 1. IDENTITY HANDSHAKE
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication Required" }, { status: 401 });
    }

    // 2. DATA AUDIT
    if (!isUUID(tierId) || !isUUID(merchantId)) {
      return NextResponse.json({ error: "Invalid Node Identity Format" }, { status: 400 });
    }

    const tier = await prisma.serviceTier.findUnique({
      where: { id: tierId },
      include: { service: true },
    });

    if (!tier || tier.service.merchantId !== merchantId) {
      return NextResponse.json({ error: "Security Fault: Tenant Mismatch" }, { status: 403 });
    }

    // 3. APEX PRECISION MATH
    const priceValue = Number(tier.price);
    const amountInCents = Math.round(priceValue * 100);

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const providerToken = process.env.PAYMENT_PROVIDER_TOKEN;

    // 4. PAYLOAD CONSTRUCTION
    const invoicePayload = {
      title: tier.service.name,
      description: `${tier.name} Access Plan`,
      payload: JSON.stringify({
        userId: session.user.id,
        tierId: tier.id,
        merchantId: merchantId,
        serviceId: tier.service.id,
        type: "SUBSCRIPTION_PURCHASE",
      }),
      provider_token: providerToken || "",
      currency: "USD",
      prices: [{ label: tier.name, amount: amountInCents }],
      start_parameter: `pay_${tier.id.slice(0, 8)}`,
    };

    // 5. TELEGRAM GATEWAY HANDSHAKE
    const tgResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/createInvoiceLink`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoicePayload),
      }
    );

    const result = await tgResponse.json();
    if (!result.ok) {
      return NextResponse.json({ error: "Gateway Rejection", details: result.description }, { status: 502 });
    }

    // 6. LEDGER INITIALIZATION
    // ✅ FIX: If metadata still causes an error after schema update, 
    // ensure you have run 'npx prisma generate'
    const payment = await prisma.payment.create({
      data: {
        amount: tier.price,
        status: PaymentStatus.PENDING,
        userId: session.user.id,
        merchantId: merchantId,
        serviceId: tier.service.id,
        serviceTierId: tier.id,
        currency: "USD",
        gatewayProvider: providerToken ? "STRIPE" : "TELEGRAM_STARS",
        gatewayReference: `INV_${Math.random().toString(36).substring(7).toUpperCase()}`,
        // Note: 'metadata' must exist in schema.prisma for this to work
        metadata: {
          version: "v14.43.0",
          hapticTriggered: true,
          ingress: "TMA_2026",
        } as Prisma.JsonObject, 
      },
    });

    return NextResponse.json({
      success: true,
      invoiceUrl: result.result,
      paymentId: payment.id,
    });
  } catch (error: any) {
    console.error("🔥 [Checkout_Failure]:", error.message);
    return NextResponse.json({ error: "Internal Protocol Error" }, { status: 500 });
  }
}