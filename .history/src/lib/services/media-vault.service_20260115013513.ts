"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// 🛰️ S3 NODE CONFIGURATION
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * 🌊 MEDIA_VAULT_SERVICE (v16.16.12)
 * Logic: Permanent residency for merchant assets with TG-Bridge.
 */
export const MediaVault = {
  /**
   * 🛰️ UPLOAD_ASSET
   * Logic: Streams a buffer to S3 and registers the URI in Prisma.
   */
  async uploadAsset(params: {
    file: Buffer;
    fileName: string;
    contentType: string;
    merchantId: string;
    purpose: "PRODUCT" | "AVATAR" | "BANNER";
  }) {
    if (!isUUID(params.merchantId)) throw new Error("PROTOCOL_ERROR: Invalid_Merchant_ID");

    // 1. Generate Institutional Path: merchant/[id]/[purpose]/[uuid]-[name]
    const fileExtension = params.fileName.split('.').pop();
    const storageKey = `merchants/${params.merchantId}/${params.purpose.toLowerCase()}/${crypto.randomUUID()}.${fileExtension}`;

    try {
      // 2. Transmit to S3 Vault
      await s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: storageKey,
        Body: params.file,
        ContentType: params.contentType,
        ACL: "public-read", // Optimized for CDN delivery
      }));

      const publicUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${storageKey}`;

      // 3. Anchor in Database
      const asset = await prisma.mediaAsset.create({
        data: {
          merchantId: params.merchantId,
          url: publicUrl,
          storageKey,
          mimeType: params.contentType,
          fileSize: params.file.byteLength,
          purpose: params.purpose,
        }
      });

      return asset;
    } catch (err) {
      console.error("🔥 [Media_Vault_Failure]:", err);
      throw new Error("NODE_ERROR: Asset_Persistence_Failed");
    }
  },

  /**
   * 🕵️ RESOLVE_TELEGRAM_FILE
   * Logic: Downloads a file from Telegram's servers and moves it to the Vault.
   * Useful when a merchant sends a photo directly to the bot.
   */
  async ingestFromTelegram(fileId: string, merchantId: string) {
    // This requires your bot instance to fetch the file_path
    // Implementation depends on your grammY/telegraf setup
    // Logic: fetch(tg_api) -> stream to S3 -> create asset
  },

  /**
   * 🔍 GET_MERCHANT_ASSETS
   */
  getAssets: cache(async (merchantId: string, purpose?: string) => {
    if (!isUUID(merchantId)) return [];
    
    return await prisma.mediaAsset.findMany({
      where: { 
        merchantId,
        ...(purpose && { purpose: purpose as any })
      },
      orderBy: { createdAt: "desc" }
    });
  })
};