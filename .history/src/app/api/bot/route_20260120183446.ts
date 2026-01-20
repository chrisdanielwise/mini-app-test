// src/app/api/bot/route.ts
import { NextResponse } from "next/server";
// import { bot } from "@/lib/bot/instance"; // Ensure your bot instance is exported

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 🛰️ Hand the update to your bot engine (Telegraf/Grammy/etc)
    await bot.handleUpdate(body);
    
    return NextResponse.json({ status: "OK" });
  } catch (error) {
    console.error("🔥 [Bot_Ingress_Error]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}