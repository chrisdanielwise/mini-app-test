"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { telegramBot } from "@/lib/telegram/bot";
// ✅ INSTITUTIONAL INGRESS: Using strictly defined types from your schema
import { 
  VerificationDocument, 
  DocStatus,
} from "@/generated/prisma";

// 🛰️ S3 NODE CONFIGURATION
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * 🌊 MEDIA_VAULT_SERVICE (Institutional Apex v2026.1.20 - HARDENED)
 * Fix: Mapped 'mediaAsset' to 'verificationDocument' to match schema.
 * Fix: Standardized to 'pending' enum to match @map logic.
 */
export const MediaVault = {
  /**
   * 🛰️ UPLOAD_ASSET
   * Logic: Streams a buffer to S3 and registers the URI in the VerificationDocument node.
   */
  async uploadAsset(params: {
    file: Buffer;
    fileName: string;
    contentType: string;
    merchantId: string;
    purpose: string; // e.g., "ID_FRONT", "BUSINESS_LICENSE"
  }): Promise<VerificationDocument> {
    if (!isUUID(params.merchantId)) throw new Error("PROTOCOL_ERROR: Invalid_Merchant_ID");

    const fileExtension = params.fileName.split('.').pop();
    const storageKey = `merchants/${params.merchantId}/docs/${crypto.randomUUID()}.${fileExtension}`;

    try {
      // 1. Transmit to S3 Vault
      await s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: storageKey,
        Body: params.file,
        ContentType: params.contentType,
        // ACL removed for modern S3 "Bucket Owner Enforced" security settings
      }));

      const publicUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${storageKey}`;

      // 2. Anchor in Database using 'verificationDocument'
      // ✅ FIX: Using 'verificationDocument' because 'mediaAsset' does not exist in your schema.
      const asset = await prisma.verificationDocument.create({
        data: {
          merchantId: params.merchantId,
          fileUrl: publicUrl,
          type: params.purpose,
          status: DocStatus.PENDING, // ✅ Maps to lowercase "pending" in DB
        }
      });

      return JSON.parse(JSON.stringify(asset));
    } catch (err) {
      console.error("🔥 [Media_Vault_Failure]:", err);
      throw new Error("NODE_ERROR: Asset_Persistence_Failed");
    }
  },

  /**
   * 🕵️ INGEST_FROM_TELEGRAM
   * Logic: Bridges Telegram binary data to S3 Residency.
   */
  async ingestFromTelegram(
    fileId: string, 
    merchantId: string, 
    purpose: string = "TELEGRAM_UPLOAD"
  ): Promise<VerificationDocument | null> {
    try {
      // 1. Resolve Path from TG
      const file = await telegramBot.api.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;

      // 2. Ingest to Memory
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("TELEGRAM_DOWNLOAD_FAILED");
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 3. Route to S3 Node
      return await this.uploadAsset({
        file: buffer,
        fileName: file.file_path?.split('/').pop() || "tg_transfer.jpg",
        contentType: "image/jpeg",
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
  getAssets: cache(async (merchantId: string): Promise<VerificationDocument[]> => {
    if (!isUUID(merchantId)) return [];
    
    const docs = await prisma.verificationDocument.findMany({
      where: { merchantId },
      orderBy: { uploadedAt: "desc" }
    });

    return JSON.parse(JSON.stringify(docs));
  })
};