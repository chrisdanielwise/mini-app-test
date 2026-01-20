
// import crypto from "crypto";
// import * as jose from "jose";

// /**
//  * 🛰️ AUTH AUDIT SUITE
//  * Purpose: Simulates a Telegram Handshake to find where the hash breaks.
//  */
// async function runAudit() {
//   console.log("🚀 STARTING ZIPHA AUTH AUDIT...");

//   // 1. CONFIG CHECK
//   const botToken = process.env.TELEGRAM_BOT_TOKEN;
//   const jwtSecret = process.env.JWT_SECRET;

//   if (!botToken || !jwtSecret) {
//     console.error("❌ ERROR: Missing .env variables.");
//     return;
//   }
//   console.log("✅ Env Variables: Detected");

//   // 2. MOCK TELEGRAM DATA (Simulating raw input)
//   // This user string is a common failure point for encoding loops
//   const mockUser = JSON.stringify({
//     id: 12345678,
//     first_name: "Test",
//     username: "test_user"
//   });
  
//   const authDate = Math.floor(Date.now() / 1000).toString();
//   const rawData = {
//     auth_date: authDate,
//     query_id: "AAHdF6IQAAAAAN0XohDhrOrc",
//     user: mockUser
//   };

//   // 3. GENERATE TEST HASH (Standard Telegram Protocol)
//   const dataCheckString = Object.keys(rawData)
//     .sort()
//     .map((key) => `${key}=${rawData[key as keyof typeof rawData]}`)
//     .join("\n");

//   const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
//   const validHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

//   console.log(`📡 Mock Data String:\n${dataCheckString.replace(/\n/g, '\\n')}`);
//   console.log(`🔐 Generated Test Hash: ${validHash}`);

//   // 4. TEST THE VERIFIER LOGIC
//   // This simulates what happens in your 'validateTelegramInitData'
//   const testInitData = `auth_date=${authDate}&query_id=AAHdF6IQAAAAAN0XohDhrOrc&user=${encodeURIComponent(mockUser)}&hash=${validHash}`;
  
//   console.log("\n🧪 TESTING VERIFIER INPUT...");
//   const params = new URLSearchParams(testInitData);
//   const receivedHash = params.get("hash");
//   params.delete("hash");

//   const checkString = Array.from(params.entries())
//     .sort(([a], [b]) => a.localeCompare(b))
//     .map(([key, value]) => `${key}=${value}`)
//     .join("\n");

//   const auditKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
//   const auditHash = crypto.createHmac("sha256", auditKey).update(checkString).digest("hex");

//   if (auditHash === receivedHash) {
//     console.log("✅ CRYPTO STABLE: Verifier logic matches Telegram protocol.");
//   } else {
//     console.error("🚨 CRYPTO BREAKDOWN: Encoding mismatch detected.");
//     console.log(`Expected: ${receivedHash}`);
//     console.log(`Actual:   ${auditHash}`);
//     console.log("💡 ROOT CAUSE: URLSearchParams is auto-decoding the 'user' JSON, breaking the HMAC.");
//   }

//   // 5. JWT ROUND-TRIP TEST
//   try {
//     const SECRET = new TextEncoder().encode(jwtSecret);
//     const token = await new jose.SignJWT({ sub: "test-uid", role: "merchant" })
//       .setProtectedHeader({ alg: "HS256" })
//       .setExpirationTime("1m")
//       .sign(SECRET);
    
//     await jose.jwtVerify(token, SECRET);
//     console.log("✅ JWT STABLE: Middleware won't reject valid tokens.");
//   } catch (e) {
//     console.error("🚨 JWT BREAKDOWN: Secret mismatch in signing process.");
//   }
// }

// runAudit();