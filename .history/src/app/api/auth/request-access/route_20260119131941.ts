import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth.service";
import { telegramBot } from "@/lib/telegram/bot"; // Your bot instance

export async function POST(request: Request) {
  const user = await getUserFromRequest(request as any);
  
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  // 🛰️ LOGIC: Notify Super Admin Group
  const message = `
🚨 *ACCESS REQUEST DETECTED*
----------------------------
👤 *User:* ${user.fullName} (@${user.username})
🆔 *Node:* \`${user.id}\`
🎯 *Action:* Clearance Upgrade Requested
----------------------------
Check Terminal Logs to approve.
  `;

  try {
    // Send to your Admin Chat ID
    await telegramBot.api.sendMessage(process.env.ADMIN_CHAT_ID!, message, { parse_mode: 'Markdown' });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "DISPATCH_FAILED" }, { status: 500 });
  }
}