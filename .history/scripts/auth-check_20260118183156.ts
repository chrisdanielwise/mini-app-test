import { validateTelegramInitData, createJWT, verifyJWT } from "@/lib/auth/telegram";
import { AuthService } from "@/lib/services/auth.service";
import prisma from "@/lib/db";

async function runSmokeTest() {
  console.log("🚀 [System_Audit] Starting Institutional Auth Health Check...");

  // 1. Verify Environment
  if (!process.env.JWT_SECRET || !process.env.TELEGRAM_BOT_TOKEN) {
    console.error("❌ [Audit_Fail] Missing Environment Variables.");
    return;
  // }
  console.log("✅ [Audit_Pass] Environment Variables Found.");

  // 2. Test JWT Signing & Standardized 'sub'
  const mockUser = { userId: "test-uuid-123", telegramId: "987654321", role: "admin", isStaff: true };
  const token = await createJWT(mockUser);
  const payload = await verifyJWT(token);

  if (payload?.sub === "test-uuid-123") {
    console.log("✅ [Audit_Pass] JWT Cryptography & 'sub' Claim Standardized.");
  } else {
    console.error("❌ [Audit_Fail] JWT Payload Mismatch.");
  }

  // 3. Test Database MagicToken Association
  try {
    const testUser = await prisma.user.findFirst();
    if (testUser) {
      const magicToken = await AuthService.generateMagicToken(testUser.telegramId.toString());
      if (magicToken) {
        console.log(`✅ [Audit_Pass] MagicToken Table linked to User ${testUser.id}.`);
        
        // Cleanup the test token
        await prisma.magicToken.delete({ where: { token: magicToken } });
      }
    } else {
      console.warn("⚠️ [Audit_Skipped] No user found in DB to test MagicLink association.");
    }
  } catch (err) {
    console.error("❌ [Audit_Fail] Database Relation Error:", err);
  }

  console.log("🏁 [System_Audit] Health Check Complete.");
}

runSmokeTest();