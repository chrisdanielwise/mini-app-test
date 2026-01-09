import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    // 1. Log the incoming request for absolute certainty
    const update = await request.json();
    console.log("📥 NEW UPDATE:", JSON.stringify(update, null, 2));

    if (token !== botToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Only respond to actual messages
    if (update.message?.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text;

      console.log(`💬 Processing message: "${text}" from Chat ID: ${chatId}`);

      // 3. Attempt to send the reply
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "✅ *Server Linked!*\n\nI received your message. Your webhook is working perfectly.",
          parse_mode: "Markdown",
        }),
      });

      const result = await response.json();

      // 4. Log the result of the Telegram API call
      if (!result.ok) {
        console.error("❌ Telegram API Error:", result.description);
      } else {
        console.log("📤 Reply sent successfully!");
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("🔥 Webhook Crash:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
