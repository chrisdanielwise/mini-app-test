
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