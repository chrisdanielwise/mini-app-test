import * as jose from "jose";

/**
 * 🔍 HANDSHAKE DIAGNOSTIC SCRIPT
 * Run this to see exactly how your IDs and URLs are being generated.
 */
async function testHandshake() {
  const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "zipha_secure_secret_2026");
  
  // 1. Mock the inputs from your GreysuitFx Profile
  const mockMerchantId = "201414b8-b107-4b9b-9d4d-8d0296b1da6d";
  const mockTelegramId = "994858530";
  const mockNgrokOrigin = "https://your-tunnel.ngrok-free.app"; // 🏁 REPLACE WITH CURRENT NGROK URL

  console.log("--- 🏁 STARTING HANDSHAKE DIAGNOSTIC ---");
  console.log(`[Input] Merchant ID: ${mockMerchantId}`);
  console.log(`[Input] Telegram ID: ${mockTelegramId}`);
  console.log(`[Input] Ngrok Origin: ${mockNgrokOrigin}`);

  try {
    // 2. Simulate JWT Generation (What the Callback Route does)
    const token = await new jose.SignJWT({ 
      merchantId: mockMerchantId, 
      telegramId: mockTelegramId 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d') 
      .sign(SECRET);
    
    console.log(`\n[JWT] Successfully Generated Token: ${token.substring(0, 20)}...`);

    // 3. Simulate Redirect URL Construction
    const dashboardUrl = new URL("/dashboard", mockNgrokOrigin);
    console.log(`[URL] Constructed Redirect Destination: ${dashboardUrl.toString()}`);

    if (dashboardUrl.hostname === "localhost") {
      console.error("❌ FAILURE: The redirect is pointing to localhost! Your phone will never reach this.");
    } else {
      console.log("✅ SUCCESS: The redirect is pointing to the Ngrok tunnel.");
    }

    // 4. Simulate Middleware Verification
    try {
      const { payload } = await jose.jwtVerify(token, SECRET);
      console.log(`\n[Middleware] Payload verified. Found Merchant: ${payload.merchantId}`);
      console.log("✅ SUCCESS: Middleware will allow this session.");
    } catch (e) {
      console.error("❌ FAILURE: Middleware secret mismatch or token expiration issue.");
    }

  } catch (error) {
    console.error("❌ DIAGNOSTIC CRASH:", error);
  }
}

testHandshake();