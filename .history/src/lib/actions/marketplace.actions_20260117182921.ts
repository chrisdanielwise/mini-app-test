"use server";

import { z } from "zod";
import { requireAuth} from "@/lib/auth/session";
import { MarketplaceService } from "@/lib/services/marketplace.service";
import { ActivityService } from "@/lib/services/activity.service";
import { revalidateTag } from "next/cache";
import { CACHE_PROFILES } from "@/lib/auth/config";
import { DispatchType, OrderStatus } from "@/generated/prisma";

/**
 * 🛰️ MARKETPLACE_SCHEMAS
 */
const ProductSchema = z.object({
  merchantId: z.string().uuid(),
  categoryId: z.string().uuid(),
  name: z.string().min(3, "Product name is too short"),
  description: z.string().min(10, "Description must be detailed"),
  basePrice: z.number().positive(),
  dispatchType: z.nativeEnum(DispatchType),
  variants: z.array(z.object({
    attributes: z.any(),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
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
    const product = await MarketplaceService.createProduct(validated.data);

    // 🕵️ 4. Audit Trail
    await ActivityService.log({
      actorId: session.user.id,
      merchantId: validated.data.merchantId,
      action: "PRODUCT_CREATED",
      resource: `Product:${product.id}`,
      metadata: { name: validated.data.name },
    });

    revalidateTag("catalog_node", CACHE_PROFILES.CONTENT);
    return { success: true, productId: product.id };
  } catch (error: any) {
    return { error: "Catalog Synchronization Failed" };
  }
}

/**
 * 🛒 ACTION: SUBMIT_ORDER
 * Level: Authenticated User (Mini App)
 */
export async function submitOrderAction(orderData: any) {
  const session = await requireAuth();

  try {
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

    revalidateTag("order_node", CACHE_PROFILES.DATA);
    return { success: true, orderId: order.id };
  } catch (error: any) {
    return { error: error.message || "Order Protocol Failure" };
  }
}