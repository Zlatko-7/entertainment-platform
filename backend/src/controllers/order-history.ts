import { NextFunction, Request, Response } from "express";
import { orderHistoryService } from "../services/order-history-service.js";
export async function orderHistory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { ordersList } = await orderHistoryService({ userId });

    return res.json({
      data: ordersList,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
}
