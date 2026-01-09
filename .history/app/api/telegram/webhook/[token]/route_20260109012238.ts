import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    // 1. Await params (Required in Next.js 15)
    const { token } = await params;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    // 2. Validate token security
    if (token !== botToken) {
      console.warn("⚠️ Unauthorized token attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 200 }); // Still return 200 to stop Telegram retries
    }

    // 3. Parse incoming update
    const update = await request.json();
    const message = update.message;

    if (message?.text === "/start") {
      const chatId = message.chat.id;

      // 4. Send response to Telegram API
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

      const response = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "🚀 *Zipha Server Connected!*\n\nYour webhook is officially online. You can now launch the Merchant Dashboard."+process.env.NEXT_PUBLIC_APP_URL,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Open Dashboard",
                  web_app: { url: process.env.NEXT_PUBLIC_APP_URL },
                },
              ],
            ],
          },
        }),
      });

      const result = await response.json();
      if (!result.ok) {
        console.error("❌ Telegram API Error:", result.description);
      }
    }

    // Always return 200 OK so Telegram stops resending the same message
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("🔥 Webhook Handler Error:", error);
    return NextResponse.json({ success: true }); // Still return 200 to avoid retry loops
  }
}