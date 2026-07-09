import { Request, Response } from "express";
import { db } from "../db/index.js";
import { orders } from "../db/schema.js";
import { eq } from "drizzle-orm";

export async function orderHistory(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const ordersList = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId));

    return res.json({
      data: ordersList,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
