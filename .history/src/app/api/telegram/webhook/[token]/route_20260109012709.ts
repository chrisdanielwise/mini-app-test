import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (token !== botToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 200 });
    }

    /**
     * 🏁 1. DYNAMIC ORIGIN DETECTION
     * We reconstruct the active URL from headers. 
     * This ensures the bot always uses the current Ngrok tunnel.
     */
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const currentActiveUrl = `${protocol}://${host}`;

    const update = await request.json();
    const message = update.message;

    if (message?.text === "/start") {
      const chatId = message.chat.id;
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

      // 🚀 2. USE THE DETECTED URL
      // We use currentActiveUrl instead of process.env.NEXT_PUBLIC_APP_URL
      await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🚀 *Zipha Server Connected!*\n\nYour webhook is officially online at: ${currentActiveUrl}`,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Open Dashboard",
                  web_app: { url: currentActiveUrl },
                },
              ],
            ],
          },
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("🔥 Webhook Handler Error:", error);
    return NextResponse.json({ success: true });
  }
}