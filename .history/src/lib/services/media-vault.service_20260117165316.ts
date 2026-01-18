"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { telegramBot } from "@/lib/telegram/bot";

// 🛰️ S3 NODE CONFIGURATION
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * 🌊 MEDIA_VAULT_SERVICE (v16.16.20)
 * Logic: Permanent residency for merchant assets with TG-Bridge.
 * Standards: v2026.1.17 Institutional Asset Management.
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

    // 1. Generate Institutional Path: merchant/[id]/[purpose]/[uuid].[ext]
    const fileExtension = params.fileName.split('.').pop();
    const storageKey = `merchants/${params.merchantId}/${params.purpose.toLowerCase()}/${crypto.randomUUID()}.${fileExtension}`;

    try {
      // 2. Transmit to S3 Vault
      await s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: storageKey,
        Body: params.file,
        ContentType: params.contentType,
        ACL: "public-read", // Optimized for global CDN delivery
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
   * 🕵️ INGEST_FROM_TELEGRAM
   * Logic: Downloads a file from Telegram's servers and moves it to the S3 Vault.
   * Standard: Handshakes with TG Bot API to resolve file_path.
   */
  async ingestFromTelegram(fileId: string, merchantId: string, purpose: "PRODUCT" | "AVATAR" | "BANNER" = "PRODUCT") {
    try {
      // 1. Resolve File Path from Telegram API
      const file = await telegramBot.api.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;

      // 2. Stream File into Memory
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("TELEGRAM_DOWNLOAD_FAILED");
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 3. Re-route to S3 Upload Node
      return await this.uploadAsset({
        file: buffer,
        fileName: file.file_path?.split('/').pop() || "tg_transfer.jpg",
        contentType: "image/jpeg", // Defaulting to JPEG for TG compression
        merchantId,
        purpose,
      });
    } catch (err) {
      console.error("🔥 [TG_Ingest_Fault]:", err);
      return null;
    }
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