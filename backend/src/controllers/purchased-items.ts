import { NextFunction, Request, Response } from "express";
import { purchasedItemsService } from "../services/purchased-items-service.js";

export async function purchasedItemsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;
    const result = await purchasedItemsService({ userId });

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}
