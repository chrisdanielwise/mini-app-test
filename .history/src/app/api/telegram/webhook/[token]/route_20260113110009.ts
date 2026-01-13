import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { completePayment } from "@/lib/services/payment.service";
import { AuthService } from "@/lib/services/auth.service"; 
import { JWT_CONFIG } from "@/lib/auth/config";

/**
 * 🚀 GLOBAL BIGINT PATCH
 * Essential for Next.js 16 / Prisma BigInt compatibility.
 * Prevents "Do not know how to serialize a BigInt" crashes during JSON serialization.
 */
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

/**
 * 🛰️ TELEGRAM WEBHOOK HANDLER (Institutional v13.9.40)
 * Logic: Role-Based Routing with Hardware Diagnostics & Safe Variable Mapping.
 */

    /**
     * 🛠️ COMMAND: /status (Hardware Diagnostics)
     * Logic: Verifies DB connectivity and server latency.
     */
    if (text === "/status") {
      const startTime = Date.now();
      const dbStatus = await prisma.$queryRaw`SELECT 1`.then(() => "ONLINE").catch(() => "OFFLINE");
      const latency = Date.now() - startTime;

      await telegramFetch("sendMessage", botToken, {
        chat_id: chatId,
        text: `🖥️ *SYSTEM ARCHITECTURE STATUS*\n\n` +
              `*Database:* ${dbStatus === "ONLINE" ? "🟢" : "🔴"} ${dbStatus}\n` +
              `*Latency:* ⚡ ${latency}ms\n` +
              `*Environment:* 🏗️ ${process.env.NODE_ENV || 'production'}\n` +
              `*Handshake Node:* ✅ ACTIVE`,
        parse_mode: "Markdown",
      });
      return NextResponse.json({ ok: true });
    }

   
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("🔥 [Webhook_Fault]:", error.message);
    return NextResponse.json({ ok: true });
  }
}

/**
 * 🛰️ INTERNAL TELEGRAM FETCH UTILITY
 */
async function telegramFetch(endpoint: string, botToken: string, body: object) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); 

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    return response;
  } catch (err: any) {
    console.error(`🔥 [Telegram_API_Error] ${endpoint}:`, err.message);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}