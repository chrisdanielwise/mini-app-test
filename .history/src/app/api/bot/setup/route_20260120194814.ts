import { telegramBot } from "@/lib/telegram/bot";
import { NextResponse } from "next/server";

/**
 * 🛰️ BOT_SETUP_PROTOCOL
 * Logic: Programmatically registers the Webhook and Secret Token with Telegram.
 * Trigger: Visit https://<your-domain>/api/bot/setup once after deployment.
 */
export async function GET() {
  // 1. Resolve Environment Nodes
  const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
  const secretToken = process.env.BOT_SECRET_TOKEN;

  // 🛡️ CLEANING PROTOCOL: Remove 'https://' if it exists to prevent double-prefixing
  const appUrl = rawAppUrl?.replace(/^https?:\/\//, "");
  const webhookUrl = `https://${appUrl}/api/bot`;

  if (!appUrl || !secretToken) {
    console.log("🛠️ SETUP_DIAGNOSTICS:", {
      APP_URL_DETECTED: !!process.env.NEXT_PUBLIC_APP_URL,
      VERCEL_URL_DETECTED: !!process.env.VERCEL_URL,
      SECRET_TOKEN_DETECTED: !!process.env.BOT_SECRET_TOKEN,
      NODE_ENV: process.env.NODE_ENV,
    });
    return NextResponse.json(
      {
        error: "MISSING_CONFIG",
        details:
          "Ensure NEXT_PUBLIC_APP_URL and BOT_SECRET_TOKEN are in Vercel Env Vars.",
      },
      { status: 500 },
    );
  }

  try {
    // 🏁 ATOMIC REGISTRATION
    // Informs Telegram where to send updates and sets a security handshake token.
    await telegramBot.api.setWebhook(webhookUrl, {
      secret_token: secretToken,
      drop_pending_updates: true, // Clears the queue of old messages
      allowed_updates: ["message", "callback_query", "my_chat_member"], // Explicit optimization
    });

    return NextResponse.json({
      success: true,
      message: "PROMOTION_NODE_REGISTERED",
      webhook: webhookUrl,
      config: {
        domain: appUrl,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("🔥 [Webhook_Setup_Failure]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        hint: "Check if your BOT_TOKEN is valid.",
      },
      { status: 500 },
    );
  }
}
