import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  // 🛰️ Calling your REAL production session resolver
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ 
      status: "FAILED", 
      reason: "Cookie was not found or JWT failed to decrypt." 
    });
  }

  return NextResponse.json({
    status: "SUCCESS",
    session_data: session
  });
}