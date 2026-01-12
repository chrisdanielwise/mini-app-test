import { NextResponse } from "next/server"

export async function GET() {
  // Mock data representing a Prisma result
  const mockData = {
    success: true,
    data: {
      telegramId: "1234567890123456789", // BigInt as String
      availableBalance: "1550.50",       // Decimal as String
      role: "MERCHANT",
      fullName: "Zipha Test Merchant"
    }
  }

  return NextResponse.json(mockData)
}