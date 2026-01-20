// import { telegramBot } from "@/lib/bot/instance";
import { NextResponse } from "next/server";

/**
 * 🛰️ BOT_SETUP_PROTOCOL
 * Logic: Programmatically registers the Webhook and Secret Token with Telegram.
 */
export async function GET() {
  // 1. Resolve Environment Nodes
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
  const webhookUrl = `https://${appUrl}/api/bot`;
  const secretToken = process.env.BOT_SECRET_TOKEN;

  if (!appUrl || !secretToken) {
    return NextResponse.json({ 
      error: "MISSING_CONFIG", 
      details: "Ensure APP_URL and BOT_SECRET_TOKEN are in Vercel Env Vars." 
    }, { status: 500 });
  }

  try {
    // 🏁 ATOMIC REGISTRATION
    // GrammY (or any bot lib) provides a native method to hit the 'setWebhook' API
    await telegramBot.api.setWebhook(webhookUrl, {
      secret_token: secretToken,
      drop_pending_updates: true, // Optional: Clears old messages so you start fresh
    });

    return NextResponse.json({
      success: true,
      message: "PROMOTION_NODE_REGISTERED",
      webhook: webhookUrl
    });
  } catch (error: any) {
    console.error("🔥 [Webhook_Setup_Failure]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}