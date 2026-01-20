import { handleUpdate } from "@/lib/telegram/bot";
import { NextResponse } from "next/server";

/**
 * 🛰️ BOT_INGRESS_ROUTE
 * Strategy: Serverless Webhook Ingress with Secret Handshake.
 * Logic: Validates Telegram signature before waking the GrammY engine.
 */
export async function POST(req: Request) {
  try {
    // 🛡️ SECURITY HANDSHAKE
    // Telegram sends the secret_token in this specific header.
    const secretToken = req.headers.get("X-Telegram-Bot-Api-Secret-Token");
    
    if (secretToken !== process.env.BOT_SECRET_TOKEN) {
      console.warn("⚠️ [Security_Violation]: Unauthorized ingress attempt blocked.");
      return NextResponse.json({ error: "UNAUTHORIZED_IDENTITY" }, { status: 403 });
    }

    // 📦 DATA EXTRACTION
    const body = await req.json();
    
    // 🌊 WAKE_BOT_ENGINE
    // Pass the standard Request body to the GrammY webhookCallback.
    // Note: Since handleUpdate is likely a GrammY webhookCallback, 
    // we pass 'body' or the 'req' depending on your instance setup.
    await handleUpdate(body);
    
    return NextResponse.json({ status: "OK", node: "INGRESS_STABLE" });
  } catch (error: any) {
    console.error("🔥 [Bot_Ingress_Failure]:", error.message);
    
    // Always return a 200 or 500 quickly so Telegram doesn't keep retrying 
    // and hitting your Vercel usage limits.
    return NextResponse.json(
      { error: "INTERNAL_NODE_FAULT", detail: error.message }, 
      { status: 500 }
    );
  }
}

// ⚙️ VERCEL_OPTIMIZATION
// Ensures this route is never cached and always runs fresh serverless logic.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";