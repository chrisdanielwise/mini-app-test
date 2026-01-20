"use server";

import { z } from "zod";
import { requireAuth } from "@/lib/auth/session";
import { MarketplaceService } from "@/lib/services/marketplace.service";
import { ActivityService } from "@/lib/services/activity.service";
import { revalidateTag } from "next/cache";
// ✅ INSTITUTIONAL INGRESS: Using strictly defined Prisma Types
import { DispatchType, Prisma } from "@/generated/prisma";
// ✅ CORRECTED DECIMAL PATH
import { Decimal } from "@prisma/client-runtime-utils";

/**
 * 🛰️ MARKETPLACE_SCHEMAS
 * Fix: Removed '?' from 'attributes' to satisfy the Service layer's requirement.
 * Fix: Added .default({}) to ensure the property is always present in the payload.
 */
const ProductSchema = z.object({
  merchantId: z.string().uuid(),
  categoryId: z.string().uuid(),
  name: z.string().min(3, "Product name is too short"),
  description: z.string().min(10, "Description must be detailed"),
  basePrice: z.number().positive(),
  // ✅ FIX: Use nativeEnum to match the Prisma 'DispatchType' exactly
  dispatchType: z.nativeEnum(DispatchType),
  variants: z.array(z.object({
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
    // ✅ FIX: This must be required to satisfy the Service parameter type
    attributes: z.any().default({}), 
  })).optional(),
});

/**
 * 📦 ACTION: UPSERT_PRODUCT
 * Level: Merchant Admin/Owner
 */
export async function upsertProductAction(formData: FormData) {
  // 🔐 1. Identity Gate
  const session = await requireAuth();
  
  // 🛡️ 2. Parse & Validate
  const rawVariants = formData.get("variants") 
    ? JSON.parse(formData.get("variants") as string) 
    : [];

  const validated = ProductSchema.safeParse({
    merchantId: formData.get("merchantId"),
    categoryId: formData.get("categoryId"),
    name: formData.get("name"),
    description: formData.get("description"),
    basePrice: Number(formData.get("basePrice")),
    dispatchType: formData.get("dispatchType"),
    variants: rawVariants,
  });

  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  try {
    // 🏁 3. Service Execution
    // Now 'validated.data' is compatible with the Service's required 'attributes' field
    const product = await MarketplaceService.createProduct(validated.data);

    // 🕵️ 4. Audit Trail
    await ActivityService.log({
      actorId: session.user.id,
      merchantId: validated.data.merchantId,
      action: "PRODUCT_CREATED",
      resource: `Product:${product.id}`,
      metadata: { name: validated.data.name },
    });

    // ✅ FIX: Next.js 15 requires the "default" profile argument for revalidateTag
    revalidateTag("catalog_node", "default");
    
    return { success: true, productId: product.id };
  } catch (error: any) {
    console.error("🔥 [Catalog_Sync_Fault]:", error);
    return { error: "Catalog Synchronization Failed" };
  }
}
/**
 * 🛒 ACTION: SUBMIT_ORDER
 * Level: Authenticated User (Mini App)
 */
export async function submitOrderAction(orderData: {
  merchantId: string;
  items: Array<{ productId: string; variantId?: string; quantity: number }>;
  shipping: any;
}) {
  const session = await requireAuth();

  try {
    // 🏁 4. Financial & Inventory Interlock
    const order = await MarketplaceService.placeOrder({
      customerId: session.user.id,
      merchantId: orderData.merchantId,
      items: orderData.items,
      shipping: orderData.shipping,
    });

    // 🕵️ 5. Audit
    await ActivityService.log({
      actorId: session.user.id,
      merchantId: orderData.merchantId,
      action: "ORDER_PLACED",
      resource: `Order:${order.id}`,
    });

    // ✅ FIX: Provided mandatory "default" profile for Next.js 15
    revalidateTag("order_node", "default");
    
    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("🔥 [Order_Protocol_Failure]:", error);
    return { error: error.message || "Order Protocol Failure" };
  }
}