import crypto from "crypto";

export function verifyTelegramHash(data: any, botToken: string) {
  const { hash, ...dataCheck } = data;
  
  // 1. Sort keys alphabetically
  const keys = Object.keys(dataCheck).sort();
  const dataCheckString = keys
    .map((key) => `${key}=${dataCheck[key]}`)
    .join("\n");

  // 2. Create Secret Key from Bot Token
  const secretKey = crypto
    .createHash("sha256")
    .update(botToken)
    .digest();

  // 3. Generate HMAC-SHA256 signature
  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  return hmac === hash;
}