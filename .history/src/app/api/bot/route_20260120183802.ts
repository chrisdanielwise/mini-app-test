// src/app/api/bot/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 🛰️ Hand the update to your bot engine (Telegraf/Grammy/etc)
    await telegramBot.handleUpdate(body);
    
    return NextResponse.json({ status: "OK" });
  } catch (error) {
    console.error("🔥 [Bot_Ingress_Error]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}