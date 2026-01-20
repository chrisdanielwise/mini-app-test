import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { isUUID } from "@/lib/utils/validators";
import { PaymentStatus, Prisma } from "@/generated/prisma";
// ✅ INSTITUTIONAL INGRESS: Using strictly UPPERCASE Prisma Enums
// import { PaymentStatus, Prisma } from "@prisma/client";

/**
 * 💳 CHECKOUT_GATEWAY_API (Institutional v2026.1.20)
 * Logic: Telegram Invoice Generation + Atomic Ledger Initialization.
 * Standard: Precision math for institutional-grade financial clearing.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tierId, merchantId } = body;

    // 🛡️ 1. IDENTITY HANDSHAKE
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication Required" },
        { status: 401 }
      );
    }

    // 2. DATA AUDIT
    if (!isUUID(tierId) || !isUUID(merchantId)) {
      return NextResponse.json(
        { error: "Invalid Node Identity Format" },
        { status: 400 }
      );
    }

    // 🔍 FETCH TIER DATA (With Merchant Cross-Check)
    const tier = await prisma.serviceTier.findUnique({
      where: { id: tierId },
      include: { service: true },
    });

    // 🛡️ SECURITY GATE: Ensure the tier actually belongs to the merchant node
    if (!tier || tier.service.merchantId !== merchantId) {
      return NextResponse.json(
        { error: "Security Fault: Tenant Mismatch" },
        { status: 403 }
      );
    }

    // 3. APEX PRECISION MATH (Cents for Telegram API)
    // tier.price is a Prisma.Decimal; converting to cents for Gateway compatibility
    const priceValue = Number(tier.price);
    const amountInCents = Math.round(priceValue * 100);

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const providerToken = process.env.PAYMENT_PROVIDER_TOKEN;

    // 4. PAYLOAD CONSTRUCTION (Strict 2026 Serializing)
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
      provider_token: providerToken || "", // Empty for Telegram Stars
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
      console.error("🔥 [Gateway_Reject]:", result.description);
      return NextResponse.json(
        { error: "Gateway Rejection", details: result.description },
        { status: 502 }
      );
    }

    // 6. LEDGER INITIALIZATION (Atomic Pending Entry)
    const payment = await prisma.payment.create({
      data: {
        amount: tier.price, // Prisma Decimal handles this directly
        // ✅ FIX: Using strictly UPPERCASE PaymentStatus enum member
        status: PaymentStatus.PENDING,
        userId: session.user.id,
        merchantId: merchantId,
        serviceId: tier.service.id,
        serviceTierId: tier.id,
        currency: "USD",
        gatewayProvider: providerToken ? "STRIPE" : "TELEGRAM_STARS",
        gatewayReference: `INV_${Math.random()
          .toString(36)
          .substring(7)
          .toUpperCase()}`,
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
    return NextResponse.json(
      { error: "Internal Protocol Error" },
      { status: 500 }
    );
  }
}
