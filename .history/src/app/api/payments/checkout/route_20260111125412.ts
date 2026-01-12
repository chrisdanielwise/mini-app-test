import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getMerchantSession } from "@/lib/auth/session";
import { isUUID } from "@/lib/utils/validators";
import { Decimal } from "@prisma/client-runtime-library";

/**
 * 💳 PAYMENT PROTOCOL: CHECKOUT
 * Logic: Generates a native Telegram Invoice Link and initializes the Ledger Node.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tierId, merchantId } = body;

    // 🛡️ 1. IDENTITY & SESSION HANDSHAKE
    const session = await getMerchantSession();
    if (!session?.user?.userId) {
      return NextResponse.json({ error: "Authentication Required" }, { status: 401 });
    }

    // 2. DATA AUDIT: UUID Validation
    if (!isUUID(tierId) || !isUUID(merchantId)) {
      return NextResponse.json({ error: "Invalid Node Identity Format" }, { status: 400 });
    }

    const tier = await prisma.serviceTier.findUnique({
      where: { id: tierId },
      include: { service: true },
    });

    if (!tier) {
      return NextResponse.json({ error: "Service Tier not found in Ledger" }, { status: 404 });
    }

    // 3. APEX PRECISION MATH
    // Telegram requires prices in the smallest unit (e.g., $1.00 = 100)
    // Using Decimal.js logic to avoid floating point errors
    const priceValue = new Decimal(tier.price.toString());
    const amountInCents = Math.round(priceValue.mul(100).toNumber());
    
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const providerToken = process.env.PAYMENT_PROVIDER_TOKEN; 

    // 4. PAYLOAD CONSTRUCTION
    const invoicePayload = {
      title: tier.service.name,
      description: `${tier.name} Plan - Automated Access`,
      payload: JSON.stringify({
        userId: session.user.userId,
        tierId: tier.id,
        merchantId: merchantId,
        type: "SUBSCRIPTION_PURCHASE"
      }),
      provider_token: providerToken || "", // Empty if using Telegram Stars
      currency: "USD",
      prices: [
        { label: tier.name, amount: amountInCents }
      ],
      start_parameter: `pay_${tier.id.split('-')[0]}`,
    };

    // 5. TELEGRAM HANDSHAKE
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
      console.error("❌ Telegram API Rejection:", result);
      return NextResponse.json({ error: "Telegram Gateway Timeout" }, { status: 502 });
    }

    // 6. LEDGER INITIALIZATION
    // Creating a PENDING record to track the ingress attempt
    await prisma.payment.create({
      data: {
        amount: tier.price,
        status: "PENDING",
        userId: session.user.userId,
        merchantId: merchantId,
        serviceId: tier.service.id,
        serviceTierId: tier.id,
        currency: "USD",
        gatewayReference: `INV_${Math.random().toString(36).substring(7).toUpperCase()}`,
        metadata: { 
          tierId: tier.id,
          initiatedBy: session.user.role 
        }
      }
    });

    return NextResponse.json({ 
      invoiceUrl: result.result,
      status: "HANDSHAKE_COMPLETE"
    });

  } catch (error: any) {
    console.error("🔥 [Checkout_Node_Failure]:", error.message);
    return NextResponse.json(
      { error: "Protocol Error: Could not initialize payment pipeline" },
      { status: 500 }
    );
  }
}