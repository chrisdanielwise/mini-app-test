import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth/session"; // 🚀 UPDATED: Universal Resolver
import { isUUID } from "@/lib/utils/validators";
// import { Decimal } from "@prisma/client/runtime-library";

/**
 * 💳 PAYMENT PROTOCOL: CHECKOUT (Institutional v9.0.1)
 * Logic: Generates a native Telegram Invoice Link and initializes the Ledger Node.
 * Optimized: Supports Telegram Stars (Empty Provider Token) and Multi-Currency.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tierId, merchantId } = body;

    // 🛡️ 1. IDENTITY & SESSION HANDSHAKE
    // Re-verifies session via the hardened, polymorphic resolver
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication Required" }, { status: 401 });
    }

    // 2. DATA AUDIT: UUID Validation
    if (!isUUID(tierId) || !isUUID(merchantId)) {
      return NextResponse.json({ error: "Invalid Node Identity Format" }, { status: 400 });
    }

    // 🔍 FETCH TIER DATA
    const tier = await prisma.serviceTier.findUnique({
      where: { id: tierId },
      include: { service: true },
    });

    if (!tier) {
      return NextResponse.json({ error: "Service Tier not found in Ledger" }, { status: 404 });
    }

    // 3. APEX PRECISION MATH
    // Telegram requires prices in the smallest unit (e.g., $1.00 = 100)
    const priceValue = new Decimal(tier.price.toString());
    const amountInCents = Math.round(priceValue.mul(100).toNumber());
    
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const providerToken = process.env.PAYMENT_PROVIDER_TOKEN; // ⭐️ Leave empty for Telegram Stars

    // 4. PAYLOAD CONSTRUCTION
    // Data is serialized for the Telegram Ingress
    const invoicePayload = {
      title: tier.service.name,
      description: `${tier.name} Plan - Automated Access`,
      payload: JSON.stringify({
        userId: session.user.id,
        tierId: tier.id,
        merchantId: merchantId,
        type: "SUBSCRIPTION_PURCHASE"
      }),
      provider_token: providerToken || "", // 🚀 Support for Telegram Stars
      currency: "USD",
      prices: [
        { label: tier.name, amount: amountInCents }
      ],
      start_parameter: `pay_${tier.id.split('-')[0]}`,
    };

    // 5. TELEGRAM GATEWAY HANDSHAKE
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
      console.error("❌ Telegram Gateway Rejection:", result.description);
      return NextResponse.json({ 
        error: "Telegram Gateway Timeout", 
        details: result.description 
      }, { status: 502 });
    }

    // 6. LEDGER INITIALIZATION
    // Creating an ATOMIC PENDING record to track the ingress attempt.
    // We use the merchantId from the payload to ensure correct revenue routing.
    const payment = await prisma.payment.create({
      data: {
        amount: tier.price,
        status: "PENDING",
        userId: session.user.id,
        merchantId: merchantId,
        serviceId: tier.service.id,
        serviceTierId: tier.id,
        currency: "USD",
        gatewayReference: `INV_${Math.random().toString(36).substring(7).toUpperCase()}`,
        metadata: { 
          tierId: tier.id,
          initiatedBy: session.user.role,
          version: "v9.0.1"
        }
      }
    });

    // 🚀 7. SUCCESSFUL EGRESS
    return NextResponse.json({ 
      success: true,
      invoiceUrl: result.result,
      paymentId: payment.id,
      status: "HANDSHAKE_COMPLETE"
    }, {
      headers: { "ngrok-skip-browser-warning": "true" }
    });

  } catch (error: any) {
    console.error("🔥 [Checkout_Node_Failure]:", error.message);
    return NextResponse.json(
      { error: "Protocol Error: Could not initialize payment pipeline" },
      { status: 500 }
    );
  }
}