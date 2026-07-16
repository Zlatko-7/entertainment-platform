import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error.js";
import { orderHistoryService } from "../services/order-history-service.js";

export async function orderHistoryController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const { ordersList } = await orderHistoryService({ userId });

    return res.status(200).json({
      data: ordersList,
    });
  } catch (error) {
    return next(error);
  }
}
