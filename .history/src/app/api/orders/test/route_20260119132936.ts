import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req: Request) {
  // ✅ FIX: Await the headers() call for Next.js 15 compliance
  const headerList = await headers();
  const authHeader = headerList.get("authorization");
  
  const body = await req.json();

  console.log("[API Test] Received POST with Auth:", authHeader);
  console.log("[API Test] Payload:", body);

  // Simulate a 401 for testing purposes if a specific flag is sent
  if (body.simulateError === "401") {
    return NextResponse.json(
      { success: false, message: "Manual test unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      orderId: "ORD-" + Math.random().toString(36).substring(2, 11).toUpperCase(),
      status: "PENDING_PAYMENT",
      receivedPayload: body
    }
  });
}