import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    // 1. Validate the token from the URL against your .env
    const { token } = await params;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (token !== botToken) {
      console.error("[Webhook] Unauthorized token attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse the update from Telegram
    const update = await request.json();
    console.log("[Webhook] Received Update:", JSON.stringify(update, null, 2));

    // 3. Handle simple /start command
    if (update.message?.text === "/start") {
      const chatId = update.message.chat.id;
      
      // Send a welcome message back via Telegram Bot API
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "🚀 *Zipha Bot Online*\n\nYour server is successfully connected to Telegram. You can now launch the Merchant Dashboard.",
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "Open Dashboard", web_app: { url: process.env.NEXT_PUBLIC_APP_URL || "" } }]
            ]
          }
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Webhook Error]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}