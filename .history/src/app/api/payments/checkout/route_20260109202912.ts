import { NextResponse } from "next/server";
import prisma from "@/lib/db";

/**
 * 💳 PAYMENT PROTOCOL: CHECKOUT
 * Generates a native Telegram Invoice Link for a specific service tier.
 */
export async function POST(request: Request) {
  try {
    const { tierId, merchantId } = await request.json();

    // 1. DATA AUDIT: Fetch the Tier and the associated Service
    const tier = await prisma.serviceTier.findUnique({
      where: { id: tierId },
      include: { service: true },
    });

    if (!tier) {
      return NextResponse.json({ error: "Invalid Tier Identity" }, { status: 404 });
    }

    // 2. PAYLOAD CONSTRUCTION
    // Telegram requires prices in the smallest unit (e.g., $1.00 = 100)
    const amountInCents = Math.round(parseFloat(tier.price.toString()) * 100);
    
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const providerToken = process.env.PAYMENT_PROVIDER_TOKEN; // Stripe/Connect/Stars

    const invoicePayload = {
      title: tier.service.name,
      description: `${tier.name} Plan - Automated Access`,
      payload: JSON.stringify({
        tierId: tier.id,
        merchantId: merchantId,
        type: "SUBSCRIPTION_PURCHASE"
      }),
      provider_token: providerToken || "", // Empty for Telegram Stars
      currency: "USD",
      prices: [
        { label: tier.name, amount: amountInCents }
      ],
      start_parameter: `pay_${tier.id}`,
    };

    // 3. TELEGRAM HANDSHAKE
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/createInvoiceLink`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoicePayload),
      }
    );

    const result = await response.json();

    if (!result.ok) {
      console.error("Telegram API Rejection:", result);
      throw new Error("Failed to generate secure invoice link");
    }

    // 4. LEDGER INITIALIZATION: Create a pending payment record
    await prisma.payment.create({
      data: {
        amount: tier.price,
        status: "PENDING",
        userId: "session_user_id", // Replace with actual session logic
        serviceId: tier.service.id,
        metadata: { tierId: tier.id }
      }
    });

    return NextResponse.json({ invoiceUrl: result.result });

  } catch (error) {
    console.error("🔥 Checkout Node Failure:", error);
    return NextResponse.json(
      { error: "Payment Protocol Initialization Failed" },
      { status: 500 }
    );
  }
}