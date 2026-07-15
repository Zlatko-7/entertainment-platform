import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { orders } from "../db/schema.js";
import { AppError } from "../errors/app-error.js";

export async function purchasedItemsServices({ userId }: { userId?: string }) {
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }
  const purchased = await db
    .select({
      productId: orders.productId,
    })
    .from(orders)
    .where(and(eq(orders.userId, userId), eq(orders.status, "paid")));

  return {
    purchasedProducts: purchased.map((item) => item.productId),
  };
}
