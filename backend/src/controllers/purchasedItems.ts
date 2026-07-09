// CURSOS LAST CHANGE: resolve product from movieId (movies.product_id → products) for checkout
import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { movies, orders, products } from "../db/schema.js";
import { stripe } from "../lib/stripe.js";
import { Request, Response } from "express";

export async function purchasedItems(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const purchased = await db
      .select({
        productId: orders.productId,
      })
      .from(orders)
      .where(and(eq(orders.userId, userId), eq(orders.status, "paid")));

    return res.json({
      purchasedProducts: purchased.map((item) => item.productId),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Initial server error" });
  }
}
